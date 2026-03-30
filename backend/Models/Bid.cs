namespace AuctionApp.Models
{
    public class Bid
    {
        public Guid Id { get; set; }

        public Guid AuctionId { get; set; }
        public Guid PlayerId { get; set; }
        public Guid TeamId { get; set; }

        public decimal BidAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Auction Auction { get; set; }
        public Player Player { get; set; }
        public Team Team { get; set; }
    }
}
