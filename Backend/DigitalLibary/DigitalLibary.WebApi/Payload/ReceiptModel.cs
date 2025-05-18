﻿using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Payload
{
    public class ReceiptModel
    {
        public Guid IdReceipt { get; set; }
        public Guid ReceiverIdUser { get; set; }
        public string? ReceiverName { get; set; }
        public string? ReceiverPosition { get; set; }
        public string? ReceiverUnitRepresent { get; set; }
        public string? DeliverName { get; set; }
        public string? DeliverPosition { get; set; }
        public string? DeliverUnitRepresent { get; set; }
        public string? ReceiptCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ImportDate { get; set; } // bổ sung 
        public DateTime? ExportDate { get; set; } // bổ sung 
        public DateTime? RecordBookDate { get; set; } // bổ sung 
        public int? Status { get; set; }
        public bool IsDeleted { get; set; }
        public string? Original { get; set; }
        public string? BookStatus { get; set; }
        public string? Reason { get; set; }
        public string? ReceiptNumber { get; set; }
        public int ReceiptType { get; set; }

        //extends
        public List<ReceiptDetail> ReceiptDetail { get; set; }
        public List<DocumentListId> DocumentListId { get; set; }
        public List<Participants> participants { get; set; }
        public int total { get; set; }
        public string? GeneralEntryNumber { get; set; }
    }
}
