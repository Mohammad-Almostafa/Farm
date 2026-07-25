using Farm.Domain.Common;
using Farm.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Farm.Infrastructure.Rebositories.Interfaces
{
    public interface IFarm : IRepository<AFarm>
    {
        Task<IEnumerable<AFarm?>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        
        Task<IEnumerable<AFarm?>> GetAllFarmsWithOwnerAsync(CancellationToken cancellationToken = default);

        Task<bool> IsFarmExistAsync(decimal Latitude, decimal Longitude , CancellationToken cancellationToken = default);

        Task<IEnumerable<AFarm?>> GetNearByFarmsAsync(decimal latitude, decimal longitude, double radiusKm = 10, CancellationToken cancellationToken = default);

        Task<PagedResult<AFarm>> GetFarmPagedAsync(Guid userId, QueryParameters parameters, CancellationToken cancellationToken = default);

        Task<PagedResult<AFarm>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default);
        
        Task<AFarm?> GetFarmWithFieldsByIdAsync(Guid Id, CancellationToken cancellationToken = default);
        
    }
}
