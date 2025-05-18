using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class CustomModelGeneralRegisterBySchoolYearDocumentStock
    {
        public string? NameSchoolYear { get; set; }
        public long? TotalEnglishLanguage { get; set; }
        public long? TotalFranceLanguage { get; set; }
        public long? TotalOtherLanguage { get; set; }
        public long? TotalBooks { get; set; }
        public long? TotalNewspapers { get; set; }
        public long? TotalPrice { get; set; }
        public long? TotalTextBooks { get; set; }
        public long? TotalChildrenBooks { get; set; }
        public long? TotalProfessionalBooks { get; set; }
        public long? TotalReferenceBooks { get; set; }
        public long? TotalOtherBooks { get; set; }

        // Phương thức khởi tạo với giá trị mặc định
        public CustomModelGeneralRegisterBySchoolYearDocumentStock()
        {
            NameSchoolYear = string.Empty; // Mặc định là chuỗi rỗng
            TotalEnglishLanguage = 0; // Mặc định là 0
            TotalFranceLanguage = 0; // Mặc định là 0
            TotalOtherLanguage = 0; // Mặc định là 0
            TotalBooks = 0; // Mặc định là 0
            TotalNewspapers = 0; // Mặc định là 0
            TotalPrice = 0; // Mặc định là 0
            TotalTextBooks = 0; // Mặc định là 0
            TotalChildrenBooks = 0; // Mặc định là 0
            TotalProfessionalBooks = 0; // Mặc định là 0
            TotalReferenceBooks = 0; // Mặc định là 0
            TotalOtherBooks = 0; // Mặc định là 0
        }
    }

}
