namespace Farm.API.Controllers
{
    public class GetCropRefDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Season { get; set; }

        public string Yield { get; set; }

        public string Description { get; set; }

        public ICollection<GetVarietyRefDto>? Variety_Refs { get; set; }
    }
    public class GetVarietyRefDto
    {
        public string Name { get; set; }//صنف
    }
}