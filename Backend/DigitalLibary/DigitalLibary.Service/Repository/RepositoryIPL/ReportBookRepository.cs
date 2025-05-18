using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class ReportBookRepository:IReportBookRepository
    {
       
        #region Variables
        private readonly IMapper _mapper;
        public DataContext _DbContext;
        #endregion

        #region Constructors
        public ReportBookRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper; 
        }
        #endregion
        public List<StatisticsOfBookConditionBySchoolYearDto> GetStatisticsOfBookConditionBySchoolYear(Guid idSchoolYear)
        {
           
            if (idSchoolYear != new Guid("00000000-0000-0000-0000-000000000000"))
            {
                
                DateTime? fromYear = new DateTime(DateTime.Now.Year, 8, 1);
                DateTime? toYear = new DateTime(DateTime.Now.Year + 1, 7, 31);
                DateTime? preFromYear = new DateTime(DateTime.Now.Year -1, 8, 1);
                DateTime? preToYear = new DateTime(DateTime.Now.Year, 7, 31);

                var schoolYear = _DbContext.SchoolYear
                                .Where(sy => sy.Id == idSchoolYear)
                                .Select(sy => new { sy.FromYear, sy.ToYear })
                                .FirstOrDefault();

                if (schoolYear != null)
                {
                    fromYear = schoolYear.FromYear;
                    toYear = schoolYear.ToYear;
                    preFromYear=new DateTime(schoolYear.FromYear.Value.Year - 1, 8, 1);
                    preToYear=new DateTime(schoolYear.FromYear.Value.Year, 7, 31);
                }
                

                var XuatSachNamNgoai = _DbContext.SchoolReceiptDetail.Where(srd => srd.ReceiptType == 1 && srd.CreateDate >= preFromYear.Value && srd.CreateDate <=preToYear.Value).Count();
                var XuatSachNamNay = _DbContext.SchoolReceiptDetail.Where(srd => srd.ReceiptType == 1 && srd.CreateDate >= fromYear.Value && srd.CreateDate <=toYear.Value).Count();
                
                // Truy vấn cơ sở dữ liệu để tính toán
                var query = _DbContext.SchoolDocumentIndividual.AsQueryable();
                //Dau Nam = tất cả mã cá biệt của năm đó trở về trước - sách trong phiếu xuất năm ngoái
                var totalBookStartYear = 0;
                if (fromYear.HasValue)
                {
                    query = query.Where(s => s.CreatedDate < fromYear.Value);
                    totalBookStartYear = query.Count() - XuatSachNamNgoai;
                }

                //Cuối năm : tổng tat ca trong nam hoc nay - xuất sách trong năm đó
                query =_DbContext.SchoolDocumentIndividual.AsQueryable();
                if (toYear.HasValue)
                {
                    query = query.Where(s => s.CreatedDate <= toYear.Value);
                }

                var totalBookEndYear = query.Count() - XuatSachNamNay;


                // tổng sách mất
                var query2 = _DbContext.SchoolAuditDetail.AsQueryable();

                if (fromYear.HasValue && toYear.HasValue)
                {
                    query2 = query2.Where(s => s.CreatedDate >= fromYear.Value && s.CreatedDate <= toYear.Value);
                }
                var totalBooksLost = 0;
                totalBooksLost =  query2.Where(x => x.WasLost == true || x.IsLostedPhysicalVersion ==true).Count();


                //Kiểm kê trong năm học đó thôi
                var result = new List<StatisticsOfBookConditionBySchoolYearDto>();
                result = _DbContext.SchoolAuditDetail
                        .Where(sad => sad.CreatedDate >= fromYear.Value && sad.CreatedDate <= toYear.Value) // Thêm điều kiện từ năm đến năm
                        .GroupBy(sad => sad.StatusName)
                        .Select(g => new StatisticsOfBookConditionBySchoolYearDto
                        {
                            StatusName = g.Key,
                            TotalBooks = g.Count(), // Đếm tổng số sách cho mỗi trạng thái

                            // Tính TotalBookStartYear cho toàn bộ bảng
                            TotalBooksStartYear = totalBookStartYear,

                            // Tính TotalBookEndYear cho toàn bộ bảng
                            TotalBooksEndYear = totalBookEndYear,
                            TotalBooksLost = totalBooksLost
                            
                        })
                        .ToList();

                // Tạo đối tượng mới để thêm vào result
                var additionalRow = new StatisticsOfBookConditionBySchoolYearDto
                {
                    StatusName = "Xuất sách",  // Giá trị StatusName tùy ý
                    TotalBooks = XuatSachNamNay,             // Các giá trị khác tùy theo yêu cầu
                    TotalBooksStartYear = totalBookStartYear,
                    TotalBooksEndYear = totalBookEndYear,
                    TotalBooksLost = totalBooksLost
                };
                result.Add(additionalRow);
                return result;

            }
            else
            {

                var firstSchoolYear = _DbContext.SchoolYear
                       .OrderBy(sy => sy.CreatedDate)  
                       .FirstOrDefault();

                var lastSchoolYear = _DbContext.SchoolYear
                                        .OrderByDescending(sy => sy.CreatedDate) 
                                        .FirstOrDefault();

                var XuatSachNamNgoai = _DbContext.SchoolReceiptDetail.Where(srd => srd.ReceiptType == 1 && srd.CreateDate >= firstSchoolYear.FromYear.Value && srd.CreateDate <lastSchoolYear.FromYear.Value).Count();
                var XuatSachNamNay = _DbContext.SchoolReceiptDetail.Where(srd => srd.ReceiptType == 1 && srd.CreateDate >= firstSchoolYear.FromYear.Value && srd.CreateDate <=lastSchoolYear.ToYear.Value).Count();

                // Truy vấn cơ sở dữ liệu để tính toán
                var query = _DbContext.SchoolDocumentIndividual.AsQueryable();
                //Dau Nam = tất cả mã cá biệt của năm đó trở về trước - sách trong phiếu xuất năm ngoái
                var totalBookStartYear = 0;
                if (lastSchoolYear.FromYear.HasValue)
                {
                    query = query.Where(s => s.CreatedDate < lastSchoolYear.FromYear.Value);
                    totalBookStartYear = query.Count() - XuatSachNamNgoai;
                }

                //Cuối năm : tổng tat ca trong nam hoc nay - xuất sách trong năm đó
                query =_DbContext.SchoolDocumentIndividual.AsQueryable();
                if (lastSchoolYear.ToYear.HasValue)
                {
                    query = query.Where(s => s.CreatedDate <= lastSchoolYear.ToYear.Value);
                }

                var totalBookEndYear = query.Count() - XuatSachNamNay;


                // tổng sách mất
                var query2 = _DbContext.SchoolAuditDetail.AsQueryable();

                if (firstSchoolYear.FromYear.HasValue && lastSchoolYear.ToYear.HasValue)
                {
                    query2 = query2.Where(s => s.CreatedDate >= firstSchoolYear.FromYear.Value && s.CreatedDate <= lastSchoolYear.ToYear.Value);
                }
                var totalBooksLost = 0;
                totalBooksLost =  query2.Where(x => x.WasLost == true || x.IsLostedPhysicalVersion ==true).Count();


                //Kiểm kê trong năm học đó thôi
                var result = new List<StatisticsOfBookConditionBySchoolYearDto>();
                result = _DbContext.SchoolAuditDetail
                        .Where(sad => sad.CreatedDate >= firstSchoolYear.FromYear.Value && sad.CreatedDate <= lastSchoolYear.ToYear.Value) // Thêm điều kiện từ năm đến năm
                        .GroupBy(sad => sad.StatusName)
                        .Select(g => new StatisticsOfBookConditionBySchoolYearDto
                        {
                            StatusName = g.Key,
                            TotalBooks = g.Count(), // Đếm tổng số sách cho mỗi trạng thái

                            // Tính TotalBookStartYear cho toàn bộ bảng
                            TotalBooksStartYear = totalBookStartYear,

                            // Tính TotalBookEndYear cho toàn bộ bảng
                            TotalBooksEndYear = totalBookEndYear,
                            TotalBooksLost = totalBooksLost

                        })
                        .ToList();

                // Tạo đối tượng mới để thêm vào result
                var additionalRow = new StatisticsOfBookConditionBySchoolYearDto
                {
                    StatusName = "Xuất sách",  // Giá trị StatusName tùy ý
                    TotalBooks = XuatSachNamNay,             // Các giá trị khác tùy theo yêu cầu
                    TotalBooksStartYear = totalBookStartYear,
                    TotalBooksEndYear = totalBookEndYear,
                    TotalBooksLost = totalBooksLost
                };
                result.Add(additionalRow);
                return result;
            }
        }


        public List<StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto> GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear(Guid idSchoolYear)
        {
            var result = new List<StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto>();
            if (idSchoolYear == new Guid("00000000-0000-0000-0000-000000000000")) {
                result = _DbContext.SchoolDocumentIndividual
                .GroupBy(sdi => sdi.DocTypeName)
                .Select(g => new StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto
                {
                    DoctypeName = g.Key,
                    TotalBooks = g.Count()
                })
                .ToList();
            }
            else
            {
                DateTime? fromYear = new DateTime();
                DateTime? toYear = new DateTime();
                var schoolYear = _DbContext.SchoolYear
                                .Where(sy => sy.Id == idSchoolYear)
                                .Select(sy => new { sy.FromYear, sy.ToYear })
                                .FirstOrDefault();
                if (schoolYear != null)
                {
                    fromYear = schoolYear.FromYear;
                    toYear = schoolYear.ToYear;
                }
                result = _DbContext.SchoolDocumentIndividual
                .Where(sdi => sdi.CreatedDate >= fromYear && sdi.CreatedDate <= toYear)
                .GroupBy(sdi => sdi.DocTypeName)
                .Select(g => new StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto
                {
                    DoctypeName = g.Key,
                    TotalBooks = g.Count()
                })
                .ToList();
            }
            return result;

        }
        public List<StatisticsOfPaperBooksAndDigitalBooksDto> GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(Guid idSchoolYear)
        {
            try
            {
                List<StatisticsOfPaperBooksAndDigitalBooksDto> result = new List<StatisticsOfPaperBooksAndDigitalBooksDto>();
                if (idSchoolYear == new Guid("00000000-0000-0000-0000-000000000000"))
                {
                    result = (from s in _DbContext.School
                            join sd in _DbContext.SchoolDocuments on s.Id equals sd.SchoolId
                            join sdi in _DbContext.SchoolDocumentIndividual on sd.Id equals sdi.DocumentId
                            group new { s.Name, sd.DoctypeStatus } by s.Name into g
                            select new StatisticsOfPaperBooksAndDigitalBooksDto
                            {
                                SchoolName = g.Key,
                                PaperBooksCount = g.Sum(x => x.DoctypeStatus == 1 ? 1 : 0),
                                DigitalBooksCount = g.Sum(x => x.DoctypeStatus == 2 ? 1 : 0)
                            }).ToList();
                
                }
                else
                {
                    DateTime? fromYear = new DateTime();
                    DateTime? toYear = new DateTime();
                    var schoolYear = _DbContext.SchoolYear.Where(x => x.IsActived == true)
                                    .Where(sy => sy.Id == idSchoolYear)
                                    .Select(sy => new { sy.FromYear, sy.ToYear })
                                    .FirstOrDefault();
                    if (schoolYear != null)
                    {
                        fromYear = schoolYear.FromYear;
                        toYear = schoolYear.ToYear;
                    }
                     result = (from s in _DbContext.School
                            join sd in _DbContext.SchoolDocuments on s.Id equals sd.SchoolId
                            join sdi in _DbContext.SchoolDocumentIndividual on sd.Id equals sdi.DocumentId
                            where sdi.CreatedDate >= fromYear && sdi.CreatedDate <= toYear
                               group new { s.Name, sd.DoctypeStatus } by s.Name into g
                            select new StatisticsOfPaperBooksAndDigitalBooksDto
                            {
                                SchoolName = g.Key,
                                PaperBooksCount = g.Sum(x => x.DoctypeStatus == 1 ? 1 : 0),
                                DigitalBooksCount = g.Sum(x => x.DoctypeStatus == 2 ? 1 : 0)
                            }).ToList();
                  
                }
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
    
}
