using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories.Interfaces;
using Farm.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Rebositories
{
    public class FieldRepository : GenericRepository<Field>, IField
    {
        private readonly FarmDbContext context;

        public FieldRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<PagedResult<AFarm>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = context.AFarms.Where(f => f.IsDeleted == false).Include(f => f.Fields).ThenInclude(f => f.Crop).AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.ToLower();
                bool isNumeric = double.TryParse(term, out double area);

                query = query.Where(f => (
                    f.Name.ToLower().Contains(term) ||
                    f.Location.ToLower().Contains(term) ||
                    f.Fields.Any(
                        field => 
                        (
                            field.IrrigationType.ToLower().Contains(term)||
                            isNumeric && field.Area >= area ||
                            field.SoilQuality.ToLower().Contains(term)||
                            field.Location.ToLower().Contains(term)||
                            field.Crop.Type.ToLower().Contains(term)
                        ) && field.IsDeleted == false) && f.IsDeleted == false));
            }

           var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync(cancellationToken);

            foreach (var farm in items)
            {
                if (farm.Fields == null) continue;

                // ترتيب الحقول حسب المعاملات (يمكنك تخصيص المنطق)
                var orderedFields = farm.Fields.AsEnumerable();

                if (!string.IsNullOrWhiteSpace(parameters.SortBy))
                {
                    switch (parameters.SortBy.ToLower())
                    {
                        case "name":
                            orderedFields = parameters.SortDescending
                                ? orderedFields.OrderByDescending(f => f.Name)
                                : orderedFields.OrderBy(f => f.Name);
                            break;
                        case "area":
                            orderedFields = parameters.SortDescending
                                ? orderedFields.OrderByDescending(f => f.Area)
                                : orderedFields.OrderBy(f => f.Area);
                            break;

                        default:
                            orderedFields = orderedFields.OrderBy(f => f.Name);
                            break;
                    }
                }
                else
                {
                    orderedFields = orderedFields.OrderBy(f => f.Name);
                }

                farm.Fields = orderedFields.ToList();
            }


            return new PagedResult<AFarm>
            {
                Items = items,
                MetaData = new PaginationMetaData(totalCount, parameters.PageSize, parameters.PageNumber)
            };
        }

        public async Task<PagedResult<AFarm>> GetPagedFarmWithFildsAsync(QueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = context.AFarms.Include(f => f.Fields).ThenInclude(f => f.Crop).Where(t => t.IsDeleted == false).AsQueryable();
            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<AFarm>
            {
                Items = items,
                MetaData = new PaginationMetaData(totalCount, parameters.PageSize, parameters.PageNumber)
            };
        }

        public async Task<bool> IsAreaOfFaildEnough(Guid farmId, double newArea, CancellationToken cancellationToken = default)
        {
            return  (await context.Fields.Where(f => f.AFarmId == farmId)
                                 .SumAsync(f => f.Area,cancellationToken) + newArea > await context.AFarms.Where(f => f.Id == farmId).Select(f => f.Area).FirstOrDefaultAsync(cancellationToken));
        }

        public async Task<IEnumerable<AFarm>> GetAllFarmWithFildsAsync(CancellationToken cancellationToken = default)
        {
            return await context.AFarms.Include(f => f.Fields).ThenInclude(f => f.Crop).Where(t => t.IsDeleted == false).ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Field>> GetAllFielsWithFarmsAsync(CancellationToken cancellationToken = default)
        {
            return await context.Fields.Include(f => f.AFarm).Where(t => t.IsDeleted == false).OrderBy(f => f.AFarm.Name).ToListAsync(cancellationToken);
        }
    }
}
