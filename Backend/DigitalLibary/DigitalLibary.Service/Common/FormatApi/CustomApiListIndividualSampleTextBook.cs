using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class CustomApiListIndividualSampleTextBook
    {
        public Guid IdIndividual { get; set; }
        public Guid IdDocument { get; set; }
        public string DocumentName { get; set; }
        public string NumIndividual { get; set; }
        public string ReceiptNumber { get; set; }
        public int PublishYear { get; set; }
        public DateTime? DateIn { get; set; }
        public long? Price { get; set; }
        public int TotalRecord { get; set; }
        public List<CustomAuditBookList> TextBookListStatus { get; set; }
    }

    public class CustomAuditBookList
    {
        public int Year { get; set; }
        public int? WasLost { get; set; }
        public bool IsLostedPhysicalVersion { get; set; }
    }
}

