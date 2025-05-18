using System;
using Microsoft.EntityFrameworkCore;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class AnalystBorrowBookMonthlyModel
    {
        public Guid Id { get; set; }
        public string? Fullname { get; set; }
        public Guid UnitId { get; set; }
        public Guid UserTypeId { get; set; }
        public int Month { get; set; }
        public int BorrowedBook { get; set; }
    }
}