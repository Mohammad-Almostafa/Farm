namespace Farm.App.DTOs
{
    public class CropsDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string Type { get; set; }//نوع

        public string Variety { get; set; }//صنف

        public string Season { get; set; }

        public string ExpectedYield { get; set; }

        public string? Description { get; set; }

        public string ImgUrl { get; set; }

        public Guid FieldId { get; set; }

        public FieldName Field { get; set; }
    }

    public class FieldName
    {
        public string Name { get; set; }

        public FarmName AFarm { get; set; }
    }
}
