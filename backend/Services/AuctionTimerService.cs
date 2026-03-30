using AuctionApp.Data;
using AuctionApp.Hubs;
using AuctionApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace AuctionApp.Services
{
    public class AuctionTimerService : BackgroundService
    {

        private readonly IServiceScopeFactory _scopeFactory;

        public AuctionTimerService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var expiredRounds = await context.AuctionRounds
                    .Where(r => r.Status == "ONGOING"
                               && r.EndTime != null
                               && r.EndTime <= DateTime.UtcNow)
                               .ToListAsync();

                foreach (var round in expiredRounds)
                {
                    // 1. Get highest bid
                    var highestBid = await context.Bids
                        .Where(b => b.AuctionId == round.AuctionId && b.PlayerId == round.PlayerId)
                        .OrderByDescending(b => b.BidAmount)
                        .FirstOrDefaultAsync();

                    var player = await context.Players.FindAsync(round.PlayerId);

                    if (highestBid != null)
                    {
                        // SOLD
                        player.TeamId = highestBid.TeamId;
                        player.SoldPrice = highestBid.BidAmount;
                        player.Status = "SOLD";
                    }
                    else
                    {
                        // UNSOLD
                        player.Status = "UNSOLD";
                    }

                    // 2. Close current round
                    round.Status = "CLOSED";

                    // 3. Find NEXT player
                    var nextPlayer = await context.Players
                        .Where(p => p.Status == "AVAILABLE")
                        .OrderBy(p => p.CreatedAt) // simple order
                        .FirstOrDefaultAsync();

                    var hub = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();

                    if (nextPlayer != null)
                    {
                        // 4. Create new round
                        var newRound = new AuctionRound
                        {
                            AuctionId = round.AuctionId,
                            PlayerId = nextPlayer.Id,
                            StartTime = DateTime.UtcNow,
                            EndTime = DateTime.UtcNow.AddMinutes(20), 
                            Status = "ONGOING"
                        };

                        context.AuctionRounds.Add(newRound);

                        // 5. Notify UI → NEW PLAYER STARTED
                        await hub.Clients.Group(round.AuctionId.ToString())
                            .SendAsync("NewPlayerStarted", new
                            {
                                playerId = nextPlayer.Id,
                                playerName = nextPlayer.Name,
                                endTime = newRound.EndTime
                            });
                    }
                    else
                    {
                        // Auction finished
                        await hub.Clients.Group(round.AuctionId.ToString())
                            .SendAsync("AuctionCompleted", new
                            {
                                message = "Auction Finished"
                            });
                    }

                    await hub.Clients.Group(round.AuctionId.ToString())
                            .SendAsync("PlayerSold", new
                            {
                                playerId = round.PlayerId,
                                teamId = highestBid?.TeamId,
                                amount = highestBid?.BidAmount,
                                status = highestBid != null ? "SOLD" : "UNSOLD"
                            });
                }


                await context.SaveChangesAsync();

                await Task.Delay(2000); // check every 2 sec
            }
        }

    }
}
