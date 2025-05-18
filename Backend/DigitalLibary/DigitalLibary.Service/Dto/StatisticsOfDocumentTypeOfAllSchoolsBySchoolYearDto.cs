using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto
    {
        public StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto() { }
        public string? DoctypeName { get; set; }
        public int? TotalBooks { get; set; }
    }
}
