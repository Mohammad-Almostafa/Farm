namespace Farm.App.DTOs
{
    public class GetFarmDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public double Area { get; set; }

        public string Location { get; set; }

        public string? Description { get; set; }

        public string? SoilType { get; set; }

        public string WaterSource { get; set; }

        public string? WorkingHours { get; set; }

        public string? ImgUrl { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? FormattedAddress { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
