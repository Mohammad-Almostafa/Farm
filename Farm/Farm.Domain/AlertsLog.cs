using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class AlertsLog
    {

        public AlertsLog()
        {
            Id = Guid.NewGuid();
            TriggeredAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }
        
        public decimal Value { get; set; }

        [MaxLength(20)]
        public string Unit { get; set; }
        
        public DateTime TriggeredAt { get; set; }

        [MaxLength(500)]
        public string Message { get; set; }

        public Sensor Sensor { get; set; }
        public Guid SensorId { get; set; }

        public AlertRule AlertRule { get; set; }
        public Guid RuleId { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }
    }
}
