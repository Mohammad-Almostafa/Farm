using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Farm.Domain
{
    public class Field
    {

        public Field()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        public double Area { get; set; }

        [MaxLength(100)]
        public string SiolType { get; set; }

        public DateTime CreatedAt { get; set; }

        public byte[]? Image { get; set; }

        public AFarm AFarm { get; set; }
        public Guid AFarmId { get; set; }

        public ICollection<Sensor> Sensors { get; set; }

        public ICollection<Crop> Crops { get; set; }

        public ICollection<WeatherHistory> WeatherHistories { get; set; }

    }
}
