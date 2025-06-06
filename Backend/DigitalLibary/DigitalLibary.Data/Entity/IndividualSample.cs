﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DigitalLibary.Data.Entity
{
    [Table("IndividualSample")]
    public class IndividualSample
    {
        public Guid Id { get; set; }
        public Guid IdDocument { get; set; }
        public Guid? IdReceipt { get; set; }
        public string NumIndividual { get; set; }
        public string Barcode { get; set; }
        public Guid StockId { get; set; }
        public bool? IsLostedPhysicalVersion { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
        public int? CheckUpdateIsLostedPhysicalVersion { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? DocumentTypeId { get; set; }
        public DateTime? EntryDate { get; set; }
        public string? GeneralEntryNumber { get; set; }
        public long? Price { get; set; }
    }
}
