using AutoMapper;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Repository.RepositoryIPL;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Linq;
using NLog.Filters;
using System.Drawing;
using DocumentFormat.OpenXml.Office.CustomUI;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportBookController : Controller
    {
        #region Variables
        private readonly IDocumentTypeRepository _documentTypeRepository;
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IReportBookRepository _reportBookRepository;
        private readonly ISchoolYearRepository _schoolYearRepository;
        private readonly SaveToDiary _saveToDiary;
        #endregion

        #region Contructor
        public ReportBookController(IDocumentTypeRepository documentTypeRepository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        IMapper mapper,
        SaveToDiary saveToDiary,
        IBookRepository bookRepository,
        IReportBookRepository reportBookRepository,
        JwtService jwtService, IUserRepository userRepository, ISchoolYearRepository schoolYearRepository)
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _mapper = mapper;
            _documentTypeRepository = documentTypeRepository;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _bookRepository = bookRepository;
            _saveToDiary = saveToDiary;
            _schoolYearRepository = schoolYearRepository;
            _reportBookRepository=reportBookRepository;
        }
        #endregion

        #region Method

        [HttpGet]
        [Route("GetStatisticsOfBookConditionBySchoolYear")]
        public List<StatisticsOfBookConditionBySchoolYearDto> GetStatisticsOfBookConditionBySchoolYear(Guid idSchoolYear)
        {
            try
            {
                var statisticsOfBookConditionBySchoolYearDto = _reportBookRepository.GetStatisticsOfBookConditionBySchoolYear(idSchoolYear);


                return statisticsOfBookConditionBySchoolYearDto;

            }
            catch (Exception)
            {
                throw; 
            }
        }[HttpGet]
        [Route("GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear")]
        public List<StatisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto> GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear(Guid idSchoolYear)
        {
            try
            {
                var statisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto = _reportBookRepository.GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear(idSchoolYear);


                return statisticsOfDocumentTypeOfAllSchoolsBySchoolYearDto;

            }
            catch (Exception)
            {
                throw; 
            }
        }
        [HttpGet]
        [Route("GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool")]
        public List<StatisticsOfPaperBooksAndDigitalBooksDto> GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(Guid idSchoolYear)
        {
            try
            {
                var statisticsOfPapersBooksAndDigitalBooksDto = _reportBookRepository.GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(idSchoolYear);


                return statisticsOfPapersBooksAndDigitalBooksDto;

            }
            catch (Exception)
            {
                throw; 
            }
        }

        [HttpGet]
        [Route("GetAllSchoolYear")]
        public List<SchoolYearModel> GetAllSchoolYear()
        {
            try
            {

                var schoolYearDtos = _schoolYearRepository.getSchoolYearActive(1, 100);
                var schoolYearModels = _mapper.Map<List<SchoolYearModel>>(schoolYearDtos);
                return schoolYearModels;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        [Route("GetAllSchoolGrade")]
        public List<SchoolGradeModel> GetAllSchoolGrade()
        {
            try
            {
                var schoolYearDtos = _schoolYearRepository.getSchoolGrade(1, 100);
                var schoolYearModels = _mapper.Map<List<SchoolGradeModel>>(schoolYearDtos);
                return schoolYearModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetAllSchool")]
        public List<SchoolModel> GetAllSchool()
        {
            try
            {
                var schoolYearDtos = _schoolYearRepository.getSchool(1, 100);
                var schoolYearModels = _mapper.Map<List<SchoolModel>>(schoolYearDtos);
                return schoolYearModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPost]
        [Route("GetAllSchoolByGradeId")]
        public List<SchoolModel> GetAllSchoolByGradeId(List<Guid> gradeId)
        {
            try
            {
                var schoolYearDtos = _schoolYearRepository.getSchoolByGrade(1, 100, gradeId);
                var schoolYearModels = _mapper.Map<List<SchoolModel>>(schoolYearDtos);
                return schoolYearModels;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("SeachReportBookTotal")]
        public List<ReportDocumentTotalModel> SeachReportBookTotal(FilterDto filter)
        {
            try
            {
                List<ReportDocumentTotalModel> reportDocumentTotals = new List<ReportDocumentTotalModel>();

                var _DocumentTotalDtos = _schoolYearRepository.getReportSchool(filter);
                var _DocumentTotalModels = _mapper.Map<List<ReportDocumentTotalModel>>(_DocumentTotalDtos);
                if (_DocumentTotalModels != null)
                {
                    var _grades = _DocumentTotalModels.GroupBy(g => g.School.GradeId);
                    foreach (var gradeItem in _grades)
                    {
                        ReportDocumentTotalModel _documentTotalModel = new ReportDocumentTotalModel()
                        {
                            Key = gradeItem.Key,
                            Name = gradeItem.FirstOrDefault().School.Grade.Name,
                            SachGiaoKhoa = gradeItem.Sum(a => a.SachGiaoKhoa),
                            SachNghiemVu = gradeItem.Sum(a => a.SachNghiemVu),
                            SachThamKhao = gradeItem.Sum(a => a.SachThamKhao),
                            SachThieuNhi = gradeItem.Sum(a => a.SachThieuNhi),
                            SachKhac = gradeItem.Sum(a => a.SachKhac),
                            Children = gradeItem.ToList()
                        };
                        reportDocumentTotals.Add(_documentTotalModel);
                    }
                }

                return reportDocumentTotals;
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPost]
        [Route("ExportExcelReportBookTotal")]
        public IActionResult ExportExcelReportBookTotal(FilterDto filter)
        {
            var schoolYearDtos = _schoolYearRepository.getReportSchool(filter);
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_BaoCaoThongKeSoLuongSach.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    #region Xử lý tổng quát

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheetTongQuat = excelPackage.Workbook.Worksheets[0];
                    namedWorksheetTongQuat.Cells["A3:Q1000"].Clear();

                    namedWorksheetTongQuat.Cells[1, 1].Value = "THỐNG KÊ SỐ LƯỢNG SÁCH";
                    var _Datas = schoolYearDtos.GroupBy(a => a.School.GradeId);
                    int startRowTongQuat = 3;


                    foreach (var _Data in _Datas)
                    {
                        var _tongSoSach = _Data.Sum(a => a.SachGiaoKhoa) + _Data.Sum(a => a.SachThamKhao) + _Data.Sum(a => a.SachNghiemVu) + _Data.Sum(a => a.SachThieuNhi) + _Data.Sum(a => a.SachKhac);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Value = _Data.FirstOrDefault().School.Grade.Name;
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 2].Value = _Data.Sum(a => a.SachGiaoKhoa);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 3].Value = _Data.Sum(a => a.SachThamKhao);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 4].Value = _Data.Sum(a => a.SachNghiemVu);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 5].Value = _Data.Sum(a => a.SachThieuNhi);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 6].Value = _Data.Sum(a => a.SachKhac);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 7].Value = _tongSoSach;
                        startRowTongQuat++;
                    }
                    // Vòng lặp thứ hai: căn chỉnh các ô và thêm viền
                    
                    var endRowTongQuat = startRowTongQuat - 1;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Value = "Tổng cộng";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.Font.Bold = true;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.Font.Color.SetColor(Color.Red);
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 2].Formula = "=SUM(B3:B" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 3].Formula = "=SUM(C3:C" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 4].Formula = "=SUM(D3:D" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 5].Formula = "=SUM(E3:E" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 6].Formula = "=SUM(F3:F" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 7].Formula = "=SUM(G3:G" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Row(startRowTongQuat).Style.Font.Bold = true;
                    for (int row = 3; row <= startRowTongQuat; row++) // Giả sử startRowStart là dòng bắt đầu
                    {
                        // Dóng giữa các cột và thêm viền
                        for (int col = 1; col <= 7; col++)
                        {
                            // Căn giữa theo chiều ngang và dọc
                            //namedWorksheetTongQuat.Cells[row, col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            //namedWorksheetTongQuat.Cells[row, col].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                            // Thêm viền
                            var cell = namedWorksheetTongQuat.Cells[row, col];
                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        }

                        // Tự động điều chỉnh độ rộng cột theo nội dung
                        //namedWorksheetTongQuat.Column(1).AutoFit();
                        namedWorksheetTongQuat.Column(2).AutoFit();
                        namedWorksheetTongQuat.Column(3).AutoFit();
                        namedWorksheetTongQuat.Column(4).AutoFit();
                        namedWorksheetTongQuat.Column(5).AutoFit();
                        namedWorksheetTongQuat.Column(6).AutoFit();
                        namedWorksheetTongQuat.Column(7).AutoFit();
                    }
                    #endregion

                    #region Xử lý chi tiết

                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];
                    namedWorksheet.Cells["A3:Q1000"].Clear();

                    namedWorksheet.Cells[1, 1].Value = "THỐNG KÊ SỐ LƯỢNG SÁCH CHI TIẾT";

                    int startRow = 3;
                    for (int i = 0; i < schoolYearDtos.Count; i++)
                    {
                        var _tongSoSach = schoolYearDtos[i].SachGiaoKhoa + schoolYearDtos[i].SachThamKhao + schoolYearDtos[i].SachNghiemVu + schoolYearDtos[i].SachThieuNhi + schoolYearDtos[i].SachKhac;
                        namedWorksheet.Cells[startRow, 1].Value = schoolYearDtos[i].School.Grade.Name;
                        namedWorksheet.Cells[startRow, 2].Value = schoolYearDtos[i].School.Name;
                        namedWorksheet.Cells[startRow, 3].Value = schoolYearDtos[i].SachGiaoKhoa;
                        namedWorksheet.Cells[startRow, 4].Value = schoolYearDtos[i].SachThamKhao;
                        namedWorksheet.Cells[startRow, 5].Value = schoolYearDtos[i].SachNghiemVu;
                        namedWorksheet.Cells[startRow, 6].Value = schoolYearDtos[i].SachThieuNhi;
                        namedWorksheet.Cells[startRow, 7].Value = schoolYearDtos[i].SachKhac;
                        namedWorksheet.Cells[startRow, 8].Value = _tongSoSach;
                        startRow++;
                    }
                    var endRow = startRow - 1;
                    namedWorksheet.Cells[$"A{startRow}:B{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 1].Value = "Tổng cộng";
                    namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;
                    namedWorksheet.Cells[startRow, 1].Style.Font.Color.SetColor(Color.Red);
                    namedWorksheet.Cells[startRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet.Cells[startRow, 3].Value = schoolYearDtos.Sum(a => a.SachGiaoKhoa);
                    namedWorksheet.Cells[startRow, 4].Value = schoolYearDtos.Sum(a => a.SachThamKhao);
                    namedWorksheet.Cells[startRow, 5].Value = schoolYearDtos.Sum(a => a.SachNghiemVu);
                    namedWorksheet.Cells[startRow, 6].Value = schoolYearDtos.Sum(a => a.SachThieuNhi);
                    namedWorksheet.Cells[startRow, 7].Value = schoolYearDtos.Sum(a => a.SachKhac);
                    namedWorksheet.Cells[startRow, 8].Formula = "=SUM(H3:H" + endRow + ")";
                    namedWorksheet.Row(startRow).Style.Font.Bold = true;
                    for (int row = 3; row <= startRow; row++) // Giả sử startRowStart là dòng bắt đầu
                    {
                        // Dóng giữa các cột và thêm viền
                        for (int col = 1; col <= 8; col++)
                        {
                            // Căn giữa theo chiều ngang và dọc
                            //namedWorksheetTongQuat.Cells[row, col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            //namedWorksheetTongQuat.Cells[row, col].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                            // Thêm viền
                            var cell = namedWorksheet.Cells[row, col];
                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        }

                        // Tự động điều chỉnh độ rộng cột theo nội dung
                        //namedWorksheet.Column(1).AutoFit();
                        namedWorksheet.Column(2).AutoFit();
                        namedWorksheet.Column(3).AutoFit();
                        namedWorksheet.Column(4).AutoFit();
                        namedWorksheet.Column(5).AutoFit();
                        namedWorksheet.Column(6).AutoFit();
                        namedWorksheet.Column(7).AutoFit();
                        namedWorksheet.Column(8).AutoFit();
                    }
                    #endregion

                    //overwrite to file old =sum(H3:H6)
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mau_BaoCaoThongKeSoLuongSach.xlsx");
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("SeachReportDetailTotal")]
        public List<ReportDocumentDetailModel> SeachReportDetailTotal(FilterDto filter)
        {
            try
            {
                List<ReportDocumentDetailModel> reportGradeSchools = new List<ReportDocumentDetailModel>();
                var reportSchoolDetail = _schoolYearRepository.getReportSchoolDetail(filter);
                var reportSchoolDetailModels = _mapper.Map<List<ReportDocumentDetailModel>>(reportSchoolDetail);
                if (reportSchoolDetailModels != null)
                {
                    var _grades = reportSchoolDetailModels.GroupBy(g => g.School.GradeId);
                    foreach (var gradeItem in _grades)
                    {
                        ReportDocumentDetailModel reportDetailModel = new ReportDocumentDetailModel()
                        {
                            Key = gradeItem.Key,
                            Name = gradeItem.FirstOrDefault().School.Grade.Name,

                            DauNam = gradeItem.Sum(a => a.DauNam),
                            CuoiNam = gradeItem.Sum(a => a.CuoiNam),
                            RachNat = gradeItem.Sum(a => a.RachNat),
                            LacHau = gradeItem.Sum(a => a.LacHau),
                            Mat = gradeItem.Sum(a => a.Mat),
                            XuatSach = gradeItem.Sum(a => a.XuatSach),
                            Children = gradeItem.ToList()

                        };
                        reportGradeSchools.Add(reportDetailModel);
                    }
                }

                return reportGradeSchools;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("ExportExcelReportDetailTotal")]
        public IActionResult ExportExcelReportDetailTotal(FilterDto filter)
        {
            var reportSchoolDetail = _schoolYearRepository.getReportSchoolDetail(filter);
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_BaoCaoThongKeTinhTrangSach.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    #region Xử lý tổng quát

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheetTongQuat = excelPackage.Workbook.Worksheets[0];
                    namedWorksheetTongQuat.Cells["A3:Q1000"].Clear();

                    namedWorksheetTongQuat.Cells[1, 1].Value = "THỐNG KÊ TÌNH TRẠNG SÁCH";
                    var _Datas = reportSchoolDetail.GroupBy(a => a.School.GradeId);
                    int startRowTongQuat = 3;


                    foreach (var _Data in _Datas)
                    {
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Value = _Data.FirstOrDefault().School.Grade.Name;
                        var _dauNam = _Data.Sum(a => a.DauNam);
                        var _rachNat = _Data.Sum(a => a.RachNat);
                        var _lacHau = _Data.Sum(a => a.LacHau);
                        var _mat = _Data.Sum(a => a.Mat);
                        var _xuatSach = _Data.Sum(a => a.XuatSach);
                        var _cuoiNam = _Data.Sum(a => a.CuoiNam);

                        namedWorksheetTongQuat.Cells[startRowTongQuat, 2].Value = _dauNam;

                        namedWorksheetTongQuat.Cells[startRowTongQuat, 3].Value = _rachNat;
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 4].Value = Math.Round(_rachNat/_dauNam*100, 2);

                        namedWorksheetTongQuat.Cells[startRowTongQuat, 5].Value = _lacHau;
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 6].Value = Math.Round(_lacHau / _dauNam * 100, 2);

                        namedWorksheetTongQuat.Cells[startRowTongQuat, 7].Value = _mat;
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 8].Value = Math.Round(_mat / _dauNam * 100, 2);

                        namedWorksheetTongQuat.Cells[startRowTongQuat, 9].Value = _xuatSach;
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 10].Value = Math.Round(_xuatSach / _dauNam * 100, 2);
                        namedWorksheetTongQuat.Cells[startRowTongQuat, 11].Value = _cuoiNam;

                        startRowTongQuat++;
                    }
                    var endRowTongQuat = startRowTongQuat - 1;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Value = "Tổng cộng";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.Font.Bold = true;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.Font.Color.SetColor(Color.Red);
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 2].Formula = "=SUM(B3:B" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 3].Formula = "=SUM(C3:C" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 5].Formula = "=SUM(E3:E" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 7].Formula = "=SUM(G3:G" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 9].Formula = "=SUM(I3:I" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Cells[startRowTongQuat, 11].Formula = "=SUM(K3:K" + endRowTongQuat + ")";
                    namedWorksheetTongQuat.Row(startRowTongQuat).Style.Font.Bold = true;

                    for (int row = 3; row <= startRowTongQuat; row++) // Giả sử startRowStart là dòng bắt đầu
                    {
                        // Dóng giữa các cột
                        for (int col = 1; col <= 11; col++)
                        {
                            //namedWorksheetTongQuat.Cells[row, col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            //namedWorksheetTongQuat.Cells[row, col].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            var cell = namedWorksheetTongQuat.Cells[row, col];
                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        }

                        // Tự động điều chỉnh độ rộng cột theo nội dung
                        namedWorksheetTongQuat.Column(1).AutoFit();
                        namedWorksheetTongQuat.Column(2).AutoFit();
                        namedWorksheetTongQuat.Column(3).AutoFit();
                        namedWorksheetTongQuat.Column(4).AutoFit();
                        namedWorksheetTongQuat.Column(5).AutoFit();
                        namedWorksheetTongQuat.Column(6).AutoFit();
                        namedWorksheetTongQuat.Column(7).AutoFit();
                        namedWorksheetTongQuat.Column(8).AutoFit();
                        namedWorksheetTongQuat.Column(9).AutoFit();
                        namedWorksheetTongQuat.Column(10).AutoFit();
                        namedWorksheetTongQuat.Column(11).AutoFit();
                    }
                    #endregion

                    #region Xử lý chi tiết

                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];
                    namedWorksheet.Cells["A3:Q1000"].Clear();

                    namedWorksheet.Cells[1, 1].Value = "THỐNG KÊ SỐ LƯỢNG SÁCH CHI TIẾT";

                    int startRow = 3;
                    for (int i = 0; i < reportSchoolDetail.Count; i++)
                    {
                        var _dauNam = reportSchoolDetail[i].DauNam;
                        var _rachNat = reportSchoolDetail[i].RachNat
;                        var _lacHau = reportSchoolDetail[i].LacHau;
                        var _mat = reportSchoolDetail[i].Mat;
                        var _xuatSach = reportSchoolDetail[i].XuatSach;
                        var _cuoiNam = reportSchoolDetail[i].CuoiNam;

                        namedWorksheet.Cells[startRow, 1].Value = reportSchoolDetail[i].School.Grade.Name;
                        namedWorksheet.Cells[startRow, 2].Value = reportSchoolDetail[i].School.Name;

                        namedWorksheet.Cells[startRow, 3].Value = _dauNam;

                        namedWorksheet.Cells[startRow, 4].Value = _rachNat;
                        namedWorksheet.Cells[startRow, 5].Value = Math.Round(_rachNat / _dauNam * 100, 2);

                        namedWorksheet.Cells[startRow, 6].Value = _lacHau;
                        namedWorksheet.Cells[startRow, 7].Value = Math.Round(_lacHau / _dauNam * 100, 2);

                        namedWorksheet.Cells[startRow, 8].Value = _mat;
                        namedWorksheet.Cells[startRow, 9].Value = Math.Round(_mat / _dauNam * 100, 2);

                        namedWorksheet.Cells[startRow, 10].Value = _xuatSach;
                        namedWorksheet.Cells[startRow, 11].Value = Math.Round(_xuatSach / _dauNam * 100, 2);

                        namedWorksheet.Cells[startRow, 12].Value = _cuoiNam;


                        startRow++;
                    }
                    var endRow = startRow - 1;
                    namedWorksheet.Cells[$"A{startRow}:B{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 1].Value = "Tổng cộng";
                    namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;
                    namedWorksheet.Cells[startRow, 1].Style.Font.Color.SetColor(Color.Red);
                    namedWorksheet.Cells[startRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    namedWorksheet.Cells[startRow, 3].Value = reportSchoolDetail.Sum(a => a.DauNam);
                    namedWorksheet.Cells[startRow, 4].Value = reportSchoolDetail.Sum(a => a.RachNat);
                    namedWorksheet.Cells[startRow, 6].Value = reportSchoolDetail.Sum(a => a.LacHau);
                    namedWorksheet.Cells[startRow, 8].Value = reportSchoolDetail.Sum(a => a.Mat);
                    namedWorksheet.Cells[startRow, 10].Value = reportSchoolDetail.Sum(a => a.XuatSach);
                    namedWorksheet.Cells[startRow, 11].Value = reportSchoolDetail.Sum(a => a.CuoiNam);
                    namedWorksheet.Row(startRow).Style.Font.Bold = true;

                    for (int i = 0; i < reportSchoolDetail.Count; i++)
                    {
                        

                        // Thêm viền cho từng cột của dòng hiện tại
                        for (int col = 1; col <= 12; col++)
                        {
                            var cell = namedWorksheet.Cells[3+i, col];

                            // Thêm viền mỏng cho tất cả các cạnh của ô
                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        }
                        // Tự động điều chỉnh độ rộng cột theo nội dung
                        namedWorksheet.Column(1).AutoFit();
                        namedWorksheet.Column(2).AutoFit();
                        namedWorksheet.Column(3).AutoFit();
                        namedWorksheet.Column(4).AutoFit();
                        namedWorksheet.Column(5).AutoFit();
                        namedWorksheet.Column(6).AutoFit();
                        namedWorksheet.Column(7).AutoFit();
                        namedWorksheet.Column(8).AutoFit();
                        namedWorksheet.Column(9).AutoFit();
                        namedWorksheet.Column(10).AutoFit();
                        namedWorksheet.Column(11).AutoFit();
                        namedWorksheet.Column(12).AutoFit();

                    }

                    #endregion

                    //overwrite to file old =sum(H3:H6)
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mau_BaoCaoThongKeTinhTrangSach.xlsx");
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //
        #endregion
    }

}
