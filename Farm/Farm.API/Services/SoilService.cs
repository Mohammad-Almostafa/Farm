using Farm.App.DTOs;
using System.Text.Json;

namespace Farm.API.Services
{
   // هذا مثال لاستدعاء LandGIS API [citation:3]

public class SoilService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<SoilService> _logger;

        public SoilService(HttpClient httpClient, ILogger<SoilService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<string?> GetSoilTypeAsync(decimal latitude, decimal longitude)
        {
            try
            {
                // تنسيق الإحداثيات (استخدام InvariantCulture لمنع مشاكل الفاصلة العشرية)
                var latStr = latitude.ToString(System.Globalization.CultureInfo.InvariantCulture);
                var lonStr = longitude.ToString(System.Globalization.CultureInfo.InvariantCulture);

                // طلب الحصول على نسبة الرمل والطين فقط (لتحديد نوع التربة)
                var requestUrl = $"https://rest.isric.org/soilgrids/v2.0/properties/query?" +
                                 $"lon={lonStr}&lat={latStr}" +
                                 $"&property=sand&property=clay" +
                                 $"&value=mean&depth=0-5cm";

                var response = await _httpClient.GetAsync(requestUrl);

                

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("فشل جلب بيانات التربة: {StatusCode}", response.StatusCode);
                    return null;
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                
                Console.WriteLine("JSON Response: " + jsonContent);
                // استخراج نسب الرمل والطين من الـ JSON
                using var document = JsonDocument.Parse(jsonContent);
                var sand = ExtractValue(document, "sand");
                var clay = ExtractValue(document, "clay");

                if (!sand.HasValue || !clay.HasValue)
                    return null;

                // تحديد نوع التربة بناءً على نسب الرمل والطين
                return DetermineSoilType(sand.Value, clay.Value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "someThing error while fetch siolData");
                return null;
            }
        }

        private double? ExtractValue(JsonDocument document, string propertyName)
        {
            try
            {
                // الوصول إلى المسار الصحيح: properties -> layers -> البحث عن العنصر المطلوب
                var layers = document.RootElement
                    .GetProperty("properties")
                    .GetProperty("layers")
                    .EnumerateArray();

                foreach (var layer in layers)
                {
                    var name = layer.GetProperty("name").GetString();
                    if (name?.Equals(propertyName, StringComparison.OrdinalIgnoreCase) == true)
                    {
                        var depths = layer.GetProperty("depths");
                        if (depths.ValueKind == JsonValueKind.Array && depths.GetArrayLength() > 0)
                        {
                            var values = depths[0].GetProperty("values");
                            var mean = values.GetProperty("mean").GetDouble();
                            // القيم تأتي بوحدة g/kg (جرام/كيلوجرام)، نحولها إلى نسبة مئوية بالقسمة على 10
                            return mean / 10.0;
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting {PropertyName}", propertyName);
                return null;
            }
        }

        private string DetermineSoilType(double sand, double clay)
        {
            double silt = 100 - sand - clay;

            // تصنيف USDA المبسط لمثلث النسيج
            if (sand > 80) return "Sandy Soil";
            if (clay > 50) return "Clay Soil";
            if (clay > 40 && sand < 45) return "Clay Loam";
            if (sand > 60 && clay < 20) return "Sandy Loam";
            if (sand > 50 && clay < 25) return "Loamy Sand";
            if (silt > 50 && clay < 25) return "Silt Loam";
            if (sand <= 50 && clay <= 27 && silt <= 50) return "Loam";
            return "Loamy Soil";
        }
    }
}
    

