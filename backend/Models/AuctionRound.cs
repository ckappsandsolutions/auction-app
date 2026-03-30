namespace AuctionApp.Models
{
    public class AuctionRound
    {
        public Guid Id { get; set; }

        public Guid AuctionId { get; set; }
        public Guid PlayerId { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = "ONGOING";

        // Navigation
        public Auction Auction { get; set; }
        public Player Player { get; set; }
    }
}
