using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class StatisticsOfBookConditionBySchoolYearDto
    {
        public StatisticsOfBookConditionBySchoolYearDto() { }
        public string? StatusName { get; set; }
        public int? TotalBooks { get; set; }
        public int? TotalBooksStartYear { get; set; }
        public int? TotalBooksEndYear { get; set; }
        public int? TotalBooksLost { get; set; }

    }
}
