namespace AuctionApp.Models
{
    public class Auction
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Status { get; set; } = "NOT_STARTED";

        public Guid? CurrentPlayerId { get; set; }

        public decimal BidIncrement { get; set; }

        public int MaxPlayersPerTeam { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Player CurrentPlayer { get; set; }
        public ICollection<Bid> Bids { get; set; }
        public ICollection<AuctionRound> AuctionRounds { get; set; }
    }
}
