using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class SensorReading : BaseEntity
    {
        public decimal Value { get; set; }
        public DateTime ReadingTimestamp { get; set; }

        public Sensor Sensor { get; set; }
        public Guid SensorId { get; set; }
    }
}
