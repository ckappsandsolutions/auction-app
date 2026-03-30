using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionApp.Models
{
    public class Team
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public decimal TotalBudget { get; set; }

        public decimal RemainingBudget { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<TeamPlayer> TeamPlayers { get; set; }
        public ICollection<Bid> Bids { get; set; }
    }
}
