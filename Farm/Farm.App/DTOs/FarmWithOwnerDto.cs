using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Farm.App.DTOs
{
    public class FarmWithOwnerDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string Name { get; set; }

        public double Area { get; set; }

        public string Location { get; set; }

        public string Description { get; set; }

        public string WaterSource { get; set; }

        public string WorkingHours { get; set; }

        public string ImgUrl { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string SoilType { get; set; }

        public string FormattedAddress { get; set; }

        public Guid OwnerId { get; set; }

        public Owner Owner { get; set; }
    }
    public class Owner
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}

