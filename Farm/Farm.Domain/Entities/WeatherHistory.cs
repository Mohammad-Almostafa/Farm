using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class WeatherHistory : BaseEntity
    {
        
        public decimal Temperature { get; set; }
        
        public decimal Humidity { get; set; }
        
        public decimal WindSpeed { get; set; }
        
        public string Condition { get; set; }

        public AFarm AFarm { get; set; }
        public Guid AFarmId { get; set; }
    }
}
