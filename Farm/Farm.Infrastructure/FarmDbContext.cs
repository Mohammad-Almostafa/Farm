using Farm.Domain;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure
{
    public class FarmDbContext : DbContext
    {
        public DbSet<AlertsLog> AlertsLogs { get; set; }

        public DbSet<Field> Fields { get; set; }

        public DbSet<Crop> Crops { get; set; }

        public DbSet<Sensor> Sensors { get; set; }

        public DbSet<AlertRule> AlertRules { get; set; }

        public DbSet<User> Users { get; set; }
        
        public DbSet<AFarm> AFarms { get; set; }

        public FarmDbContext(DbContextOptions<FarmDbContext> options) : base(options)
        {
            
        }
    }
}
