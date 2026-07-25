using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class SensorReadingDto
    {
        public Guid SensorId { get; set; }
        public decimal Value { get; set; }
        public DateTime ReadingTimestamp { get; set; } = DateTime.UtcNow;
    }
}
