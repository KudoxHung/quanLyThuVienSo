using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class StatisticsOfPaperBooksAndDigitalBooksDto
    {
        public StatisticsOfPaperBooksAndDigitalBooksDto() { }
        public string SchoolName { get; set; }
        public int PaperBooksCount { get; set; }
        public int DigitalBooksCount { get; set; }
    }
}
