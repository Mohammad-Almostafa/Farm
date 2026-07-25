using System.Text.Json;

public class WeatherService
{
    private readonly HttpClient _httpClient;
    private const string WeatherApiBaseUrl = "https://api.open-meteo.com/v1/forecast";

    public WeatherService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<WeatherData?> GetCurrentWeatherAsync(decimal latitude, decimal longitude)
    {
        var url = $"{WeatherApiBaseUrl}?" +
                  $"latitude={latitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}&" +
                  $"longitude={longitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}&" +
                  "current=temperature_2m,relative_humidity_2m,wind_speed_10m&" +
                  "hourly=temperature_2m,relative_humidity_2m,wind_speed_10m";

        var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode) return null;

        Console.WriteLine($"Weather API response: {response}");

        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<WeatherData>(content);
    }
}

public class WeatherData
{
    public CurrentWeather current { get; set; }
}

public class CurrentWeather
{
    public decimal temperature_2m { get; set; }
    public decimal relative_humidity_2m { get; set; }
    public decimal wind_speed_10m { get; set; }
}