using Farm.Domain.Entities;

namespace Farm.Infrastructure.Rebositories.Interfaces
{
    public interface ISensor : IRepository<Sensor>
    {
        Task<IEnumerable<Sensor>> GetSensorWithReadingByFaildIdAsync(Guid fieldId, DateTime? from, DateTime? to, CancellationToken cancellationToken = default);
        
        Task<SensorReading> AddReadingAsync(SensorReading sensorReading, CancellationToken cancellationToken = default);
    
        Task<IEnumerable<AlertsLog>> GetAlertLogsAsync(CancellationToken cancellationToken = default);
    }
}
