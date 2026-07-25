using Farm.App.DTOs;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories.Interfaces;
using System.Threading.Tasks;

namespace Farm.API.Services
{
    public class UserValidationService
    {
        private readonly IUser userRepository;

        public UserValidationService(IUser userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<User?> ValidateUserCridentials(LoginDto login, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(login.Username_Email))
                return null;

            var em = await userRepository.FindByUsernameOrEmailAsync(login.Username_Email, login.Username_Email, cancellationToken);
            if (em == null)
                return null;

            if (BCrypt.Net.BCrypt.Verify(login.Password, em.Password))
                return em;
            
            return null;
        }
        public async Task<User?> ValidateAdminUserCridentials(LoginDto login, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(login.Username_Email))
                return null;

            var em = await userRepository.FindByUsernameOrEmailAsync(login.Username_Email, login.Username_Email, cancellationToken);
            if (em == null)
                return null;

            if (BCrypt.Net.BCrypt.Verify(login.Password, em.Password))
                return em;
            
            return null;
        }
    }
}
