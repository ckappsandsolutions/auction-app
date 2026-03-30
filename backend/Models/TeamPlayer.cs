namespace AuctionApp.Models
{
    public class TeamPlayer
    {
        public Guid Id { get; set; }

        public Guid TeamId { get; set; }
        public Guid PlayerId { get; set; }

        public decimal BoughtPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Team Team { get; set; }
        public Player Player { get; set; }
    }
}
