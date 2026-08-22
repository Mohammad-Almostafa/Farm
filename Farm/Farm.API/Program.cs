using Farm.API.Helpers;
using Farm.API.Hups;
using Farm.API.Services;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories;
using Farm.Infrastructure.Rebositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

Log.Logger = new LoggerConfiguration()
                        .MinimumLevel.Debug()
                        .WriteTo.Console()
                        .WriteTo.File("G:/ﬂÊ—” Csharp/1000 programer/Farm/Farm", rollingInterval: RollingInterval.Month)
                        .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();
// Add services to the container.

// Mapster configuration, it needs to be added before adding the IMapper service, and it needs to add Mapster.DependencyInjection package to the project
//var config = TypeAdapterConfig.GlobalSettings;
//config.Scan(typeof(Program).Assembly); 

//builder.Services.AddSingleton(config);
//builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddControllers(options =>
{
    options.ReturnHttpNotAcceptable = true;
}
).AddNewtonsoftJson();

builder.Services.AddDbContext<FarmDbContext>(option =>
{
    option.UseSqlServer(
        builder.Configuration["ConnectionStrings:FarmDbConnectionString"],
        sqlOptions =>
        {
            sqlOptions.CommandTimeout(60);
        }
    );
});

//JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Authentication:issure"],
            ValidAudience = builder.Configuration["Authentication:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Authentication:SecretKey"]))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/sensorHub"))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddApiVersioning(option =>
{
    option.DefaultApiVersion = new Asp.Versioning.ApiVersion(1, 0);
    option.AssumeDefaultVersionWhenUnspecified = true;
    option.ReportApiVersions = true;
}).AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

builder.Services.AddHttpClient<SoilService>(client =>
{
    client.DefaultRequestHeaders.Add("User-Agent", "FarmApp/1.0");
    client.Timeout = TimeSpan.FromSeconds(15);
});

//services
builder.Services.AddScoped<UserValidationService>();
builder.Services.AddTransient<DistanceFarmService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddHttpClient<WeatherService>();

//SignalR
builder.Services.AddSignalR(options =>
{
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);

    options.KeepAliveInterval = TimeSpan.FromSeconds(15);

    options.HandshakeTimeout = TimeSpan.FromSeconds(30);
});

//entities
builder.Services.AddScoped<ISensor, SensorRepository>();
builder.Services.AddScoped<IUser, UserRepository>();
builder.Services.AddScoped<IFarm, FarmRepository>();
builder.Services.AddScoped<IField, FieldRepository>();
builder.Services.AddScoped<ICrop, CropRepository>();
builder.Services.AddScoped<ITask, TaskRepository>();

builder.Services.AddCors(options =>
    options.AddPolicy("Course23Policy", builder =>
        builder.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        )
    );

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOperations", policy =>
        policy.RequireRole("Admin"));
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseCors("Course23Policy");

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

using (var scoup = app.Services.CreateScope())
{
    var context = scoup.ServiceProvider.GetRequiredService<FarmDbContext>();

    await FarmDbContext.CreateInitialDbData(context);
}

//SignalR
app.MapHub<SensorHub>("/sensorHub");

app.Run();
