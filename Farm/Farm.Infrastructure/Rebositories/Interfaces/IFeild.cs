using Farm.Domain.Common;
using Farm.Domain.Entities;

namespace Farm.Infrastructure.Rebositories.Interfaces
{
    public interface IField : IRepository<Field>
    {
        Task<PagedResult<AFarm>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default);

        Task<PagedResult<AFarm>> GetPagedFarmWithFildsAsync(QueryParameters parameters, CancellationToken cancellationToken = default);
        
        Task<IEnumerable<AFarm>> GetAllFarmWithFildsAsync(CancellationToken cancellationToken = default);
        
        Task<IEnumerable<Field>> GetAllFielsWithFarmsAsync(CancellationToken cancellationToken = default);

        Task<bool> IsAreaOfFaildEnough(Guid farmId, double newArea, CancellationToken cancellationToken = default);
    }
}
