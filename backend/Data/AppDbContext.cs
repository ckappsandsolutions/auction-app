using AuctionApp.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionApp.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<TeamPlayer> TeamPlayers { get; set; }
        public DbSet<AuctionRound> AuctionRounds { get; set; }
    }
}
