namespace Farm.App.DTOs
{
    public class GetFarmWithFieldsWithSensotrsDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Location { get; set; }

        public double Area { get; set; }

        public ICollection<GetFieldWithSensorDto>? Fields { get; set; }
    }

    public class GetFieldWithSensorDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public ICollection<GetSensorsDto>? Sensors { get; set; }
    }

    public class GetSensorsDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; }
    }
}
