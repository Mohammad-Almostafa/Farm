using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class GetSensorsWithReadingsDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public string SerialNumber { get; set; }
        public List<GetSensorReadingDto> Readings { get; set; } = new List<GetSensorReadingDto>();
    }
    public class GetSensorReadingDto
    {
        public Guid SensorId { get; set; }
        public decimal Value { get; set; }
        public DateTime ReadingTimestamp { get; set; }
    }
}
