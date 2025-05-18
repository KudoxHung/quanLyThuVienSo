﻿using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;

namespace DigitalLibary.Service.Dto
{
    public class DocumentInvoiceDto
    {
        public Guid Id { get; set; }
        public string InvoiceCode { get; set; }
        public Guid UserId { get; set; }
        public DateTime DateOut { get; set; }
        public DateTime DateIn { get; set; }
        public DateTime? DateInReality { get; set; }
        public int? Status { get; set; }
        public Guid? CreateBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? Note { get; set; }
        public bool? IsCompleted { get; set; }
        public int? Total { get; set; }

        public List<DocumentAndIndividual> DocumentAndIndividual { get; set; }
        public List<DocumentAndIndividualView> DocumentAndIndividualView { get; set; }
        public List<DocumentInvoiceDetail> DocumentInvoiceDetail { get; set; }
    }
    public class DocumentAndIndividual
    {
        public Guid idDocument { get; set; }
        public List<Guid>? idIndividual { get; set; }
    }
    public class DocumentAndIndividualView
    {
        public Guid idDocument { get; set; }
        public Guid idIndividual { get; set; }
        public string? numIndividual { get; set; }
        public string? docName { get; set; }
        public int? status { get; set; }
        public bool? isLostedPhysicalVersion { get; set; }
    }
}
