using System;

namespace DigitalLibary.WebApi.Payload
{
    public class AnalystBorrowBookMonthlyPayload
    {
        public Guid IdUnit { get; set; }
        public Guid IdUserType { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
}