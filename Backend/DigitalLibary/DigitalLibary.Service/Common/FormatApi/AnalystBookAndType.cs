﻿using System;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class AnalystBookAndType
    {
        public int TotalDocument { get; set; }
        public int RemainDocument { get; set; }
        public int BorrowedDocument { get; set; }
        public int LostDocument { get; set; }
        public Guid ID { get; set; }
        public string? DocName { get; set; }
        public Guid DocumentTypeId { get; set; }
        public string? OriginalFileName { get; set; }
        public string? FileName { get; set; }
        public string? FileNameExtention { get; set; }
        public string? FilePath { get; set; }
        public string? Language { get; set; }
        public string? Publisher { get; set; }
        public DateTime? PublishYear { get; set; }
        public long? NumberView { get; set; }
        public long? NumberLike { get; set; }
        public long? NumberUnlike { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public Guid? ModifiedBy { get; set; }
        public bool? IsApproved { get; set; }
        public Guid? ApprovedBy { get; set; }
        public bool? IsHavePhysicalVersion { get; set; }
        public string? Author { get; set; }
        public int? Status { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool IsDeleted { get; set; }
        public string Description { get; set; }
        public long? Price { get; set; }
        public Guid? IdCategorySign_V1 { get; set; }
        public int? Sort { get; set; }
        public string? EncryptDocumentName { get; set; }
        public string? NameDocmentType { get; set; }
    }
}
