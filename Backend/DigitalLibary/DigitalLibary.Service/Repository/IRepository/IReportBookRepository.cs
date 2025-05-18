using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IReportBookRepository
    {
        public List<StatisticsOfPaperBooksAndDigitalBooksDto> GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(Guid idSchoolYear);
        public List<StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto> GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear(Guid idSchoolYear);
        public List<StatisticsOfBookConditionBySchoolYearDto> GetStatisticsOfBookConditionBySchoolYear(Guid idSchoolYear);
    }
}
