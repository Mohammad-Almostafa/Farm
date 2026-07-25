using Farm.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Farm.Infrastructure.Persistence;
using Farm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Farm.Infrastructure.Rebositories.Interfaces;

namespace Farm.Infrastructure.Rebositories
{
    public class UserRepository : GenericRepository<User>, IUser
    {
        private readonly FarmDbContext context;

        public UserRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<User?> FindAdminByUsernameOrEmailAsync(string email, string userName, CancellationToken cancellationToken = default)
        {
            return await context.Users.FirstOrDefaultAsync(u => (u.Email == email || u.UserName == userName) && u.Role == "Admin", cancellationToken);
        }

        public async Task<User?> FindByUsernameOrEmailAsync(string email, string userName, CancellationToken cancellationToken = default)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email || u.UserName == userName, cancellationToken);
        }

        public async Task<IEnumerable<Guid>> GetFarmerUserAsync(CancellationToken cancellationToken = default)
        {
            return await context.Users.Where(u => u.Role == "Farmer").Select(u => u.Id).ToListAsync(cancellationToken);
        }
    }
}
