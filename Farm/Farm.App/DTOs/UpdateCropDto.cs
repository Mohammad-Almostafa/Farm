using Microsoft.AspNetCore.Http;

namespace Farm.App.DTOs
{
    public class UpdateCropDto
    {
        public string Type { get; set; }//نوع

        public string Variety { get; set; }//صنف

        public string Season { get; set; }

        public string ExpectedYield { get; set; }

        public string? Description { get; set; }

        public Guid FieldId { get; set; }

        public IFormFile? ImgFile { get; set; }
    }
}
