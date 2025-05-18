using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using DigitalLibary.Service.Queries;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class AnalystRepository : IAnalystRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        #endregion

        #region Constructors

        public AnalystRepository(DataContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        #endregion

        #region Method


        public List<CustomModelGeneralRegisterBySchoolYearExportStock> GetFileExcelGeneralRegisterBySchoolYearExportStock(Guid IdSchoolYear)
        {
            // Truy vấn để lấy fromYear và toYear từ bảng SchoolYear dựa trên IdSchoolYear
            var schoolYear = _dbContext.SchoolYear
                .Where(s => s.Id == IdSchoolYear)
                .Select(s => new { s.FromYear, s.ToYear })
                .FirstOrDefault();


            // Kiểm tra nếu không tìm thấy SchoolYear
            if (schoolYear == null)
            {
                throw new Exception("SchoolYear not found");
            }
            // Chuyển đổi fromYear và toYear thành DateTime
            DateTime? FromDate = schoolYear.FromYear.HasValue
        ? DateTime.Parse(schoolYear.FromYear.Value.ToString("yyyy-MM-dd"), new CultureInfo("en-CA"))
        : (DateTime?)null;

            DateTime? ToDate = schoolYear.ToYear.HasValue
                ? DateTime.Parse(schoolYear.ToYear.Value.ToString("yyyy-MM-dd"), new CultureInfo("en-CA"))
                : (DateTime?)null;


            var DateLeft = new DateTime(FromDate.Value.Year, 8, 1);
            var DateRight = new DateTime(ToDate.Value.Year, 7, 31);
            var query = (from r in _dbContext.Receipt
                         join rd in _dbContext.ReceiptDetail on r.IdReceipt equals rd.IdReceipt
                         join d in _dbContext.Document on rd.IdDocument equals d.ID
                         join i in _dbContext.IndividualSample on d.ID equals i.IdDocument
                         join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                         where r.ReceiptType == 1 && r.CreatedDate >= DateLeft
                         && r.CreatedDate <= DateRight && rd.IdIndividualSample == i.Id && r.IsDeleted == false
                         group new { d, dt, r, rd, i } by new { r.IdReceipt, r.ReceiptNumber, r.RecordBookDate, r.ExportDate } into g
                         select new CustomModelGeneralRegisterBySchoolYearExportStock
                         {

                             IdReceipt = g.Key.IdReceipt,
                             NameSchoolYear = FromDate.Value.Year + "-" + ToDate.Value.Year,
                             RecordBookDate = g.Key.RecordBookDate,
                             ExportDate = g.Key.ExportDate,
                             TotalEnglishLanguageByReceipt = g.Count(x => x.d.Language != null && x.d.Language.ToLower() == "tiếng anh"),
                             TotalFranceLanguageByReceipt = g.Count(x => x.d.Language != null && x.d.Language.ToLower() == "tiếng pháp"),
                             TotalOtherLanguageByReceipt = g.Count(x => !new[]
                                 { "tiếng anh", "tiếng pháp"}
                                 .Contains(x.d.Language.ToLower())),
                             ReceiptNumber = g.Key.ReceiptNumber,
                             TotalBooksByReceipt = g.Count(x => x.dt.Status == 1),
                             TotalNewspapersByReceipt = g.Count(x => x.dt.Status == 2),
                             TotalPriceByReceipt = g.Sum(x => x.i.Price),
                             TotalTextBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách giáo khoa"),
                             TotalChildrenBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách thiếu nhi"),
                             TotalProfessionalBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách nghiệp vụ"),
                             TotalReferenceBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách tham khảo"),
                             TotalOtherBooksByReceipt = g.Count(x => !new[]
                               { "sách giáo khoa", "sách thiếu nhi", "sách nghiệp vụ", "sách tham khảo" }
                               .Contains(x.dt.DocTypeName.ToLower())),
                             TotalDamagedBooksByRecepit = g.Count(x => x.rd.StatusIndividual.Contains("nát")),
                             TotalOutdatedBooksByRecepit = g.Count(x => x.rd.StatusIndividual.Contains("hậu")),
                             TotalOtherReasonsByRecepit = g.Count(x => !x.rd.StatusIndividual.Contains("nát") && !x.rd.StatusIndividual.Contains("hậu")),
                             TotalLostBooksByRecepit = g.Count(x => x.i.IsLostedPhysicalVersion == true && x.i.IsDeleted == false)

                         });

            var ListExcelGeneralRegister = query
            .ToList()
           .OrderBy(x => long.Parse(x.ReceiptNumber.Substring(2)))
           .ToList();


            return ListExcelGeneralRegister;
        }
        public List<TotalBooksByYear> TotalBooks2(Guid IdSchoolYear)
        {
            try
            {
                var schoolYear = _dbContext.SchoolYear
                    .Where(s => s.Id == IdSchoolYear)
                    .Select(s => new { s.FromYear, s.ToYear })
                    .FirstOrDefault();

                if (schoolYear == null)
                {
                    throw new Exception("SchoolYear not found");
                }

                var conditionYear = new DateTime(schoolYear.FromYear.Value.Year, 7, 31);

                var tmp = from i in _dbContext.IndividualSample
                          join d in _dbContext.Document on i.IdDocument equals d.ID
                          join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                          where i.IsDeleted == false
                                && d.IsDeleted == false
                                && i.CreatedDate <= conditionYear
                                && (i.IsLostedPhysicalVersion == false || i.IsLostedPhysicalVersion == null)
                          select new
                          {
                              i.Id,
                              Price = i.Price ?? d.Price,
                              dt.DocTypeName,
                              dt.Status,
                              d.Language
                          };

                var tmp2 = from i in _dbContext.IndividualSample
                           join rd in _dbContext.ReceiptDetail on i.Id equals rd.IdIndividualSample
                           join r in _dbContext.Receipt on rd.IdReceipt equals r.IdReceipt
                           join d in _dbContext.Document on i.IdDocument equals d.ID
                           join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                           where r.ReceiptType == 1
                                 && r.Status == 1
                                 && d.IsDeleted == false
                                 && i.CreatedDate <= conditionYear
                           select new
                           {
                               i.Id,
                               Price = i.Price ?? d.Price,
                               dt.DocTypeName,
                               dt.Status,
                               d.Language
                           };

                var data = tmp.AsEnumerable().ToList();
                var data2 = tmp2.AsEnumerable().ToList();

                var result = new
                {
                    TotalEnglishLanguage = data.Count(x => x.Language != null &&
                        (x.Language.ToLower() == "tiếng anh" || x.Language.ToLower() == "english")) +
                        data2.Count(x => x.Language != null &&
                        (x.Language.ToLower() == "tiếng anh" || x.Language.ToLower() == "english")),

                    TotalFranceLanguage = data.Count(x => x.Language != null &&
                        (x.Language.ToLower() == "tiếng pháp" || x.Language.ToLower() == "french")) +
                        data2.Count(x => x.Language != null &&
                        (x.Language.ToLower() == "tiếng pháp" || x.Language.ToLower() == "french")),

                    TotalOtherLanguage = data.Count(x => !new[] { "tiếng anh", "tiếng pháp", "english", "french" }
                        .Contains(x.Language?.ToLower() ?? string.Empty)) +
                        data2.Count(x => !new[] { "tiếng anh", "tiếng pháp", "english", "french" }
                        .Contains(x.Language?.ToLower() ?? string.Empty)),

                    TotalBooks = data.Count(x => x.Status == 1) + data2.Count(x => x.Status == 1),

                    TotalNewspapers = data.Count(x => x.Status == 2) + data2.Count(x => x.Status == 2),

                    TotalPrice = data.Sum(x => x.Price ?? 0) + data2.Sum(x => x.Price ?? 0),

                    TotalChildrenBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách thiếu nhi") +
                        data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách thiếu nhi"),

                    TotalReferenceBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách tham khảo") +
                        data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách tham khảo"),

                    TotalProfessionalBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách nghiệp vụ") +
                        data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách nghiệp vụ"),

                    TotalTextBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách giáo khoa") +
                        data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách giáo khoa"),

                    TotalOtherBooks = data.Count(x => !new[] { "sách thiếu nhi", "sách tham khảo", "sách nghiệp vụ", "sách giáo khoa" }
                        .Contains(x.DocTypeName?.ToLower() ?? string.Empty)) +
                        data2.Count(x => !new[] { "sách thiếu nhi", "sách tham khảo", "sách nghiệp vụ", "sách giáo khoa" }
                        .Contains(x.DocTypeName?.ToLower() ?? string.Empty))
                };

                return new List<TotalBooksByYear>
                {
                    new TotalBooksByYear
                    {
                        TotalEnglishLanguage = result.TotalEnglishLanguage,
                        TotalFranceLanguage = result.TotalFranceLanguage,
                        TotalOtherLanguage = result.TotalOtherLanguage,
                        TotalBooks = result.TotalBooks,
                        TotalNewspapers = result.TotalNewspapers,
                        TotalPrice = result.TotalPrice,
                        TotalChildrenBooks = result.TotalChildrenBooks,
                        TotalReferenceBooks = result.TotalReferenceBooks,
                        TotalProfessionalBooks = result.TotalProfessionalBooks,
                        TotalTextBooks = result.TotalTextBooks,
                        TotalOtherBooks = result.TotalOtherBooks
                    }
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomModelGeneralRegisterBySchoolYearImportStock> GetFileExcelGeneralRegisterBySchoolYearImportStock(Guid IdSchoolYear)
        {
            // Truy vấn để lấy fromYear và toYear từ bảng SchoolYear dựa trên IdSchoolYear
            var schoolYear = _dbContext.SchoolYear
                .Where(s => s.Id == IdSchoolYear)
                .Select(s => new { s.FromYear, s.ToYear })
                .FirstOrDefault();


            // Kiểm tra nếu không tìm thấy SchoolYear
            if (schoolYear == null)
            {
                throw new Exception("SchoolYear not found");
            }
            if (schoolYear != null)
            {
                var conditionYear = new DateTime(schoolYear.FromYear.Value.Year, 7, 31);
                var tmp = from i in _dbContext.IndividualSample
                          join d in _dbContext.Document on i.IdDocument equals d.ID
                          join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                          where i.IsDeleted == false && d.IsDeleted == false && i.CreatedDate <= conditionYear
                          select new
                          {
                              i.Id,
                              Price = i.Price ?? d.Price,
                              dt.DocTypeName,
                              dt.Status,
                              d.Language
                          };
                var tmp2 = from i in _dbContext.IndividualSample
                           join rd in _dbContext.ReceiptDetail on i.Id equals rd.IdIndividualSample
                           join r in _dbContext.Receipt on rd.IdReceipt equals r.IdReceipt
                           join d in _dbContext.Document on i.IdDocument equals d.ID
                           join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                           where r.ReceiptType == 1 && r.Status == 1 && d.IsDeleted == false && i.CreatedDate <= conditionYear
                           select new
                           {
                               i.Id,
                               Price = i.Price ?? d.Price,
                               dt.DocTypeName,
                               dt.Status,
                               d.Language
                           };

                // Convert to a list to perform in-memory calculations
                var data = tmp.AsEnumerable().ToList();
                var data2 = tmp2.AsEnumerable().ToList();
                var result = new
                {
                    TotalEnglishLanguage = data.Count(x => x.Language != null && (x.Language.ToLower() == "tiếng anh" || x.Language.ToLower() == "english")) +
                     data2.Count(x => x.Language != null && (x.Language.ToLower() == "tiếng anh" || x.Language.ToLower() == "english")),

                    TotalFranceLanguage = data.Count(x => x.Language != null && (x.Language.ToLower() == "tiếng pháp" || x.Language.ToLower() == "french")) +
                    data.Count(x => x.Language != null && (x.Language.ToLower() == "tiếng pháp" || x.Language.ToLower() == "french")),

                    TotalOtherLanguage = data.Count(x => !new[] { "tiếng anh", "tiếng pháp", "english", "french" }
                     .Contains(x.Language?.ToLower() ?? string.Empty)) +
                      data2.Count(x => !new[] { "tiếng anh", "tiếng pháp", "english", "french" }
                     .Contains(x.Language?.ToLower() ?? string.Empty)),

                    TotalBooks = data.Count(x => x.Status == 1) + data2.Count(x => x.Status == 1),

                    TotalNewspapers = data.Count(x => x.Status == 2) + data2.Count(x => x.Status == 2),

                    TotalPrice = data.Sum(x => x.Price) + data2.Sum(x => x.Price),

                    TotalChildrenBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách thiếu nhi") +
                    data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách thiếu nhi"),

                    TotalReferenceBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách tham khảo") +
                    data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách tham khảo"),

                    TotalProfessionalBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách nghiệp vụ") +
                    data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách nghiệp vụ"),

                    TotalTextBooks = data.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách giáo khoa") +
                    data2.Count(x => x.DocTypeName != null && x.DocTypeName.ToLower() == "sách giáo khoa"),

                    TotalOtherBooks = data.Count(x => !new[]
                        { "sách thiếu nhi", "sách tham khảo", "sách nghiệp vụ", "sách giáo khoa" }
                        .Contains(x.DocTypeName.ToLower())) +
                         data2.Count(x => !new[]
                        { "sách thiếu nhi", "sách tham khảo", "sách nghiệp vụ", "sách giáo khoa" }
                        .Contains(x.DocTypeName.ToLower()))
                };
                var DateLeft = new DateTime(schoolYear.FromYear.Value.Year, 8, 1);
                var DateRight = new DateTime(schoolYear.ToYear.Value.Year, 7, 31);
                var query = (from r in _dbContext.Receipt
                             join rd in _dbContext.ReceiptDetail on r.IdReceipt equals rd.IdReceipt
                             join d in _dbContext.Document on rd.IdDocument equals d.ID
                             join i in _dbContext.IndividualSample on d.ID equals i.IdDocument
                             join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                             where r.ReceiptType == 0 && r.CreatedDate >= DateLeft
                             && r.CreatedDate <= DateRight && r.IdReceipt == i.IdReceipt && r.IsDeleted == false
                             group new { d, dt, r, i } by new { r.ReceiptNumber, r.IdReceipt, r.RecordBookDate, r.Original } into g
                             select new CustomModelGeneralRegisterBySchoolYearImportStock
                             {
                                 TotalEnglishLanguage = result.TotalEnglishLanguage,
                                 TotalFranceLanguage = result.TotalFranceLanguage,
                                 TotalOtherLanguage = result.TotalOtherLanguage,
                                 IdReceipt = g.Key.IdReceipt,
                                 NameSchoolYear = schoolYear.FromYear.Value.Year + "-" + schoolYear.ToYear.Value.Year,
                                 RecordBookDate = g.Key.RecordBookDate,
                                 Original = (g.Key.Original ?? ""),
                                 TotalBooks = result.TotalBooks,
                                 TotalNewspapers = result.TotalNewspapers,
                                 TotalPrice = result.TotalPrice,
                                 TotalChildrenBooks = result.TotalChildrenBooks,
                                 TotalReferenceBooks = result.TotalReferenceBooks,
                                 TotalProfessionalBooks = result.TotalProfessionalBooks,
                                 TotalTextBooks = result.TotalTextBooks,
                                 TotalOtherBooks = result.TotalOtherBooks,
                                 TotalEnglishLanguageByReceipt = g.Count(x => x.d.Language != null && (x.d.Language.ToLower() == "tiếng anh" || x.d.Language.ToLower() == "english")),
                                 TotalFranceLanguageByReceipt = g.Count(x => x.d.Language != null && (x.d.Language.ToLower() == "tiếng pháp" || x.d.Language.ToLower() == "french")),
                                 TotalOtherLanguageByReceipt = g.Count(x => !new[]
                                     { "tiếng anh", "tiếng pháp","english", "french"}
                                     .Contains(x.d.Language.ToLower())),
                                 ReceiptNumber = g.Key.ReceiptNumber,
                                 TotalBooksByReceipt = g.Count(x => x.dt.Status == 1),
                                 TotalNewspapersByReceipt = g.Count(x => x.dt.Status == 2),
                                 TotalPriceByReceipt = g.Sum(x => x.i.Price),
                                 TotalTextBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách giáo khoa"),
                                 TotalChildrenBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách thiếu nhi"),
                                 TotalProfessionalBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách nghiệp vụ"),
                                 TotalReferenceBooksByReceipt = g.Count(x => x.dt.DocTypeName != null && x.dt.DocTypeName.ToLower() == "sách tham khảo"),
                                 TotalOtherBooksByReceipt = g.Count(x => !new[]
                                     { "sách giáo khoa", "sách thiếu nhi", "sách nghiệp vụ", "sách tham khảo" }
                                     .Contains(x.dt.DocTypeName.ToLower()))
                             });

                //System.Diagnostics.Debug.WriteLine(query.ElementAt(0).ReceiptNumber.Trim().Substring(2));
                var ListExcelGeneralRegister = query
                .ToList()
               .OrderBy(x => long.Parse(x.ReceiptNumber.Substring(2)))
               .ToList();


                return ListExcelGeneralRegister;
            }
            return new List<CustomModelGeneralRegisterBySchoolYearImportStock>();
        }


        public List<CustomModelGeneralRegister> GetFileExcelGeneralRegister(string fromDate, string toDate)
        {
            var FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
            var ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

            var query = from d in _dbContext.Document
                        join indSamp in _dbContext.IndividualSample on d.ID equals indSamp.IdDocument into indSampGroup
                        from indSamp in indSampGroup.DefaultIfEmpty()
                        join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                        where d.CreatedDate >= FromDate && d.CreatedDate <= ToDate
                        group new { d, indSamp, dt } by new { d.ID, d.DocName, d.DocumentTypeId, dt.DocTypeName, d.CreatedDate, d.Language, d.Price } into g
                        orderby g.Key.DocumentTypeId // Sắp xếp theo DocumentTypeId
                        select new CustomModelGeneralRegister
                        {
                            ID = g.Key.ID,
                            DocName = g.Key.DocName,
                            DocumentTypeId = g.Key.DocumentTypeId,
                            DocTypeName = g.Key.DocTypeName,
                            CountIndividualSamples = g.Count(x => x.indSamp != null).ToString(),
                            CreatedDate = g.Key.CreatedDate,
                            Language = g.Key.Language,
                            Price = g.Key.Price
                        };

            var ListExcelGeneralRegister = query
                .AsEnumerable() // Chuyển sang LINQ to Objects
                .GroupBy(x => x.DocumentTypeId) // Nhóm lại theo DocumentTypeId
                .SelectMany(group => group.OrderBy(x => x.DocName)) // Sắp xếp theo DocName trong từng nhóm DocumentTypeId
                .ToList();

            return ListExcelGeneralRegister;
        }


        // Edit 30/12/2024
        public List<CustomModelGeneralRegister> GetFileExcelGeneralRegister_Ver2(string fromDate, string toDate)
        {
            var FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
            var ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

            List<CustomModelGeneralRegister> customModelGenerals = new List<CustomModelGeneralRegister>();

            var documents = _dbContext.Document.Where(e => e.CreatedDate >= FromDate && e.CreatedDate <= ToDate && !e.IsDeleted).ToList();


            foreach (var document in documents)
            {
                var documentType = _dbContext.DocumentType.FirstOrDefault(e => e.Id == document.DocumentTypeId && !e.IsDeleted && e.Status == 1);

                if (documentType == null)
                {
                    continue;
                }

                var individualSamples = _dbContext.IndividualSample.Where(i => i.IdDocument == document.ID && !i.IsDeleted).ToList();

                int soLuong = individualSamples.Count;

                long tongSoGiaTien = individualSamples.Sum(e => e.Price ?? 0);


                var customModelGeneralRegister = new CustomModelGeneralRegister
                {
                    ID = document.ID,
                    DocName = document.DocName,
                    DocumentTypeId = document.DocumentTypeId,
                    DocTypeName = documentType.DocTypeName,
                    CountIndividualSamples = soLuong.ToString(),
                    CreatedDate = document.CreatedDate,
                    Language = document.Language,
                    Price = tongSoGiaTien
                };

                customModelGenerals.Add(customModelGeneralRegister);

            }

            return customModelGenerals.OrderBy(e => e.DocTypeName).ToList();
        }

        public List<ListIndividualLiquidated> ListIndividualLiquidated(IndividualLiquidatedModel individualLiquidatedModel)
        {
            var lstIndividual = _dbContext.IndividualSample
                .Where(e => individualLiquidatedModel.IdsIndividual.Contains(e.Id))
                .ToList();

            var lstDocument = _dbContext.Document
                .Where(d => lstIndividual.Select(i => i.IdDocument).Distinct().Contains(d.ID))
                .ToList();

            var lstDocumentType = _dbContext.DocumentType
                .Where(dt => lstDocument.Select(d => d.DocumentTypeId).Distinct().Contains(dt.Id))
                .ToList();

            var datas = lstDocumentType.Select(dt => new ListIndividualLiquidated
            {
                DocumentTypeName = dt.DocTypeName,
                BookNameAndNumIndividuals = lstDocument
                        .Where(d => d.DocumentTypeId == dt.Id)
                        .Select(d => new BookNameAndNumIndividual
                        {
                            NameBook = d.DocName,
                            NumIndividual = lstIndividual
                                .Where(i => i.IdDocument == d.ID)
                                .Select(i => i.NumIndividual.Substring(0, i.NumIndividual.IndexOf('/')))
                                .ToList(),
                            Price = _dbContext.AuditBookList.FirstOrDefault(e =>
                                    e.IdDocument == d.ID &&
                                    e.IsLiquidation != null &&
                                    e.IdAuditReceipt == individualLiquidatedModel.IdAuditReceipt)
                                ?.Price,
                            Note = _dbContext.AuditBookList.FirstOrDefault(e =>
                                    e.IdDocument == d.ID &&
                                    e.IdAuditReceipt == individualLiquidatedModel.IdAuditReceipt)
                                ?.Note,
                        })
                        .ToList()
            })
                .ToList();

            return datas;
        }

        public List<CustomApiCountUserByUserType> CountUserByType()
        {
            try
            {
                var userType = _dbContext.UserType.Where(e => e.Id != Guid.Empty).ToList();

                return userType.Select((t, i) => new CustomApiCountUserByUserType
                {
                    UserType = t,
                    NumberUser = _dbContext.User.Count(e => e.UserTypeId == userType[i].Id && e.IsDeleted == false)
                }).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomApiCountDocumentByType> CountDocumentByType()
        {
            try
            {
                var documentType = _dbContext.DocumentType.Where(e => e.IsDeleted == false).ToList();

                return documentType.Select((t, i) => new CustomApiCountDocumentByType
                {
                    documentType = t,
                    count = _dbContext.Document.Count(e =>
                        e.DocumentTypeId == documentType[i].Id && e.IsDeleted == false)
                }).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiAnalystUserAndBook AnalystUserAndBook()
        {
            try
            {
                var customApiAnalystUserAndBook = new CustomApiAnalystUserAndBook();
                int month = DateTime.Now.Month;

                var totalUserAnalyst = new TotalserAnalyst();
                int totalUser = _dbContext.User.Count(e => e.IsDeleted == false);
                totalUserAnalyst.TotalUser = totalUser;
                customApiAnalystUserAndBook.totalser = totalUserAnalyst;

                // count list user by current month and last month
                int countUserCurrentMont = _dbContext.User.Count(e => e.CreatedDate.Value.Month == month
                                                                      && e.IsDeleted == false);
                int countUserLastMonth = _dbContext.User.Count(e => e.CreatedDate.Value.Month == month - 1
                                                                    && e.IsDeleted == false);

                if (countUserLastMonth == 0)
                {
                    countUserLastMonth = 1;
                }

                var result = countUserCurrentMont - countUserLastMonth / (double)(countUserLastMonth * 100);

                var userAnalyst = new UserAnalyst
                {
                    NumberUserCurrentMonth = countUserCurrentMont,
                    NumberUserLastMonth = countUserLastMonth,
                    CurrentMonth = month,
                    LastMonth = month - 1,
                    percentDifference = result
                };
                customApiAnalystUserAndBook.userAnalyst = userAnalyst;

                // count number book borrow current month and last month
                int numberBookBorrowCurrentMonth = _dbContext.DocumentInvoice.Count(e =>
                    e.CreateDate.Value.Month == month && e.Status == 0 || e.Status == 2);
                int numberBookBorrowLastMonth = _dbContext.DocumentInvoice.Count(e =>
                    e.CreateDate.Value.Month == month - 1 && e.Status == 0 || e.Status == 2);

                if (numberBookBorrowLastMonth == 0)
                {
                    numberBookBorrowLastMonth = 1;
                }

                result = numberBookBorrowCurrentMonth -
                         numberBookBorrowLastMonth / (double)(numberBookBorrowLastMonth * 100);

                var bookBorrowAnalyst = new BookBorrowAnalyst
                {
                    TotalBorrowBookCurrentMonth = numberBookBorrowCurrentMonth,
                    TotalBorrowBookLastMonth = numberBookBorrowLastMonth,
                    CurrentMonth = month,
                    LastMonth = month - 1,
                    percentDifference = result
                };
                customApiAnalystUserAndBook.bookBorrowAnalyst = bookBorrowAnalyst;

                // count number book back current month and last month
                int numberBookBackCurrentMonth =
                    _dbContext.DocumentInvoice.Count(e => e.CreateDate.Value.Month == month && e.Status == 1);
                int numberBookBackLastMonth =
                    _dbContext.DocumentInvoice.Count(e => e.CreateDate.Value.Month == month - 1 && e.Status == 1);

                if (numberBookBackLastMonth == 0)
                {
                    numberBookBackLastMonth = 1;
                }

                result = numberBookBackCurrentMonth - numberBookBackLastMonth / (double)(numberBookBackLastMonth * 100);

                var bookBackAnalyst = new BookBackAnalyst
                {
                    TotalBookBackCurrentMonth = numberBookBackCurrentMonth,
                    TotalBookBackLastMonth = numberBookBackLastMonth,
                    CurrentMonth = month,
                    LastMonth = month - 1,
                    percentDifference = result
                };
                customApiAnalystUserAndBook.bookBackAnalyst = bookBackAnalyst;

                return customApiAnalystUserAndBook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomApiBorrowByUserType> CustomApiBorrowByUserTypes(string status, string fromDate, string toDate)
        {
            try
            {
                var FromDate = new DateTime();
                var ToDate = new DateTime();

                var customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                var userTypes = _dbContext.UserType.Where(e => e.Id != Guid.Empty).ToList();

                for (int i = 0; i < userTypes.Count; i++)
                {
                    var users = _dbContext.User.Where(e => e.UserTypeId == userTypes[i].Id
                                                           && e.IsDeleted == false && e.IsActive == true &&
                                                           e.IsLocked == false).ToList();

                    int countUserBorrow = 0;
                    var customApiBorrowByUserType = new CustomApiBorrowByUserType();
                    for (int j = 0; j < users.Count; j++)
                    {
                        if (status == "NotLate")
                        {
                            // if empty todate and fromdate return full data
                            // if param exit return data by todate and fromdate
                            if (fromDate == null && toDate == null)
                            {
                                int count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id);
                                countUserBorrow += count;
                            }
                            else
                            {
                                FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                                ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                                int count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id
                                    && e.CreateDate >= FromDate && e.CreateDate <= ToDate);
                                countUserBorrow += count;
                            }
                        }
                        else
                        {
                            // if empty todate and fromdate return full data
                            // if param exit return data by todate and fromdate
                            if (fromDate == null && toDate == null)
                            {
                                int count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id
                                    && e.DateInReality > e.DateIn && e.Status == 2);
                                countUserBorrow += count;
                            }
                            else
                            {
                                FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                                ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                                int count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id
                                    && e.DateInReality > e.DateIn && e.Status == 2 && e.CreateDate >= FromDate
                                    && e.CreateDate <= ToDate);
                                countUserBorrow += count;
                            }
                        }
                    }

                    customApiBorrowByUserType.UserType = userTypes[i].TypeName;
                    customApiBorrowByUserType.NumberUserType = countUserBorrow;
                    customApiBorrowByUserTypes.Add(customApiBorrowByUserType);
                }

                int sum = 0;
                for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                {
                    sum += customApiBorrowByUserTypes[i].NumberUserType;
                }

                if (sum == 0)
                {
                    sum += 1;
                }

                foreach (var t in customApiBorrowByUserTypes)
                {
                    t.percent =
                        (t.NumberUserType / (double)sum) * 100;
                }

                return customApiBorrowByUserTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomApiAnalystBookByType> CustomApiAnalystBookByTypes(Guid IdDocumentType)
        {
            var result = _dbContext.GetDynamicResult("exec [dbo].[SP_AnalystBookByTypes] @IdDocumentType",
                new SqlParameter("@IdDocumentType", IdDocumentType));

            var listDataBook = result
                .Select(str1 => (AnalystBookAndType)JsonConvert
                    .DeserializeObject<AnalystBookAndType>(JsonConvert
                        .SerializeObject(str1))).ToList();
            //var individualSample = (from sample in _dbContext.IndividualSample
            //                        join doc in _dbContext.Document
            //                        on sample.IdDocument equals doc.ID
            //                        where sample.DocumentTypeId == IdDocumentType && sample.IsDeleted == false
            //                        select new
            //                        {
            //                            sample, // Dữ liệu từ bảng IndividualSample
            //                            doc     // Dữ liệu từ bảng Document
            //                        }).ToList();


            var data = listDataBook
                .Select(s => new CustomApiAnalystBookByType
                {
                    TotalDocument = s.TotalDocument,
                    RemainDocument = s.RemainDocument,
                    LostDocument = s.LostDocument,
                    BorrowedDocument = s.BorrowedDocument,
                    NameDocmentType = s.NameDocmentType,
                    document = new Document
                    {
                        ID = s.ID,
                        DocName = s.DocName,
                        CreatedDate = s.CreatedDate,
                        IsHavePhysicalVersion = s.IsHavePhysicalVersion,
                        Language = s.Language,
                        Publisher = s.Publisher,
                        PublishYear = s.PublishYear,
                        NumberLike = s.NumberLike,
                        NumberUnlike = s.NumberUnlike,
                        NumberView = s.NumberView,
                        ModifiedDate = s.ModifiedDate,
                        Author = s.Author,
                        Description = s.Description,
                        Price = s.Price,
                        //Price = individualSample.FirstOrDefault(p => p.IdDocument == s.ID)?.Price ?? 0,
                        DocumentTypeId = s.DocumentTypeId,
                        OriginalFileName = s.OriginalFileName,
                        FileName = s.FileName,
                        FileNameExtention = s.FileNameExtention,
                        FilePath = s.FilePath

                    },

                    individual = _dbContext.IndividualSample
                    .Join(_dbContext.Document,
                        sample => sample.IdDocument,
                        doc => doc.ID,
                        (sample, doc) => new { sample, doc })
                    .Where(joined => joined.doc.DocName == s.DocName && joined.sample.IdDocument == s.ID
                    && joined.sample.DocumentTypeId == IdDocumentType && !joined.sample.IsDeleted && joined.sample.Price != null
                    )
                    .Select(joined => joined.sample)
                    .ToList()

                }).ToList();

            return new List<CustomApiAnalystBookByType>(data);
        }

        public List<AnalystBookByGroupType> AnalystBookByGroupTypes(Guid idDocumentType)
        {
            var data = CustomApiAnalystBookByTypes(idDocumentType);

            var temp = data.GroupBy(e => e.document.DocumentTypeId)
                .Select(e => new AnalystBookByGroupType
                {
                    IdDocumentType = e.Key,
                    NameDocmentType = e.FirstOrDefault()?.NameDocmentType,
                    DataAnalystBooks = e.Select(x => new CustomApiAnalystBookByType
                    {
                        document = x.document,
                        individual = x.individual,
                        TotalDocument = x.TotalDocument,
                        RemainDocument = x.RemainDocument,
                        BorrowedDocument = x.BorrowedDocument,
                        LostDocument = x.LostDocument
                    }).ToList()
                }).ToList();
            return new List<AnalystBookByGroupType>(temp);
        }

        public List<ListBookNew> ListDocumentByIdStock(Guid idStock)
        {
            try
            {
                var lstBookView = new List<ListBookNew>();

                var documentStocks = _dbContext.DocumentStock.Where(e =>
                    e.Id == idStock && e.IsDeleted == false
                    || e.StockParentId == idStock && e.IsDeleted == false).ToList();

                var lstIdDocument = new HashSet<Guid?>();
                for (int i = 0; i < documentStocks.Count; i++)
                {
                    var individualSamples = _dbContext.IndividualSample.AsNoTracking().Where(e =>
                        e.StockId == documentStocks[i].Id && e.IsDeleted == false && e.IsLostedPhysicalVersion == false
                    ).ToList();
                    foreach (var t in individualSamples)
                    {
                        lstIdDocument.Add(t.IdDocument);
                    }
                }

                foreach (var unique in lstIdDocument)
                {
                    var document = _dbContext.Document.AsNoTracking()
                        .FirstOrDefault(e => e.ID == unique.Value && e.IsDeleted == false);

                    var documentAvatars = new List<DocumentAvatar>();
                    var documentType = new DocumentType();
                    if (document != null)
                    {
                        documentAvatars = _dbContext.DocumentAvatar.Where(e => e.IdDocument == document.ID).ToList();
                        documentType = _dbContext.DocumentType.AsNoTracking()
                            .FirstOrDefault(e => e.Id == document.DocumentTypeId);

                        var lstBook = new ListBookNew
                        {
                            Document = document,
                            listAvatar = documentAvatars,
                            IdCategory = documentType.Id,
                            NameCategory = documentType.DocTypeName
                        };

                        lstBookView.Add(lstBook);
                    }
                }

                return lstBookView;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public int CountDocumentByIdStock(Guid idStock)
        {
            try
            {
                int count = 0;

                var documentStocks = _dbContext.DocumentStock
                    .Where(e => e.Id == idStock || e.StockParentId == idStock).ToList();
                List<Guid?> lstIdDocument = new List<Guid?>();
                for (int i = 0; i < documentStocks.Count; i++)
                {
                    var individualSamples = _dbContext.IndividualSample.AsNoTracking().Where(e =>
                            e.StockId == documentStocks[i].Id && e.IsDeleted == false &&
                            e.IsLostedPhysicalVersion == false)
                        .ToList();

                    count += individualSamples.Count;
                }

                return count;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomApiBorrowByUserType> CustomApiBorrowByUserTypes(string fromDate, string toDate)
        {
            try
            {
                DateTime FromDate = new DateTime();
                DateTime ToDate = new DateTime();

                List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                List<UserType> userTypes = _dbContext.UserType.Where(e => e.Id != Guid.Empty).ToList();

                for (int i = 0; i < userTypes.Count; i++)
                {
                    List<User> users = _dbContext.User.Where(e => e.UserTypeId == userTypes[i].Id
                                                                  && e.IsDeleted == false && e.IsActive == true &&
                                                                  e.IsLocked == false).ToList();

                    int countUserBorrow = 0;
                    CustomApiBorrowByUserType customApiBorrowByUserType = new CustomApiBorrowByUserType();
                    for (int j = 0; j < users.Count; j++)
                    {
                        int count = 0;
                        if (fromDate == null && toDate == null)
                        {
                            count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id);
                        }
                        else
                        {
                            FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                            ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                            count = _dbContext.DocumentInvoice.Count(e => e.UserId == users[j].Id
                                                                          && e.CreateDate >= FromDate &&
                                                                          e.CreateDate <= ToDate);
                        }

                        countUserBorrow += count;
                    }

                    customApiBorrowByUserType.UserType = userTypes[i].TypeName;
                    customApiBorrowByUserType.NumberUserType = countUserBorrow;
                    customApiBorrowByUserTypes.Add(customApiBorrowByUserType);
                }

                int sum = 0;
                for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                {
                    sum += customApiBorrowByUserTypes[i].NumberUserType;
                }

                if (sum == 0)
                {
                    sum += 1;
                }

                for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                {
                    customApiBorrowByUserTypes[i].percent =
                        (customApiBorrowByUserTypes[i].NumberUserType / (double)sum) * 100;
                }

                return customApiBorrowByUserTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CustomApiListBorrowByUserType> CustomApiListBorrowByUserTypes(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            try
            {
                var customApiListBorrowByUserTypes = new List<CustomApiListBorrowByUserType>();
                var FromDate = new DateTime();
                var ToDate = new DateTime();

                var users = _dbContext.User.Where(e => e.IsDeleted == false && e.IsActive == true && e.IsLocked == false).ToList();

                if (idUnit != Guid.Empty)
                {
                    users = users.Where(e => e.UnitId == idUnit).ToList();
                }

                if (idUserType != Guid.Empty)
                {
                    users = users.Where(e => e.UserTypeId == idUserType).ToList();
                }

                for (int i = 0; i < users.Count; i++)
                {
                    var documentInvoices = new List<DocumentInvoice>();

                    if (fromDate != null && toDate != null)
                    {
                        FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                        ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                        documentInvoices = _dbContext.DocumentInvoice.Where(e =>
                                                                            e.UserId == users[i].Id &&
                                                                            //(e.Status == 1 || e.Status == 2 || e.Status == 4) &&
                                                                            e.DateIn.Date >= FromDate.Date &&
                                                                            e.DateIn.Date <= ToDate.Date).ToList();
                    }
                    else
                    {
                        documentInvoices = _dbContext.DocumentInvoice.Where(e =>
                                                                            //e.Status == 0 &&
                                                                            e.UserId == users[i].Id).ToList();
                    }



                    if (documentInvoices != null && documentInvoices.Count > 0)
                    {

                        foreach (var documentInvoice in documentInvoices)
                        {
                            var customApiListBorrowByUserType =
                            new CustomApiListBorrowByUserType
                            {
                                IdUser = users[i].Id,
                                NameUser = users[i].Fullname,
                                fromDate = documentInvoice.DateIn,
                                toDate = documentInvoice.DateOut,
                                UserCode = users[i].UserCode,
                                Email = users[i].Email,
                                Address = users[i].Address,
                                IdUnit = users[i].UnitId,
                                IdUserType = users[i].UserTypeId
                            };

                            customApiListBorrowByUserTypes.Add(customApiListBorrowByUserType);
                        }
                    }
                }

                return customApiListBorrowByUserTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiListBorrowByUserTypeDetail CustomApiListBorrowByUserTypesDetail(Guid IdUnit, Guid IdUser, string fromDate, string toDate)
        {
            try
            {
                CustomApiListBorrowByUserTypeDetail customApiListBorrowByUserTypeDetail =
                    new CustomApiListBorrowByUserTypeDetail();
                DateTime FromDate = new DateTime();
                DateTime ToDate = new DateTime();

                User user = _dbContext.User.FirstOrDefault(e => e.Id == IdUser && e.IsDeleted == false && e.IsActive == true && e.IsLocked == false);

                if (user != null)
                {
                    List<DocumentInvoice> documentInvoice = null;
                    if (fromDate != null && toDate != null)
                    {
                        FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                        ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                                                //e.Status == 0 &&
                                                e.UserId == user.Id &&
                                                e.DateIn.Date >= FromDate.Date && e.DateIn.Date <= ToDate.Date).ToList();
                    }
                    else
                    {
                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                                                                           //e.Status == 0 && 
                                                                           e.UserId == user.Id).ToList();
                    }

                    Unit unit = _dbContext.Unit.FirstOrDefault(e => e.Id == user.UnitId);

                    customApiListBorrowByUserTypeDetail.IdUser = user.Id;
                    customApiListBorrowByUserTypeDetail.NameUser = user.Fullname;
                    customApiListBorrowByUserTypeDetail.UserCode = user.UserCode;
                    customApiListBorrowByUserTypeDetail.Email = user.Email;
                    customApiListBorrowByUserTypeDetail.Address = user.Address;
                    customApiListBorrowByUserTypeDetail.IdUnit = user.UnitId;
                    customApiListBorrowByUserTypeDetail.NameUnit = unit.UnitName;
                    customApiListBorrowByUserTypeDetail.IdUserType = user.UserTypeId;

                    List<ListBorrowByUserId> listBorrowByUserIds = new List<ListBorrowByUserId>();

                    for (int i = 0; i < documentInvoice.Count; i++)
                    {
                        List<DocumentInvoiceDetail> documentInvoiceDetails = _dbContext.DocumentInvoiceDetail.Where(e =>
                            e.IdDocumentInvoice == documentInvoice[i].Id).ToList();

                        for (int j = 0; j < documentInvoiceDetails.Count; j++)
                        {
                            Document document = _dbContext.Document.FirstOrDefault(e =>
                                e.ID == documentInvoiceDetails[j].IdDocument
                                && e.IsDeleted == false);

                            IndividualSample individualSample = _dbContext.IndividualSample.AsNoTracking()
                                .FirstOrDefault(e => e.Id == documentInvoiceDetails[j].IdIndividual);

                            if (document != null && individualSample != null)
                            {
                                ListBorrowByUserId listBorrowByUserId = new ListBorrowByUserId
                                {
                                    fromDate = documentInvoice[i].DateIn,
                                    toDate = documentInvoice[i].DateOut,
                                    dateReality = documentInvoice[i].DateInReality,
                                    IdDocumnent = document.ID,
                                    NameDocument = document.DocName,
                                    IdIndividual = individualSample.Id,
                                    NumIndividual = individualSample.NumIndividual,
                                    Note = documentInvoice[i].Note
                                };

                                listBorrowByUserIds.Add(listBorrowByUserId);
                            }
                        }
                    }

                    customApiListBorrowByUserTypeDetail.listBorrowByUserIds = listBorrowByUserIds;
                }

                return customApiListBorrowByUserTypeDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiListBorrowByUserTypesDetails CustomApiListBorrowByUserTypesDetails(Guid idUnit, Guid IdUser, string fromDate, string toDate)
        {
            try
            {
                var FromDate = new DateTime();
                var ToDate = new DateTime();

                CustomApiListBorrowByUserTypesDetails customApiListUserByUnits = new CustomApiListBorrowByUserTypesDetails();

                User user = _dbContext.User
                    .FirstOrDefault(e =>
                        e.Id == IdUser && e.IsDeleted == false && e.IsActive == true && e.IsLocked == false);

                if (user == null)
                {
                    return null;
                }
                Unit unit = _dbContext.Unit.FirstOrDefault(e => e.Id == user.UnitId);

                List<DocumentInvoice> documentInvoice;
                if (fromDate == null && toDate == null)
                {
                    documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                        e.UserId == user.Id && e.Status == 0).ToList();
                }
                else
                {
                    FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                    ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                    documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                        e.UserId == user.Id && (e.Status == 1 || e.Status == 2 || e.Status == 0) && e.CreateDate >= FromDate &&
                        e.CreateDate <= ToDate).ToList();
                }


                customApiListUserByUnits.NameUser = user.Fullname;
                customApiListUserByUnits.Address = user.Address;
                customApiListUserByUnits.NameUnit = unit.UnitName;
                List<ListBorrowByUserIds> listBorrowByUserIds = new List<ListBorrowByUserIds>();

                for (int j = 0; j < documentInvoice.Count; j++)
                {
                    var documentInvoiceDetails = _dbContext.DocumentInvoiceDetail.Where(e =>
                        e.IdDocumentInvoice == documentInvoice[j].Id).ToList();
                    for (int k = 0; k < documentInvoiceDetails.Count; k++)
                    {
                        var document = _dbContext.Document.FirstOrDefault(e =>
                            e.ID == documentInvoiceDetails[k].IdDocument
                            && e.IsDeleted == false);

                        var individualSample = _dbContext.IndividualSample.AsNoTracking()
                            .FirstOrDefault(e => e.Id == documentInvoiceDetails[k].IdIndividual);

                        if (document != null && individualSample != null)
                        {
                            ListBorrowByUserIds listBorrowByUserId = new ListBorrowByUserIds();
                            listBorrowByUserId.FromDate = documentInvoice[j].DateIn;
                            listBorrowByUserId.ToDate = documentInvoice[j].DateOut;
                            listBorrowByUserId.Note = documentInvoiceDetails[k].Note;
                            listBorrowByUserId.NameDocument = document.DocName;
                            listBorrowByUserId.NumIndividual = individualSample.NumIndividual;
                            listBorrowByUserId.IsComplete = documentInvoiceDetails[k].IsCompleted;
                            listBorrowByUserId.DateInReality = documentInvoiceDetails[k].DateInReality;
                            listBorrowByUserId.NumberDayLate = CalculateDaysDifference(
                                                documentInvoiceDetails[k].DateOut, documentInvoiceDetails[k].DateInReality);
                            listBorrowByUserId.MessageDayLate = CalculateDayLate(documentInvoice[j].DateIn, documentInvoice[j].DateOut, documentInvoiceDetails[k].DateInReality, documentInvoiceDetails[k].IsCompleted);

                            listBorrowByUserIds.Add(listBorrowByUserId);


                        }
                    }
                }

                customApiListUserByUnits.listBorrowByUserIds = listBorrowByUserIds.OrderByDescending(e => e.FromDate).ToList();
                return customApiListUserByUnits;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public List<CustomApiListUserByUnit> CustomApiListUserByUnit(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            try
            {
                var FromDate = new DateTime();
                var ToDate = new DateTime();

                var customApiListUserByUnits = new List<CustomApiListUserByUnit>();

                var user = _dbContext.User.Where(e => e.IsDeleted == false).ToList();

                if (idUnit != Guid.Empty)
                {
                    user = user.Where(e => e.UnitId == idUnit).ToList();
                }

                if (idUserType != Guid.Empty)
                {
                    user = user.Where(e => e.UserTypeId == idUserType).ToList();
                }

                for (int i = 0; i < user.Count; i++)
                {
                    List<DocumentInvoice> documentInvoice;
                    if (fromDate == null && toDate == null)
                    {
                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                            e.UserId == user[i].Id
                            //&& e.Status == 0
                            ).ToList();
                    }
                    else
                    {
                        FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                        ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                            e.UserId == user[i].Id
                            //&& (e.Status == 1 || e.Status == 2 || e.Status == 0) 
                            && e.CreateDate.Value.Date >= FromDate.Date &&
                            e.CreateDate.Value.Date <= ToDate.Date).ToList();
                    }

                    for (int j = 0; j < documentInvoice.Count; j++)
                    {
                        var documentInvoiceDetails = _dbContext.DocumentInvoiceDetail.Where(e =>
                            e.IdDocumentInvoice == documentInvoice[j].Id).ToList();
                        for (int k = 0; k < documentInvoiceDetails.Count; k++)
                        {
                            var document = _dbContext.Document.FirstOrDefault(e =>
                                e.ID == documentInvoiceDetails[k].IdDocument
                                && e.IsDeleted == false);

                            var individualSample = _dbContext.IndividualSample.AsNoTracking()
                                .FirstOrDefault(e => e.Id == documentInvoiceDetails[k].IdIndividual);

                            if (document != null && individualSample != null)
                            {
                                var customApiListUserByUnit = new CustomApiListUserByUnit();
                                customApiListUserByUnit.NameUser = user[i].Fullname;
                                customApiListUserByUnit.fromDate = documentInvoice[j].DateIn;
                                customApiListUserByUnit.toDate = documentInvoice[j].DateOut;
                                customApiListUserByUnit.Note = documentInvoiceDetails[k].Note;
                                customApiListUserByUnit.NameDocument = document.DocName;
                                customApiListUserByUnit.NumIndividual = individualSample.NumIndividual;
                                customApiListUserByUnit.IsComplete = documentInvoiceDetails[k].IsCompleted;
                                customApiListUserByUnit.DateInReality = documentInvoiceDetails[k].DateInReality;
                                customApiListUserByUnit.NumberDayLate = CalculateDaysDifference(
                                                 documentInvoiceDetails[k].DateOut, documentInvoiceDetails[k].DateInReality);
                                customApiListUserByUnit.MessageDayLate = CalculateDayLate(documentInvoice[j].DateIn, documentInvoice[j].DateOut, documentInvoiceDetails[k].DateInReality, documentInvoiceDetails[k].IsCompleted);

                                customApiListUserByUnits.Add(customApiListUserByUnit);


                            }
                        }
                    }
                }

                customApiListUserByUnits = customApiListUserByUnits.OrderByDescending(e => e.fromDate).ToList();
                return customApiListUserByUnits;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static int CalculateDaysDifference(DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
            {

                TimeSpan difference = endDate.Value.Date.Subtract(startDate.Value.Date);
                return difference.Days;
            }
            if (endDate == null && startDate.HasValue)
            {

                endDate = DateTime.Now;
                TimeSpan difference = endDate.Value.Date.Subtract(startDate.Value.Date);
                return difference.Days;
            }
            else
            {
                return 0;
            }
        }

        // Hàm xây dựng chuỗi kết quả

        public static String CalculateDayLate(DateTime? dateIn, DateTime? dateOut, DateTime? dateInReality, bool? IsComplete)
        {

            if (!dateIn.HasValue && !dateOut.HasValue)
            {

                return "Ngày mượn và ngày hẹn trả không được trống.";
            }
            else if (dateOut < dateIn)
            {
                return "Ngày hẹn trả không được nhỏ hơn ngày mượn.";
            }
            else if (IsComplete == true && !dateInReality.HasValue)
            {
                return "Đã trả, nhưng lại không có ngày trả thực tế trên hệ thống.";
            }
            if (!dateInReality.HasValue)
            {
                dateInReality = DateTime.Now;
            }
            string BuildTimeString(TimeSpan difference)
            {
                var parts = new List<string>();

                if (Math.Abs(difference.Days) > 0)
                    parts.Add($"{Math.Abs(difference.Days)} ngày");
                if (Math.Abs(difference.Hours) > 0)
                    parts.Add($"{Math.Abs(difference.Hours)} giờ");
                if (Math.Abs(difference.Minutes) > 0)
                    parts.Add($"{Math.Abs(difference.Minutes)} phút");
                if (Math.Abs(difference.Seconds) > 0)
                    parts.Add($"{Math.Abs(difference.Seconds)} giây");

                return string.Join(", ", parts);
            }
            String result = null;
            TimeSpan difference = dateInReality.Value.Subtract(dateOut.Value); // lấy "ngày trả thực tế" - "ngày hẹn trả"

            if (IsComplete == true) // nếu trạng thái đã trả
            {
                if (difference.TotalSeconds < 0)
                {
                    result = "Đã trả trước hạn " + BuildTimeString(difference);
                }
                else if (difference.TotalSeconds == 0)
                {
                    result = "Đã trả (Đúng hạn)";
                }
                else
                {
                    result = "Đã trả trễ hạn " + BuildTimeString(difference);
                }
            }
            else if (IsComplete == false) // nếu trạng thái chưa trả
            {
                if (difference.TotalSeconds <= 0)
                {
                    result = "Đang mượn";
                }
                else
                {
                    result = "Đang mượn trễ hạn " + BuildTimeString(difference);
                }
            }
            else
            {
                result = "Trạng thái mượn và trả không hợp lệ";
            }



            return result;
        }

        public List<CustomApiListBorrowLateByUserType> CustomApiListBorrowLateByUserTypes(Guid IdUserType, string toDate)
        {
            try
            {
                DateTime ToDate = new DateTime();
                List<CustomApiListBorrowLateByUserType> customApiListBorrowLateByUserTypes =
                    new List<CustomApiListBorrowLateByUserType>();

                List<User> user = _dbContext.User.Where(e =>
                    e.UserTypeId == IdUserType && e.IsDeleted == false).ToList();


                for (int i = 0; i < user.Count; i++)
                {
                    List<DocumentInvoice> documentInvoice = null;
                    if (toDate != null)
                    {
                        ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                            e.UserId == user[i].Id && e.DateInReality == null && e.DateOut <= DateTime.Now && e.Status == 0 && e.CreateDate <= ToDate).ToList(); // Trang have been fixed here
                    }
                    else
                    {
                        documentInvoice = _dbContext.DocumentInvoice.Where(e =>
                            e.UserId == user[i].Id && e.Status == 2).ToList();
                    }
                    Unit unit = _dbContext.Unit.FirstOrDefault(e => e.Id == user[i].UnitId);
                    for (int j = 0; j < documentInvoice.Count; j++)
                    {
                        List<DocumentInvoiceDetail> documentInvoiceDetails = _dbContext.DocumentInvoiceDetail.Where(e =>
                            e.IdDocumentInvoice == documentInvoice[j].Id).ToList();
                        for (int k = 0; k < documentInvoiceDetails.Count; k++)
                        {
                            Document document = _dbContext.Document.FirstOrDefault(e =>
                                e.ID == documentInvoiceDetails[k].IdDocument
                                && e.IsDeleted == false);

                            IndividualSample individualSample = _dbContext.IndividualSample.AsNoTracking()
                                .FirstOrDefault(e => e.Id == documentInvoiceDetails[k].IdIndividual);

                            if (individualSample != null && document != null)
                            {
                                var customApiListBorrowLateByUserType =
                                    new CustomApiListBorrowLateByUserType
                                    {
                                        IdUser = user[i].Id,
                                        NameUser = user[i].Fullname,
                                        fromDate = documentInvoice[j].DateIn,
                                        toDate = documentInvoice[j].DateOut,
                                        IdUnit = user[i].UnitId,
                                        NameUnit = unit.UnitName,
                                        IdIndividual = individualSample.Id,
                                        NumIndividual = individualSample.NumIndividual,
                                        IdDocument = document.ID,
                                        NameDocument = document.DocName,
                                        Author = document.Author,
                                        InvoiceCode = documentInvoice[j].InvoiceCode
                                    };
                                //caculate time late
                                int result = 0;
                                if (documentInvoice[j].DateInReality != null)
                                {
                                    // In this case the reality is not null but the student can be late
                                    // or not it expect to the result after caculator
                                    var time = documentInvoice[j].DateInReality - documentInvoice[j].DateOut;
                                    result = (int)Math.Ceiling(time.Value.TotalDays);
                                    if (result < 0) result = 0;
                                }
                                else
                                {
                                    //In this case the student has't been return the book.
                                    // Caculator the time late by the current date.
                                    TimeSpan? time = DateTime.Now - documentInvoice[j].DateOut;
                                    result = (int)Math.Ceiling(time.Value.TotalDays);
                                    if (result < 0) result = 0;

                                }
                                customApiListBorrowLateByUserType.NumberDayLate = result;

                                customApiListBorrowLateByUserTypes.Add(customApiListBorrowLateByUserType);
                            }
                        }
                    }
                }
                return customApiListBorrowLateByUserTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public List<CustomApiNumIndividualLedger> CustomApiNumIndividualLedgers(string fromDate, string toDate, Guid documentType)
        {
            #region LiquidatedIndividualSample
            var liquidatedIndividualFiveYears =
                _dbContext.LiquidatedIndividualSample
                    .Where(e => e.IsDeleted == false &&
                                e.CreatedDate.Value.Year + 5 <= DateTime.Now.Year).ToList();
            if (liquidatedIndividualFiveYears.Any())
            {
                liquidatedIndividualFiveYears.ForEach(e => e.IsDeleted = true);
                _dbContext.SaveChanges();
            }
            #endregion
            var result = _dbContext.CustomApiNumIndividualLedger
                .FromSqlRaw(UtilsSqlQueries.AnalystIndividualSample)
                .ToList();
            if (documentType != Guid.Empty)
            {
                result = result.Where(e => e.DocumentTypeId == documentType).ToList();
            }

            if (fromDate != null && toDate != null)
            {
                // var fromDateIndividual = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                //  var toDateIndividual = DateTime.Parse(toDate, new CultureInfo("en-CA"));
                // result = result.Where(e => e.DateIn >= fromDateIndividual && e.DateIn <= toDateIndividual).ToList();
                // Định dạng chuỗi đầu vào của fromDate và toDate (chỉ ngày tháng)
                string dateFormat = "yyyy-MM-dd";
                var fromDateIndividual = DateTime.ParseExact(fromDate, dateFormat, CultureInfo.InvariantCulture);
                var toDateIndividual = DateTime.ParseExact(toDate, dateFormat, CultureInfo.InvariantCulture);
                var fromDateStartOfDay = fromDateIndividual.Date; // 00:00:00
                var toDateEndOfDay = toDateIndividual.Date.AddDays(1).AddTicks(-1); // 23:59:59
                result = result.Where(e =>
                    (e.CreatedDate) >= fromDateStartOfDay &&
                    (e.CreatedDate) <= toDateEndOfDay
                ).ToList();

                //result = result.Where(e => e.DateIn >= fromDateStartOfDay && e.DateIn <= toDateEndOfDay).ToList();
            }
            return result;
        }


        // CustomApiNumIndividualLedgersExcel OLD
        /*public List<CustomApiNumIndividualLedger> CustomApiNumIndividualLedgersExcel(string fromDate, string toDate, Guid documentType)
        {
            List<CustomApiNumIndividualLedger> result = _dbContext.CustomApiNumIndividualLedger
                .FromSqlRaw(UtilsSqlQueries.AnalystIndividualSampleExcel)
                .ToList();

            if (documentType != Guid.Empty)
            {
                result = result.Where(e => e.DocumentTypeId == documentType).ToList();
            }

            if (fromDate != null && toDate != null)
            {
                string dateFormat = "yyyy-MM-dd";

                var fromDateIndividual = DateTime.ParseExact(fromDate, dateFormat, CultureInfo.InvariantCulture);
                var toDateIndividual = DateTime.ParseExact(toDate, dateFormat, CultureInfo.InvariantCulture);

                var fromDateStartOfDay = fromDateIndividual.Date; // 00:00:00
                var toDateEndOfDay = toDateIndividual.Date.AddDays(1).AddTicks(-1); // 23:59:59

                result = result.Where(e => e.DateIn >= fromDateStartOfDay && e.DateIn <= toDateEndOfDay).ToList();
            }

            return result;
        }*/

        // CustomApiNumIndividualLedgersExcel NEW
        private (string Prefix, int Number) ExtractPrefixAndNumber(string nameIndividual)
        {
            // Tách phần chữ ra khỏi đầu chuỗi
            var prefix = new string(nameIndividual.TakeWhile(char.IsLetter).ToArray());

            // Tìm phần số đầu tiên ngay sau các chữ cái
            var numberPart = new string(nameIndividual.SkipWhile(char.IsLetter)
                                                      .TakeWhile(char.IsDigit) // Chỉ lấy số
                                                      .ToArray());

            // Trả về tuple với tiền tố và số (nếu không tìm thấy số, trả về 0)
            return (prefix, int.TryParse(numberPart, out var num) ? num : 0);
        }


        public List<CustomApiNumIndividualLedgerExcel> CustomApiNumIndividualLedgersExcel(string fromDate, string toDate, Guid documentType)
        {
            var check = _dbContext.DocumentType.Where(x => x.Id == documentType).FirstOrDefault()?.DocTypeName.ToLower().Contains("sách giáo khoa");
            var resultSGK = new List<CustomApiNumIndividualLedgerExcel>();
            var resultAllNotSGK = new List<CustomApiNumIndividualLedgerExcel>();

            string dateFormat = "yyyy-MM-dd";

            var fromDateIndividual = DateTime.ParseExact(fromDate, dateFormat, CultureInfo.InvariantCulture);
            var toDateIndividual = DateTime.ParseExact(toDate, dateFormat, CultureInfo.InvariantCulture);

            var fromDateStartOfDay = fromDateIndividual.Date; // 00:00:00
            var toDateEndOfDay = toDateIndividual.Date.AddDays(1).AddTicks(-1); // 23:59:59
            var result = (from i in _dbContext.IndividualSample
                          join d in _dbContext.Document on i.IdDocument equals d.ID into docGroup
                          from d in docGroup.DefaultIfEmpty()
                          join ds in _dbContext.DocumentStock on i.StockId equals ds.Id into stockGroup
                          from ds in stockGroup.DefaultIfEmpty()
                          join cc in _dbContext.CategoryColor on d.IdCategoryColor equals cc.Id into colorGroup
                          from cc in colorGroup.DefaultIfEmpty()
                          join cs in _dbContext.CategorySign_V1 on d.IdCategorySign_V1 equals cs.Id into signGroup
                          from cs in signGroup.DefaultIfEmpty()
                          where d.IsDeleted == false && i.IsDeleted == false
                          select new CustomApiNumIndividualLedgerExcel
                          {
                              IdIndividual = i.Id,
                              NameIndividual = i.NumIndividual,
                              DateIn = i.EntryDate ?? i.CreatedDate ?? DateTime.Now,
                              DocumentName = d.DocName,
                              Author = d.Author,
                              Publisher = d.Publisher,
                              PublishYear = d.PublishYear,
                              Price = i.Price ?? d.Price,
                              DocumentTypeId = d.DocumentTypeId,
                              DocumentId = d.ID,
                              PublishPlace = d.PublishPlace,
                              DocumentStock = ds.StockName,
                              ReadingLevel = cc.ReadingLevel,
                              ColorName = cc.ColorName,
                              OrdinalNumber = ds.OrdinalNumber,
                              SignCode = cs.SignCode,
                              SignName = cs.SignName,
                              GeneralEntryNumber = i.GeneralEntryNumber,

                              WasLost = (from abl in _dbContext.AuditBookList
                                         join ar in _dbContext.AuditReceipt on abl.IdAuditReceipt equals ar.Id
                                         where abl.IdIndividualSample == i.Id && ar.CreatedDate >= fromDateStartOfDay && ar.CreatedDate <= toDateEndOfDay
                                         orderby ar.CreatedDate descending
                                         select abl.WasLost).FirstOrDefault(),

                              IsLiquidation = (from abl in _dbContext.AuditBookList
                                               join ar in _dbContext.AuditReceipt on abl.IdAuditReceipt equals ar.Id
                                               where abl.IdIndividualSample == i.Id
                                               orderby ar.ReportToDate descending
                                               select abl.IsLiquidation).FirstOrDefault(),

                              ReportToDate = (from abl in _dbContext.AuditBookList
                                              join ar in _dbContext.AuditReceipt on abl.IdAuditReceipt equals ar.Id
                                              where abl.IdIndividualSample == i.Id
                                              orderby ar.ReportToDate descending
                                              select ar.ReportToDate).FirstOrDefault(),

                              ExportDate = (from rd in _dbContext.ReceiptDetail
                                            join r in _dbContext.Receipt on rd.IdReceipt equals r.IdReceipt
                                            where rd.IdIndividualSample == i.Id && r.Status == 1 && r.ReceiptType == 1 && rd.IsDeleted == false && r.IsDeleted == false
                                            select r.ExportDate).FirstOrDefault(),

                              ReceiptNumber = (from rd in _dbContext.ReceiptDetail
                                               join r in _dbContext.Receipt on rd.IdReceipt equals r.IdReceipt
                                               where rd.IdIndividualSample == i.Id && r.Status == 1 && r.ReceiptType == 1 && rd.IsDeleted == false && r.IsDeleted == false
                                               select r.ReceiptNumber).FirstOrDefault(),
                              IsBuy = _dbContext.Receipt.Any(r => r.Original == "Trường tự mua" && r.IsDeleted == false && i.IdReceipt == r.IdReceipt),
                              IsDeleteIndividual = i.IsDeleted,
                          }).ToList();
            var result2 = result;


            if (documentType != Guid.Empty)
            {
                result2 = result2.Where(e => e.DocumentTypeId == documentType).ToList();
            }
            else
            {

                Guid docTypeIdSGK = _dbContext.DocumentType.Where(x => x.DocTypeName.ToLower().Contains("sách giáo khoa") && x.IsDeleted == false && x.Status == 1).Select(x => x.Id).FirstOrDefault();
                resultSGK = result.Where(x => x.DocumentTypeId == docTypeIdSGK).ToList();
                resultSGK = resultSGK.OrderBy(e => e.OrdinalNumber)
                                .ThenBy(e => e.Price)
                                .ThenBy(e => e.PublishYear)
                                .ThenBy(e => e.Publisher)
                                .ThenBy(e => e.DocumentId)
                                .ThenBy(e => e.OrdinalNumber)
                                .ThenBy(e => ExtractNumber(e.NameIndividual))
                                .ToList();
                result = new List<CustomApiNumIndividualLedgerExcel>();
                result.AddRange(resultSGK);

                resultAllNotSGK = result2.Where(x => x.DocumentTypeId != docTypeIdSGK)
                        .OrderBy(e => ExtractPrefixAndNumber(e.NameIndividual).Prefix)   // Sắp xếp theo tiền tố (SNV, STN, STK)
                        .ThenBy(e => ExtractPrefixAndNumber(e.NameIndividual).Number)    // Sắp xếp theo số
                        .ToList();
                result.AddRange(resultAllNotSGK);
                result2 = result;
            }

            if (fromDate != null && toDate != null)
            {
                result2 = result2.Where(e => e.DateIn >= fromDateStartOfDay && e.DateIn <= toDateEndOfDay).ToList();
            }
            if (documentType == Guid.Empty)
            {
                return result2;
            }

            if (check == true)
            {
                result2 = result2.OrderBy(e => e.OrdinalNumber)
                                .ThenBy(e => e.Price)
                                .ThenBy(e => e.PublishYear)
                                .ThenBy(e => e.Publisher)
                                .ThenBy(e => e.DocumentId)
                                .ThenBy(e => e.OrdinalNumber)
                                .ThenBy(e => ExtractNumber(e.NameIndividual))
                                .ToList();
            }
            else
            {
                result2 = result2
                               .OrderBy(e => ExtractNumber(e.NameIndividual))
                               .ToList();
            }

            return result2;


        }





        static int GetSortKey(string str)
        {
            // Find the index of '/' character
            int slashIndex = str.IndexOf('/');

            // Extract the part before the slash
            string codePart = str.Substring(0, slashIndex);

            // Extract the numeric part after the code
            string numericPart = new string(codePart.SkipWhile(c => !char.IsDigit(c)).ToArray());

            // Parse the numeric part to an integer
            if (int.TryParse(numericPart, out int numericValue))
            {
                return numericValue;
            }

            // If parsing fails, return a large number to ensure it's sorted to the end
            return int.MaxValue;
        }

        public async Task<List<AnalystBorrowBookMonthly>> AnalystBorrowBookMonthly(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            if (idUnit == Guid.Empty)
            {
                return new List<AnalystBorrowBookMonthly>();
            }

            // get list the user by unitId
            var users = await _dbContext.User
                .Where(e => e.UnitId == idUnit).ToListAsync();

            // Check if the usertypyId is not null, get the list<user> with the idusertypre
            if (idUserType != Guid.Empty)
            {
                users = users.Where(e => e.UserTypeId == idUserType).ToList();
            }

            // List Id User
            var idsUser = users.Select(e => e.Id);
            //List documentInvoice flowing the list of the IdUser
            var documentInvoice = await _dbContext.DocumentInvoice
                .Where(e => idsUser.Contains(e.UserId))
                .ToListAsync();



            var fromDateConverted =
                DateTime.ParseExact(fromDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var toDateConverted =
                DateTime.ParseExact(toDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);

            var results = new List<AnalystBorrowBookMonthly>();
            foreach (var item in users)
            {

                var documentInvoiceByUserId = documentInvoice.Where(e => e.UserId == item.Id).ToList();

                var invoiceByIdUser = _dbContext.DocumentInvoiceDetail.Where(e =>
                                                                documentInvoiceByUserId.Select(e => e.Id).Contains(e.IdDocumentInvoice) &&
                                                                (e.DateIn.HasValue && e.DateIn.Value >= fromDateConverted.Date && e.DateIn.Value <= toDateConverted.Date)).ToList();



                if (invoiceByIdUser.Count == 0)
                {
                    continue;
                }

                var numberOfBookInJanuary = 0;
                var numberOfBookInFeburary = 0;
                var numberOfBookInMarch = 0;
                var numberOfBookInApril = 0;
                var numberOfBookInMay = 0;
                var numberOfBookInJune = 0;
                var numberOfBookInJuly = 0;
                var numberOfBookInAugust = 0;
                var numberOfBookInStempber = 0;
                var numberOfBookInOctober = 0;
                var numberOfBookInNovember = 0;
                var numberOfBookInDecember = 0;

                foreach (var x in documentInvoiceByUserId)
                {
                    for (int i = toDateConverted.Month; i >= 1; i--)
                    {
                        if (
                                (x.DateIn.Month == i) ||
                                (invoiceByIdUser.FirstOrDefault(e => e.DateIn.HasValue && e.DateIn.Value.Month == i) != null)
                            )
                        {

                            int countDIV = invoiceByIdUser.Where(e => e.DateIn.HasValue && e.DateIn.Value.Month == i).Count();

                            if (i == 1)
                            {
                                numberOfBookInJanuary += countDIV;
                                break;
                            }
                            else if (i == 2)
                            {
                                numberOfBookInFeburary += countDIV;
                                break;
                            }
                            else if (i == 3)
                            {
                                numberOfBookInMarch += countDIV;
                                break;
                            }
                            else if (i == 4)
                            {
                                numberOfBookInApril += countDIV;
                                break;
                            }
                            else if (i == 5)
                            {
                                numberOfBookInMay += countDIV;
                                break;
                            }
                            else if (i == 6)
                            {
                                numberOfBookInJune += countDIV;
                                break;
                            }
                            else if (i == 7)
                            {
                                numberOfBookInJuly += countDIV;
                                break;
                            }
                            else if (i == 8)
                            {
                                numberOfBookInAugust += countDIV;
                                break;
                            }
                            else if (i == 9)
                            {
                                numberOfBookInStempber += countDIV;
                                break;
                            }
                            else if (i == 10)
                            {
                                numberOfBookInOctober += countDIV;
                                break;
                            }
                            else if (i == 11)
                            {
                                numberOfBookInNovember += countDIV;
                                break;
                            }
                            else if (i == 12)
                            {
                                numberOfBookInDecember += countDIV;
                                break;
                            }
                        }
                    }
                }

                results.Add(new AnalystBorrowBookMonthly()
                {
                    Id = item.Id,
                    Fullname = item?.Fullname,
                    UnitId = item!.UnitId,
                    UserTypeId = item!.UserTypeId,
                    NameMonthAndNumberBorrowedModels = new List<NameMonthAndNumberBorrowedModel>()
                    {
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 1,
                            // này đang là số phiếu mượn cần phải thay bằng số sách
                            NumberOfBorrowedBooks = numberOfBookInJanuary
                            //invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 1) // đếm số sách trong này
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 2,
                            NumberOfBorrowedBooks = numberOfBookInFeburary
                               // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 2)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 3,
                            NumberOfBorrowedBooks = numberOfBookInMarch
                               // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 3)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 4,
                            NumberOfBorrowedBooks = numberOfBookInApril
                              //  invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 4)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 5,
                            NumberOfBorrowedBooks = numberOfBookInMay
                              //  invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 5)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 6,
                            NumberOfBorrowedBooks = numberOfBookInJune
                              //  invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 6)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 7,
                            NumberOfBorrowedBooks = numberOfBookInJuly
                              //  invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 7)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 8,
                            NumberOfBorrowedBooks = numberOfBookInAugust
                               // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 8)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 9,
                            NumberOfBorrowedBooks = numberOfBookInStempber
                               // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 9)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 10,
                            NumberOfBorrowedBooks = numberOfBookInOctober
                           // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 10)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 11,
                            NumberOfBorrowedBooks = numberOfBookInNovember
                            // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 11)
                        },
                        new NameMonthAndNumberBorrowedModel()
                        {
                            NameMonth = 12,
                            NumberOfBorrowedBooks = numberOfBookInDecember
                            // invoiceByIdUser.Count(e => e.CreateDate != null && e.CreateDate.Value.Month == 12)
                        }
                    }.ToList()
                });
            }

            return results;
        }

        public List<AnalystBorrowedBooksByQuarter> AnalystBorrowedBooksByQuarter(List<Guid> unitIds, Guid idUserType, int quarter, int year)
        {
            var units = _dbContext.Unit.Where(e => unitIds.Contains(e.Id)).ToList();

            var users = _dbContext.User
                .Where(e => !e.IsDeleted)
                .ToList();

            var typeStudent = _dbContext.UserType.FirstOrDefault(e => e.TypeName == "HocSinh");
            var typeTeacher = _dbContext.UserType.FirstOrDefault(e => e.TypeName == "GiaoVien");
            var typeEmployee = _dbContext.UserType.FirstOrDefault(e => e.TypeName == "NhanVien");

            var results = new List<AnalystBorrowedBooksByQuarter>();

            var quarterMonths = new Dictionary<int, List<int>>
            {
                { 1, new List<int> { 1, 2, 3 } },
                { 2, new List<int> { 4, 5, 6 } },
                { 3, new List<int> { 7, 8, 9 } },
                { 4, new List<int> { 10, 11, 12 } }
            };

            foreach (var unit in units)
            {
                if (idUserType == Guid.Empty || idUserType == typeEmployee?.Id)
                {
                    AssignToStudentAndTeacher(quarter, year, users, unit, typeStudent, typeTeacher, quarterMonths,
                        results);
                }

                if (idUserType == typeStudent?.Id)
                {
                    AssignToStudent(quarter, year, users, unit, typeStudent, quarterMonths,
                        results);
                }

                if (idUserType == typeTeacher?.Id)
                {
                    AssignToTeacher(quarter, year, users, unit, typeTeacher, quarterMonths,
                        results);
                }
            }

            return results;
        }

        private void AssignToStudentAndTeacher(int quarter, int year, List<User> users, Unit unit, UserType typeStudent, UserType typeTeacher, Dictionary<int, List<int>> quarterMonths, List<AnalystBorrowedBooksByQuarter> results)
        {
            var unitUsersWithStudentType = users.Where(e => e.UnitId == unit.Id && e.UserTypeId == typeStudent?.Id).ToList();

            var unitUsersWithTeacherType = users.Where(e => e.UnitId == unit.Id && e.UserTypeId == typeTeacher?.Id).ToList();

            var borrowedBooksByQuarter = new List<BorrowedBooksByQuarter>();

            foreach (var month in quarterMonths[quarter])
            {
                var userIdsWithStudentType = unitUsersWithStudentType.Select(e => e.Id).ToList();
                var userIdsWithTeacherType = unitUsersWithTeacherType.Select(e => e.Id).ToList();

                var documentInvoiceWithStudentType = _dbContext.DocumentInvoice
                    .Where(e =>
                        e.DateIn.Year == year &&
                        e.DateIn.Month == month &&
                        userIdsWithStudentType.Contains(e.UserId))
                    .ToList();

                var documentInvoiceWithTeacherType = _dbContext.DocumentInvoice
                    .Where(e =>
                        e.DateIn.Year == year &&
                        e.DateIn.Month == month &&
                        userIdsWithTeacherType.Contains(e.UserId))
                    .ToList();

                var documentInvoiceIdsWithStudentType =
                    documentInvoiceWithStudentType.Select(e => e.Id).ToList();
                var documentInvoiceIdsWithTeacherType =
                    documentInvoiceWithTeacherType.Select(e => e.Id).ToList();

                var documentInvoiceDetailStudentType = _dbContext.DocumentInvoiceDetail
                    .Where(e => documentInvoiceIdsWithStudentType.Contains(e.IdDocumentInvoice))
                    .ToList();

                var documentInvoiceDetailTeacherType = _dbContext.DocumentInvoiceDetail
                    .Where(e => documentInvoiceIdsWithTeacherType.Contains(e.IdDocumentInvoice))
                    .ToList();

                var borrowedBooks = new BorrowedBooksByQuarter
                {
                    NumberStudentUserOfUnitBorrowedBook = unitUsersWithStudentType.Count(u =>
                        documentInvoiceWithStudentType.Select(d => d.UserId).Contains(u.Id)),
                    NumberBorrowedBookByStudent = documentInvoiceDetailStudentType.Count,
                    NumberBorrowedBookByTeacher = documentInvoiceDetailTeacherType.Count
                };

                borrowedBooksByQuarter.Add(borrowedBooks);
            }

            results.Add(new AnalystBorrowedBooksByQuarter
            {
                IdUnit = unit.Id,
                UnitName = unit.UnitName,
                NumberUserOfUnit = unitUsersWithStudentType.Count + unitUsersWithTeacherType.Count,
                BorrowedBooksByQuarters = borrowedBooksByQuarter
            });
        }

        private void AssignToStudent(int quarter, int year, List<User> users, Unit unit, UserType typeStudent, Dictionary<int, List<int>> quarterMonths, List<AnalystBorrowedBooksByQuarter> results)
        {
            var unitUsersWithStudentType = users.Where(e => e.UnitId == unit.Id
                                                            && e.UserTypeId == typeStudent?.Id).ToList();

            var borrowedBooksByQuarter = new List<BorrowedBooksByQuarter>();

            foreach (var month in quarterMonths[quarter])
            {
                var userIdsWithStudentType = unitUsersWithStudentType.Select(e => e.Id).ToList();

                var documentInvoiceWithStudentType = _dbContext.DocumentInvoice
                    .Where(e =>
                        e.DateIn.Year == year &&
                        e.DateIn.Month == month &&
                        userIdsWithStudentType.Contains(e.UserId))
                    .ToList();
                var totalQuarter = _dbContext.DocumentInvoice
                    .Where(d => d.DateIn.Year == year &&
                                d.DateIn.Month >= month &&
                                userIdsWithStudentType.Contains(d.UserId))
                    .AsEnumerable() // Chuyển sang xử lý trong bộ nhớ để thực hiện tính toán phức tạp
                    .Select(d => new
                    {
                        DocumentInvoice = d,
                        Quarter = (d.DateIn.Month - 1) / 3 + 1
                    })
                    .GroupBy(x => new { x.DocumentInvoice.UserId, x.Quarter })
                    .Select(g => g.OrderBy(x => x.DocumentInvoice.DateIn).First().DocumentInvoice) // Lấy bản ghi đầu tiên trong mỗi nhóm
                    .ToList();


                var documentInvoiceIdsWithStudentType =
                    documentInvoiceWithStudentType.Select(e => e.Id).ToList();

                var documentInvoiceDetailStudentType = _dbContext.DocumentInvoiceDetail
                    .Where(e => documentInvoiceIdsWithStudentType.Contains(e.IdDocumentInvoice))
                    .ToList();

                var borrowedBooks = new BorrowedBooksByQuarter
                {
                    NumberStudentUserOfUnitBorrowedBook = unitUsersWithStudentType.Count(u =>
                        documentInvoiceWithStudentType.Select(d => d.UserId).Contains(u.Id)),
                    NumberBorrowedBookByStudent = documentInvoiceDetailStudentType.Count,
                    NumberBorrowedBookByTeacher = 0,
                    TotalQuarter = totalQuarter.Count
                };

                borrowedBooksByQuarter.Add(borrowedBooks);
            }

            results.Add(new AnalystBorrowedBooksByQuarter
            {
                IdUnit = unit.Id,
                UnitName = unit.UnitName,
                NumberUserOfUnit = unitUsersWithStudentType.Count,
                BorrowedBooksByQuarters = borrowedBooksByQuarter
            });
        }

        private void AssignToTeacher(int quarter, int year, List<User> users, Unit unit, UserType typeTeacher, Dictionary<int, List<int>> quarterMonths, List<AnalystBorrowedBooksByQuarter> results)
        {
            var unitUsersWithTeacherType = users.Where(e => e.UnitId == unit.Id
                                                            && e.UserTypeId == typeTeacher?.Id).ToList();

            var borrowedBooksByQuarter = new List<BorrowedBooksByQuarter>();

            foreach (var month in quarterMonths[quarter])
            {
                var userIdsWithTeacherType = unitUsersWithTeacherType.Select(e => e.Id).ToList();

                var documentInvoiceWithTeacherType = _dbContext.DocumentInvoice
                    .Where(e =>
                        e.DateIn.Year == year &&
                        e.DateIn.Month == month &&
                        userIdsWithTeacherType.Contains(e.UserId))
                    .ToList();

                var documentInvoiceIdsWithTeacherType =
                    documentInvoiceWithTeacherType.Select(e => e.Id).ToList();

                var documentInvoiceDetailTeacherType = _dbContext.DocumentInvoiceDetail
                    .Where(e => documentInvoiceIdsWithTeacherType.Contains(e.IdDocumentInvoice))
                    .ToList();

                var borrowedBooks = new BorrowedBooksByQuarter
                {
                    NumberStudentUserOfUnitBorrowedBook = 0,
                    NumberBorrowedBookByStudent = 0,
                    NumberBorrowedBookByTeacher = documentInvoiceDetailTeacherType.Count
                };

                borrowedBooksByQuarter.Add(borrowedBooks);
            }

            results.Add(new AnalystBorrowedBooksByQuarter
            {
                IdUnit = unit.Id,
                UnitName = unit.UnitName,
                NumberUserOfUnit = unitUsersWithTeacherType.Count,
                BorrowedBooksByQuarters = borrowedBooksByQuarter
            });
        }

        public async Task<List<CustomApiListIndividualSampleTextBook>> GetListDataTextBook(DateTime fromDate, DateTime toDate)
        {
            Guid idDocumentTypeTextBook = Guid.Empty;

            int yearFromDate = fromDate.Year;

            int totalCountYear = 5; // Số năm cần lấy dữ liệu

            List<int> listYear = new List<int>();

            var documentType = await _dbContext.DocumentType
                .AsNoTracking()
                .Where(e => e.DocTypeName.Trim().ToLower().Equals("sách giáo khoa") && e.Status == 1 && e.IsDeleted == false)
                .ToListAsync(); // Lấy tất cả các loại document có tên "sách giáo khoa"

            if (documentType == null || !documentType.Any())
            {
                return new List<CustomApiListIndividualSampleTextBook>();
            }

            var documentTypeIds = documentType.Select(dt => dt.Id).ToList();

            while (listYear.Count < totalCountYear) // Nếu listYear chưa đủ 5 năm, thêm các năm trước yearFromDate
            {
                listYear.Add(yearFromDate);
                yearFromDate++;
            }

            var documents = await _dbContext.Document
                .AsNoTracking()
                .Where(e => documentTypeIds.Contains(e.DocumentTypeId) && e.IsDeleted == false)
                .ToListAsync(); // Lấy toàn bộ sách giáo khoa liên quan

            var listDataTextBook = new List<CustomApiListIndividualSampleTextBook>();

            foreach (var document in documents)
            {
                var individualSamples = await _dbContext.IndividualSample
                    .AsNoTracking()
                    .Where(e => e.IdDocument == document.ID)
                    .ToListAsync(); // Lấy toàn bộ mã cá biệt của sách giáo khoa

                if (individualSamples == null || !individualSamples.Any())
                {
                    continue;
                }

                foreach (var individualSample in individualSamples)
                {
                    DateTime dateIn = individualSample.EntryDate ?? individualSample.CreatedDate ?? DateTime.Now; // Ngày vào sổ
                    string documentName = document.DocName; // Tên sách
                    string numIndividual = individualSample.NumIndividual; // Mã cá biệt
                    int publishYear = document.PublishYear.HasValue ? document.PublishYear.Value.Year : 0000; // Năm xuất bản
                    int totalRecord = individualSamples.Count; // Tổng số bản ghi
                    long price = document.Price.GetValueOrDefault(0); // Giá sách - thành tiền

                    bool flagCheckWasLost = false;

                    var auditBooks = new List<CustomAuditBookList>();

                    foreach (int year in listYear.OrderBy(e => e).ToList())
                    {


                        var auditReceipt = await (from ar in _dbContext.AuditReceipt
                                                  join abl in _dbContext.AuditBookList on ar.Id equals abl.IdAuditReceipt
                                                  where abl.IdIndividualSample == individualSample.Id
                                                  && ar.ReportToDate.Value.Date >= fromDate.Date
                                                  && ar.ReportToDate.Value.Date <= toDate.Date
                                                  orderby ar.ReportToDate descending
                                                  select new
                                                  {
                                                      ar.ReportCreateDate,
                                                      abl.WasLost
                                                  }).FirstOrDefaultAsync();
                        var documenInvoiceDetaill = _dbContext.DocumentInvoiceDetail
                                                .Where(x => x.IdIndividual == individualSample.Id && x.IsCompleted == true)
                                                .OrderByDescending(x => x.CreateDate)
                                                .FirstOrDefault();


                        if (flagCheckWasLost == true)
                        {
                            auditBooks.Add(new CustomAuditBookList
                            {
                                Year = year,
                                WasLost = 2
                            });
                            continue;
                        }

                        if (auditReceipt != null)
                        {
                            if (auditReceipt.WasLost == true && auditReceipt.ReportCreateDate.Value.Year == year)
                            {
                                flagCheckWasLost = true;
                            }

                            if (auditReceipt.WasLost == true && auditReceipt.ReportCreateDate.Value.Year == year)
                            {
                                auditBooks.Add(new CustomAuditBookList
                                {
                                    Year = year,
                                    WasLost = 1,
                                    IsLostedPhysicalVersion = true
                                });
                            }
                            else
                            {
                                auditBooks.Add(new CustomAuditBookList
                                {
                                    Year = year,
                                    WasLost = 0,
                                    IsLostedPhysicalVersion = false
                                });
                            }

                        }
                        else
                        {
                            if (documenInvoiceDetaill != null)
                            {
                                if (individualSample.IsLostedPhysicalVersion == true && documenInvoiceDetaill.DateIn.Value.Date.Year == year)
                                {
                                    flagCheckWasLost = true;
                                }

                                if (individualSample.IsLostedPhysicalVersion == true && documenInvoiceDetaill.DateIn.Value.Date.Year == year)
                                {
                                    auditBooks.Add(new CustomAuditBookList
                                    {
                                        Year = year,
                                        WasLost = 1,
                                        IsLostedPhysicalVersion = true
                                    });
                                }
                                else
                                {
                                    auditBooks.Add(new CustomAuditBookList
                                    {
                                        Year = year,
                                        WasLost = 0,
                                        IsLostedPhysicalVersion = false
                                    });
                                }
                            }
                            else
                            {
                                auditBooks.Add(new CustomAuditBookList
                                {
                                    Year = year,
                                    WasLost = 0,
                                    IsLostedPhysicalVersion = false
                                });
                            }
                        }


                    }

                    var getReceiptNumber = await (from i in _dbContext.IndividualSample
                                                  join rc in _dbContext.Receipt on i.IdReceipt equals rc.IdReceipt
                                                  where
                                                      i.IdReceipt == individualSample.IdReceipt &&
                                                      rc.ReceiptType == 0 &&
                                                      //i.IsDeleted == false &&
                                                      rc.IsDeleted == false &&
                                                      i.Id == individualSample.Id
                                                  select new
                                                  {
                                                      rc.ReceiptNumber
                                                  }).FirstOrDefaultAsync();

                    string receiptNumber = getReceiptNumber != null ? getReceiptNumber.ReceiptNumber : string.Empty;

                    listDataTextBook.Add(new CustomApiListIndividualSampleTextBook
                    {
                        IdIndividual = individualSample.Id,
                        IdDocument = document.ID,
                        DocumentName = documentName,
                        NumIndividual = numIndividual,
                        ReceiptNumber = receiptNumber,
                        PublishYear = publishYear,
                        DateIn = dateIn,
                        Price = price,
                        TotalRecord = totalRecord,
                        TextBookListStatus = auditBooks
                    });
                }
            }

            listDataTextBook = listDataTextBook
                                .Where(e => e.DateIn >= fromDate && e.DateIn <= toDate)
                                .OrderBy(e => e.DocumentName)
                                .ThenBy(e => ExtractNumber(e.NumIndividual))
                                .ToList();

            return listDataTextBook;
        }


        public async Task<List<CustomAnalystMagazine>> GetListDataAnalystMagazine(int year, int typeAnalyst, List<Guid> listDocumentType)
        {
            if (typeAnalyst < 1 || typeAnalyst > 4)
            {
                return null;
            }

            List<CustomAnalystMagazine> analystMagazines = new List<CustomAnalystMagazine>();



            if (typeAnalyst == 1 || typeAnalyst == 3)
            {

                DateTime startDate;
                DateTime endDate;
                if (typeAnalyst == 1)
                {
                    // từ tháng 8 năm year đến hết tháng 7 năm year + 1
                    startDate = new DateTime(year, 8, 1);
                    endDate = new DateTime(year + 1, 7, 31);
                }
                else
                {
                    // trong năm year
                    startDate = new DateTime(year, 1, 1);
                    endDate = new DateTime(year, 12, 31);
                }



                foreach (var item in listDocumentType)
                {
                    List<string>[,] magazineArray = new List<string>[31, 12];
                    for (int i = 0; i < 31; i++)
                    {
                        for (int j = 0; j < 12; j++)
                        {
                            magazineArray[i, j] = new List<string>();
                        }
                    }

                    var documentType = _dbContext.DocumentType.Where(e => e.Id == item && e.Status == 2).FirstOrDefault();

                    var documentsQuery = from doc in _dbContext.Document
                                         join docType in _dbContext.DocumentType
                                         on doc.DocumentTypeId equals docType.Id
                                         where docType.Status == 2 &&
                                               doc.CreatedDate.HasValue &&
                                               doc.CreatedDate.Value.Date >= startDate &&
                                               doc.CreatedDate.Value.Date <= endDate &&
                                               docType.Id == documentType.Id &&
                                               doc.IsDeleted == false
                                         orderby doc.CreatedDate
                                         select doc;

                    List<Document> documents = await documentsQuery.ToListAsync();

                    foreach (var doc in documents)
                    {
                        DateTime docDate = doc.CreatedDate.Value.Date;
                        int day = docDate.Day;
                        int month = docDate.Month;

                        int columnIndex;

                        if (typeAnalyst == 1)
                        {
                            columnIndex = month - startDate.Month;

                            if (columnIndex < 0)
                            {
                                columnIndex += 12;
                            }
                        }
                        else
                        {
                            columnIndex = month - 1;
                        }

                        if (day >= 1 && day <= 31)
                        {
                            magazineArray[day - 1, columnIndex].Add(doc.MagazineNumber);
                        }
                    }

                    analystMagazines.Add(new CustomAnalystMagazine()
                    {
                        DocumentTypeName = documentType.DocTypeName,
                        ListMagazineOne = magazineArray,
                        ListMagazineTwo = null,
                        ReleaseTerm = documentType.ReleaseTerm,
                        Language = documentType.Language,
                        PlaceOfProduction = documentType.PlaceOfProduction,
                        PaperSize = documentType.PaperSize,
                        NumberOfCopies = documentType.NumberOfCopies
                    });

                }
            }
            else if (typeAnalyst == 2 || typeAnalyst == 4)
            {
                DateTime startDate;
                DateTime endDate;
                if (typeAnalyst == 2)
                {
                    // từ tháng 8 năm year đến hết tháng 7 năm year + 1
                    startDate = new DateTime(year, 8, 1);
                    endDate = new DateTime(year + 1, 7, 31);
                }
                else
                {
                    // trong năm year
                    startDate = new DateTime(year, 1, 1);
                    endDate = new DateTime(year + 1, 12, 31);
                }
                foreach (var item in listDocumentType)
                {
                    List<string>[,] magazineArray = new List<string>[2, 12];

                    for (int i = 0; i < 2; i++)
                    {
                        for (int j = 0; j < 12; j++)
                        {
                            magazineArray[i, j] = new List<string>();
                        }
                    }

                    var documentType = _dbContext.DocumentType.Where(e => e.Id == item && e.Status == 2).FirstOrDefault();

                    var documentsQuery = from doc in _dbContext.Document
                                         join docType in _dbContext.DocumentType
                                         on doc.DocumentTypeId equals docType.Id
                                         where docType.Status == 2 &&
                                               doc.CreatedDate.HasValue &&
                                               doc.CreatedDate.Value.Date >= startDate &&
                                               doc.CreatedDate.Value.Date <= endDate &&
                                               docType.Id == documentType.Id &&
                                               doc.IsDeleted == false
                                         orderby doc.CreatedDate
                                         select doc;

                    List<Document> documents = await documentsQuery.ToListAsync();

                    foreach (var doc in documents)
                    {
                        DateTime docDate = doc.CreatedDate.Value.Date;
                        int month = docDate.Month;

                        int columnIndex;
                        int row = 0;

                        if (typeAnalyst == 2)
                        {
                            columnIndex = month - startDate.Month;

                            if (columnIndex < 0)
                            {
                                columnIndex += 12;
                            }
                        }
                        else
                        {
                            if (docDate.Year != startDate.Year)
                            {
                                row = 1;
                            }
                            columnIndex = month - 1;
                        }

                        magazineArray[row, columnIndex].Add(doc.MagazineNumber);

                    }

                    analystMagazines.Add(new CustomAnalystMagazine()
                    {
                        DocumentTypeName = documentType.DocTypeName,
                        ListMagazineOne = null,
                        ListMagazineTwo = magazineArray,
                        ReleaseTerm = documentType.ReleaseTerm,
                        Language = documentType.Language,
                        PlaceOfProduction = documentType.PlaceOfProduction,
                        PaperSize = documentType.PaperSize,
                        NumberOfCopies = documentType.NumberOfCopies
                    });

                }

            }


            return analystMagazines;



        }


        public List<CustomApiAnalystMagazine> GetListDataApiAnalystMagazine(int year, int typeAnalyst, List<Guid> listDocumentType)
        {
            if (typeAnalyst < 1 || typeAnalyst > 4)
            {
                return new List<CustomApiAnalystMagazine>();
            }

            DateTime startDate;
            DateTime endDate;

            switch (typeAnalyst)
            {
                case 1:
                case 2:
                    startDate = new DateTime(year, 8, 1);
                    endDate = new DateTime(year + 1, 7, 31);
                    break;
                case 3:
                case 4:
                    startDate = new DateTime(year, 1, 1);
                    endDate = new DateTime(year + 1, 12, 31);
                    break;
                default:
                    return new List<CustomApiAnalystMagazine>();
            }

            var analystMagazines = new List<CustomApiAnalystMagazine>();

            foreach (var item in listDocumentType)
            {
                var documentsQuery = (from doc in _dbContext.Document
                                      join docType in _dbContext.DocumentType
                                      on doc.DocumentTypeId equals docType.Id
                                      where docType.Status == 2 &&
                                            doc.CreatedDate.HasValue &&
                                            doc.CreatedDate.Value.Date >= startDate &&
                                            doc.CreatedDate.Value.Date <= endDate &&
                                            docType.Id == item &&
                                            doc.IsDeleted == false &&
                                            docType.IsDeleted == false
                                      orderby doc.CreatedDate
                                      select new CustomApiAnalystMagazine
                                      {
                                          DocTypeName = docType.DocTypeName,
                                          MagazineNumber = doc.MagazineNumber,
                                          CreatedDate = doc.CreatedDate
                                      }).ToList();

                analystMagazines.AddRange(documentsQuery);
            }

            return analystMagazines;
        }




        private static int ExtractNumber(string numIndividual)
        {
            var match = Regex.Match(numIndividual, @"\d+");
            return match.Success ? int.Parse(match.Value) : 0;
        }


        #endregion
    }
}