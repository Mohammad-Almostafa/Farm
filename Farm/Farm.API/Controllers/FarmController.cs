using Farm.API.Services;
using Farm.App.DTOs;
using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class FarmController : ControllerBase
    {
        private readonly WeatherService weatherService;
        private readonly IFarm farmRepository;
        private readonly CloudinaryService cloudinaryService;
        private readonly SoilService soilService;

        public FarmController(WeatherService weatherService, IFarm farmRepository, CloudinaryService _cloudinaryService, SoilService soilService)
        {
            this.weatherService = weatherService;
            this.farmRepository = farmRepository;
            cloudinaryService = _cloudinaryService;
            this.soilService = soilService;
        }

        [HttpPost("create-farm")]
        public async Task<IActionResult> CreateFarm([FromForm] AFarmDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            TypeAdapterConfig<AFarmDto, AFarm>.NewConfig()
                .Ignore(dest => dest.ImgUrl);

            var farm = dto.Adapt<AFarm>();
            if (dto.ImgFile != null)
            {
                farm.ImgUrl = await cloudinaryService.UploadImageAsync(dto.ImgFile, "farms");
            }
            var exists = await farmRepository.IsFarmExistAsync(farm.Latitude, farm.Longitude, cancellationToken);
            if (exists)
                return BadRequest("A farm already exists at this location");

            farm.SoilType = await soilService.GetSoilTypeAsync(farm.Latitude, farm.Longitude);

            await farmRepository.AddAsync(farm, cancellationToken);

            await farmRepository.SaveChangesAsync(cancellationToken);

            return Created();
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyFarms(
            [FromQuery] decimal latitude,
            [FromQuery] decimal longitude,
            [FromQuery] double radiusKm = 10,
            CancellationToken cancellationToken = default)
        {
            var farms = await farmRepository.GetNearByFarmsAsync(latitude, longitude, radiusKm, cancellationToken);

            var nearbyFarms = farms.Select(farm => new {
                farm.Id,
                farm.Name,
                farm.Latitude,
                farm.Longitude,
                farm.FormattedAddress,
                Distance = DistanceFarmService.CalculateDistance(latitude, longitude, farm.Latitude, farm.Longitude)
            });

            return Ok(nearbyFarms);
        }

        [HttpPut("{farmId}")]
        public async Task<IActionResult> UpdateFarm(Guid farmId, [FromBody]UpdateFarmDto farmDto, CancellationToken cancellationToken)
        {
            if (ModelState.IsValid)
            {
                var farm = await farmRepository.GetByIdAsync(farmId, cancellationToken);
                if (farm == null) return NotFound();
                farmDto.Adapt(farm);
                await farmRepository.UpdateAsync(farm);
                await farmRepository.SaveChangesAsync(cancellationToken);
                return NoContent();
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{farmId}")]
        public async Task<IActionResult> DeleteFarm(Guid farmId, CancellationToken cancellationToken)
        {
            if (ModelState.IsValid)
            {
                var farm = await farmRepository.GetByIdAsync(farmId, cancellationToken);
                if (farm == null) return NotFound();
                await farmRepository.DeleteAsync(farm, cancellationToken);
                await farmRepository.SaveChangesAsync(cancellationToken);
                return NoContent();
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFarmById(Guid id, CancellationToken cancellationToken)
        {
            if (ModelState.IsValid)
            {
                return Ok(await farmRepository.GetByIdAsync(id, cancellationToken));
            }
            return BadRequest(ModelState);
        }

        [HttpGet("pagedfarms")]
        public async Task<IActionResult> GetPagedFarms(
            [FromQuery] QueryParameters parameters,
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var result = await farmRepository.SearchAsync(parameters.SearchTerm, parameters, cancellationToken);
                var dtos = result.Items.Adapt<IEnumerable<GetFarmDto>>();

                return Ok(new PagedResult<GetFarmDto>
                {
                    Items = dtos,
                    MetaData = result.MetaData
                });
            }
            return BadRequest(ModelState);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllFarms(CancellationToken cancellationToken) 
        { 
            if (ModelState.IsValid)
            {
                return Ok(await farmRepository.GetAllAsync(cancellationToken));
            }
            return BadRequest(ModelState);
        }
        [HttpGet("pagedfarmbyuserid/{userId}")]
        public async Task<IActionResult> GetPagedFarmsByUserId(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool desc = false,
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var parameters = new QueryParameters
                {
                    PageNumber = page,
                    PageSize = pageSize,
                    SearchTerm = search,
                    SortBy = sortBy,
                    SortDescending = desc
                };
                var farm = await farmRepository.GetFarmPagedAsync(userId, parameters, cancellationToken);
                
                return Ok(farm.Adapt<GetFarmDto>());
            }
            return BadRequest(ModelState);
        }

        [HttpGet("weather")]
        public async Task<IActionResult> GetWeatherOfFarm(
            [FromQuery] decimal latitude,
            [FromQuery] decimal longitude,
            CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                            
            return Ok(await weatherService.GetCurrentWeatherAsync(latitude, longitude));
        }

        //admin
        [HttpGet("allwithowner")]
        public async Task<IActionResult> GetAllFarmsWithOwner(CancellationToken cancellationToken) 
        { 
            if (ModelState.IsValid)
            {
                var farm = await farmRepository.GetAllFarmsWithOwnerAsync(cancellationToken);

                var dto = farm.Adapt<IEnumerable<FarmWithOwnerDto>>();
                
                return Ok(dto);
            }
            return BadRequest(ModelState);
        }
    }
}
