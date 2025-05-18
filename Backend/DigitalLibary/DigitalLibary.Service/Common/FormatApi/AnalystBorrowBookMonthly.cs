using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class AnalystBorrowBookMonthly
    {
        public Guid Id { get; set; }
        public string? Fullname { get; set; }
        public Guid UnitId { get; set; }
        public Guid UserTypeId { get; set; }
        public List<NameMonthAndNumberBorrowedModel>? NameMonthAndNumberBorrowedModels { get; set; }
    }

    public class NameMonthAndNumberBorrowedModel
    {
        public int NameMonth { get; set; }
        public int NumberOfBorrowedBooks { get; set; }
    }
}