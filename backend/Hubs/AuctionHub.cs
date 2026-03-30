using Microsoft.AspNetCore.SignalR;

namespace AuctionApp.Hubs
{
    public class AuctionHub:Hub
    {
        // Called when client joins auction
        public async Task JoinAuction(string auctionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
        }
    }
}
