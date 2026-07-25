using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class FieldDto
    {
        public string Name { get; set; }

        public double Area { get; set; }

        public bool IsPasture { get; set; }

        public string Location { get; set; }//North, North-West, West, South-West, South, South-East, East, North-East, Mid

        public IFormFile? ImgFile { get; set; }

        public string IrrigationType { get; set; }//Drip, Sprinkler, Flood, CenterPivot

        public string SoilQuality { get; set; }//Excellent, Good, Moderate, Poor

        public Guid AFarmId { get; set; }

        public Guid? CropId { get; set; }
    }
}
