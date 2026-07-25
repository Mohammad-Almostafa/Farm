using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class SensorDto
    {
        public string Type { get; set; }

        public string SerialNumber { get; set; }

        public string Unit { get; set; }

        public decimal MinRange { get; set; }

        public decimal MaxRange { get; set; }

        public string Status { get; set; } = "Active";  // Active, Inactive, Maintenance

        public Guid FieldId { get; set; }
    }
}
