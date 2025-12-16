using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class AlertRule
    {

        public AlertRule()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }

        [MaxLength(50)]
        public string SensorType { get; set; }
        
        public decimal Threshold { get; set; }
        
        public string Comparison { get; set; } // "Greater" أو "Less"
        
        public DateTime CreatedAt { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }

    }
}
