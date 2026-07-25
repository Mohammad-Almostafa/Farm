using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class Sensor : BaseEntity
    {
        public string Type { get; set; }
        
        public string SerialNumber { get; set; }
        
        public string Unit { get; set; }

        public decimal MinRange { get; set; }

        public decimal MaxRange { get; set; }

        public string Status { get; set; } = "Active";  // Active, Inactive, Maintenance

        public Field Field { get; set; }
        public Guid FieldId { get; set; }

        public ICollection<SensorReading> Readings { get; set; }
    }
}
