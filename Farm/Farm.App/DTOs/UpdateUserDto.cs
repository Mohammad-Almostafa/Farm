using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.App.DTOs
{
    public class UpdateUserDto
    {
        [MinLength(3),MaxLength(50)]
        public string UserName { get; set; }

        public string Role { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }
}
