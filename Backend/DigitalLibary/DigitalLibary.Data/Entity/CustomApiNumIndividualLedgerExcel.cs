using Microsoft.EntityFrameworkCore;
using System;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class CustomApiNumIndividualLedgerExcel
    {
        public Guid IdIndividual { get; set; }
        public Guid DocumentTypeId { get; set; }
        public Guid DocumentId { get; set; }
        public string NameIndividual { get; set; }
        public string DocumentName { get; set; }
        public string Author { get; set; }
        public DateTime? DateIn { get; set; }
        public string? Publisher { get; set; }
        public string? DocumentStock { get; set; }
        public int? OrdinalNumber { get; set; }
        public string? PublishPlace { get; set; }
        public DateTime? PublishYear { get; set; }
        public long? Price { get; set; }
        public string? ReadingLevel { get; set; }
        public string? SignName { get; set; }
        public string? SignCode { get; set; }
        public string? ColorName { get; set; }
        public string? GeneralEntryNumber { get; set; }
        // AuditReceipt - AuditBookList
        public bool? WasLost { get; set; } // Trạng thái mất của mã cá biệt - cái này nằm ở Kiểm kê
        public bool? IsLiquidation { get; set; } // Trạng thái thanh lý của mã cá biệt - cái này nằm ở Kiểm kê
        public DateTime? ReportToDate { get; set; } // Kiểm kê đến ngày bao nhiêu - cái này nằm ở Danh sách kiểm kê
        // IndividualSample
        public bool? IsDeleteIndividual { get; set; } // Trạng thái xoá của mã cá biệt - cái này nằm ở Mã cá biệt
        // Receipt
        public DateTime? ExportDate { get; set; } // Ngày xuất - cái này nằm ở Phiếu xuất
        public string? ReceiptNumber { get; set; } // Số biên bản xuất - cái này nằm ở Phiếu xuất
        public bool IsBuy { get; set; } // Trạng thái mua của mã cá biệt - cái này nằm ở Phiếu nhập
    }
}