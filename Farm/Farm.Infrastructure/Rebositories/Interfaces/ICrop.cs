using Farm.Domain.Common;
using Farm.Domain.Entities;
using static Farm.Infrastructure.Rebositories.CropRepository;

namespace Farm.Infrastructure.Rebositories.Interfaces
{
    public interface ICrop : IRepository<Crop>
    {
        Task<IEnumerable<Crop>> GetAllCropWithFieldAndFarmAsync(CancellationToken cancellationToken = default);

        Task<PagedResult<Crop>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default);

        Task<IEnumerable<Crop_Ref>> GetAllCropRefAsync(CancellationToken cancellationToken = default);
        
        Task<Crop_Ref?> GetCropRefByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task<Crop_Ref?> AddCropRefAsync(Crop_Ref entity, CancellationToken cancellationToken = default);

        Task<List<CropDistributionDto>> GetCropDistributionByFarmIdAsync(Guid farmId, CancellationToken cancellationToken = default);
    }
}
