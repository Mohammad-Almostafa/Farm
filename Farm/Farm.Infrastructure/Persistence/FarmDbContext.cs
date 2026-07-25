using Farm.Domain.Common;
using Farm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Persistence
{
    public class FarmDbContext : DbContext
    {
        public DbSet<AlertsLog> AlertsLogs { get; set; }

        public DbSet<Field> Fields { get; set; }

        public DbSet<Crop> Crops { get; set; }

        public DbSet<Sensor> Sensors { get; set; }

        public DbSet<SensorReading> SensorReadings { get; set; }

        public DbSet<WeatherHistory> WeatherHistories { get; set; }

        public DbSet<User> Users { get; set; }
        
        public DbSet<AFarm> AFarms { get; set; }

        public DbSet<ActionableTask> ActionableTasks { get; set; }

        public DbSet<Crop_Ref> Crop_Refs { get; set; }

        public DbSet<Variety_Ref> Variety_Refs { get; set; }

        public FarmDbContext(DbContextOptions<FarmDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AlertsLog>()
                .HasOne(a => a.Field)
                .WithMany()
                .HasForeignKey(a => a.FieldId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<AlertsLog>()
                .HasOne(a => a.Sensor)
                .WithMany()
                .HasForeignKey(a => a.SensorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<AFarm>()
                .HasOne(a => a.Owner)
                .WithMany()
                .HasForeignKey(a => a.OwnerId);

            //modelBuilder.Entity<Field>()
            //    .HasOne(f => f.Crop)
            //    .WithOne(c => c.Field)
            //    .HasForeignKey<Crop>(c => c.FieldId);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>()
                .Where(e => e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        public static async Task CreateInitialDbData(FarmDbContext _context)
        {

            //await _context.Database.EnsureDeletedAsync();
            await _context.Database.EnsureCreatedAsync();

            var crops = new List<Crop_Ref>{
                // 1. طماطم
                new Crop_Ref
                {
                    Name = "طماطم (Tomato)",
                    Season = "ربيع - خريفي",
                    Yield = "30-50",
                    Description = "يتنوع حسب الصنف ونظام الزراعة (أرض مفتوحة أو بيوت محمية)",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "شندويل (Shandwel)" },
                        new Variety_Ref { Name = "طماطم بلاستيكية (Plastic)" },
                        new Variety_Ref { Name = "حمراء عادية (Local Red)" },
                        new Variety_Ref { Name = "طماطم كرزية (Cherry)" }
                    }
                },
                // 2. خيار
                new Crop_Ref
                {
                    Name = "خيار (Cucumber)",
                    Season = "ربيع - صيفي",
                    Yield = "20-40",
                    Description = "البيوت المحمية تعطي إنتاجية أعلى",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "خيار بيوت محمية (Greenhouse)" },
                        new Variety_Ref { Name = "خيار أرضي (Field)" },
                        new Variety_Ref { Name = "خيار قطف مبكر (Early)" }
                    }
                },
                // 3. باذنجان
                new Crop_Ref
                {
                    Name = "باذنجان (Eggplant)",
                    Season = "صيفي",
                    Yield = "25-35",
                    Description = "يتحمل الحرارة العالية، يحتاج ري منتظم",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "باذنجان أسود طويل (Black Long)" },
                        new Variety_Ref { Name = "باذنجان عبلّ (Abal)" },
                        new Variety_Ref { Name = "باذنجان رومي (Romi)" }
                    }
                },
                // 4. فلفل
                new Crop_Ref
                {
                    Name = "فلفل (Pepper)",
                    Season = "ربيع - صيفي",
                    Yield = "15-25",
                    Description = "يحتاج تربة جيدة التصريف",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "فلفل حلو بلدي (Sweet Bell)" },
                        new Variety_Ref { Name = "فلفل حار (Hot Pepper)" },
                        new Variety_Ref { Name = "فلفل قرني (Qarni)" }
                    }
                },
                // 5. بطاطا
                new Crop_Ref
                {
                    Name = "بطاطا (Potato)",
                    Season = "شتوي (شباط) / صيفي (آب)",
                    Yield = "20-35",
                    Description = "محصولان سنوياً في المناطق المعتدلة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "بطاطا سبونتا (Spunta)" },
                        new Variety_Ref { Name = "بطاطا ديزيريه (Désirée)" },
                        new Variety_Ref { Name = "بطاطا أجريا (Agria)" }
                    }
                },
                // 6. بصل
                new Crop_Ref
                {
                    Name = "بصل (Onion)",
                    Season = "شتوي (تشرين أول)",
                    Yield = "25-40",
                    Description = "يخزن لفترة طويلة بعد الحصاد",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "بصل أحمر (Red)" },
                        new Variety_Ref { Name = "بصل أبيض (White)" },
                        new Variety_Ref { Name = "بصل جاف (Dry)" }
                    }
                },
                // 7. ثوم
                new Crop_Ref
                {
                    Name = "ثوم (Garlic)",
                    Season = "خريفي",
                    Yield = "10-15",
                    Description = "يُزرع في الخريف ويُحصد في الربيع",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "ثوم بلدي (Local)" },
                        new Variety_Ref { Name = "ثوم صيني (Chinese)" }
                    }
                },
                // 8. كوسا
                new Crop_Ref
                {
                    Name = "كوسا (Zucchini)",
                    Season = "ربيعي",
                    Yield = "15-25",
                    Description = "ينتج بغزارة ويحتاج قطف يومي",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "كوسا بلدي (Local)" },
                        new Variety_Ref { Name = "كوسا بيضاء (White)" }
                    }
                },
                // 9. سبانخ
                new Crop_Ref
                {
                    Name = "سبانخ (Spinach)",
                    Season = "شتوي",
                    Yield = "10-15",
                    Description = "ينمو في الأجواء الباردة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "سبانخ بلدي (Local)" }
                    }
                },
                // 10. خس
                new Crop_Ref
                {
                    Name = "خس (Lettuce)",
                    Season = "ربيع - خريفي",
                    Yield = "20-30",
                    Description = "يتحمل البرودة الخفيفة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "خس روماني (Romaine)" },
                        new Variety_Ref { Name = "خس كابوتشا (Capuch)" }
                    }
                },
                // 11. قمح
                new Crop_Ref
                {
                    Name = "قمح (Wheat)",
                    Season = "شتوي (تشرين أول - تشرين ثاني)",
                    Yield = "3-6",
                    Description = "أهم محصول استراتيجي",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "قمح شامي (Shami)" },
                        new Variety_Ref { Name = "قمح درعمي (Duraimi)" },
                        new Variety_Ref { Name = "قمح أكساد (ACSAD)" }
                    }
                },
                // 12. شعير
                new Crop_Ref
                {
                    Name = "شعير (Barley)",
                    Season = "شتوي",
                    Yield = "2-4",
                    Description = "يستخدم كعلف للحيوانات",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "شعير بلدي (Local)" },
                        new Variety_Ref { Name = "شعير ريهان (Rihan)" }
                    }
                },
                // 13. فول
                new Crop_Ref
                {
                    Name = "فول (Fava Bean)",
                    Season = "شتوي",
                    Yield = "2-3",
                    Description = "يُزرع في الأراضي البعلية",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "فول بلدي (Local)" }
                    }
                },
                // 14. حمص
                new Crop_Ref
                {
                    Name = "حمص (Chickpea)",
                    Season = "شتوي",
                    Yield = "1-2",
                    Description = "يتحمل الجفاف",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "حمص كبير (Large)" },
                        new Variety_Ref { Name = "حمص بلدي (Local)" }
                    }
                },
                // 15. عدس
                new Crop_Ref
                {
                    Name = "عدس (Lentil)",
                    Season = "شتوي",
                    Yield = "1-1.5",
                    Description = "مصدر مهم للبروتين النباتي",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "عدس أحمر (Red)" },
                        new Variety_Ref { Name = "عدس أخضر (Green)" }
                    }
                },
                // 16. زيتون
                new Crop_Ref
                {
                    Name = "زيتون (Olive)",
                    Season = "خريفي (أيلول - تشرين أول)",
                    Yield = "5-15",
                    Description = "تعتمد الإنتاجية على عمر الأشجار",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "زيتون خضيري (Khudairi)" },
                        new Variety_Ref { Name = "زيتون صوراني (Sorani)" },
                        new Variety_Ref { Name = "زيتون دان (Dane)" }
                    }
                },
                // 17. عنب
                new Crop_Ref
                {
                    Name = "عنب (Grape)",
                    Season = "صيفي (تموز - آب)",
                    Yield = "10-20",
                    Description = "يستخدم للأكل الطازج أو التصنيع",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "عنب حلواني (Helwani)" },
                        new Variety_Ref { Name = "عنب بلدي (Local)" },
                        new Variety_Ref { Name = "عنب أسود (Black)" }
                    }
                },
                // 18. لوز
                new Crop_Ref
                {
                    Name = "لوز (Almond)",
                    Season = "ربيعي",
                    Yield = "1-2",
                    Description = "يُقطف ثماره خضراء أو جافة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "لوز أشقر (Ashkar)" },
                        new Variety_Ref { Name = "لوز أخضر (Green)" }
                    }
                },
                // 19. برتقال (حمضيات)
                new Crop_Ref
                {
                    Name = "برتقال (Orange)",
                    Season = "شتوي (كانون أول - شباط)",
                    Yield = "15-30",
                    Description = "من الحمضيات الرئيسية",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "برتقال أبو سرة (Abu Surra)" },
                        new Variety_Ref { Name = "برتقال بلدي (Local)" }
                    }
                },
                // 20. ليمون
                new Crop_Ref
                {
                    Name = "ليمون (Lemon)",
                    Season = "خريفي - شتوي",
                    Yield = "10-20",
                    Description = "يستخدم في الطهي والمشروبات",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "ليمون أضاليا (Adalia)" },
                        new Variety_Ref { Name = "ليمون بلدي (Local)" }
                    }
                },
                // 21. تفاح
                new Crop_Ref
                {
                    Name = "تفاح (Apple)",
                    Season = "ربيعي - صيفي",
                    Yield = "20-35",
                    Description = "يلائم المناطق الجبلية الباردة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "تفاح جولدن (Golden)" },
                        new Variety_Ref { Name = "تفاح أحمر (Red)" }
                    }
                },
                // 22. رمان
                new Crop_Ref
                {
                    Name = "رمان (Pomegranate)",
                    Season = "خريفي (أيلول - تشرين أول)",
                    Yield = "10-15",
                    Description = "يتحمل الجفاف والملوحة",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "رمان بلدي (Local)" },
                        new Variety_Ref { Name = "رمان حلو (Sweet)" }
                    }
                },
                // 23. نعنع
                new Crop_Ref
                {
                    Name = "نعنع (Mint)",
                    Season = "ربيع - صيف",
                    Yield = "10-15",
                    Description = "يتحمل الري الوفير",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "نعنع بلدي (Local)" }
                    }
                },
                // 24. بقدونس
                new Crop_Ref
                {
                    Name = "بقدونس (Parsley)",
                    Season = "ربيع - خريف",
                    Yield = "20-30",
                    Description = "موسم بارد",
                    Variety_Refs = new List<Variety_Ref>
                    {
                        new Variety_Ref { Name = "بقدونس مجعد (Curly)" }
                    }
                },
                // 25. كزبرة
                new Crop_Ref
                {
                    Name = "كزبرة (Coriander)",
                    Season = "ربيع - شتاء",
                    Yield = "5-8",
                    Description = "تستخدم الورقة والبذور",
                    Variety_Refs = new List<Variety_Ref>{ new Variety_Ref { Name = "كزبرة بلدي (Local)" } }
                }
            };

            //await _context.Crop_Refs.ExecuteDeleteAsync();

            if(_context.Crop_Refs.Count() < 1)
            {
                await _context.Crop_Refs.AddRangeAsync(crops);

                await _context.SaveChangesAsync();
            }

        }
    }
}
