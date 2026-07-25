using Farm.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Infrastructure.Rebositories.Interfaces
{
    public interface IUser : IRepository<User>
    {
        Task<User?> FindByUsernameOrEmailAsync(string email, string userName, CancellationToken cancellationToken = default);
        Task<User?> FindAdminByUsernameOrEmailAsync(string email, string userName, CancellationToken cancellationToken = default);
        Task<IEnumerable<Guid>> GetFarmerUserAsync(CancellationToken cancellationToken = default);
    }
}
