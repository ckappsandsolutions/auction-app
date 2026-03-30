namespace AuctionApp.DTOs
{
    public class PlaceBidRequest
    {
        public Guid AuctionId { get; set; }
        public Guid PlayerId { get; set; }
        public Guid TeamId { get; set; }
        public decimal BidAmount { get; set; }
    }
}
