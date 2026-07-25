using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Farm.App.DTOs
{
    public class SoilDataDto
    {
        // معلومات الموقع لتوثيق البيانات
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // 1. درجة حموضة التربة (pH) - مهمة جداً لاختيار نوع السماد
        // SoilGrids ترجعها عادة phh2o
        public decimal PhValue { get; set; }

        // 2. نسبة الطين (Clay) - تحدد مدى احتفاظ التربة بالمياه
        public decimal ClayPercentage { get; set; }

        // 3. نسبة الرمل (Sand) - تحدد سرعة تصريف المياه
        public decimal SandPercentage { get; set; }

        // 4. نسبة الغرين (Silt) - مادة وسيطة بين الرمل والطين
        public decimal SiltPercentage { get; set; }

        // 5. المادة العضوية (Organic Matter) - تدل على خصوبة التربة
        public decimal OrganicMatter { get; set; }

        // نصيحة وصفية بناءً على البيانات (يتم توليدها في الباك-إند)
        public string SoilType { get; set; } // مثال: "Sandy", "Clayey", "Loamy"
        public string Recommendation { get; set; } // نصيحة سريعة للمزارع
    }
}
