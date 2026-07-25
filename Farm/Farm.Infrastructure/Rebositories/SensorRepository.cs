using Farm.Domain.Entities;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories.Interfaces;
using Farm.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Rebositories
{
    public class SensorRepository : GenericRepository<Sensor>, ISensor
    {
        private readonly FarmDbContext context;

        public SensorRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<SensorReading> AddReadingAsync(SensorReading sensorReading, CancellationToken cancellationToken = default)
        {
            await context.SensorReadings.AddAsync(sensorReading);

            return sensorReading;
        }

        public async Task<IEnumerable<AlertsLog>> GetAlertLogsAsync(CancellationToken cancellationToken = default)
        {
            return await context.AlertsLogs.Include(a => a.Sensor).Include(a => a.Field).ThenInclude(f => f.AFarm).ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Sensor>> GetSensorWithReadingByFaildIdAsync(Guid fieldId, DateTime? from, DateTime? to, CancellationToken cancellationToken = default)
        {
            from = from ?? DateTime.UtcNow.AddDays(-7);
            
            to = to ?? DateTime.UtcNow;

            var sensors = await context.Sensors.Include(s => s.Readings)
                .Where(s => s.FieldId == fieldId && !s.IsDeleted &&
                            s.Readings.Any(r => r.ReadingTimestamp >= from && r.ReadingTimestamp <= to))
                .ToListAsync(cancellationToken);

            foreach (var sensor in sensors)
            {
                if (sensor.Readings != null)
                {
                    sensor.Readings = sensor.Readings
                        .Where(r => r.ReadingTimestamp >= from && r.ReadingTimestamp <= to)
                        .OrderBy(r => r.ReadingTimestamp)
                        .ToList();
                }
            }

            return sensors;
        }
    }
}
