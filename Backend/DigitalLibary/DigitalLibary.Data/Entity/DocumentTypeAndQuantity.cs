using Microsoft.EntityFrameworkCore;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class DocumentTypeAndQuantity
    {
        public string? DocumentType { get; set; }
        public int? Quantity { get; set; }
        public int? QuantityLiquidated { get; set; }
    }
}