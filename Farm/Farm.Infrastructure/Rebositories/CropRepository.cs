using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories.Interfaces;
using Farm.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Rebositories
{
    public class CropRepository : GenericRepository<Crop>, ICrop
    {
        private readonly FarmDbContext context;

        public CropRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<Crop_Ref?> AddCropRefAsync(Crop_Ref entity, CancellationToken cancellationToken = default)
        {
            var cropRef = await context.Crop_Refs.FirstOrDefaultAsync(c => c.Name == entity.Name &&
                                                       c.Yield == entity.Yield &&
                                                       c.Variety_Refs.Any() &&
                                                       c.Season == entity.Season, cancellationToken);

            var variety = await context.Crop_Refs.FirstOrDefaultAsync(c => c.Name == entity.Name &&
                                                       c.Yield == entity.Yield &&
                                                       !c.Variety_Refs.Any() &&
                                                       c.Season == entity.Season, cancellationToken);
            if (cropRef == null)
            {
                await context.Crop_Refs.AddAsync(entity, cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
            }
            else
            {
                if (cropRef != null && variety == null)
                {
                    await context.Variety_Refs.AddAsync(
                        new Variety_Ref
                        {
                            Name = cropRef.Name,
                            Crop_RefId = cropRef.Id
                        }, cancellationToken);

                    await context.SaveChangesAsync(cancellationToken);
                }
            }
            return cropRef;
        }

        public async Task<IEnumerable<Crop_Ref>> GetAllCropRefAsync(CancellationToken cancellationToken = default)
        {
            return await context.Crop_Refs.Include(c => c.Variety_Refs).ToListAsync(cancellationToken);
        }

        public async Task<Crop_Ref?> GetCropRefByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await context.Crop_Refs.Include(c => c.Variety_Refs).FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        }
        
        public async Task<PagedResult<Crop>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = context.Crops.Where(c => c.IsDeleted == false).AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.ToLower();
                bool isNumeric = decimal.TryParse(term, out decimal area);

                query = query.Where(c => (
                    c.Type.ToLower().Contains(term) ||
                    c.Variety.ToLower().Contains(term) ||
                    c.ExpectedYield.ToLower().Contains(term) ||
                    c.Status.ToLower().Contains(term) ||
                    c.Yield == area && isNumeric ||
                    c.Season.ToString().Contains(term) ||
                    c.ActualHarvestDate.ToString().Contains(term) ||
                    c.NextWatered.ToString().Contains(term) ||
                    c.NextFertilization.ToString().Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(parameters.SortBy))
            {
                query = parameters.SortBy.ToLower() switch
                {
                    "name" => parameters.SortDescending ? query.OrderByDescending(f => f.Type) : query.OrderBy(f => f.Type),
                    "createdat" => parameters.SortDescending ? query.OrderByDescending(f => f.CreatedAt) : query.OrderBy(f => f.CreatedAt),
                    _ => query.OrderBy(f => f.Type)
                };
            }
            else
            {
                query = query.OrderBy(f => f.Type);
            }

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<Crop>
            {
                Items = items,
                MetaData = new PaginationMetaData(totalCount, parameters.PageSize, parameters.PageNumber)
            };
        }

        public override Task<Crop?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return context.Crops.Include(c => c.Field).ThenInclude(f => f.AFarm).FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<List<CropDistributionDto>> GetCropDistributionByFarmIdAsync(Guid farmId, CancellationToken cancellationToken = default)
        {
            return await context.Fields
                .Where(f => f.AFarmId == farmId && !f.IsDeleted && f.Crop != null)
                .GroupBy(f => f.Crop.Type)
                .Select(g => new CropDistributionDto
                {
                    Name = g.Key,
                    Value = g.Sum(f => f.Area) // ✅ مجموع مساحات الحقول لكل محصول
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Crop>> GetAllCropWithFieldAndFarmAsync(CancellationToken cancellationToken = default)
        {
            return await context.Crops.Include(c => c.Field).ThenInclude(f => f.AFarm).Where(c => c.IsDeleted == false).ToListAsync(cancellationToken);
        }

        public class CropDistributionDto
        {
            public string Name { get; set; }
            public double Value { get; set; }
        }
    }
}
