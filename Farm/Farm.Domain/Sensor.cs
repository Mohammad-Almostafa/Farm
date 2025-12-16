using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class Sensor
    {

        public Sensor()
        {
            Id = Guid.NewGuid();
            InstaledAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }

        [MaxLength(50)]
        public string Type { get; set; }

        public string SerialNumber { get; set; }

        public DateTime InstaledAt { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }

        public ICollection<SensorReading> Readings { get; set; }

    }
}
