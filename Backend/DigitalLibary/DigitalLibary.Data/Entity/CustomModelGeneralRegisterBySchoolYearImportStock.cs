using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    
    [Keyless]
    public class CustomModelGeneralRegisterBySchoolYearImportStock
    {
        public Guid IdReceipt { get; set; }
        public string? NameSchoolYear { get; set; }
        public DateTime? RecordBookDate { get; set; }
        public long? TotalEnglishLanguage { get; set; }
        public long? TotalFranceLanguage{ get; set; }
        public long? TotalOtherLanguage { get; set; }
        public long? TotalEnglishLanguageByReceipt { get; set; }
        public long? TotalFranceLanguageByReceipt { get; set; }
        public long? TotalOtherLanguageByReceipt { get; set; }
        public long? TotalPrice { get; set; }
        public long? TotalBooks {  get; set; }
        public long? TotalNewspapers { get; set; }
        public long? TotalNewspapersByReceipt { get; set; }
        public long? TotalTextBooks { get; set; }
        public long? TotalProfessionalBooks {get;set; }
        public long? TotalReferenceBooks { get; set; }
        public long? TotalChildrenBooks { get; set; }
        public long? TotalOtherBooks { get;  set; }
        public string? ReceiptNumber { get; set; }
        public string? Original { get; set; }
        public long? TotalBooksByReceipt { get; set; }
        public long? TotalPriceByReceipt { get; set; }  
        public long? TotalTextBooksByReceipt { get; set; }
        public long? TotalChildrenBooksByReceipt { get; set; }
        public long? TotalProfessionalBooksByReceipt { get; set; }
        public long? TotalReferenceBooksByReceipt { get; set; }
        public long? TotalOtherBooksByReceipt { get; set; }
    }
    
}
