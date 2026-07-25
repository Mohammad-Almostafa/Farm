using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.App.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username_Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
