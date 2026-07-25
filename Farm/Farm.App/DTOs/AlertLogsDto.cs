using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Farm.App.DTOs
{
    public class AlertLogsDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public decimal Value { get; set; }

        public string Unit { get; set; }

        public string Message { get; set; }

        public string SensorName { get; set; }

        public string FieldName { get; set; }

        public string FarmName { get; set; }
    }
}
