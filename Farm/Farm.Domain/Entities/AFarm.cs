
using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class AFarm : BaseEntity
    {        
        public string Name { get; set; }

        public double Area { get; set; }

        public string Location { get; set; }

        public string? Description { get; set; }

        public string? SoilType { get; set; }

        public string? ImgUrl { get; set; }

        public string WaterSource { get; set; }

        public string? WorkingHours { get; set; }

        // map information
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string? FormattedAddress { get; set; }

        public User Owner { get; set; }
        public Guid OwnerId { get; set; }

        public ICollection<Field>? Fields { get; set; }
    }
}
