using Farm.Infrastructure.Rebositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Farm.API.Controllers
{
    [Route("api/v{version:apiversion}/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITask taskRepository;

        public TaskController(ITask taskRepository)
        {
            this.taskRepository = taskRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks(CancellationToken cancellationToken = default)
        {
            return Ok(await taskRepository.GetAllAsync());
        }

        [HttpPut("{id}/toggle-completion")]
        public async Task<IActionResult> ToggleCompletion(Guid id, [FromBody] bool isCompleted)
        {
            var task = await taskRepository.GetByIdAsync(id);
            if (task == null) return NotFound();
            task.IsCompleted = isCompleted;
            await taskRepository.SaveChangesAsync();
            return Ok(task);
        }

    }
}
