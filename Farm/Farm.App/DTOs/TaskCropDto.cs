using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class TaskCropDto
    {

        public string? Status { get; set; }//Planted, Harvested, Fallow, Infested

        public decimal? Yield { get; set; }

        public DateTime? NextWatered { get; set; }

        public DateTime? NextFertilization { get; set; }

        public DateTime? ActualHarvestDate { get; set; }
    }
}
