using System.ComponentModel.DataAnnotations;

namespace Farm.Domain
{
    public class AFarm
    {

        public AFarm()
        {
            Id  = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public Guid Id { get; set; }
        
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string Location { get; set; }

        public DateTime CreatedAt { get; set; }

        public User Owner { get; set; }
        public Guid OwnerId { get; set; }

        public ICollection<Field> Fields { get; set; }

    }
}
