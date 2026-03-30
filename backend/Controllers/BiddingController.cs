using AuctionApp.Data;
using AuctionApp.DTOs;
using AuctionApp.Hubs;
using AuctionApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace AuctionApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BiddingController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly IHubContext<AuctionHub> _hub;

        public BiddingController(AppDbContext context, IHubContext<AuctionHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        [HttpPost("place-bid")]
        public async Task<IActionResult> PlaceBid(PlaceBidRequest request)
        {
            // Validate Auction
            var auction = await _context.Auctions
                .FirstOrDefaultAsync(a => a.Id == request.AuctionId);

            if (auction == null || auction.Status != "LIVE")
                return BadRequest("Auction is not live");

            // Validate Player
            var player = await _context.Players
                .FirstOrDefaultAsync(p => p.Id == request.PlayerId);

            if (player == null || player.Status != "AVAILABLE")
                return BadRequest("Player not available");

            // Get highest bid
            var highestBid = await _context.Bids
                .Where(b => b.AuctionId == request.AuctionId && b.PlayerId == request.PlayerId)
                .OrderByDescending(b => b.BidAmount)
                .FirstOrDefaultAsync();

            decimal minAllowedBid = highestBid == null
                ? player.BasePrice
                : highestBid.BidAmount + auction.BidIncrement;

            if (request.BidAmount < minAllowedBid)
                return BadRequest($"Bid must be at least {minAllowedBid}");

            // Validate Team
            var team = await _context.Teams
                .Include(t => t.TeamPlayers)
                .FirstOrDefaultAsync(t => t.Id == request.TeamId);

            if (team == null)
                return BadRequest("Invalid team");

            if (team.RemainingBudget < request.BidAmount)
                return BadRequest("Insufficient budget");

            if (team.TeamPlayers.Count >= auction.MaxPlayersPerTeam)
                return BadRequest("Team player limit reached");

            // Save bid
            var bid = new Bid
            {
                AuctionId = request.AuctionId,
                PlayerId = request.PlayerId,
                TeamId = request.TeamId,
                BidAmount = request.BidAmount,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bids.Add(bid);
            await _context.SaveChangesAsync();


            //get current round
            var round = await _context.AuctionRounds.FirstOrDefaultAsync(r =>
                                        r.AuctionId == request.AuctionId &&
                                        r.PlayerId == request.PlayerId &&
                                        r.Status == "ONGOING");

            if (round != null)
            {
                round.EndTime = DateTime.UtcNow.AddSeconds(100000); // extend timer
                await _context.SaveChangesAsync();
            }

            await _hub.Clients.Group(request.AuctionId.ToString())
                    .SendAsync("ReceiveBidUpdate", new
                    {
                        playerId = request.PlayerId,
                        bidAmount = request.BidAmount,
                        teamId = request.TeamId,
                        endTime = round?.EndTime
                    });


            return Ok(new
            {
                message = "Bid placed successfully",
                highestBid = request.BidAmount,
                team = team.Name
            });
        }

        [HttpPost("finalize-player")]
        public async Task<IActionResult> FinalizePlayer(FinalizePlayerRequest request)
        {
            // Validate auction
            var auction = await _context.Auctions
                .FirstOrDefaultAsync(a => a.Id == request.AuctionId);

            if (auction == null || auction.Status != "LIVE")
                return BadRequest("Auction not active");

            // Validate player
            var player = await _context.Players
                .FirstOrDefaultAsync(p => p.Id == request.PlayerId);

            if (player == null || player.Status != "AVAILABLE")
                return BadRequest("Player already processed");

            // Get highest bid
            var highestBid = await _context.Bids
                .Where(b => b.AuctionId == request.AuctionId && b.PlayerId == request.PlayerId)
                .OrderByDescending(b => b.BidAmount)
                .FirstOrDefaultAsync();

            // If no bids -> UNSOLD
            if (highestBid == null)
            {
                player.Status = "UNSOLD";

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Player marked as UNSOLD"
                });
            }

            // Get winning team
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == highestBid.TeamId);

            if (team == null)
                return BadRequest("Winning team not found");

            // Deduct budget
            if (team.RemainingBudget < highestBid.BidAmount)
                return BadRequest("Team budget issue");

            team.RemainingBudget -= highestBid.BidAmount;

            // Assign player to team
            var teamPlayer = new TeamPlayer
            {
                TeamId = team.Id,
                PlayerId = player.Id,
                BoughtPrice = highestBid.BidAmount,
                CreatedAt = DateTime.UtcNow
            };

            _context.TeamPlayers.Add(teamPlayer);

            // Update player status
            player.Status = "SOLD";

            // Close auction round
            var round = await _context.AuctionRounds
                .FirstOrDefaultAsync(r =>
                    r.AuctionId == request.AuctionId &&
                    r.PlayerId == request.PlayerId &&
                    r.Status == "ONGOING");

            if (round != null)
            {
                round.Status = "CLOSED";
                round.EndTime = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Player sold successfully",
                player = player.Name,
                team = team.Name,
                amount = highestBid.BidAmount
            });
        }

        [HttpGet("current-state/{auctionId}")]
        public async Task<IActionResult> GetCurrentState(Guid auctionId)
        {
            //var auction = await _context.Auctions
            //    .Include(a => a.CurrentPlayer)
            //    .FirstOrDefaultAsync(a => a.Id == auctionId);

            //if (auction == null)
            //    return NotFound("Auction not found");

            //if (auction.CurrentPlayerId == null)
            //    return Ok(new { message = "No active player" });

            //var highestBid = await _context.Bids
            //    .Where(b => b.AuctionId == auctionId && b.PlayerId == auction.CurrentPlayerId)
            //    .OrderByDescending(b => b.BidAmount)
            //    .Include(b => b.Team)
            //    .FirstOrDefaultAsync();

            //var round = await _context.AuctionRounds
            //    .Where(r => r.AuctionId == auctionId && r.Status == "ONGOING")
            //    .OrderByDescending(r => r.StartTime)
            //    .FirstOrDefaultAsync();

            //return Ok(new
            //{
            //    player = auction.CurrentPlayer,
            //    playerStatus = auction.Status,
            //    highestBid = highestBid?.BidAmount ?? 0,
            //    highestBidder = highestBid?.Team?.Name ?? "No bids yet",
            //    endTime = round?.EndTime
            //});



            // 1. Get active round
            var round = await _context.AuctionRounds
                .Where(r => r.AuctionId == auctionId && r.Status == "ONGOING")
                .OrderByDescending(r => r.StartTime)
                .FirstOrDefaultAsync();

            // CASE 1: Active round
            if (round != null)
            {
                var player = await _context.Players
                    .FirstOrDefaultAsync(p => p.Id == round.PlayerId);

                var highestBid = await _context.Bids
                    .Where(b => b.AuctionId == auctionId && b.PlayerId == round.PlayerId)
                    .OrderByDescending(b => b.BidAmount)
                    .Include(b => b.Team)
                    .FirstOrDefaultAsync();

                var allPlayers = await _context.Players
                    .OrderBy(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(new
                {
                    player = player, 
                    playerStatus = player.Status,
                    highestBid = highestBid?.BidAmount ?? 0,
                    highestBidder = highestBid?.Team?.Name ?? "No bids yet",
                    endTime = round.EndTime,
                    players = allPlayers
                });
            }

            // CASE 2: No active round -> last player (SOLD / UNSOLD)
            var lastRound = await _context.AuctionRounds
                .Where(r => r.AuctionId == auctionId)
                .OrderByDescending(r => r.StartTime)
                .FirstOrDefaultAsync();

            if (lastRound != null)
            {
                var player = await _context.Players
                    .FirstOrDefaultAsync(p => p.Id == lastRound.PlayerId);

                return Ok(new
                {
                    player = player,
                    playerStatus = player.Status,
                    highestBid = player.SoldPrice ?? 0,
                    highestBidder = "N/A",
                    endTime = (DateTime?)null
                });
            }

            // CASE 3: No auction started
            return Ok(new
            {
                message = "Auction not started"
            });
        }
    }
}
