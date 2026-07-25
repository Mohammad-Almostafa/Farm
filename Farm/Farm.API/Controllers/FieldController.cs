using Farm.API.Services;
using Farm.App.DTOs;
using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories;
using Farm.Infrastructure.Rebositories.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class FieldController : ControllerBase
    {
        private readonly IField fieldRepository;
        private readonly CloudinaryService cloudinaryService;

        public FieldController(IField fieldRepository, CloudinaryService _cloudinaryService)
        {
            this.fieldRepository = fieldRepository;
            cloudinaryService = _cloudinaryService;
        }

        [HttpGet("pagedfields")]
        public async Task<IActionResult> GetPagedFarmWithFields(
            [FromQuery] QueryParameters parameters,
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var result = await fieldRepository.SearchAsync(parameters.SearchTerm, parameters, cancellationToken);

                TypeAdapterConfig<Field, GetFieldDto>
                    .NewConfig()
                    .Map(dest => dest.CropName, src => src.Crop != null ? src.Crop.Type : null)
                    .Map(dest => dest.FarmName, src => src.AFarm != null ? src.AFarm.Name : null);

                var dtos = result.Items.Adapt<IEnumerable<GetFarmWithFieldsDto>>();

                return Ok(new PagedResult<GetFarmWithFieldsDto>
                {
                    Items = dtos,
                    MetaData = result.MetaData
                });
            }
            return BadRequest(ModelState);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllFarmWithFields(
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var result = await fieldRepository.GetAllFarmWithFildsAsync(cancellationToken);

                TypeAdapterConfig<Field, GetFieldDto>
                    .NewConfig()
                    .Map(dest => dest.CropName, src => src.Crop != null ? src.Crop.Type : null)
                    .Map(dest => dest.FarmName, src => src.AFarm != null ? src.AFarm.Name : null);

                var dtos = result.Adapt<IEnumerable<GetFarmWithFieldsDto>>();

                return Ok(dtos);
            }
            return BadRequest(ModelState);
        }

        [HttpPost("create-field")]
        public async Task<IActionResult> CreateField([FromForm] FieldDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            TypeAdapterConfig<FieldDto, Field>.NewConfig()
                .Ignore(dest => dest.ImgUrl);

            var field = dto.Adapt<Field>();
            if (dto.ImgFile != null)
            {
                field.ImgUrl = await cloudinaryService.UploadImageAsync(dto.ImgFile, "farms");
            }
            
            if (await fieldRepository.IsAreaOfFaildEnough(dto.AFarmId, dto.Area, cancellationToken))
                return BadRequest("there is no enough area in this farm to add new field !");

            await fieldRepository.AddAsync(field, cancellationToken);

            await fieldRepository.SaveChangesAsync(cancellationToken);

            return Created();
        }

        //admin

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteField(Guid id, CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var field = await fieldRepository.GetByIdAsync(id, cancellationToken);
            if (field == null) return NotFound();
            await fieldRepository.DeleteAsync(field, cancellationToken);
            await fieldRepository.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateField(Guid id, [FromBody] FieldDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var field = await fieldRepository.GetByIdAsync(id, cancellationToken);
            
            if(field == null) return NotFound();

            TypeAdapterConfig<FieldDto, Field>.NewConfig()
                .Ignore(dest => dest.ImgUrl);

            dto.Adapt(field);
            if (dto.ImgFile != null)
            {
                field.ImgUrl = await cloudinaryService.UploadImageAsync(dto.ImgFile, "farms");
            }
            
            if (await fieldRepository.IsAreaOfFaildEnough(dto.AFarmId, dto.Area, cancellationToken))
                return BadRequest("there is no enough area in this farm to add new field!");

            await fieldRepository.UpdateAsync(field, cancellationToken);

            await fieldRepository.SaveChangesAsync(cancellationToken);

            return NoContent();
        }

        [HttpGet("allfieldwithfarm")]
        public async Task<IActionResult> GetAllFieldsWithFarm(
            CancellationToken cancellationToken = default)
        {
            if (ModelState.IsValid)
            {
                var fields = await fieldRepository.GetAllFielsWithFarmsAsync(cancellationToken);

                var dtos = fields.Adapt<IEnumerable<FieldWithFarmDto>>();

                return Ok(dtos);
            }
            return BadRequest(ModelState);
        }
    }
}
