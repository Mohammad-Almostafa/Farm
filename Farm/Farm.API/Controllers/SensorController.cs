using Farm.API.Hups;
using Farm.App.DTOs;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly ISensor sensorRepository;
        private readonly IHubContext<SensorHub> hubContext;
        private readonly IField fieldRepository;
        private readonly IFarm farmRepository;
        private readonly IUser userRepository;

        public SensorController(ISensor sensorRepository, IHubContext<SensorHub> hubContext, IField fieldRepository, IFarm farmRepository, IUser userRepository)
        {
            this.sensorRepository = sensorRepository;
            this.hubContext = hubContext;
            this.fieldRepository = fieldRepository;
            this.farmRepository = farmRepository;
            this.userRepository = userRepository;
        }
        [HttpGet("{fieldId}")]
        public async Task<IActionResult> GetSensorHistory(
            Guid fieldId,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            CancellationToken cancellationToken = default)
        {
            var readings = await sensorRepository.GetSensorWithReadingByFaildIdAsync(fieldId, from, to, cancellationToken);
            var dto = readings.Adapt<IEnumerable<GetSensorsWithReadingsDto>>();

            return Ok(dto);
        }

        [HttpPost("addReading")]
        public async Task<IActionResult> CreateReading([FromBody] SensorReadingDto dto)
        {
            var reading = dto.Adapt<SensorReading>();

            var sensor = await sensorRepository.GetByIdAsync(dto.SensorId);

            var field = await fieldRepository.GetByIdAsync(sensor.FieldId);

            var farm = await farmRepository.GetByIdAsync(field.AFarmId);

            var userIds = await userRepository.GetFarmerUserAsync();

            var alertLogs = new AlertsLog
            {
                SensorId = sensor.Id,
                FieldId = field.Id,
                Value = reading.Value,
                Unit = sensor.Type,
            };

            var message = string.Empty;
            if (reading.Value > sensor.MaxRange)
                message = $"⚠️ High {sensor.Type} in '{field.Name}' ({farm.Name}): {reading.Value} {sensor.Unit} (max: {sensor.MaxRange})";
            else
            if (reading.Value < sensor.MinRange)
                message = $"⚠️ Low {sensor.Type} in '{field.Name}' ({farm.Name}): {reading.Value} {sensor.Unit} (min: {sensor.MinRange})";

            await sensorRepository.AddReadingAsync(reading);

            await sensorRepository.SaveChangesAsync();

            await hubContext.Clients.All.SendAsync(
                "ReceiveSensorReading",
                reading.SensorId.ToString(),
                reading.Value.ToString(),
                reading.ReadingTimestamp.ToString("o")
            );

            if (!string.IsNullOrEmpty(message))
            {
                foreach (var userId in userIds)
                    await hubContext.Clients.Users(userId.ToString()).SendAsync("ReceiveAlert",
                    message);
                alertLogs.Message = message;
            }

            return Created();
        }

        [HttpPost("addSensor")]
        public async Task<IActionResult> AddSensor(SensorDto dto)
        {
            var sensor = dto.Adapt<Sensor>();

            await sensorRepository.AddAsync(sensor);

            await sensorRepository.SaveChangesAsync();

            await sensorRepository.AddReadingAsync(new SensorReading
            {
                SensorId = sensor.Id,
                Value = 0,
                ReadingTimestamp = DateTime.UtcNow
            });

            await sensorRepository.AddReadingAsync(new SensorReading
            {
                SensorId = sensor.Id,
                Value = 8,
                ReadingTimestamp = DateTime.UtcNow
            });

            await sensorRepository.SaveChangesAsync();

            return Created();
        }

        [HttpGet("alertLogs")]
        public async Task<IActionResult> GetAlertLogs(CancellationToken cancellationToken)
        {
            TypeAdapterConfig<AlertsLog, AlertLogsDto>
                .NewConfig()
                .Map(dest => dest.SensorName, src => src.Sensor != null ? src.Sensor.Type : null)
                .Map(dest => dest.FieldName, src => src.Field != null ? src.Field.Name : null)
                .Map(dest => dest.FarmName, src => src.Field.AFarm != null ? src.Field.AFarm.Name : null);

            var logs = await sensorRepository.GetAlertLogsAsync(cancellationToken);
            var dto = logs.Adapt<IEnumerable<AlertLogsDto>>();
            return Ok(dto);
        }
    }
}
