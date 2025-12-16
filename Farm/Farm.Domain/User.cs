using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class User
    {

        public User()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }

        [MaxLength(100)]
        public string Username { get; set; }

        [MaxLength(200)]
        public string Email { get; set; }

        [MaxLength(500)]
        public string PasswordHash { get; set; }
        
        [MaxLength(50)]
        public string Role { get; set; }
        
        public DateTime CreatedAt { get; set; }

        public ICollection<AFarm> AFarms { get; set; }
    }
}
