using System;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Payload
{
    public class GetExceLAnalystMagazinePayLoad
    {
        public string? SchoolYearOrFinancialYear { get; set; }
        public string? MonthOrYear { get; set; }
        public DateTime? StartYear { get; set; }
        public DateTime? EndYear { get; set; }
        public List<Guid>? ListIdDocumentType { get; set; }
    }
}
