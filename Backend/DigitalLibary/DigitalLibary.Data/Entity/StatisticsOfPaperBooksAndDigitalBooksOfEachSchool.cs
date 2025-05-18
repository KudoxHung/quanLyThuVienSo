using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    public class StatisticsOfPaperBooksAndDigitalBooksOfEachSchool
    {
        public StatisticsOfPaperBooksAndDigitalBooksOfEachSchool() { }
        public string SchoolName { get; set; }
        public int PaperBooksCount { get; set; }
        public int DigitalBooksCount { get; set; }
    }
}
