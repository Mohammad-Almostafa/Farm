using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Farm.App.DTOs
{
    public class UpdateFarmDto
    {
        [MinLength(3), MaxLength(100)]
        public string? Name { get; set; }

        public double? Area { get; set; }

        public string? Location { get; set; }

        public string? Description { get; set; }

        public string? WaterSource { get; set; }

        public string? WorkingHours { get; set; }

        public IFormFile? ImgFile { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public string? FormattedAddress { get; set; }

        public Guid OwnerId { get; set; }
    }
}
