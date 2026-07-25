using Farm.Infrastructure.Rebositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private readonly ICrop cropRepository;
        private readonly IFarm farmRepository;
        private readonly IField fieldRepository;

        public StatisticController(ICrop cropRepository, ITask taskRepository, IFarm farmRepository, IField fieldRepository)
        {
            this.cropRepository = cropRepository;
            this.farmRepository = farmRepository;
            this.fieldRepository = fieldRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDashboardStats(Guid id, CancellationToken cancellationToken = default)
        {
            var farm = await farmRepository.GetFarmWithFieldsByIdAsync(id);
            if(farm == null) return NotFound();

            var totalFields = await fieldRepository.CountAsync(f => f.AFarmId == id, cancellationToken);
            var totalFarmedFields = await fieldRepository.CountAsync(f => f.AFarmId == id, cancellationToken);
            var pendingTasks = farm.Fields?.Sum(f => f.ActionableTasks?.Count() ?? 0) ?? 0;
            int totalSensors = farm.Fields?.Sum(f => f.Sensors?.Count() ?? 0) ?? 0;
            var cropDistribution = await cropRepository.GetCropDistributionByFarmIdAsync(id, cancellationToken);

            return Ok(new
            {
                FarmArea = farm.Area,
                TotalFields = totalFields,
                TotalSensors = totalSensors,
                PendingTasks = pendingTasks,
                CropDistribution = cropDistribution
            });
        }
    }
}
