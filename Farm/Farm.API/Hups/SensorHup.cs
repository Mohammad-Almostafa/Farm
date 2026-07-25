using Microsoft.AspNetCore.SignalR;

namespace Farm.API.Hups
{
    public class SensorHub : Hub
    {
        public async Task SendSensorReading(string sensorId, string value, string timestamp)
        {
            await Clients.All.SendAsync("ReceiveSensorReading", sensorId, value, timestamp);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"🟢 [SignalR] User connected with ID: '{userId}'");
            await base.OnConnectedAsync();
        }
    }
}
