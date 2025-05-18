﻿using System;

namespace DigitalLibary.WebApi.Payload
{
    public class DocumentTypeModel
    {
        public Guid Id { get; set; }
        public string DocTypeName { get; set; }
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
        public long? Status { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int? ReleaseTerm { get; set; }
        public string? Language { get; set; }
        public string? PlaceOfProduction { get; set; }
        public string? PaperSize { get; set; }
        public string? NumberOfCopies { get; set; }
    }
}
