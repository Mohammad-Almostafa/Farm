using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.App.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        [MinLength(3),MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        [MinLength(6),MaxLength(50)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [EmailAddress, Required]
        public string Email { get; set; }
    }
}
