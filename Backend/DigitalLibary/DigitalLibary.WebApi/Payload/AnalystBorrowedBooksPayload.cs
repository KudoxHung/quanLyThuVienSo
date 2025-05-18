using System;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Payload
{
    public class AnalystBorrowedBooksPayload
    {
        public int Quarter { get; set; }
        public int Year { get; set; }
        public List<Guid> IdsUnit { get; set; }
        public Guid UserType { get; set; }
    }
}