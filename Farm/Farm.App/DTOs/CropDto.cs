using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class CropDto
    {
        public string Type { get; set; }//نوع

        public string Variety { get; set; }//صنف

        public string Season { get; set; }

        public string ExpectedYield { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; }//Planted, Harvested, Fallow, Infested

        public decimal? Yield { get; set; }

        public DateTime? NextWatered { get; set; }

        public DateTime? NextFertilization { get; set; }

        public DateTime? ActualHarvestDate { get; set; }

        public Guid FieldId { get; set; }

        public IFormFile? ImgFile { get; set; }
    }
}
