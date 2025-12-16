using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class SensorReading
    {

        public SensorReading()
        {
            Id = Guid.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public Guid Id { get; set; }

        public decimal Value { get; set; }
        
        public string Unit { get; set; }
        
        public DateTime Timestamp { get; set; }

        public Sensor Sensor { get; set; }
        public Guid SensorId { get; set; }
    }
}
