using Farm.Domain.Common;

namespace Farm.Domain.Entities
{
    public class ActionableTask : BaseEntity
    {
        public ActionableTask()
        {
            IsCompleted = false;
        }

        public string TaskType { get; set; }//Irrigation, fertilizing, Harvesting

        public string FarmName { get; set; }

        public string FieldName { get; set; }

        public string CropName { get; set; }

        public DateTime? TaskTime { get; set; }

        public bool IsCompleted { get; set; }

        public Field Field { get; set; }
        public Guid FieldId { get; set; }
    }
}
