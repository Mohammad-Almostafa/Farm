using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class Variety_Ref
    {
        public Variety_Ref()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }//صنف

        public Guid Crop_RefId { get; set; }
        public Crop_Ref Crop_Ref { get; set; }
    }
}
