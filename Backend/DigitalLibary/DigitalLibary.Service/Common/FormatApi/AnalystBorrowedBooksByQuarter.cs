using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class AnalystBorrowedBooksByQuarter
    {
        public Guid IdUnit { get; set; }
        public string UnitName { get; set; }
        public int NumberUserOfUnit { get; set; }
        public List<BorrowedBooksByQuarter>? BorrowedBooksByQuarters { get; set; }
    }

    public class BorrowedBooksByQuarter
    {
        public int NumberStudentUserOfUnitBorrowedBook { get; set; }
        public int NumberBorrowedBookByStudent { get; set; }
        public int NumberBorrowedBookByTeacher { get; set; }
        public int? TotalQuarter { get; set; }
    }
}