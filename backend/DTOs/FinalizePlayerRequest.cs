namespace AuctionApp.DTOs
{
    public class FinalizePlayerRequest
    {
        public Guid AuctionId { get; set; }
        public Guid PlayerId { get; set; }
    }
}
