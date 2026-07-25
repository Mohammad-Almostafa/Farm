using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class Field : BaseEntity
    {
        public string Name { get; set; }

        public bool IsPastre { get; set; } //pastre or agriculture

        public double Area { get; set; }

        public string Location { get; set; }//North, North-West, West, South-West, South, South-East, East, North-East, Mid

        public string? ImgUrl { get; set; }

        public string IrrigationType { get; set; }//Drip, Sprinkler, Flood, CenterPivot

        public string SoilQuality { get; set; }//Excellent, Good, Moderate, Poor

        public AFarm AFarm { get; set; }
        public Guid AFarmId { get; set; }

        //NavProp
        public Crop Crop { get; set; }

        public ICollection<Sensor> Sensors { get; set; }

        public ICollection<WeatherHistory> WeatherHistories { get; set; }

        public ICollection<ActionableTask> ActionableTasks { get; set; }

    }
}
