namespace AuctionApp.Services
{
    public interface ITokenService
    {
        string GenerateToken(string username);
    }
}
