using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories.Interfaces;
using Farm.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Rebositories
{
    public class FarmRepository : GenericRepository<AFarm> , IFarm
    {
        private readonly FarmDbContext context;

        public FarmRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }
        
        public async Task<IEnumerable<AFarm?>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await context.AFarms.Where(f => f.OwnerId == userId && f.IsDeleted == false).ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<AFarm?>> GetNearByFarmsAsync(decimal latitude, decimal longitude, double radiusKm = 10, CancellationToken cancellationToken = default)
        {
            return await context.AFarms.Where(f => Math.Pow(69.1 * (double)(f.Latitude - latitude), 2) +
                                                   Math.Pow(69.1 * (double)(longitude - f.Longitude) * Math.Cos((double)f.Latitude / 57.3), 2)
                                                   < Math.Pow(radiusKm / 1.609, 2) && f.IsDeleted == false).ToListAsync(cancellationToken);
        }

        public Task<bool> IsFarmExistAsync(decimal Latitude, decimal Longitude, CancellationToken cancellationToken = default)
        {
            return context.AFarms.AnyAsync(f => f.Latitude == Latitude && f.Longitude == Longitude && f.IsDeleted == false, cancellationToken);
        }

        public async Task<PagedResult<AFarm>> GetFarmPagedAsync(Guid userId, QueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = context.AFarms.AsQueryable().Where(f => f.OwnerId == userId && f.IsDeleted == false);
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

        public async Task<PagedResult<AFarm>> SearchAsync(string? searchTerm, QueryParameters parameters, CancellationToken cancellationToken = default)
        {
            var query = context.AFarms.Where(f => f.IsDeleted == false) as IQueryable<AFarm>;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.ToLower();
                
                bool isNumeric = double.TryParse(term, out double area);
                
                query = query.Where(f => (
                    f.Name.ToLower().Contains(term) ||
                    f.Location.ToLower().Contains(term) ||
                    f.FormattedAddress.ToLower().Contains(term)||
                    f.Description.ToLower().Contains(term)||
                    isNumeric && f.Area >= area) && f.IsDeleted == false);
            }

            if (!string.IsNullOrWhiteSpace(parameters.SortBy))
            {
                query = parameters.SortBy.ToLower() switch
                {
                    "name" => parameters.SortDescending ? query.OrderByDescending(f => f.Name) : query.OrderBy(f => f.Name),
                    "createdat" => parameters.SortDescending ? query.OrderByDescending(f => f.CreatedAt) : query.OrderBy(f => f.CreatedAt),
                    _ => query.OrderBy(f => f.Name)
                };
            }
            else
            {
                query = query.OrderBy(f => f.Name);
            }

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

        public async Task<AFarm?> GetFarmWithFieldsByIdAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await context.AFarms
                .Include(f => f.Fields).ThenInclude(f => f.Sensors)
                .Include(f => f.Fields).ThenInclude(f => f.ActionableTasks).FirstOrDefaultAsync(f => f.Id == Id, cancellationToken);
        }

        public async Task<IEnumerable<AFarm?>> GetAllFarmsWithOwnerAsync(CancellationToken cancellationToken = default)
        {
            return await context.AFarms.Include(f => f.Owner).Where(f => f.IsDeleted == false).OrderBy(f => f.OwnerId).ToListAsync(cancellationToken);
        }
    }
}
