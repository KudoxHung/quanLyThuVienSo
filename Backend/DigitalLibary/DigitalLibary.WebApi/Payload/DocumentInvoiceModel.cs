using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;

namespace DigitalLibary.WebApi.Payload
{
    public class DocumentInvoiceModel
    {
        public Guid Id { get; set; }
        public string InvoiceCode { get; set; }
        public Guid UserId { get; set; }
        public string DateOut { get; set; }
        public string DateIn { get; set; }
        public DateTime? DateInReality { get; set; }
        public int? Status { get; set; }
        public Guid? CreateBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? Note { get; set; }
        public int? Total { get; set; }
        public List<DocumentAndIndividual> DocumentAndIndividual { get; set; }
        public List<DocumentAndIndividualView> DocumentAndIndividualView { get; set; }
        public List<DocumentInvoiceDetail> DocumentInvoiceDetail { get; set; }
    }
}
