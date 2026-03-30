using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionApp.Models
{
    public class Player
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Category { get; set; }

        public decimal BasePrice { get; set; }

        public string Status { get; set; } = "AVAILABLE";
        public Guid? TeamId { get; set; }
        public decimal? SoldPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // Navigation
        public ICollection<Bid> Bids { get; set; }
        public ICollection<TeamPlayer> TeamPlayers { get; set; }
    }
}
