using System;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class CustomApiReceiptExportBooks
    {
        public Guid? IdDocument { get; set; }
        public Guid? IdDocumentType { get; set; }
        public string? DocumentName { get; set; }
        public string? NumIndividual { get; set; }
        public Guid? IdIndividual { get; set; }
        public float Price { get; set; }
        public string? Publisher { get; set; }
        public string? Author { get; set; }
        public string? StatusIndividual { get; set; }
        public string? Note { get; set; }

    }
}



