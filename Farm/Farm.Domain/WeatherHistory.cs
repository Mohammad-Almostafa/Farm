using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class WeatherHistory
    {

        public WeatherHistory() 
        {
            Id = Guid.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        public Guid Id { get; set; }
        
        public decimal Temperature { get; set; }
        
        public decimal Humidity { get; set; }
        
        public decimal WindSpeed { get; set; }
        
        public string Condition { get; set; }
        
        public DateTime Timestamp { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }


    }
}
