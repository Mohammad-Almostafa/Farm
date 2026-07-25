using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Farm.App.DTOs;
using Farm.API.Services;
using Farm.Domain.Enums;
using Mapster;
using Farm.Domain.Entities;
using Farm.Infrastructure.Rebositories.Interfaces;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]//Route with verioning
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IUser userRepository;
        private readonly UserValidationService userService;

        public AccountController(IConfiguration configuration, IUser userRepository, UserValidationService userService)
        {
            this.configuration = configuration;
            this.userRepository = userRepository;
            this.userService = userService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> CreateUser(RegisterUserDto dto, CancellationToken cancellationToken)
        {
            if (ModelState.IsValid) {
                         //src.Adapt<Dest>()
                var user = dto.Adapt<User>();
                var isExist = await userRepository.FindByUsernameOrEmailAsync(user.Email, user.UserName, cancellationToken);
                if (isExist == null)
                {
                    user.Role = UserRole.Viewer.ToString();
                    user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                    await userRepository.AddAsync(user, cancellationToken);
                    await userRepository.SaveChangesAsync(cancellationToken);
                    return Created();
                }
                else
                {
                    return BadRequest("Your Username or Email is exist");
                }
            }
            return BadRequest(ModelState);
        }

        // login endPoint with JWT 
        [HttpPost("login")]
        public async Task<ActionResult<string>> AutheticateAsync(LoginDto authReqwest, CancellationToken cancellationToken) {

            var user = await userService.ValidateUserCridentials(authReqwest, cancellationToken);
            if (user == null) { return Unauthorized("your Username or Password is incorrect pleas try agian!"); }
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // SignalR
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),   // UserId
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName),                    // UserName
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.NameId, user.Role.ToString()),             // Role
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // TokenId
                };

            var sekretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:SecretKey"]));

            var signingCred = new SigningCredentials(sekretKey, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                configuration["Authentication:issure"],
                configuration["Authentication:Audience"],
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddHours(10),
                signingCred
                );

            var serilaisedToken = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return Ok(new { token = serilaisedToken });
        }



        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(Guid userId, CancellationToken cancellationToken) 
        {
            if (ModelState.IsValid) 
            {
                var user = await userRepository.GetByIdAsync(userId, cancellationToken);
                
                return Ok(user);
            }
            return BadRequest(ModelState);
        }

        //Admin

        [HttpPost("loginAdmin")]
        public async Task<ActionResult<string>> AdminAutheticateAsync(LoginDto authReqwest, CancellationToken cancellationToken)
        {

            var user = await userService.ValidateAdminUserCridentials(authReqwest, cancellationToken);
            if (user == null) { return Unauthorized("your admin Username or Password is incorrect pleas try agian!"); }
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // SignalR
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),   // UserId
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName),                    // UserName
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.NameId, user.Role.ToString()),             // Role
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // TokenId
                };

            var sekretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:SecretKey"]));

            var signingCred = new SigningCredentials(sekretKey, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                configuration["Authentication:issure"],
                configuration["Authentication:Audience"],
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddHours(10),
                signingCred
                );

            var serilaisedToken = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return Ok(new { token = serilaisedToken });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken) 
        {
            if (ModelState.IsValid) 
            {                
                return Ok(await userRepository.GetAllAsync(cancellationToken));
            }
            return BadRequest(ModelState);
        }
        
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(Guid userId , UpdateUserDto userDto, CancellationToken cancellationToken) 
        {
            if (ModelState.IsValid) 
            {
                var user = await userRepository.GetByIdAsync(userId, cancellationToken);
                if (user == null) return NotFound();
                //src.Adapt(dest)
                userDto.Adapt(user);
                await userRepository.UpdateAsync(user, cancellationToken);
                await userRepository.SaveChangesAsync(cancellationToken);
                return NoContent();
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId, CancellationToken cancellationToken) 
        {
            if (ModelState.IsValid) 
            {
                var user = await userRepository.GetByIdAsync(userId, cancellationToken); if (user == null) return NotFound();
                await userRepository.DeleteAsync(user, cancellationToken);
                await userRepository.SaveChangesAsync(cancellationToken);
                return NoContent();
            }
            return BadRequest(ModelState);
        }
    }
}
