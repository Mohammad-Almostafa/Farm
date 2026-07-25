namespace Farm.API.Controllers
{
    public class CropRefDto
    {
        public string Name { get; set; }

        public string Season { get; set; }

        public string Yield { get; set; }

        public string Description { get; set; }

        public ICollection<VarietyRefDto>? Variety_Refs { get; set; }
    }
    public class VarietyRefDto
    {
        public string Name { get; set; }//صنف
    }
}