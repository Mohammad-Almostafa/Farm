using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class Crop_Ref
    {
        public Crop_Ref()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Season { get; set; }
        
        public string Yield { get; set; }

        public string Description { get; set; }

        public ICollection<Variety_Ref>? Variety_Refs { get; set; }
    }
}
