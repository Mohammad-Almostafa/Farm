using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class AlertsLog : BaseEntity
    {
        public AlertsLog()
        {
            Message = "Normal";
        }
        public decimal Value { get; set; }

        public string Unit { get; set; }

        public string Message { get; set; }

        public Sensor Sensor { get; set; }
        public Guid SensorId { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }
    }
}
