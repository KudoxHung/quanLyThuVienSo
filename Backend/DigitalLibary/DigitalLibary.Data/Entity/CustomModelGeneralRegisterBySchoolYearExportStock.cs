using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{

    [Keyless]
    public class CustomModelGeneralRegisterBySchoolYearExportStock
    {
        public Guid IdReceipt { get; set; }
        public string? NameSchoolYear { get; set; }
        public DateTime? RecordBookDate { get; set; }
        public DateTime? ExportDate { get; set; }
        public long? TotalEnglishLanguageByReceipt { get; set; }
        public long? TotalFranceLanguageByReceipt { get; set; }
        public long? TotalOtherLanguageByReceipt { get; set; }
        public long? TotalBooksByReceipt { get; set; }
        public long? TotalNewspapersByReceipt { get; set; }
        public string? ReceiptNumber { get; set; }
        public long? TotalPriceByReceipt { get; set; }
        public long? TotalTextBooksByReceipt { get; set; }
        public long? TotalChildrenBooksByReceipt { get; set; }
        public long? TotalProfessionalBooksByReceipt { get; set; }
        public long? TotalReferenceBooksByReceipt { get; set; }
        public long? TotalOtherBooksByReceipt { get; set; }
        public long? TotalDamagedBooksByRecepit { get; set; }
        public long? TotalOutdatedBooksByRecepit { get; set; }
        public long? TotalOtherReasonsByRecepit { get; set; }
        public long? TotalLostBooksByRecepit { get; set; }
    }

}
