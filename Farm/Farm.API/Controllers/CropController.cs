using Farm.API.Services;
using Farm.App.DTOs;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories;
using Farm.Infrastructure.Rebositories.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class CropController : ControllerBase
    {
        private readonly CloudinaryService cloudinaryService;
        private readonly ICrop cropRepository;
        private readonly ITask taskRepository;

        public CropController(CloudinaryService _cloudinaryService, ICrop cropRepository, ITask taskRepository)
        {
            cloudinaryService = _cloudinaryService;
            this.cropRepository = cropRepository;
            this.taskRepository = taskRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCropById(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                return Ok(await cropRepository.GetByIdAsync(id, cancellationToken));
            }
            return BadRequest(ModelState);
        }


        [HttpPost("create-crop")]
        public async Task<IActionResult> CreateCrop([FromForm] CropDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            TypeAdapterConfig<CropDto, Crop>.NewConfig()
                .Ignore(dest => dest.ImgUrl);

            var crop = dto.Adapt<Crop>();
            if (dto.ImgFile != null)
            {
                crop.ImgUrl = await cloudinaryService.UploadImageAsync(dto.ImgFile, "farms");
            }

            await cropRepository.AddAsync(crop, cancellationToken);

            await cropRepository.SaveChangesAsync(cancellationToken);

            return Created();
        }

        [HttpPut("update-crop/{id}")]
        public async Task<IActionResult> UpdateCrop(Guid id, TaskCropDto dto, CancellationToken cancellationToken)
        {
            var crop = await cropRepository.GetByIdAsync(id, cancellationToken);

            if (!ModelState.IsValid || crop == null)
                return BadRequest(ModelState);

            dto.Adapt(crop);

            if (crop.NextWatered != null)
                await taskRepository.AddAsync(new ActionableTask
                {
                    TaskType = "irrication",
                    TaskTime = crop.NextWatered,
                    CropName = crop.Type,
                    FarmName = crop.Field.AFarm.Name,
                    FieldName = crop.Field.Name,
                    FieldId = crop.Field.Id
                });
            if (crop.NextFertilization != null)

                await taskRepository.AddAsync(new ActionableTask
                {
                    TaskType = "Fertilization",
                    TaskTime = crop.NextFertilization,
                    CropName = crop.Type,
                    FarmName = crop.Field.AFarm.Name,
                    FieldName = crop.Field.Name,
                    FieldId = crop.Field.Id
                });
            if (crop.Status == "Harvested")

                await taskRepository.AddAsync(new ActionableTask
                {
                    TaskType = "Harvest",
                    TaskTime = crop.ActualHarvestDate,
                    CropName = crop.Type,
                    FarmName = crop.Field.AFarm.Name,
                    FieldName = crop.Field.Name,
                    FieldId = crop.Field.Id
                });

            await cropRepository.UpdateAsync(crop, cancellationToken);

            await cropRepository.SaveChangesAsync(cancellationToken);

            return NoContent();
        }

        //Crop_Reference EndPoints
        [HttpGet("allCropRefs")]
        public async Task<IActionResult> GetAllCropRef(CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var cropRef = await cropRepository.GetAllCropRefAsync(cancellationToken);
                var dtos = cropRef.Adapt<List<GetCropRefDto>>();
                return Ok(dtos);
            }
            return BadRequest(ModelState);
        }

        [HttpGet("CropRef/{id}")]
        public async Task<IActionResult> GetCropRefById(Guid id, CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var cropRef = await cropRepository.GetCropRefByIdAsync(id, cancellationToken);
                var dtos = cropRef.Adapt<GetCropRefDto>();
                return Ok(dtos);
            }
            return BadRequest(ModelState);
        }

        [HttpPost("addCropRef")]
        public async Task<IActionResult> AddCropRef(CropRefDto dto, CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var cropRef = dto.Adapt<Crop_Ref>();
                await cropRepository.AddCropRefAsync(cropRef, cancellationToken);
                return Created();
            }
            return BadRequest(ModelState);
        }

        //admin
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCrops(
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var result = await cropRepository.GetAllCropWithFieldAndFarmAsync(cancellationToken);
                var dtos = result.Adapt<IEnumerable<CropsDto>>();
                return Ok(dtos);
            }
            return BadRequest(ModelState);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCrop(Guid id, [FromBody] UpdateCropDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var crop = await cropRepository.GetByIdAsync(id, cancellationToken);

            if (crop == null) return NotFound();

            TypeAdapterConfig<UpdateCropDto, Crop>.NewConfig()
                .Ignore(dest => dest.ImgUrl);

            dto.Adapt(crop);
            if (dto.ImgFile != null)
            {
                crop.ImgUrl = await cloudinaryService.UploadImageAsync(dto.ImgFile, "farms");
            }

            await cropRepository.UpdateAsync(crop, cancellationToken);

            await cropRepository.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
