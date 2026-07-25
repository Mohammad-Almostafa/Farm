using Farm.Domain.Common;
using Farm.Domain.Entities;
using Farm.Infrastructure.Persistence;
using Farm.Infrastructure.Rebositories.Interfaces;
using Farm.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Farm.Infrastructure.Rebositories
{
    public class TaskRepository : GenericRepository<ActionableTask>, ITask
    {
        private readonly FarmDbContext context;

        public TaskRepository(FarmDbContext context) : base(context)
        {
            this.context = context;
        }

        
    }
}
