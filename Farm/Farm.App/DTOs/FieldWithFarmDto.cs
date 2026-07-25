namespace Farm.App.DTOs
{
    public class FieldWithFarmDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string Name { get; set; }

        public bool IsPasture { get; set; }

        public double Area { get; set; }

        public string Location { get; set; }//North, North-West, West, South-West, South, South-East, East, North-East, Mid

        public string ImgUrl { get; set; }

        public string IrrigationType { get; set; }//Drip, Sprinkler, Flood, CenterPivot

        public string SoilQuality { get; set; }//Excellent, Good, Moderate, Poor

        public Guid AFarmId { get; set; }

        public FarmName AFarm { get; set; }
        

    }
    public class FarmName
    {
        public string Name { get; set; }
    }
}
