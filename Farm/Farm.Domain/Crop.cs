using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class Crop
    {

        public Crop()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }
        
        public Guid Id { get; set; }

        [MaxLength(100)]
        public string Type { get; set; }

        public DateTime SeasonStrart { get; set; }

        public DateTime SeasonEnd { get; set; }

        public decimal ExpectedYield { get; set; }

        public DateTime CreatedAt { get; set; }

        public byte[]? Image { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }
    }
}
