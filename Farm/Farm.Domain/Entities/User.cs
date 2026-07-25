using Farm.Domain.Common;
using Farm.Domain.Enums;

namespace Farm.Domain.Entities
{
    public class User : BaseEntity
    {

        public User()
        {
            Role = UserRole.Viewer.ToString();
        }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
        
        public string Role { get; set; }//Admin,ENG,Farmer,Viewer

        public ICollection<AFarm> AFarms { get; set; }
    }
}
