namespace Farm.App.DTOs
{
    public class GetFarmWithFieldsDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Location { get; set; }

        public double Area { get; set; }

        public ICollection<GetFieldDto>? Fields { get; set; }
    }
}
