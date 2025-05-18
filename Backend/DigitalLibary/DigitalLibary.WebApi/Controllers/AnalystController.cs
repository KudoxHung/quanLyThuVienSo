using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Utils;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalystController : Controller
    {
        #region Variables

        private readonly IAnalystRepository _analystRepository;
        private readonly AppSettingModel _appSettingModel;
        private readonly IUserRepository _userRepository;
        private readonly ISchoolYearRepository _schoolYearRepository;
        private readonly IContactAndIntroductionRepository _contactAndIntroductionRepository;
        private readonly ILogger<BookController> _logger;
        private readonly IUnitRepository _unitRepository;
        private readonly IDocumentTypeRepository _documentType;
        private readonly IIndividualSampleRepository _individualSampleRepository;
        private readonly IReceiptRepository _receiptRepository;

        #endregion

        #region Contructor

        public AnalystController(IAnalystRepository analystRepository,
            IOptionsMonitor<AppSettingModel> optionsMonitor,
            ISchoolYearRepository schoolYearRepository,
            IUnitRepository unitRepository,
            ILogger<BookController> logger,
            IContactAndIntroductionRepository contactAndIntroductionRepository,
            IUserRepository userRepository,
            IIndividualSampleRepository individualSampleRepository,
            IReceiptRepository receiptRepository,
            IDocumentTypeRepository documentType)
        {
            _documentType = documentType;
            _appSettingModel = optionsMonitor.CurrentValue;
            _userRepository = userRepository;
            _analystRepository = analystRepository;
            _unitRepository = unitRepository;
            _schoolYearRepository = schoolYearRepository;
            _logger = logger;
            _contactAndIntroductionRepository = contactAndIntroductionRepository;
            _individualSampleRepository = individualSampleRepository;
            _receiptRepository = receiptRepository;
        }

        #endregion

        #region Method
        public static string ConvertToRomanMonth(string inputDate)
        {
            string[] parts = inputDate.Split('/');
            int day = int.Parse(parts[0]);
            int month = int.Parse(parts[1]);
            int year = int.Parse(parts[2]);
            string[] romanMonths = { "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII" };
            string romanMonth = romanMonths[month];
            string shortYear = year.ToString().Substring(2);
            string result = $"{day}/{romanMonth}/{shortYear}";
            return result;
        }
        [HttpPost]
        [Route("UploadFileToCloudDianary")]
        public async Task<IActionResult> UploadFileToCloudDianary(IFormFile uploadedFile)
        {
            //byte[] fileBytes = System.IO.File.ReadAllBytes(path);

            if (uploadedFile == null || uploadedFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Chuyển file thành byte[]
            byte[] fileBytes;
            using (var memoryStream = new MemoryStream())
            {
                await uploadedFile.CopyToAsync(memoryStream);
                fileBytes = memoryStream.ToArray();
            }
            string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
            string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
            string fileName = $"{id}.docx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
            string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

            try
            {
                // Đảm bảo thư mục tồn tại trước khi ghi
                if (!System.IO.Directory.Exists(directoryPath))
                {
                    System.IO.Directory.CreateDirectory(directoryPath);
                }

                // Ghi file vào đường dẫn
                System.IO.File.WriteAllBytes(outputPath, fileBytes);
                Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                Console.WriteLine(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
            }

            var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".docx";
            var account = new Account(
                "dvgdcqn5g",
                "621798912237287",
                "7FqPAOtqqppKEAdWsxiZmmqx-bs"
            );

            var cloudinary = new Cloudinary(account);

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(docxFilePath),
                PublicId = Guid.NewGuid().ToString(),
                Folder = "word"
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);


            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return Ok(new
                {
                    Success = true,
                    Url = uploadResult.SecureUrl.ToString()
                });

            }
            else
            {
                return Ok(new
                {
                    Success = false,
                    Url = uploadResult.SecureUrl.ToString()
                });

            }
        }

        [HttpGet]
        [Route("GetInfoAppseting")]
        public AppsettingPayload GetInfoAppseting()
        {
            AppsettingPayload xxx = new AppsettingPayload();
            xxx.SchoolName = _appSettingModel.SchoolName;
            xxx.DistrictName = _appSettingModel.DistrictName;
            xxx.NameFooter = _appSettingModel.NameFooter;
            return xxx;
        }


        [HttpGet]
        [Route("GetFileExcelGeneralRegister")]
        public IActionResult GetFileExcelGeneralRegister(string fromDate, string toDate, string documentTypeId)
        {

            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "SoDangKyTongQuat.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    // sheet 0 is the inforamtion of the import book
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A39:Q10000"].Clear();
                    //var listLedger = _analystRepository.GetFileExcelGeneralRegister(fromDate, toDate).OrderBy(x => x.CreatedDate).ToList();

                    var listLedger = _analystRepository.GetFileExcelGeneralRegister_Ver2(fromDate, toDate).OrderBy(x => x.CreatedDate).ToList();

                    if (string.IsNullOrEmpty(documentTypeId) == false)
                    {
                        if (documentTypeId != "00000000-0000-0000-0000-000000000000")
                        {
                            listLedger = _analystRepository.GetFileExcelGeneralRegister_Ver2(fromDate, toDate).Where(e => e.DocumentTypeId == Guid.Parse(documentTypeId)).OrderBy(x => x.CreatedDate).ToList();
                        }
                    }



                    namedWorksheet.Cells["A3:Q3"].Merge = true;
                    namedWorksheet.Cells["A3:Q3"].Value = _appSettingModel.SchoolName;
                    namedWorksheet.Cells["A2:Q2"].Merge = true;
                    namedWorksheet.Cells["A2:Q2"].Value = _appSettingModel.DistrictName;
                    namedWorksheet.Cells["A32:Q32"].Merge = true;
                    namedWorksheet.Cells["A32:Q32"].Value = _appSettingModel.NameFooter;

                    int numberRows = 39;
                    for (int i = 0; i < listLedger.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 1; j <= 17; j++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;


                            if (j == 1)
                            {
                                cell.WrapText = true;
                            }
                            if (j == 9)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            if (j == 5 || j == 10 || j == 11 || j == 12 || j == 13)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                cell.WrapText = true;
                            }
                            if (j == 3)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                cell.WrapText = true;
                            }
                            if (j == 16)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                cell.WrapText = true;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        namedWorksheet.Cells[numberRows, 1].Value = ConvertToRomanMonth(listLedger[i].CreatedDate?.ToString("dd/MM/yyyy"));
                        namedWorksheet.Cells[numberRows, 2].Value = i + 1;
                        namedWorksheet.Cells[numberRows, 3].Value = listLedger[i].DocName;
                        namedWorksheet.Cells[numberRows, 4].Value = "";
                        namedWorksheet.Cells[numberRows, 5].Value = listLedger[i].CountIndividualSamples;
                        namedWorksheet.Cells[numberRows, 6].Value = "";
                        namedWorksheet.Cells[numberRows, 7].Value = "";
                        namedWorksheet.Cells[numberRows, 8].Value = "";
                        namedWorksheet.Cells[numberRows, 9].Value = listLedger[i].Price;

                        if (listLedger[i].DocTypeName.ToLower() == "sách giáo khoa")
                        {
                            namedWorksheet.Cells[numberRows, 10].Value = listLedger[i].DocTypeName;
                        }
                        else if (listLedger[i].DocTypeName.ToLower() == "sách nghiệp vụ")
                        {
                            namedWorksheet.Cells[numberRows, 11].Value = listLedger[i].DocTypeName;
                        }
                        else if (listLedger[i].DocTypeName.ToLower() == "sách tham khảo")
                        {
                            namedWorksheet.Cells[numberRows, 12].Value = listLedger[i].DocTypeName;
                        }
                        else if (listLedger[i].DocTypeName.ToLower() == "sách thiếu nhi")
                        {
                            namedWorksheet.Cells[numberRows, 13].Value = listLedger[i].DocTypeName;
                        }

                        if (listLedger[i].Language != null)
                        {
                            if (listLedger[i].Language.ToLower() == "english")
                            {
                                namedWorksheet.Cells[numberRows, 14].Value = "X";
                            }
                            else if (listLedger[i].Language.ToLower() == "french")
                            {
                                namedWorksheet.Cells[numberRows, 15].Value = "X";
                            }
                            else
                            {
                                namedWorksheet.Cells[numberRows, 16].Value = listLedger[i].Language;
                            }
                        }

                        namedWorksheet.Cells[numberRows, 17].Value = "";
                        numberRows++;
                    }

                    /* // sheet 1 is the inforamtion of the export book
                     var namedWorksheet2 = excelPackage.Workbook.Worksheets[2];
                     namedWorksheet2.Cells["A10:N10000"].Clear();
                     namedWorksheet2.Cells["A4:N4"].Merge = true;
                     namedWorksheet2.Cells["A4:N4"].Value = "NĂM HỌC: " + DateTime.Parse(fromDate).Year.ToString() + " - " + DateTime.Parse(toDate).Year.ToString();
                     int numberRows2 = 10;
                     for (int i = 0; i < listLedger.Count; i++)
                     {
                         //This is 4mat excel before rendder data
                         for (int j = 2; j <= 14; j++)
                         {
                             var cell = namedWorksheet2.Cells[numberRows2, j].Style;
                             cell.Font.Size = 13;
                             cell.Font.Name = "Times New Roman";
                             cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                             if (j == 1)
                             {
                                 cell.WrapText = true;
                             }
                             if (j == 9)
                             {
                                 cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                             }
                             if (j == 5 || j == 13 || j == 11 || j == 12)
                             {
                                 cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                             }
                             if (j == 3 || j == 2)
                             {
                                 cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                 cell.WrapText = true;
                             }
                             if (j == 16)
                             {
                                 cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                 cell.WrapText = true;
                             }

                             var borderStyle = cell.Border;
                             borderStyle.Top.Style = ExcelBorderStyle.Thin;
                             borderStyle.Left.Style = ExcelBorderStyle.Thin;
                             borderStyle.Right.Style = ExcelBorderStyle.Thin;
                             borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                         }
                         long? tempx = _documentType.GetAllDocumentTypeById(listLedger[i].DocumentTypeId).Status;
                         long? TypeofDoc = tempx ?? 0;
                         if (TypeofDoc != 1 && TypeofDoc != 2)
                         {
                             continue;
                         }

                         namedWorksheet2.Cells[numberRows2, 2].Value = (TypeofDoc == 1) ? listLedger[i].DocTypeName : "";
                         namedWorksheet2.Cells[numberRows2, 3].Value = (TypeofDoc == 2) ? listLedger[i].DocTypeName : "";




                         namedWorksheet2.Cells[numberRows2, 4].Value = "";
                         namedWorksheet2.Cells[numberRows2, 5].Value = "";
                         namedWorksheet2.Cells[numberRows2, 6].Value = listLedger[i].Price;
                         namedWorksheet2.Cells[numberRows2, 7].Value = (listLedger[i].DocTypeName.ToLower() == "sách giáo khoa") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 8].Value = (listLedger[i].DocTypeName.ToLower() == "sách nghiệp vụ") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 9].Value = (listLedger[i].DocTypeName.ToLower() == "sách tham khảo") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 10].Value = (listLedger[i].DocTypeName.ToLower() == "sách thiếu nhi") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 11].Value = (listLedger[i].Language != null && listLedger[i].Language.ToLower() == "english") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 12].Value = (listLedger[i].Language != null && listLedger[i].Language.ToLower() == "french") ? "X" : "";
                         namedWorksheet2.Cells[numberRows2, 13].Value = (string.IsNullOrEmpty(namedWorksheet2.Cells[numberRows2, 11].Value?.ToString()) && string.IsNullOrEmpty(namedWorksheet2.Cells[numberRows2, 12].Value?.ToString())) ? "X" : "";


                         numberRows2++;
                     }
 */
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "SoDangKyTongQuat.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetFileExcelGeneralRegister_v1")]
        public IActionResult GetFileExcelGeneralRegister_v1(string fromDate, string toDate)
        {

            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "SoDangKyTongQuat_v1.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    // sheet 0 is the inforamtion of the import book
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A39:Q10000"].Clear();
                    var listLedger = _analystRepository.GetFileExcelGeneralRegister(fromDate, toDate).OrderBy(x => x.CreatedDate).ToList();

                    namedWorksheet.Cells["A3:Q3"].Merge = true;
                    namedWorksheet.Cells["A3:Q3"].Value = _appSettingModel.SchoolName;
                    namedWorksheet.Cells["A2:Q2"].Merge = true;
                    namedWorksheet.Cells["A2:Q2"].Value = _appSettingModel.DistrictName;
                    namedWorksheet.Cells["A32:Q32"].Merge = true;
                    namedWorksheet.Cells["A32:Q32"].Value = _appSettingModel.NameFooter;

                    int numberRows = 39;
                    for (int i = 0; i < listLedger.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 1; j <= 17; j++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;


                            if (j == 1)
                            {
                                cell.WrapText = true;
                            }
                            if (j == 9)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            if (j == 5)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            if (j == 3 || j == 13)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                cell.WrapText = true;
                            }
                            if (j == 16)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                cell.WrapText = true;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        namedWorksheet.Cells[numberRows, 1].Value = ConvertToRomanMonth(listLedger[i].CreatedDate?.ToString("dd/MM/yyyy"));
                        namedWorksheet.Cells[numberRows, 2].Value = i + 1;
                        namedWorksheet.Cells[numberRows, 3].Value = listLedger[i].DocName;
                        namedWorksheet.Cells[numberRows, 4].Value = "";
                        namedWorksheet.Cells[numberRows, 5].Value = listLedger[i].CountIndividualSamples;
                        namedWorksheet.Cells[numberRows, 6].Value = "";
                        namedWorksheet.Cells[numberRows, 7].Value = "";
                        namedWorksheet.Cells[numberRows, 8].Value = "";
                        namedWorksheet.Cells[numberRows, 9].Value = listLedger[i].Price;
                        namedWorksheet.Cells[numberRows, 10].Value = "";
                        namedWorksheet.Cells[numberRows, 11].Value = "";
                        namedWorksheet.Cells[numberRows, 12].Value = "";
                        namedWorksheet.Cells[numberRows, 13].Value = listLedger[i].DocTypeName;
                        namedWorksheet.Cells[numberRows, 14].Value = "";
                        namedWorksheet.Cells[numberRows, 15].Value = "";
                        namedWorksheet.Cells[numberRows, 16].Value = listLedger[i].Language;
                        namedWorksheet.Cells[numberRows, 17].Value = "";
                        numberRows++;
                    }

                    // sheet 1 is the inforamtion of the export book
                    var namedWorksheet2 = excelPackage.Workbook.Worksheets[2];
                    namedWorksheet2.Cells["A10:N10000"].Clear();
                    namedWorksheet2.Cells["A4:N4"].Merge = true;
                    namedWorksheet2.Cells["A4:N4"].Value = "NĂM HỌC: " + DateTime.Parse(fromDate).Year.ToString() + " - " + DateTime.Parse(toDate).Year.ToString();
                    int numberRows2 = 10;
                    for (int i = 0; i < listLedger.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 2; j <= 14; j++)
                        {
                            var cell = namedWorksheet2.Cells[numberRows2, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                            if (j == 1)
                            {
                                cell.WrapText = true;
                            }
                            if (j == 9)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            if (j == 5 || j == 13 || j == 11 || j == 12)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            if (j == 3 || j == 2)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                cell.WrapText = true;
                            }
                            if (j == 16)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                cell.WrapText = true;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }
                        long? tempx = _documentType.GetAllDocumentTypeById(listLedger[i].DocumentTypeId).Status;
                        long? TypeofDoc = tempx ?? 0;
                        if (TypeofDoc != 1 && TypeofDoc != 2)
                        {
                            continue;
                        }

                        namedWorksheet2.Cells[numberRows2, 2].Value = (TypeofDoc == 1) ? listLedger[i].DocTypeName : "";
                        namedWorksheet2.Cells[numberRows2, 3].Value = (TypeofDoc == 2) ? listLedger[i].DocTypeName : "";
                        namedWorksheet2.Cells[numberRows2, 4].Value = "";
                        namedWorksheet2.Cells[numberRows2, 5].Value = "";
                        namedWorksheet2.Cells[numberRows2, 6].Value = listLedger[i].Price;
                        namedWorksheet2.Cells[numberRows2, 7].Value = (listLedger[i].DocTypeName.ToLower() == "sách giáo khoa") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 8].Value = (listLedger[i].DocTypeName.ToLower() == "sách nghiệp vụ") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 9].Value = (listLedger[i].DocTypeName.ToLower() == "sách tham khảo") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 10].Value = (listLedger[i].DocTypeName.ToLower() == "sách thiếu nhi") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 11].Value = (listLedger[i].Language != null && listLedger[i].Language.ToLower() == "english") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 12].Value = (listLedger[i].Language != null && listLedger[i].Language.ToLower() == "french") ? "X" : "";
                        namedWorksheet2.Cells[numberRows2, 13].Value = (string.IsNullOrEmpty(namedWorksheet2.Cells[numberRows2, 11].Value?.ToString()) && string.IsNullOrEmpty(namedWorksheet2.Cells[numberRows2, 12].Value?.ToString())) ? "X" : "";


                        numberRows2++;
                    }

                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "SoDangKyTongQuat.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpGet]
        [Route("GetFileExcelGeneralRegisterByShoolYear")]
        public IActionResult GetFileExcelGeneralRegisterByShoolYear(Guid IdSchoolYear)
        {

            try
            {
                SchoolYearDto schoolYearDto = _schoolYearRepository.getSchoolYear(IdSchoolYear);
                var NameSchoolYear = schoolYearDto.FromYear.Value.Year + "-" + schoolYearDto.ToYear.Value.Year;
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MAU_SO_DANG_KY_TONG_QUAT_THEO_NAM_HOC.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    #region  sheet 1 is the inforamtion of the import stock

                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A12:R10000"].Clear();
                    var listLedger = _analystRepository.GetFileExcelGeneralRegisterBySchoolYearImportStock(IdSchoolYear);
                    var total = _analystRepository.TotalBooks2(IdSchoolYear);


                    // Lấy dữ liệu từ 2 sheet trước đẻ lưu dữ liệu vào listLedger3
                    var listLedger3 = new List<CustomModelGeneralRegisterBySchoolYearDocumentStock>();


                    var mappedItem = new CustomModelGeneralRegisterBySchoolYearDocumentStock();
                    //if (listLedger.Count>0)
                    //{
                    //    mappedItem = new CustomModelGeneralRegisterBySchoolYearDocumentStock
                    //    {
                    //        NameSchoolYear = listLedger[0].NameSchoolYear,
                    //        TotalEnglishLanguage = listLedger[0].TotalEnglishLanguage,
                    //        TotalFranceLanguage = listLedger[0].TotalFranceLanguage,
                    //        TotalOtherLanguage = listLedger[0].TotalOtherLanguage,
                    //        TotalBooks = listLedger[0].TotalBooks,
                    //        //TotalBooks = _analystRepository.TotalBooks(IdSchoolYear),
                    //        TotalNewspapers = listLedger[0].TotalNewspapers,
                    //        TotalPrice = listLedger[0].TotalPrice,
                    //        TotalTextBooks = listLedger[0].TotalTextBooks,
                    //        TotalChildrenBooks = listLedger[0].TotalChildrenBooks,
                    //        TotalProfessionalBooks = listLedger[0].TotalProfessionalBooks,
                    //        TotalReferenceBooks = listLedger[0].TotalReferenceBooks,
                    //        TotalOtherBooks = listLedger[0].TotalOtherBooks
                    //    };
                    //}
                    if (listLedger.Count > 0)
                    {
                        mappedItem = new CustomModelGeneralRegisterBySchoolYearDocumentStock
                        {
                            NameSchoolYear = total[0].NameSchoolYear,
                            TotalEnglishLanguage = total[0].TotalEnglishLanguage,
                            TotalFranceLanguage = total[0].TotalFranceLanguage,
                            TotalOtherLanguage = total[0].TotalOtherLanguage,
                            TotalBooks = total[0].TotalBooks,
                            //TotalBooks = _analystRepository.TotalBooks(IdSchoolYear),
                            TotalNewspapers = total[0].TotalNewspapers,
                            TotalPrice = total[0].TotalPrice,
                            TotalTextBooks = total[0].TotalTextBooks,
                            TotalChildrenBooks = total[0].TotalChildrenBooks,
                            TotalProfessionalBooks = total[0].TotalProfessionalBooks,
                            TotalReferenceBooks = total[0].TotalReferenceBooks,
                            TotalOtherBooks = total[0].TotalOtherBooks
                        };
                    }


                    // Add the mapped item to the new list
                    listLedger3.Add(mappedItem);


                    namedWorksheet.Cells["A3:I3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet.Cells["A3:I3"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet.Cells["A3:I3"].Merge = true;
                    namedWorksheet.Cells["A3:I3"].Value = _appSettingModel.SchoolName;
                    namedWorksheet.Cells["A2:I2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet.Cells["A2:I2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet.Cells["A2:I2"].Merge = true;
                    namedWorksheet.Cells["A2:I2"].Value = _appSettingModel.DistrictName;
                    //namedWorksheet.Cells["A32:Q32"].Merge = true;
                    //namedWorksheet.Cells["A32:Q32"].Value = _appSettingModel.NameFooter;

                    namedWorksheet.Cells["A6:R6"].Merge = true;
                    namedWorksheet.Cells["A6:R6"].Value = "NĂM HỌC: " + NameSchoolYear;

                    // nếu không có data thì vẫn để mẫu như vậy
                    namedWorksheet.Cells[12, 3].Value = "Mang sang";
                    namedWorksheet.Cells[12, 3].Style.Font.Bold = true;
                    namedWorksheet.Cells[12, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    if (total.Count > 0)
                    {
                        namedWorksheet.Cells[12, 4].Value = "";
                        namedWorksheet.Cells[12, 5].Value = total[0].TotalBooks == 0 ? "" : total[0].TotalBooks;
                        namedWorksheet.Cells[12, 6].Value = total[0].TotalNewspapers == 0 ? "" : total[0].TotalNewspapers;
                        namedWorksheet.Cells[12, 7].Value = ""; // Nếu có điều kiện, bạn có thể thêm tương tự
                        namedWorksheet.Cells[12, 8].Value = "";
                        namedWorksheet.Cells[12, 9].Value = total[0].TotalPrice == 0 ? "" : total[0].TotalPrice;
                        namedWorksheet.Cells[12, 10].Value = total[0].TotalTextBooks == 0 ? "" : total[0].TotalTextBooks;
                        namedWorksheet.Cells[12, 11].Value = total[0].TotalProfessionalBooks == 0 ? "" : total[0].TotalProfessionalBooks;
                        namedWorksheet.Cells[12, 12].Value = total[0].TotalReferenceBooks == 0 ? "" : total[0].TotalReferenceBooks;
                        namedWorksheet.Cells[12, 13].Value = total[0].TotalChildrenBooks == 0 ? "" : total[0].TotalChildrenBooks;
                        namedWorksheet.Cells[12, 14].Value = total[0].TotalOtherBooks == 0 ? "" : total[0].TotalOtherBooks;
                        namedWorksheet.Cells[12, 15].Value = total[0].TotalEnglishLanguage == 0 ? "" : total[0].TotalEnglishLanguage;
                        namedWorksheet.Cells[12, 16].Value = total[0].TotalFranceLanguage == 0 ? "" : total[0].TotalFranceLanguage;
                        namedWorksheet.Cells[12, 17].Value = total[0].TotalOtherLanguage == 0 ? "" : total[0].TotalOtherLanguage;

                        namedWorksheet.Cells[12, 18].Value = "";

                        namedWorksheet.Cells[12, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        namedWorksheet.Cells[12, 16].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        namedWorksheet.Cells[12, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    }

                    if (listLedger.Count > 0)
                    {
                        namedWorksheet.Cells[12, 1].Value = "";
                        namedWorksheet.Cells[12, 2].Value = "";
                        namedWorksheet.Cells[12, 3].Value = "Mang sang";
                        namedWorksheet.Cells[12, 3].Style.Font.Bold = true;
                        namedWorksheet.Cells[12, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        namedWorksheet.Cells[12, 4].Value = "";
                        namedWorksheet.Cells[12, 5].Value = listLedger[0].TotalBooks == 0 ? "" : listLedger[0].TotalBooks;
                        namedWorksheet.Cells[12, 6].Value = listLedger[0].TotalNewspapers == 0 ? "" : listLedger[0].TotalNewspapers;
                        namedWorksheet.Cells[12, 7].Value = ""; // Nếu có điều kiện, bạn có thể thêm tương tự
                        namedWorksheet.Cells[12, 8].Value = "";
                        namedWorksheet.Cells[12, 9].Value = listLedger[0].TotalPrice == 0 ? "" : listLedger[0].TotalPrice;
                        namedWorksheet.Cells[12, 10].Value = listLedger[0].TotalTextBooks == 0 ? "" : listLedger[0].TotalTextBooks;
                        namedWorksheet.Cells[12, 11].Value = listLedger[0].TotalProfessionalBooks == 0 ? "" : listLedger[0].TotalProfessionalBooks;
                        namedWorksheet.Cells[12, 12].Value = listLedger[0].TotalReferenceBooks == 0 ? "" : listLedger[0].TotalReferenceBooks;
                        namedWorksheet.Cells[12, 13].Value = listLedger[0].TotalChildrenBooks == 0 ? "" : listLedger[0].TotalChildrenBooks;
                        namedWorksheet.Cells[12, 14].Value = listLedger[0].TotalOtherBooks == 0 ? "" : listLedger[0].TotalOtherBooks;
                        namedWorksheet.Cells[12, 15].Value = listLedger[0].TotalEnglishLanguage == 0 ? "" : listLedger[0].TotalEnglishLanguage;
                        namedWorksheet.Cells[12, 16].Value = listLedger[0].TotalFranceLanguage == 0 ? "" : listLedger[0].TotalFranceLanguage;
                        namedWorksheet.Cells[12, 17].Value = listLedger[0].TotalOtherLanguage == 0 ? "" : listLedger[0].TotalOtherLanguage;

                        namedWorksheet.Cells[12, 18].Value = "";

                        namedWorksheet.Cells[12, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        namedWorksheet.Cells[12, 16].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        namedWorksheet.Cells[12, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                    }


                    int numberRows = 13;
                    int stt = 1;
                    for (int i = 0; i < 1; i++)
                    {
                        for (int j = 1; j <= 18; j++)
                        {
                            var cell = namedWorksheet.Cells[12, j].Style;
                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }
                    }
                    for (int i = 0; i < listLedger.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 1; j <= 18; j++)
                        {

                            var cell = namedWorksheet.Cells[numberRows, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;

                            if (j == 1 || j == 2 || j >= 5 && j <= 17)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            else
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }


                        namedWorksheet.Cells[numberRows, 1].Value = (listLedger[i].RecordBookDate?.ToString("dd/MM/yyyy"));
                        namedWorksheet.Cells[numberRows, 2].Value = stt++;
                        namedWorksheet.Cells[numberRows, 3].Value = listLedger[i].Original;
                        namedWorksheet.Cells[numberRows, 4].Value = listLedger[i].ReceiptNumber;
                        namedWorksheet.Cells[numberRows, 5].Value = listLedger[i].TotalBooksByReceipt == 0 ? "" : listLedger[i].TotalBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 6].Value = listLedger[i].TotalNewspapersByReceipt == 0 ? "" : listLedger[i].TotalNewspapersByReceipt;
                        namedWorksheet.Cells[numberRows, 7].Value = ""; // Nếu có điều kiện, bạn có thể thêm tương tự
                        namedWorksheet.Cells[numberRows, 8].Value = "";
                        namedWorksheet.Cells[numberRows, 9].Value = listLedger[i].TotalPriceByReceipt == 0 ? "" : listLedger[i].TotalPriceByReceipt;
                        namedWorksheet.Cells[numberRows, 10].Value = listLedger[i].TotalTextBooksByReceipt == 0 ? "" : listLedger[i].TotalTextBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 11].Value = listLedger[i].TotalProfessionalBooksByReceipt == 0 ? "" : listLedger[i].TotalProfessionalBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 12].Value = listLedger[i].TotalReferenceBooksByReceipt == 0 ? "" : listLedger[i].TotalReferenceBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 13].Value = listLedger[i].TotalChildrenBooksByReceipt == 0 ? "" : listLedger[i].TotalChildrenBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 14].Value = listLedger[i].TotalOtherBooksByReceipt == 0 ? "" : listLedger[i].TotalOtherBooksByReceipt;
                        namedWorksheet.Cells[numberRows, 15].Value = listLedger[i].TotalEnglishLanguageByReceipt == 0 ? "" : listLedger[i].TotalEnglishLanguageByReceipt;
                        namedWorksheet.Cells[numberRows, 16].Value = listLedger[i].TotalFranceLanguageByReceipt == 0 ? "" : listLedger[i].TotalFranceLanguageByReceipt;
                        namedWorksheet.Cells[numberRows, 17].Value = listLedger[i].TotalOtherLanguageByReceipt == 0 ? "" : listLedger[i].TotalOtherLanguageByReceipt;

                        namedWorksheet.Cells[numberRows, 18].Value = "";

                        numberRows++;
                    }
                    char[] arrayColumns = Enumerable.Range('A', 26).Select(c => (char)c).ToArray();
                    var mappedItem2 = new CustomModelGeneralRegisterBySchoolYearDocumentStock { NameSchoolYear = NameSchoolYear };

                    if (listLedger.Count == 0)
                    {
                        for (int i = 1; i <= 18; i++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, i].Style;

                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                            if (i == 1 || i == 2 || i >= 5 && i <= 17)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            else
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }


                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;

                            if (i == 1 || i == 2 || i == 4 || i == 7 || i == 8 || i == 18) continue;
                            if (i == 3)
                            {
                                namedWorksheet.Cells[numberRows, i].Value = "Tổng phát sinh";
                                namedWorksheet.Cells[numberRows, i].Style.Font.Bold = true;
                            }
                            else
                            {
                                //namedWorksheet.Cells[numberRows, i].Value = 0;
                                //namedWorksheet.Cells[numberRows, i].Formula = $"IF(SUM({arrayColumns[i - 1]}{numberRows - 1})=0, \"\", SUM({arrayColumns[i - 1]}{numberRows - 1}))";

                                namedWorksheet.Calculate();
                                if (i == 5)
                                {
                                    mappedItem2.TotalBooks = 0;
                                }
                                else if (i == 6)
                                {
                                    mappedItem2.TotalNewspapers = 0;
                                }
                                else if (i == 9)
                                {
                                    mappedItem2.TotalPrice = 0;
                                }
                                else if (i == 10)
                                {
                                    mappedItem2.TotalTextBooks = 0;
                                }
                                else if (i == 11)
                                {
                                    mappedItem2.TotalProfessionalBooks = 0;
                                }
                                else if (i == 12)
                                {
                                    mappedItem2.TotalReferenceBooks = 0;
                                }
                                else if (i == 13)
                                {
                                    mappedItem2.TotalChildrenBooks = 0;
                                }
                                else if (i == 14)
                                {
                                    mappedItem2.TotalOtherBooks = 0;
                                }
                                else if (i == 15)
                                {
                                    mappedItem2.TotalEnglishLanguage = 0;
                                }
                                else if (i == 16)
                                {
                                    mappedItem2.TotalFranceLanguage = 0;
                                }
                                else if (i == 17)
                                {
                                    mappedItem2.TotalOtherLanguage = 0;
                                }
                            }
                        }
                    }
                    else
                    {
                        for (int i = 1; i <= 18; i++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, i].Style;

                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                            if (i == 1 || i == 2 || i >= 5 && i <= 17)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            else
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }


                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;

                            if (i == 1 || i == 2 || i == 4 || i == 7 || i == 8 || i == 18) continue;
                            if (i == 3)
                            {
                                namedWorksheet.Cells[numberRows, i].Value = "Tổng phát sinh";
                                namedWorksheet.Cells[numberRows, i].Style.Font.Bold = true;
                            }
                            else
                            {
                                namedWorksheet.Cells[numberRows, i].Formula = $"IF(SUM({arrayColumns[i - 1]}13:{arrayColumns[i - 1]}{numberRows - 1})=0, \"\", SUM({arrayColumns[i - 1]}13:{arrayColumns[i - 1]}{numberRows - 1}))";

                                namedWorksheet.Calculate();
                                if (i == 5)
                                {
                                    mappedItem2.TotalBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 6)
                                {
                                    mappedItem2.TotalNewspapers = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 9)
                                {
                                    mappedItem2.TotalPrice = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 10)
                                {
                                    mappedItem2.TotalTextBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 11)
                                {
                                    mappedItem2.TotalProfessionalBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 12)
                                {
                                    mappedItem2.TotalReferenceBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 13)
                                {
                                    mappedItem2.TotalChildrenBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 14)
                                {
                                    mappedItem2.TotalOtherBooks = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 15)
                                {
                                    mappedItem2.TotalEnglishLanguage = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 16)
                                {
                                    mappedItem2.TotalFranceLanguage = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                                else if (i == 17)
                                {
                                    mappedItem2.TotalOtherLanguage = namedWorksheet.Cells[numberRows, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet.Cells[numberRows, i].Value.ToString());
                                }
                            }
                        }
                    }
                    listLedger3.Add(mappedItem2);
                    numberRows++;
                    for (int i = 1; i <= 18; i++)
                    {
                        var cell = namedWorksheet.Cells[numberRows, i].Style;

                        cell.Font.Size = 13;
                        cell.Font.Name = "Times New Roman";
                        cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                        if (i == 1 || i == 2 || i >= 5 && i <= 17)
                        {
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        }
                        else
                        {
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        }


                        var borderStyle = cell.Border;
                        borderStyle.Top.Style = ExcelBorderStyle.Thin;
                        borderStyle.Left.Style = ExcelBorderStyle.Thin;
                        borderStyle.Right.Style = ExcelBorderStyle.Thin;
                        borderStyle.Bottom.Style = ExcelBorderStyle.Thin;


                        if (i == 1 || i == 2 || i == 4 || i == 7 || i == 8 || i == 18) continue;
                        if (i == 3)
                        {
                            namedWorksheet.Cells[numberRows, i].Value = "Mang sang trang sau";
                            namedWorksheet.Cells[numberRows, i].Style.Font.Bold = true;
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, i].Formula = $"IF(SUM({arrayColumns[i - 1]}12:{arrayColumns[i - 1]}{numberRows - 2})=0, \"\", SUM({arrayColumns[i - 1]}12:{arrayColumns[i - 1]}{numberRows - 2}))";

                        }

                    }
                    for (int i = 1; i <= 18; i++)
                    {
                        namedWorksheet.Column(i).AutoFit();
                        namedWorksheet.Column(i).Width += 2;
                    }
                    #endregion

                    #region sheet 2 is the inforamtion of the export stock

                    var listLedger2 = _analystRepository.GetFileExcelGeneralRegisterBySchoolYearExportStock(IdSchoolYear);


                    var namedWorksheet2 = excelPackage.Workbook.Worksheets[1];
                    namedWorksheet2.Cells["A12:U10000"].Clear();
                    namedWorksheet2.Cells["A3:I3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet2.Cells["A3:I3"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet2.Cells["A3:I3"].Merge = true;
                    namedWorksheet2.Cells["A3:I3"].Value = _appSettingModel.SchoolName;
                    namedWorksheet2.Cells["A2:I2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet2.Cells["A2:I2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet2.Cells["A2:I2"].Merge = true;
                    namedWorksheet2.Cells["A2:I2"].Value = _appSettingModel.DistrictName;
                    namedWorksheet2.Cells["A6:U6"].Merge = true;
                    namedWorksheet2.Cells["A6:U6"].Value = "NĂM HỌC: " + NameSchoolYear;

                    int numberRows2 = 12;
                    var mappedItem3 = new CustomModelGeneralRegisterBySchoolYearDocumentStock { NameSchoolYear = NameSchoolYear };


                    for (int i = 0; i < listLedger2.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 1; j <= 21; j++)
                        {
                            var cell = namedWorksheet2.Cells[numberRows2, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            //if (j == 1)
                            //{
                            //    cell.WrapText = true;
                            //}
                            //if (j == 9)
                            //{
                            //    cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            //}
                            //if (j == 5 || j == 13 || j == 11 || j == 12)
                            //{
                            //    cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            //}
                            //if (j == 3 || j == 2)
                            //{
                            //    cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            //    cell.WrapText = true;
                            //}
                            //if (j == 16)
                            //{
                            //    cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            //    cell.WrapText = true;
                            //}

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        namedWorksheet2.Cells[numberRows2, 1].Value = (listLedger2[i].RecordBookDate?.ToString("dd/MM/yyyy"));
                        namedWorksheet2.Cells[numberRows2, 2].Value = listLedger2[i].ReceiptNumber;
                        namedWorksheet2.Cells[numberRows2, 3].Value = (listLedger2[i].ExportDate?.ToString("dd/MM/yyyy"));
                        namedWorksheet2.Cells[numberRows2, 4].Value = listLedger2[i].TotalBooksByReceipt == 0 ? "" : listLedger2[i].TotalBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 5].Value = listLedger2[i].TotalNewspapersByReceipt == 0 ? "" : listLedger2[i].TotalNewspapersByReceipt;
                        namedWorksheet2.Cells[numberRows2, 6].Value = ""; // Nếu có điều kiện, bạn có thể thêm tương tự
                        namedWorksheet2.Cells[numberRows2, 7].Value = "";
                        namedWorksheet2.Cells[numberRows2, 8].Value = listLedger2[i].TotalPriceByReceipt == 0 ? "" : listLedger2[i].TotalPriceByReceipt;
                        namedWorksheet2.Cells[numberRows2, 9].Value = listLedger2[i].TotalTextBooksByReceipt == 0 ? "" : listLedger2[i].TotalTextBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 10].Value = listLedger2[i].TotalProfessionalBooksByReceipt == 0 ? "" : listLedger2[i].TotalProfessionalBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 11].Value = listLedger2[i].TotalReferenceBooksByReceipt == 0 ? "" : listLedger2[i].TotalReferenceBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 12].Value = listLedger2[i].TotalChildrenBooksByReceipt == 0 ? "" : listLedger2[i].TotalChildrenBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 13].Value = listLedger2[i].TotalOtherBooksByReceipt == 0 ? "" : listLedger2[i].TotalOtherBooksByReceipt;
                        namedWorksheet2.Cells[numberRows2, 14].Value = listLedger2[i].TotalEnglishLanguageByReceipt == 0 ? "" : listLedger2[i].TotalEnglishLanguageByReceipt;
                        namedWorksheet2.Cells[numberRows2, 15].Value = listLedger2[i].TotalFranceLanguageByReceipt == 0 ? "" : listLedger2[i].TotalFranceLanguageByReceipt;
                        namedWorksheet2.Cells[numberRows2, 16].Value = listLedger2[i].TotalOtherLanguageByReceipt == 0 ? "" : listLedger2[i].TotalOtherLanguageByReceipt;
                        namedWorksheet2.Cells[numberRows2, 17].Value = listLedger2[i].TotalDamagedBooksByRecepit == 0 ? "" : listLedger2[i].TotalDamagedBooksByRecepit;
                        namedWorksheet2.Cells[numberRows2, 18].Value = listLedger2[i].TotalLostBooksByRecepit == 0 ? "" : listLedger2[i].TotalLostBooksByRecepit;
                        namedWorksheet2.Cells[numberRows2, 19].Value = ""; // Nếu có điều kiện, bạn có thể thêm tương tự
                        namedWorksheet2.Cells[numberRows2, 20].Value = listLedger2[i].TotalOutdatedBooksByRecepit == 0 ? "" : listLedger2[i].TotalOutdatedBooksByRecepit;
                        namedWorksheet2.Cells[numberRows2, 21].Value = listLedger2[i].TotalOtherReasonsByRecepit == 0 ? "" : listLedger2[i].TotalOtherReasonsByRecepit;


                        numberRows2++;
                    }

                    namedWorksheet2.Cells[$"A{numberRows2}:C${numberRows2}"].Value = "Tổng xuất";
                    namedWorksheet2.Cells[$"A{numberRows2}:C${numberRows2}"].Style.Font.Bold = true;
                    namedWorksheet2.Cells[$"A{numberRows2}:C${numberRows2}"].Merge = true;
                    namedWorksheet2.Cells[$"A{numberRows2}:C${numberRows2}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet2.Cells[$"A{numberRows2}:C${numberRows2}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;


                    if (listLedger2.Count == 0)
                    {
                        for (int i = 1; i <= 21; i++)
                        {
                            var cell = namedWorksheet2.Cells[numberRows2, i].Style;

                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            if (i != 1 && i != 2 && i != 3)
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;

                            if (i == 1 || i == 2 || i == 3 || i == 6 || i == 7 || i == 19) continue;

                            namedWorksheet2.Cells[numberRows2, i].Formula = "";

                            namedWorksheet2.Calculate();
                            if (i == 4)
                            {
                                mappedItem3.TotalBooks = 0;
                            }
                            else if (i == 5)
                            {
                                mappedItem3.TotalNewspapers = 0;
                            }
                            else if (i == 8)
                            {
                                mappedItem3.TotalPrice = 0;
                            }
                            else if (i == 9)
                            {
                                mappedItem3.TotalTextBooks = 0;
                            }
                            else if (i == 10)
                            {
                                mappedItem3.TotalProfessionalBooks = 0;
                            }
                            else if (i == 11)
                            {
                                mappedItem3.TotalReferenceBooks = 0;
                            }
                            else if (i == 12)
                            {
                                mappedItem3.TotalChildrenBooks = 0;
                            }
                            else if (i == 13)
                            {
                                mappedItem3.TotalOtherBooks = 0;
                            }
                            else if (i == 14)
                            {
                                mappedItem3.TotalEnglishLanguage = 0;
                            }
                            else if (i == 15)
                            {
                                mappedItem3.TotalFranceLanguage = 0;
                            }
                            else if (i == 16)
                            {
                                mappedItem3.TotalOtherLanguage = 0;
                            }

                        }
                    }
                    else
                    {
                        for (int i = 1; i <= 21; i++)
                        {
                            var cell = namedWorksheet2.Cells[numberRows2, i].Style;

                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            if (i != 1 && i != 2 && i != 3)
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;

                            if (i == 1 || i == 2 || i == 3 || i == 6 || i == 7 || i == 19) continue;

                            namedWorksheet2.Cells[numberRows2, i].Formula = $"IF(SUM({arrayColumns[i - 1]}12:{arrayColumns[i - 1]}{numberRows2 - 1})=0, \"\", SUM({arrayColumns[i - 1]}12:{arrayColumns[i - 1]}{numberRows2 - 1}))";

                            namedWorksheet2.Calculate();
                            if (i == 4)
                            {
                                mappedItem3.TotalBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 5)
                            {
                                mappedItem3.TotalNewspapers = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 8)
                            {
                                mappedItem3.TotalPrice = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 9)
                            {
                                mappedItem3.TotalTextBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 10)
                            {
                                mappedItem3.TotalProfessionalBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 11)
                            {
                                mappedItem3.TotalReferenceBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 12)
                            {
                                mappedItem3.TotalChildrenBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 13)
                            {
                                mappedItem3.TotalOtherBooks = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 14)
                            {
                                mappedItem3.TotalEnglishLanguage = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 15)
                            {
                                mappedItem3.TotalFranceLanguage = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }
                            else if (i == 16)
                            {
                                mappedItem3.TotalOtherLanguage = namedWorksheet2.Cells[numberRows2, i].Value.ToString() == "" ? 0 : long.Parse(namedWorksheet2.Cells[numberRows2, i].Value.ToString());
                            }

                        }
                    }
                    listLedger3.Add(mappedItem3);
                    for (int i = 1; i <= 21; i++)
                    {
                        namedWorksheet2.Column(i).AutoFit();
                        namedWorksheet2.Column(i).Width += 2;

                    }
                    namedWorksheet2.Column(19).Width = Math.Max(30, namedWorksheet2.Column(19).Width + 10);
                    #endregion

                    #region sheet 3 is the information of document stock
                    var namedWorksheet3 = excelPackage.Workbook.Worksheets[2];
                    namedWorksheet3.Cells["A12:O10000"].Clear();



                    namedWorksheet3.Cells["A3:F3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet3.Cells["A3:F3"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet3.Cells["A3:F3"].Merge = true;
                    namedWorksheet3.Cells["A3:F3"].Value = _appSettingModel.SchoolName;
                    namedWorksheet3.Cells["A2:F2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet3.Cells["A2:F2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet3.Cells["A2:F2"].Merge = true;
                    namedWorksheet3.Cells["A2:F2"].Value = _appSettingModel.DistrictName;
                    //namedWorksheet.Cells["A32:Q32"].Merge = true;
                    //namedWorksheet.Cells["A32:Q32"].Value = _appSettingModel.NameFooter;

                    namedWorksheet3.Cells["A6:O6"].Merge = true;
                    namedWorksheet3.Cells["A6:O6"].Value = "NĂM HỌC: " + NameSchoolYear;

                    int numberRows3 = 12;
                    for (int i = 0; i < listLedger3.Count; i++)
                    {
                        //This is 4mat excel before rendder data
                        for (int j = 1; j <= 15; j++)
                        {

                            var cell = namedWorksheet3.Cells[numberRows3, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;

                            if (j >= 2 && j <= 15)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }
                            else
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        if (i == 0)
                        {
                            namedWorksheet3.Cells[numberRows3, 1].Value = "Hiện còn đến 01/08/" + (NameSchoolYear.Split('-')[0]);
                        }
                        else if (i == 1)
                        {
                            namedWorksheet3.Cells[numberRows3, 1].Value = "Năm học " + NameSchoolYear + " nhập";
                        }
                        else if (i == 2)
                        {
                            namedWorksheet3.Cells[numberRows3, 1].Value = "Năm học " + NameSchoolYear + " xuất";
                        }

                        namedWorksheet3.Cells[numberRows3, 2].Value = listLedger3[i].TotalBooks == 0 ? "" : listLedger3[i].TotalBooks;
                        namedWorksheet3.Cells[numberRows3, 3].Value = listLedger3[i].TotalNewspapers == 0 ? "" : listLedger3[i].TotalNewspapers;
                        namedWorksheet3.Cells[numberRows3, 4].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                        namedWorksheet3.Cells[numberRows3, 5].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                        namedWorksheet3.Cells[numberRows3, 6].Value = listLedger3[i].TotalPrice == 0 ? "" : listLedger3[i].TotalPrice;
                        namedWorksheet3.Cells[numberRows3, 7].Value = listLedger3[i].TotalTextBooks == 0 ? "" : listLedger3[i].TotalTextBooks;
                        namedWorksheet3.Cells[numberRows3, 8].Value = listLedger3[i].TotalProfessionalBooks == 0 ? "" : listLedger3[i].TotalProfessionalBooks;
                        namedWorksheet3.Cells[numberRows3, 9].Value = listLedger3[i].TotalReferenceBooks == 0 ? "" : listLedger3[i].TotalReferenceBooks;
                        namedWorksheet3.Cells[numberRows3, 10].Value = listLedger3[i].TotalChildrenBooks == 0 ? "" : listLedger3[i].TotalChildrenBooks;
                        namedWorksheet3.Cells[numberRows3, 11].Value = listLedger3[i].TotalOtherBooks == 0 ? "" : listLedger3[i].TotalOtherBooks;
                        namedWorksheet3.Cells[numberRows3, 12].Value = listLedger3[i].TotalEnglishLanguage == 0 ? "" : listLedger3[i].TotalEnglishLanguage;
                        namedWorksheet3.Cells[numberRows3, 13].Value = listLedger3[i].TotalFranceLanguage == 0 ? "" : listLedger3[i].TotalFranceLanguage;
                        namedWorksheet3.Cells[numberRows3, 14].Value = listLedger3[i].TotalOtherLanguage == 0 ? "" : listLedger3[i].TotalOtherLanguage;
                        namedWorksheet3.Cells[numberRows3, 15].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                        numberRows3++;
                    }
                    namedWorksheet3.Cells[12, 2].Value = total[0].TotalBooks == 0 ? "" : total[0].TotalBooks;
                    namedWorksheet3.Cells[12, 3].Value = total[0].TotalNewspapers == 0 ? "" : total[0].TotalNewspapers;
                    namedWorksheet3.Cells[12, 4].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                    namedWorksheet3.Cells[12, 5].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                    namedWorksheet3.Cells[12, 6].Value = total[0].TotalPrice == 0 ? "" : total[0].TotalPrice;
                    namedWorksheet3.Cells[12, 7].Value = total[0].TotalTextBooks == 0 ? "" : total[0].TotalTextBooks;
                    namedWorksheet3.Cells[12, 8].Value = total[0].TotalProfessionalBooks == 0 ? "" : total[0].TotalProfessionalBooks;
                    namedWorksheet3.Cells[12, 9].Value = total[0].TotalReferenceBooks == 0 ? "" : total[0].TotalReferenceBooks;
                    namedWorksheet3.Cells[12, 10].Value = total[0].TotalChildrenBooks == 0 ? "" : total[0].TotalChildrenBooks;
                    namedWorksheet3.Cells[12, 11].Value = total[0].TotalOtherBooks == 0 ? "" : total[0].TotalOtherBooks;
                    namedWorksheet3.Cells[12, 12].Value = total[0].TotalEnglishLanguage == 0 ? "" : total[0].TotalEnglishLanguage;
                    namedWorksheet3.Cells[12, 13].Value = total[0].TotalFranceLanguage == 0 ? "" : total[0].TotalFranceLanguage;
                    namedWorksheet3.Cells[12, 14].Value = total[0].TotalOtherLanguage == 0 ? "" : total[0].TotalOtherLanguage;
                    namedWorksheet3.Cells[12, 15].Value = ""; // Ô này có thể để trống hoặc thêm điều kiện nếu cần
                    for (int i = 1; i <= 15; i++)
                    {
                        var cell = namedWorksheet3.Cells[numberRows3, i].Style;

                        cell.Font.Size = 13;
                        cell.Font.Name = "Times New Roman";
                        if (i == 1)
                        {
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        }
                        else
                        {
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        }

                        var borderStyle = cell.Border;
                        borderStyle.Top.Style = ExcelBorderStyle.Thin;
                        borderStyle.Left.Style = ExcelBorderStyle.Thin;
                        borderStyle.Right.Style = ExcelBorderStyle.Thin;
                        borderStyle.Bottom.Style = ExcelBorderStyle.Thin;

                        if (i == 4 || i == 5 || i == 15) continue;

                        if (i == 1)
                        {
                            namedWorksheet3.Cells[numberRows3, i].Value = "Tồn Kho " + NameSchoolYear;
                        }
                        else
                        {
                            //namedWorksheet3.Cells[numberRows3, i].Formula = $"IF({arrayColumns[i - 1]}12 = \"\", 0, {arrayColumns[i - 1]}12) + IF({arrayColumns[i - 1]}13 = \"\", 0, {arrayColumns[i - 1]}13) - IF({arrayColumns[i - 1]}14 = \"\", 0, {arrayColumns[i - 1]}14)";
                            namedWorksheet3.Cells[numberRows3, i].Formula =
    $"IF(IF({arrayColumns[i - 1]}12 = \"\", 0, {arrayColumns[i - 1]}12) + IF({arrayColumns[i - 1]}13 = \"\", 0, {arrayColumns[i - 1]}13) - IF({arrayColumns[i - 1]}14 = \"\", 0, {arrayColumns[i - 1]}14) = 0, \"\", IF({arrayColumns[i - 1]}12 = \"\", 0, {arrayColumns[i - 1]}12) + IF({arrayColumns[i - 1]}13 = \"\", 0, {arrayColumns[i - 1]}13) - IF({arrayColumns[i - 1]}14 = \"\", 0, {arrayColumns[i - 1]}14))";


                            namedWorksheet3.Calculate();
                        }


                    }
                    for (int i = 1; i <= 15; i++)
                    {
                        namedWorksheet3.Column(i).AutoFit();
                        namedWorksheet3.Column(i).Width += 2;
                    }
                    #endregion
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MAU_SO_DANG_KY_TONG_QUAT_THEO_NAM_HOC.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetFileExcelAnalystBorrowBookByQuarter
        [HttpPost]
        [Route("GetFileExcelAnalystBorrowBookByQuarter")]
        public IActionResult GetFileExcelAnalystBorrowBookByQuarter(AnalystBorrowedBooksPayload model)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "TKQUI.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    namedWorksheet.Cells["A9:R10000"].Clear();

                    var lstData = _analystRepository.AnalystBorrowedBooksByQuarter(
                        model.IdsUnit,
                        model.UserType,
                        model.Quarter,
                        model.Year);

                    var ruleDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2);
                    namedWorksheet.Cells[1, 1].Style.Font.Size = 14;
                    namedWorksheet.Cells[1, 1].Style.Font.Bold = true;
                    if (ruleDto != null)
                    {
                        namedWorksheet.Cells[1, 1].Value = $"{ruleDto[0].col10.ToUpper()}";
                    }
                    else
                    {
                        namedWorksheet.Cells[1, 1].Value = $"TRƯỜNG: ....";
                    }

                    namedWorksheet.Cells[$"A4:R4"].Merge = true;
                    namedWorksheet.Cells[$"A4:R4"].Value = "NĂM HỌC: " + model.Year + " - " + (model.Year + 1);

                    var timeLineFromDateToDate = "";
                    string[] arrayStringNameMonths = { "", "", "" };
                    switch (model.Quarter)
                    {
                        case 1:
                            timeLineFromDateToDate = $"Từ 01/{model.Year} đến 03/{model.Year}";
                            arrayStringNameMonths[0] = "Tháng 1";
                            arrayStringNameMonths[1] = "Tháng 2";
                            arrayStringNameMonths[2] = "Tháng 3";
                            break;
                        case 2:
                            timeLineFromDateToDate = $"Từ 04/{model.Year} đến 06/{model.Year}";
                            arrayStringNameMonths[0] = "Tháng 4";
                            arrayStringNameMonths[1] = "Tháng 5";
                            arrayStringNameMonths[2] = "Tháng 6";
                            break;
                        case 3:
                            timeLineFromDateToDate = $"Từ 07/{model.Year} đến 09/{model.Year}";
                            arrayStringNameMonths[0] = "Tháng 7";
                            arrayStringNameMonths[1] = "Tháng 8";
                            arrayStringNameMonths[2] = "Tháng 9";
                            break;
                        case 4:
                            timeLineFromDateToDate = $"Từ 10/{model.Year} đến 12/{model.Year}";
                            arrayStringNameMonths[0] = "Tháng 10";
                            arrayStringNameMonths[1] = "Tháng 11";
                            arrayStringNameMonths[2] = "Tháng 12";
                            break;
                    }

                    namedWorksheet.Cells[$"A5:R5"].Merge = true;
                    namedWorksheet.Cells[$"A5:R5"].Style.Font.Size = 14;
                    namedWorksheet.Cells[$"A5:R5"].Style.Font.Bold = true;
                    namedWorksheet.Cells[$"A5:R5"].Value = timeLineFromDateToDate;

                    namedWorksheet.Cells["D6"].Value = arrayStringNameMonths[0];
                    namedWorksheet.Cells["H6"].Value = arrayStringNameMonths[1];
                    namedWorksheet.Cells["L6"].Value = arrayStringNameMonths[2];


                    int rowBegin = 9;
                    for (int i = rowBegin; i < rowBegin + lstData.Count + 1; i++)
                    {
                        for (int j = 1; j <= 18; j++)
                        {
                            namedWorksheet.Cells[i, j].Style.Border.Top.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Right.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Left.Style =
                                ExcelBorderStyle.Thin;

                            namedWorksheet.Cells[i, j].Style.Font.Size = 13;
                            namedWorksheet.Cells[i, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[i, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.Center;
                            namedWorksheet.Cells[i, j].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            namedWorksheet.Cells[i, j].Value = 0;
                        }
                    }

                    namedWorksheet.Cells[$"E{rowBegin}:E{rowBegin + lstData.Count - 1}"].Merge = true;
                    namedWorksheet.Cells[$"F{rowBegin}:F{rowBegin + lstData.Count - 1}"].Merge = true;

                    namedWorksheet.Cells[$"I{rowBegin}:I{rowBegin + lstData.Count - 1}"].Merge = true;
                    namedWorksheet.Cells[$"J{rowBegin}:J{rowBegin + lstData.Count - 1}"].Merge = true;

                    namedWorksheet.Cells[$"M{rowBegin}:M{rowBegin + lstData.Count - 1}"].Merge = true;
                    namedWorksheet.Cells[$"N{rowBegin}:N{rowBegin + lstData.Count - 1}"].Merge = true;

                    namedWorksheet.Cells[$"Q{rowBegin}:Q{rowBegin + lstData.Count - 1}"].Merge = true;
                    namedWorksheet.Cells[$"R{rowBegin}:R{rowBegin + lstData.Count - 1}"].Merge = true;

                    int sumOfNumberStudentBorrowBookByQuarter = 0;
                    int sumOfNumberBorrowBookByStudentByQuarter = 0;
                    int sumOfNumberBorrowBookByTeacherByQuarter = 0;
                    for (int i = 0; i < lstData.Count; i++)
                    {
                        namedWorksheet.Cells[rowBegin, 1].Value = lstData[i].UnitName;
                        namedWorksheet.Cells[rowBegin, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        namedWorksheet.Cells[rowBegin, 2].Value = lstData[i].NumberUserOfUnit;

                        var borrowedBooksByQuarters = lstData[i].BorrowedBooksByQuarters;
                        int increaseIndex = 3;
                        int sumOfNumberStudentBorrowBook = 0;
                        int sumOfNumberBorrowBookByStudent = 0;
                        if (borrowedBooksByQuarters != null)
                        {
                            foreach (var item in borrowedBooksByQuarters)
                            {
                                namedWorksheet.Cells[rowBegin, increaseIndex].Value =
                                    item.NumberStudentUserOfUnitBorrowedBook;
                                //namedWorksheet.Cells[rowBegin, increaseIndex].Value =
                                //   item.NumberBorrowedBookByStudent;
                                // namedWorksheet.Cells[$"D{rowBegin}"].Value = item.NumberStudentUserOfUnitBorrowedBook;
                                int increaseTemp = increaseIndex + 1;
                                namedWorksheet.Cells[rowBegin, increaseTemp].Value =
                                    item.NumberBorrowedBookByStudent;
                                //namedWorksheet.Cells[$"D{rowBegin}"].Value = item.NumberStudentUserOfUnitBorrowedBook;
                                increaseIndex += 4;
                                //sumOfNumberStudentBorrowBook += item.NumberStudentUserOfUnitBorrowedBook;
                                //sumOfNumberStudentBorrowBook += item.TotalQuarter??0;
                                sumOfNumberBorrowBookByStudent += item.NumberBorrowedBookByStudent;
                            }
                        }

                        namedWorksheet.Cells[$"O{rowBegin}"].Value = borrowedBooksByQuarters[0].TotalQuarter ?? 0;
                        namedWorksheet.Cells[$"P{rowBegin}"].Value = sumOfNumberBorrowBookByStudent;

                        sumOfNumberStudentBorrowBookByQuarter += borrowedBooksByQuarters[0].TotalQuarter ?? 0;
                        sumOfNumberBorrowBookByStudentByQuarter += sumOfNumberBorrowBookByStudent;
                        rowBegin++;
                    }


                    namedWorksheet.Rows[rowBegin].Style.Font.Bold = true;
                    namedWorksheet.Cells[rowBegin, 1].Value = "Tổng Cộng";
                    namedWorksheet.Cells[rowBegin, 2].Value = lstData.Sum(e => e.NumberUserOfUnit);// Tổng số user của đơn vị không phân chia theo loại user
                    int columnIndex = 3;

                    for (int quarterIndex = 0; quarterIndex < 3; quarterIndex++)
                    {
                        int? studentUserSum = lstData.Sum(e =>
                            e.BorrowedBooksByQuarters?.ElementAtOrDefault(quarterIndex)
                                ?.NumberStudentUserOfUnitBorrowedBook);
                        int? studentBorrowedSum = lstData.Sum(e =>
                            e.BorrowedBooksByQuarters?.ElementAtOrDefault(quarterIndex)?.NumberBorrowedBookByStudent);
                        int? teacherBorrowedSum = lstData.Sum(e =>
                            e.BorrowedBooksByQuarters?.ElementAtOrDefault(quarterIndex)?.NumberBorrowedBookByTeacher);

                        switch (quarterIndex)
                        {
                            case 0:
                                namedWorksheet.Cells[$"E9"].Value = teacherBorrowedSum;
                                break;
                            case 1:
                                namedWorksheet.Cells[$"I9"].Value = teacherBorrowedSum;
                                break;
                            case 2:
                                namedWorksheet.Cells[$"M9"].Value = teacherBorrowedSum;
                                break;
                        }

                        namedWorksheet.Cells[rowBegin, columnIndex].Value = studentUserSum;
                        namedWorksheet.Cells[rowBegin, columnIndex + 1].Value = studentBorrowedSum;
                        namedWorksheet.Cells[rowBegin, columnIndex + 2].Value = teacherBorrowedSum;

                        sumOfNumberBorrowBookByTeacherByQuarter += teacherBorrowedSum ?? 0;
                        columnIndex += 4;
                    }

                    namedWorksheet.Cells[rowBegin, 15].Value = sumOfNumberStudentBorrowBookByQuarter;
                    namedWorksheet.Cells[rowBegin, 16].Value = sumOfNumberBorrowBookByStudentByQuarter;
                    namedWorksheet.Cells[rowBegin, 17].Value = sumOfNumberBorrowBookByTeacherByQuarter;
                    namedWorksheet.Cells["Q9"].Value = sumOfNumberBorrowBookByTeacherByQuarter;

                    var customColor = System.Drawing.Color.FromArgb(226, 239, 218);

                    namedWorksheet.Cells[$"D6:F{rowBegin}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    namedWorksheet.Cells[$"D6:F{rowBegin}"].Style.Fill.BackgroundColor.SetColor(customColor);

                    namedWorksheet.Cells[$"L6:N{rowBegin}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    namedWorksheet.Cells[$"L6:N{rowBegin}"].Style.Fill.BackgroundColor.SetColor(customColor);

                    customColor = System.Drawing.Color.FromArgb(217, 217, 217);

                    namedWorksheet.Cells[$"H6:J{rowBegin}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    namedWorksheet.Cells[$"H6:J{rowBegin}"].Style.Fill.BackgroundColor.SetColor(customColor);

                    namedWorksheet.Cells[$"P6:R{rowBegin}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    namedWorksheet.Cells[$"P6:R{rowBegin}"].Style.Fill.BackgroundColor.SetColor(customColor);

                    var fiToSave = new FileInfo(path);
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "TK_MuonSach.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystBorrowBookByQuarter
        [HttpPost]
        [Route("AnalystBorrowBookByQuarter")]
        public List<AnalystBorrowedBooksByQuarter> AnalystBorrowBookByQuarter(AnalystBorrowedBooksPayload model)
        {
            try
            {
                _logger.LogInformation("Lấy dữ liệu thành công !");
                return _analystRepository.AnalystBorrowedBooksByQuarter(model.IdsUnit, model.UserType, model.Quarter,
                    model.Year);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lấy dữ liệu không thành công {ex.Message}");
                throw;
            }
        }

        // GET: api/Analyst/GetFileExcelAnalystBorrowBookMonthly
        [HttpPost]
        [Route("GetFileExcelAnalystBorrowBookMonthly")]
        public async Task<IActionResult> GetFileExcelAnalystBorrowBookMonthly(AnalystBorrowBookMonthlyPayload model)
        {
            try
            {
                if (model.FromDate is null || model.ToDate is null)
                {
                    model.FromDate = $"01/01/{DateTime.Now.Year}";
                    model.ToDate = $"01/12/{DateTime.Now.Year}";
                }

                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau4A-TKmuonsach.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    namedWorksheet.Cells["A9:O10000"].Clear(); // clear all data the table from the A[9] to O[10000]

                    var lstData = await _analystRepository.AnalystBorrowBookMonthly(model.IdUnit, model.IdUserType,
                        model.FromDate, model.ToDate);
                    var fromDateConvertFromString = DateTime.ParseExact(model.FromDate, "dd/MM/yyyy",
                        System.Globalization.CultureInfo.InvariantCulture);
                    var toDateConvertFromString = DateTime.ParseExact(model.ToDate, "dd/MM/yyyy",
                        System.Globalization.CultureInfo.InvariantCulture);

                    var ruleDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2);
                    if (ruleDto != null)
                    {
                        namedWorksheet.Cells[1, 1].Value = $"{ruleDto[0].col10.ToUpper()}";
                    }
                    else
                    {
                        namedWorksheet.Cells[1, 1].Value = $"TRƯỜNG: ....";
                    }

                    if (model.IdUnit != Guid.Empty)
                    {
                        var unit = _unitRepository.GetUnitById(model.IdUnit);

                        namedWorksheet.Cells[$"B3:E3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        namedWorksheet.Cells[$"B3:E3"].Merge = true;
                        namedWorksheet.Cells[$"B3:E3"].Style.Font.Size = 14;
                        namedWorksheet.Cells[$"B3:E3"].Style.Font.Bold = true;

                        namedWorksheet.Cells[$"B3:E3"].Value = "LỚP/PHÒNG BAN: " + unit.UnitName.ToUpper();
                    }

                    namedWorksheet.Cells[$"B4"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    namedWorksheet.Cells[$"B4"].Style.Font.Size = 14;
                    namedWorksheet.Cells[$"B4"].Style.Font.Bold = true;

                    int increaseYear = fromDateConvertFromString.Year + 1;
                    namedWorksheet.Cells[$"B4"].Value = "NĂM HỌC: " + fromDateConvertFromString.Year + "-" +
                                                        increaseYear;

                    namedWorksheet.Cells[$"B5"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    namedWorksheet.Cells[$"B5"].Style.Font.Size = 14;
                    namedWorksheet.Cells[$"B5"].Style.Font.Italic = true;

                    namedWorksheet.Cells[$"B5"].Value = $"Từ {model.FromDate} đến {model.ToDate}";

                    namedWorksheet.Cells[$"C7:N7"].Merge = true;
                    namedWorksheet.Cells[$"C7:N7"].Style.Font.Size = 13;
                    namedWorksheet.Cells[$"C7:N7"].Style.Font.Bold = true;
                    namedWorksheet.Cells[$"C7:N7"].Value = "Số cuốn sách mượn về nhà hàng tháng";
                    namedWorksheet.Cells[$"C7:N7"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet.Cells[$"C7:N7"].Style.Border.Top.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"C7:N7"].Style.Border.Left.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"C7:N7"].Style.Border.Right.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"C7:N7"].Style.Border.Bottom.Style =
                        ExcelBorderStyle.Thin;

                    string[] charToRender = { "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N" };
                    for (int i = 0; i < 12; i++)
                    {
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Border.Top.Style =
                            ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Border.Left.Style =
                            ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Border.Right.Style =
                            ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Border.Bottom.Style =
                            ExcelBorderStyle.Thin;

                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Value = i + 1;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Font.Bold = true;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Font.Size = 13;
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.Font.Name = "Times New Roman";
                        namedWorksheet.Cells[$"{charToRender[i]}{8}"].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.Center;
                    }

                    namedWorksheet.Cells[$"O7:O8"].Merge = true;
                    namedWorksheet.Cells[$"O7:O8"].Style.Font.Size = 13;
                    namedWorksheet.Cells[$"O7:O8"].Style.Font.Bold = true;
                    namedWorksheet.Cells[$"O7:O8"].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[$"O7:O8"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    namedWorksheet.Cells[$"O7:O8"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet.Cells[$"O7:O8"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    namedWorksheet.Cells[$"O7:O8"].Style.Border.Top.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"O7:O8"].Style.Border.Right.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"O7:O8"].Style.Border.Bottom.Style =
                        ExcelBorderStyle.Thin;
                    namedWorksheet.Cells[$"O7:O8"].Style.Border.Left.Style =
                        ExcelBorderStyle.Thin;

                    int rowBegin = 9;
                    for (int i = rowBegin; i < rowBegin + lstData.Count + 2; i++)
                    {
                        for (int j = 1; j <= 15; j++)
                        {
                            namedWorksheet.Cells[i, j].Style.Border.Top.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Right.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[i, j].Style.Border.Left.Style =
                                ExcelBorderStyle.Thin;

                            namedWorksheet.Cells[i, j].Style.Font.Size = 13;
                            namedWorksheet.Cells[i, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[i, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.Center;
                        }
                    }

                    int[] numberOfUserBorrowBook = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                    int[] numberOfBorrowedBook = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                    for (int i = 0; i < lstData.Count; i++)
                    {
                        namedWorksheet.Cells[rowBegin, 1].Value = i + 1;
                        namedWorksheet.Cells[rowBegin, 2].Value = lstData[i].Fullname;

                        int numberIncrease = 3;
                        int toTalBorrowedBook = 0;
                        for (int j = 0; j < 12; j++)
                        {
                            if (j == toDateConvertFromString.Month)
                            {
                                break;
                            }

                            var nameMonthAndNumberBorrowedModels = lstData[i].NameMonthAndNumberBorrowedModels;
                            if (nameMonthAndNumberBorrowedModels != null)
                            {
                                int tempValue = nameMonthAndNumberBorrowedModels[j].NumberOfBorrowedBooks;
                                namedWorksheet.Cells[rowBegin, numberIncrease].Value =
                                    tempValue;
                                toTalBorrowedBook += tempValue;

                                if (tempValue != 0)
                                {
                                    numberOfUserBorrowBook[j] += 1;
                                    numberOfBorrowedBook[j] += tempValue;
                                }
                            }

                            numberIncrease++;
                        }

                        namedWorksheet.Cells[rowBegin, 15].Value = toTalBorrowedBook;
                        rowBegin++;
                    }

                    for (int i = 1; i <= 2; i++)
                    {
                        namedWorksheet.Cells[$"A{rowBegin}:B{rowBegin}"].Merge = true;
                        namedWorksheet.Cells[$"A{rowBegin}:B{rowBegin}"].Style.Font.Bold = true;
                        namedWorksheet.Cells[$"A{rowBegin}:B{rowBegin}"].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.Left;
                        namedWorksheet.Cells[rowBegin, 1].Value =
                            i == 1 ? "Tổng số HS/GV mượn sách" : "Tổng số quyển sách HS/GV mượn";
                        for (int j = 3; j < 15; j++)
                        {
                            if (j - 3 == toDateConvertFromString.Month)
                            {
                                break;
                            }

                            int tempValue = i == 1 ? numberOfUserBorrowBook[j - 3] : numberOfBorrowedBook[j - 3];
                            namedWorksheet.Cells[rowBegin, j].Style.Font.Bold = true;
                            namedWorksheet.Cells[rowBegin, j].Value = tempValue;
                        }

                        rowBegin++;
                    }

                    var fiToSave = new FileInfo(path);
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "TK_MuonSach.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }

        // // GET: api/Analyst/AnalystBorrowBookMonthly
        // [HttpGet]
        // [Route("AnalystBorrowBookMonthly")]
        // public async Task<List<AnalystBorrowBookMonthly>> AnalystBorrowBookMonthly(Guid idUnit, Guid idUserType)
        // {
        //     try
        //     {
        //         _logger.LogInformation("Lấy dữ liệu thành công !");
        //         return await _analystRepository.AnalystBorrowBookMonthly(idUnit, idUserType);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError($"Lấy dữ liệu không thành công {ex.Message}");
        //         throw;
        //     }
        // }

        // GET: api/Analyst/GetFileExcelListIndividualLiquidated
        [HttpPost]
        [Route("GetFileExcelListIndividualLiquidated")]
        public IActionResult GetFileExcelListIndividualLiquidated(IndividualLiquidatedModel individualLiquidatedModel)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "BANG_KE_THANH_LY_SACH.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exception
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    namedWorksheet.Cells["A6:G10000"].Clear();

                    var lstData = _analystRepository.ListIndividualLiquidated(individualLiquidatedModel);

                    namedWorksheet.Cells[1, 1].Value =
                        "BẢNG KÊ KÈM THEO BIÊN BẢN SỐ " + individualLiquidatedModel.NameAuditReceipt;
                    namedWorksheet.Cells[1, 1].Style.Font.Size = 14;
                    namedWorksheet.Cells[1, 1].Style.Font.Bold = true;

                    namedWorksheet.Cells[2, 1].Value = "BIÊN BẢN XUẤT SÁCH KHỎI KHO THƯ VIỆN SỐ";
                    namedWorksheet.Cells[2, 1].Style.Font.Size = 14;
                    namedWorksheet.Cells[2, 1].Style.Font.Bold = true;

                    namedWorksheet.Cells[3, 1].Value =
                        $"NGÀY {DateTime.Now.Day} THÁNG {DateTime.Now.Month} NĂM {DateTime.Now.Year}";
                    namedWorksheet.Cells[3, 1].Style.Font.Size = 11;
                    namedWorksheet.Cells[3, 1].Style.Font.Bold = true;

                    int numberRows = 6;

                    for (int i = 0;
                         i < ((lstData.Count) * 2) + lstData.Select(e => e.BookNameAndNumIndividuals).Count();
                         i++)
                    {
                        for (int j = 1; j <= 7; j++)
                        {
                            namedWorksheet.Cells[numberRows, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRows, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.CenterContinuous;

                            if (j == 2)
                            {
                                namedWorksheet.Cells[numberRows, j].Style.HorizontalAlignment =
                                    ExcelHorizontalAlignment.Left;


                            }

                            namedWorksheet.Cells[numberRows, j].Style.Border.Top.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Left.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Right.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;
                        }

                        numberRows++;
                    }

                    numberRows = 6;
                    for (int i = 0; i < lstData.Count; i++)
                    {
                        namedWorksheet.Cells[numberRows, 4].Value = "";
                        namedWorksheet.Cells[numberRows, 5].Value = "";
                        namedWorksheet.Cells[numberRows, 6].Value = "";
                        namedWorksheet.Cells[numberRows, 7].Value = "";

                        namedWorksheet.Cells[numberRows, 2].Value = "*" + lstData[i].DocumentTypeName;
                        namedWorksheet.Cells[numberRows, 2].Style.Font.Size = 14;
                        namedWorksheet.Cells[numberRows, 2].Style.Font.Bold = true;
                        namedWorksheet.Cells[numberRows, 2].Style.Font.Italic = true;
                        namedWorksheet.Cells[numberRows, 2].Style.Font.UnderLine = true;
                        numberRows++;

                        for (int j = 0; j < lstData[i].BookNameAndNumIndividuals.Count; j++)
                        {
                            for (int k = 1; k <= 7; k++)
                            {
                                var cellStyle = namedWorksheet.Cells[numberRows, k].Style;
                                if (k == 2 || k == 3)
                                {

                                    namedWorksheet.Cells[numberRows, k].Style.HorizontalAlignment =
                                    ExcelHorizontalAlignment.Left;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Font.Name = "Times New Roman";



                                }
                                else
                                {
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                                    namedWorksheet.Cells[numberRows, k].Style.Font.Name = "Times New Roman";
                                    namedWorksheet.Cells[numberRows, k].Style.HorizontalAlignment =
                                        ExcelHorizontalAlignment.CenterContinuous;
                                }
                                cellStyle.WrapText = true;
                                cellStyle.VerticalAlignment = ExcelVerticalAlignment.Center;

                            }


                            namedWorksheet.Cells[numberRows, 1].Value = j + 1;
                            namedWorksheet.Cells[numberRows, 1].Style.Font.Size = 13;

                            namedWorksheet.Cells[numberRows, 2].Value =
                                lstData[i].BookNameAndNumIndividuals[j].NameBook;
                            namedWorksheet.Cells[numberRows, 2].Style.Font.Size = 13;


                            namedWorksheet.Cells[numberRows, 3].Value =
                                string.Join(", ", lstData[i].BookNameAndNumIndividuals[j].NumIndividual.ToArray());
                            namedWorksheet.Cells[numberRows, 3].Style.Font.Size = 13;

                            namedWorksheet.Cells[numberRows, 4].Value =
                                lstData[i].BookNameAndNumIndividuals[j].NumIndividual.Count;
                            namedWorksheet.Cells[numberRows, 4].Style.Font.Size = 13;

                            if (lstData[i].BookNameAndNumIndividuals[j].Price is not null)
                            {
                                // Hiển thị giá sách
                                namedWorksheet.Cells[numberRows, 5].Value = lstData[i].BookNameAndNumIndividuals[j].Price;
                                namedWorksheet.Cells[numberRows, 5].Style.Font.Size = 13;

                                // Tính toán và hiển thị tổng số tiền
                                namedWorksheet.Cells[numberRows, 6].Value =
                                    ((lstData[i].BookNameAndNumIndividuals[j].NumIndividual.Count) *
                                     (lstData[i].BookNameAndNumIndividuals[j].Price));
                                namedWorksheet.Cells[numberRows, 6].Style.Font.Size = 13;
                            }
                            else
                            {
                                namedWorksheet.Cells[numberRows, 5].Value = "";
                                namedWorksheet.Cells[numberRows, 6].Value = "";
                            }



                            namedWorksheet.Cells[numberRows, 7].Value =
                                lstData[i].BookNameAndNumIndividuals[j].Note ?? "";
                            namedWorksheet.Cells[numberRows, 7].Style.Font.Size = 13;

                            numberRows++;
                        }

                        namedWorksheet.Cells[numberRows, 3].Value = "TỔNG CỘNG:";
                        namedWorksheet.Cells[numberRows, 3].Style.Font.Size = 14;
                        namedWorksheet.Cells[numberRows, 3].Style.Font.Bold = true;
                        namedWorksheet.Cells[numberRows, 3].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.CenterContinuous;
                        namedWorksheet.Cells[numberRows, 3].Style.Font.Name = "Times New Roman";

                        long sumPriceBook = 0;
                        long numberIndividual = 0;
                        foreach (var item in lstData[i].BookNameAndNumIndividuals)
                        {
                            sumPriceBook += item.NumIndividual.Count * item.Price ?? 0;
                            numberIndividual += item.NumIndividual.Count;
                        }

                        namedWorksheet.Cells[numberRows, 4].Value = numberIndividual;
                        namedWorksheet.Cells[numberRows, 4].Style.Font.Size = 14;
                        namedWorksheet.Cells[numberRows, 4].Style.Font.Bold = true;
                        namedWorksheet.Cells[numberRows, 4].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.CenterContinuous;

                        namedWorksheet.Cells[numberRows, 4].Style.Font.Name = "Times New Roman";


                        namedWorksheet.Cells[numberRows, 5].Value = "";

                        namedWorksheet.Cells[numberRows, 5].Style.Font.Name = "Times New Roman";


                        namedWorksheet.Cells[numberRows, 6].Value = sumPriceBook;


                        namedWorksheet.Cells[numberRows, 6].Style.Font.Name = "Times New Roman";

                        namedWorksheet.Cells[numberRows, 6].Style.Font.Size = 14;
                        namedWorksheet.Cells[numberRows, 6].Style.Font.Bold = true;
                        namedWorksheet.Cells[numberRows, 6].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.CenterContinuous;

                        namedWorksheet.Cells[numberRows, 7].Value = "";

                        numberRows++;
                    }
                    namedWorksheet.Cells[numberRows + 2, 2].Value = "HIỆU TRƯỞNG";
                    namedWorksheet.Cells[numberRows + 2, 2].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 2, 2].Style.Font.Bold = true;
                    namedWorksheet.Cells[numberRows + 2, 2].Style.Font.Name = "Times New Roman";


                    namedWorksheet.Cells[numberRows + 2, 5].Value = "Người lập bảng";
                    namedWorksheet.Cells[numberRows + 2, 5].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 2, 5].Style.Font.Bold = true;
                    namedWorksheet.Cells[numberRows + 2, 5].Style.Font.Name = "Times New Roman";


                    namedWorksheet.Cells[numberRows + 2, 6].Value = "";


                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystBookByGroupDocumentType
        [HttpGet]
        [Route("AnalystBookByGroupDocumentType")]
        public List<AnalystBookByGroupType> AnalystBookByGroupDocumentType(Guid idDocumentType)
        {
            try
            {
                return _analystRepository.AnalystBookByGroupTypes(idDocumentType);
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystListBorrowByUserTypeAndUnit
        [HttpGet]
        [Route("AnalystListBorrowByUserTypeAndUnit")]
        public List<CustomApiListUserByUnit> AnalystListBorrowByUserTypeAndUnit(Guid idUnit, Guid idUserType,
            string fromDate, string toDate)
        {
            try
            {
                return _analystRepository.CustomApiListUserByUnit(idUnit, idUserType, fromDate, toDate);
            }
            catch (Exception)
            {
                throw;
            }
        }





        // GET: api/Analyst/GetFileExcelAnalystListBorrowLateByUserType 
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowLateByUserType")]
        public IActionResult GetFileExcelAnalystListBorrowLateByUserType(Guid idUserType, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "DanhSachMuonChuaTra.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A5:J2000"].Clear();

                    var countUser = _analystRepository.CustomApiListBorrowLateByUserTypes(idUserType, toDate);

                    var type = _userRepository.getUserType(idUserType);

                    namedWorksheet.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[$"C3:E3"].Merge = true;

                    namedWorksheet.Cells["C3:E3"].Value = "Đến ngày " + toDate;

                    namedWorksheet.Cells[$"A5:J5"].Merge = true;
                    namedWorksheet.Cells[5, 1].Style.Font.Size = 14;
                    namedWorksheet.Cells[5, 1].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[5, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[5, 1].Style.Font.Bold = true;

                    if (type.TypeName == "GiaoVien")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC GIÁO VIÊN";
                    }

                    if (type.TypeName == "HocSinh")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC HỌC SINH";
                    }

                    if (type.TypeName == "NhanVien")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC NHÂN VIÊN";
                    }

                    namedWorksheet.Row(5).Height = 35;

                    int numberRows = 6;
                    for (int i = 0; i < countUser.Count; i++)
                    {
                        namedWorksheet.Row(numberRows).Height = 35;

                        for (int j = 1; j <= 10; j++)
                        {
                            namedWorksheet.Cells[numberRows, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;


                            namedWorksheet.Cells[numberRows, j].Style.Font.Size = 13;
                            namedWorksheet.Cells[numberRows, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRows, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.CenterContinuous;
                        }

                        //namedWorksheet.Cells[numberRows, 2].Style.WrapText = true;
                        //namedWorksheet.Cells[numberRows, 5].Style.WrapText = true;

                        namedWorksheet.Cells[numberRows, 1].Value = i + 1;
                        namedWorksheet.Cells[numberRows, 2].Value = countUser[i].NameUser;
                        namedWorksheet.Cells[numberRows, 3].Value = countUser[i].NameUnit;
                        namedWorksheet.Cells[numberRows, 4].Value = countUser[i].NumIndividual.Split('/')[0];
                        namedWorksheet.Cells[numberRows, 5].Value = countUser[i].NameDocument;
                        namedWorksheet.Cells[numberRows, 6].Value = countUser[i].Author;
                        namedWorksheet.Cells[numberRows, 7].Value = countUser[i].InvoiceCode;
                        namedWorksheet.Cells[numberRows, 8].Value = countUser[i].fromDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRows, 9].Value = countUser[i].toDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRows, 10].Value = countUser[i].NumberDayLate;

                        if (countUser[i].Author == null)
                        {
                            namedWorksheet.Cells[numberRows, 6].Value = " ";
                        }

                        numberRows++;
                    }

                    namedWorksheet.Cells[$"G{numberRows + 5}:J{numberRows + 5}"].Merge = true;
                    namedWorksheet.Cells[$"G{numberRows + 6}:J{numberRows + 6}"].Merge = true;

                    namedWorksheet.Cells[numberRows + 5, 7].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 5, 7].Style.Font.Name = "Times New Roman";

                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Name = "Times New Roman";

                    namedWorksheet.Cells[numberRows + 5, 7].Style.HorizontalAlignment =
                        ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[numberRows + 6, 7].Style.HorizontalAlignment =
                        ExcelHorizontalAlignment.CenterContinuous;

                    namedWorksheet.Cells[numberRows + 5, 7].Value =
                        $"Ngày {DateTime.Now.Day} tháng {DateTime.Now.Month} năm {DateTime.Now.Year}";
                    namedWorksheet.Cells[numberRows + 6, 7].Value = "Cán bộ thư viện";
                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Bold = true;

                    for (int j = 1; j <= 10; j++)
                    {
                        namedWorksheet.Column(j).AutoFit();
                        namedWorksheet.Column(j).Width += 2;
                    }
                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowLateByUserType2")]
        public async Task<IActionResult> GetFileExcelAnalystListBorrowLateByUserType2(Guid idUserType, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "DanhSachMuonChuaTra.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A5:J2000"].Clear();

                    var countUser = _analystRepository.CustomApiListBorrowLateByUserTypes(idUserType, toDate);

                    var type = _userRepository.getUserType(idUserType);

                    namedWorksheet.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[$"C3:E3"].Merge = true;

                    namedWorksheet.Cells["C3:E3"].Value = "Đến ngày " + toDate;

                    namedWorksheet.Cells[$"A5:J5"].Merge = true;
                    namedWorksheet.Cells[5, 1].Style.Font.Size = 14;
                    namedWorksheet.Cells[5, 1].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[5, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[5, 1].Style.Font.Bold = true;

                    if (type.TypeName == "GiaoVien")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC GIÁO VIÊN";
                    }

                    if (type.TypeName == "HocSinh")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC HỌC SINH";
                    }

                    if (type.TypeName == "NhanVien")
                    {
                        namedWorksheet.Cells[5, 1].Value = "BẠN ĐỌC NHÂN VIÊN";
                    }

                    namedWorksheet.Row(5).Height = 35;

                    int numberRows = 6;
                    for (int i = 0; i < countUser.Count; i++)
                    {
                        namedWorksheet.Row(numberRows).Height = 35;

                        for (int j = 1; j <= 10; j++)
                        {
                            namedWorksheet.Cells[numberRows, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRows, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;


                            namedWorksheet.Cells[numberRows, j].Style.Font.Size = 13;
                            namedWorksheet.Cells[numberRows, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRows, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.CenterContinuous;
                        }

                        //namedWorksheet.Cells[numberRows, 2].Style.WrapText = true;
                        //namedWorksheet.Cells[numberRows, 5].Style.WrapText = true;

                        namedWorksheet.Cells[numberRows, 1].Value = i + 1;
                        namedWorksheet.Cells[numberRows, 2].Value = countUser[i].NameUser;
                        namedWorksheet.Cells[numberRows, 3].Value = countUser[i].NameUnit;
                        namedWorksheet.Cells[numberRows, 4].Value = countUser[i].NumIndividual.Split('/')[0];
                        namedWorksheet.Cells[numberRows, 5].Value = countUser[i].NameDocument;
                        namedWorksheet.Cells[numberRows, 6].Value = countUser[i].Author;
                        namedWorksheet.Cells[numberRows, 7].Value = countUser[i].InvoiceCode;
                        namedWorksheet.Cells[numberRows, 8].Value = countUser[i].fromDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRows, 9].Value = countUser[i].toDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRows, 10].Value = countUser[i].NumberDayLate;

                        if (countUser[i].Author == null)
                        {
                            namedWorksheet.Cells[numberRows, 6].Value = " ";
                        }

                        numberRows++;
                    }

                    namedWorksheet.Cells[$"G{numberRows + 5}:J{numberRows + 5}"].Merge = true;
                    namedWorksheet.Cells[$"G{numberRows + 6}:J{numberRows + 6}"].Merge = true;

                    namedWorksheet.Cells[numberRows + 5, 7].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 5, 7].Style.Font.Name = "Times New Roman";

                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Size = 14;
                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Name = "Times New Roman";

                    namedWorksheet.Cells[numberRows + 5, 7].Style.HorizontalAlignment =
                        ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[numberRows + 6, 7].Style.HorizontalAlignment =
                        ExcelHorizontalAlignment.CenterContinuous;

                    namedWorksheet.Cells[numberRows + 5, 7].Value =
                        $"Ngày {DateTime.Now.Day} tháng {DateTime.Now.Month} năm {DateTime.Now.Year}";
                    namedWorksheet.Cells[numberRows + 6, 7].Value = "Cán bộ thư viện";
                    namedWorksheet.Cells[numberRows + 6, 7].Style.Font.Bold = true;

                    for (int j = 1; j <= 10; j++)
                    {
                        namedWorksheet.Column(j).AutoFit();
                        namedWorksheet.Column(j).Width += 2;
                    }
                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                try
                {
                    // Đảm bảo thư mục tồn tại trước khi ghi
                    if (!System.IO.Directory.Exists(directoryPath))
                    {
                        System.IO.Directory.CreateDirectory(directoryPath);
                    }

                    // Ghi file vào đường dẫn
                    System.IO.File.WriteAllBytes(outputPath, fileBytes);
                    Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                    Console.WriteLine(ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                }

                var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                var account = new Account(
                    "dvgdcqn5g",
                    "621798912237287",
                    "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                );

                var cloudinary = new Cloudinary(account);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(docxFilePath),
                    PublicId = Guid.NewGuid().ToString(),
                    Folder = "word"
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);


                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new
                    {
                        Success = true,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                else
                {
                    return Ok(new
                    {
                        Success = false,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetListBorrowLateByUserType
        [HttpGet]
        [Route("GetListBorrowLateByUserType")]
        public List<CustomApiListBorrowLateByUserType> GetListBorrowLateByUserType(Guid idUserType, string toDate)
        {
            try
            {
                return _analystRepository.CustomApiListBorrowLateByUserTypes(idUserType, toDate);
            }
            catch (Exception)
            {
                throw;
            }
        }



        // GET: api/Analyst/GetFileExcelAnalystListBorrowByUserTypeDetail
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowByUserTypeDetail")]
        public IActionResult GetFileExcelAnalystListBorrowByUserTypeDetail(Guid idUnit, Guid idUser, string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "DanhSachMuonChiTiet.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A52:K2000"].Clear();

                    var listBorrow = _analystRepository.CustomApiListBorrowByUserTypesDetails(idUnit, idUser, fromDate, toDate);
                    if (listBorrow == null)
                    {
                        return BadRequest("Có lỗi khi lấy list!");
                    }
                    else if (listBorrow.listBorrowByUserIds.Count <= 0)
                    {
                        return BadRequest("List không có gì hết!");
                    }

                    namedWorksheet.Cells[$"A3:K3"].Merge = true;
                    namedWorksheet.Cells[3, 1].Style.Font.Size = 13;
                    namedWorksheet.Cells[3, 1].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[3, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[3, 1].Style.Font.Bold = true;


                    namedWorksheet.Cells[3, 1].Value = $"THƯ VIỆN " + _appSettingModel.SchoolName;

                    //namedWorksheet.Cells[$"A16:K19"].Merge = true;
                    //namedWorksheet.Cells[16, 2].Style.Font.Size = 40;
                    //namedWorksheet.Cells[16, 2].Style.Font.Name = "Times New Roman";
                    //namedWorksheet.Cells[16, 2].Style.Font.Bold = true;
                    //namedWorksheet.Cells[16, 2].Value = "SỔ MƯỢN SÁCH";


                    namedWorksheet.Cells[$"A20:K22"].Merge = true;
                    namedWorksheet.Cells[20, 2].Style.Font.Size = 40;
                    namedWorksheet.Cells[20, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[20, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[20, 2].Style.Font.Bold = true;

                    UserDTO userDto = _userRepository.getUserByID(idUser);
                    if (userDto != null)
                    {
                        UserType userType = _userRepository.getUserType(userDto.UserTypeId);
                        if (userType.TypeName == "HocSinh" && userType != null)
                        {
                            namedWorksheet.Cells[20, 2].Value = "CỦA HỌC SINH";
                        }
                        else namedWorksheet.Cells[20, 2].Value = "CỦA GIÁO VIÊN";
                    }
                    else
                    {
                        namedWorksheet.Cells[20, 2].Value = "CỦA HỌC SINH";
                    }

                    namedWorksheet.Cells[$"A23:K23"].Merge = true;
                    namedWorksheet.Cells[23, 2].Style.Font.Size = 20;
                    namedWorksheet.Cells[23, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[23, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[23, 2].Style.Font.Bold = true;

                    SchoolYearDto schoolYearDto = _schoolYearRepository.getSchoolYear();
                    if (schoolYearDto != null)
                    {
                        namedWorksheet.Cells[23, 2].Value =
                            $"NĂM HỌC: {schoolYearDto.FromYear.Value.ToString("yyyy")} - {schoolYearDto.ToYear.Value.ToString("yyyy")}";
                    }
                    else
                    {
                        namedWorksheet.Cells[23, 2].Value = $"NĂM HỌC: {DateTime.Now.Year} - {DateTime.Now.Year + 1}";
                    }

                    //namedWorksheet.Cells[$"A45:K23"].Style.Font.Name = "Times New Roman";
                    //namedWorksheet.Cells[$"A45:K23"].Style.Font.Bold = true;
                    //namedWorksheet.Cells[$"A45:K23"].Style.Font.Size = 16;

                    int tenp = 47;
                    for (int i = 1; i < 4; i++)
                    {
                        namedWorksheet.Cells[$"A{tenp}:E{tenp}"].Merge = true;
                        namedWorksheet.Cells[tenp, 1].Style.Font.Size = 14;
                        namedWorksheet.Cells[tenp, 1].Style.Font.Name = "Times New Roman";
                        tenp++;
                    }

                    namedWorksheet.Cells[47, 1].Value = "Họ và tên: " + listBorrow.NameUser;
                    namedWorksheet.Cells[48, 1].Value = "Phòng ban: " + listBorrow.NameUnit;
                    namedWorksheet.Cells[49, 1].Value = "Địa chỉ: " + listBorrow.Address;
                    namedWorksheet.Cells[50, 1].Style.WrapText = true;


                    int numberRow = 52;
                    for (int i = 0; i < listBorrow.listBorrowByUserIds.Count; i++)
                    {
                        namedWorksheet.Row(numberRow).Height = 35;
                        for (int j = 1; j <= 11; j++)
                        {
                            namedWorksheet.Cells[numberRow, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Font.Size = 13;
                            namedWorksheet.Cells[numberRow, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRow, j].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                        }

                        namedWorksheet.Cells[numberRow, 2].Style.WrapText = true;
                        namedWorksheet.Cells[numberRow, 3].Style.WrapText = true;
                        namedWorksheet.Cells[numberRow, 10].Style.WrapText = true;
                        namedWorksheet.Cells[numberRow, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                        namedWorksheet.Cells[numberRow, 1].Value = i + 1;
                        namedWorksheet.Cells[numberRow, 2].Value = listBorrow.NameUser;
                        namedWorksheet.Cells[numberRow, 3].Value = listBorrow.listBorrowByUserIds[i].NameDocument;
                        namedWorksheet.Cells[numberRow, 5].Value = listBorrow.listBorrowByUserIds[i].NumIndividual.Split('/')[0];
                        namedWorksheet.Cells[numberRow, 6].Value = listBorrow.listBorrowByUserIds[i].FromDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 7].Value = "";
                        namedWorksheet.Cells[numberRow, 8].Value = listBorrow.listBorrowByUserIds[i].ToDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 9].Value = "";
                        namedWorksheet.Cells[numberRow, 10].Value = listBorrow.listBorrowByUserIds[i].MessageDayLate;
                        namedWorksheet.Cells[numberRow, 11].Value = "";
                        numberRow++;
                    }


                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetFileExcelAnalystListBorrowByUserType
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowByUserType")]
        public IActionResult GetFileExcelAnalystListBorrowByUserType(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            if (fromDate == null || toDate == null)
            {
                return BadRequest("Vui lòng chọn thời gian cần để báo cáo");
            }
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "DanhSachMuonTheoPhongBan.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A51:K20000"].Clear();

                    var countUser = _analystRepository.CustomApiListUserByUnit(idUnit, idUserType, fromDate, toDate);

                    namedWorksheet.Cells[$"A3:I3"].Merge = true;
                    namedWorksheet.Cells[3, 1].Style.Font.Size = 13;
                    namedWorksheet.Cells[3, 1].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[3, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[3, 1].Style.Font.Bold = true;

                    var ruleDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2);
                    if (ruleDto != null)
                    {
                        namedWorksheet.Cells[3, 1].Value = $"THƯ VIỆN {ruleDto[0].col10.ToUpper()}";
                    }
                    else
                    {
                        namedWorksheet.Cells[3, 1].Value = $"THƯ VIỆN TRƯỜNG ...";
                    }

                    namedWorksheet.Cells[$"B20:I22"].Merge = true;
                    namedWorksheet.Cells[20, 2].Style.Font.Size = 40;
                    namedWorksheet.Cells[20, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[20, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[20, 2].Style.Font.Bold = true;

                    var userType = _userRepository.getUserType(idUserType);
                    namedWorksheet.Cells[20, 2].Value = "";
                    if (userType != null)
                    {
                        if (userType.TypeName == "HocSinh")
                        {
                            namedWorksheet.Cells[20, 2].Value = "CỦA HỌC SINH";
                        }
                        else namedWorksheet.Cells[20, 2].Value = "CỦA GIÁO VIÊN";
                    }

                    namedWorksheet.Cells[$"B23:I23"].Merge = true;
                    namedWorksheet.Cells[23, 2].Style.Font.Size = 20;
                    namedWorksheet.Cells[23, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[23, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[23, 2].Style.Font.Bold = true;

                    var schoolYearDto = _schoolYearRepository.getSchoolYear();
                    if (schoolYearDto != null)
                    {
                        string year = schoolYearDto.FromYear.Value.ToString("yyyy");
                        namedWorksheet.Cells[23, 2].Value =
                            $"NĂM HỌC: {schoolYearDto.FromYear.Value.ToString("yyyy")} - {schoolYearDto.ToYear.Value.ToString("yyyy")}";
                    }
                    else
                    {
                        namedWorksheet.Cells[23, 2].Value = $"NĂM HỌC: {DateTime.Now.Year} - {DateTime.Now.Year + 1}";
                    }

                    var unit = _userRepository.getUnit(idUnit);
                    namedWorksheet.Cells[48, 1].Value = "Tất cả";
                    if (unit != null)
                    {
                        namedWorksheet.Cells[$"A48:K48"].Merge = true;
                        namedWorksheet.Cells[48, 1].Style.Font.Size = 14;
                        namedWorksheet.Cells[48, 1].Style.Font.Name = "Times New Roman";
                        namedWorksheet.Cells[48, 1].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.CenterContinuous;
                        namedWorksheet.Cells[48, 1].Style.Font.Bold = true;

                        namedWorksheet.Cells[48, 1].Value = unit.UnitName;
                    }

                    int numberRow = 51;
                    for (int i = 0; i < countUser.Count; i++)
                    {
                        namedWorksheet.Row(numberRow).Height = 35;
                        for (int j = 1; j <= 11; j++)
                        {
                            // Kẻ viền trên và dưới cho tất cả các cột
                            namedWorksheet.Cells[numberRow, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                            if (j == 3) // Cột 3: Không kẻ viền bên phải
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.None; // Không kẻ viền bên phải
                            }
                            else if (j == 4) // Cột 4: Không kẻ viền bên trái
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.None; // Không kẻ viền bên trái
                            }
                            else // Các cột khác: Kẻ viền đầy đủ
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            }


                            namedWorksheet.Cells[numberRow, j].Style.Font.Size = 14;
                            namedWorksheet.Cells[numberRow, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRow, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.CenterContinuous;
                        }

                        //namedWorksheet.Cells[numberRow, 2].Style.WrapText = true;
                        //namedWorksheet.Cells[numberRow, 3].Style.WrapText = true;
                        // Gộp ô của cột 3 và cột 4 tại hàng numberRow
                        var range = namedWorksheet.Cells[numberRow, 3, numberRow, 4]; // Dải ô: từ cột 3 đến cột 4 trên cùng hàng
                        range.Merge = true; // Gộp ô
                        range.Style.WrapText = true;

                        // Đặt giá trị cho ô đã gộp
                        range.Value = countUser[i].NameDocument;
                        //namedWorksheet.Cells[numberRow, 10].Style.WrapText = true;
                        namedWorksheet.Cells[numberRow, 10].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.Left;

                        namedWorksheet.Cells[numberRow, 1].Value = i + 1;
                        namedWorksheet.Cells[numberRow, 2].Value = countUser[i].NameUser;
                        //namedWorksheet.Cells[numberRow, 3].Value = countUser[i].NameDocument;
                        namedWorksheet.Cells[numberRow, 5].Value = countUser[i].NumIndividual.Split('/')[0];
                        namedWorksheet.Cells[numberRow, 6].Value = countUser[i].fromDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 7].Value = "";
                        namedWorksheet.Cells[numberRow, 8].Value = countUser[i].toDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 9].Value = "";

                        if (countUser[i].IsComplete == true)
                        {
                            if (countUser[i].NumberDayLate == 0)
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đã trả (đúng hạn)";
                            }
                            else
                            {
                                if (countUser[i].NumberDayLate < 0)
                                {
                                    namedWorksheet.Cells[numberRow, 10].Value = "Đã trả trước hạn " + Math.Abs(countUser[i].NumberDayLate) + " ngày";
                                }
                                else
                                {
                                    namedWorksheet.Cells[numberRow, 10].Value = "Đã trả trễ hạn " + countUser[i].NumberDayLate + " ngày";

                                }
                            }

                        }
                        else
                        {
                            TimeSpan difference = DateTime.Now.Date.Subtract(countUser[i].toDate.Date);
                            //namedWorksheet.Cells[numberRow, 10].Value =  difference.Days;
                            if (difference.Days <= 0)
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đang mượn";
                            }
                            else
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đang mượn trễ hạn " + difference.Days + " ngày";
                            }
                        }
                        namedWorksheet.Cells[numberRow, 10].Value = countUser[i].MessageDayLate;
                        // namedWorksheet.Cells[numberRow, 10].Value = countUser[i].DateInReality.ToString();
                        namedWorksheet.Cells[numberRow, 11].Value = "";


                        numberRow++;
                    }
                    for (int j = 1; j <= 11; j++)
                    {
                        namedWorksheet.Column(j).AutoFit();
                        namedWorksheet.Column(j).Width += 2;
                    }
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowByUserType2")]
        public async Task<IActionResult> GetFileExcelAnalystListBorrowByUserType2(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            if (fromDate == null || toDate == null)
            {
                return BadRequest("Vui lòng chọn thời gian cần để báo cáo");
            }
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "DanhSachMuonTheoPhongBan.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet.Cells["A51:K20000"].Clear();

                    var countUser = _analystRepository.CustomApiListUserByUnit(idUnit, idUserType, fromDate, toDate);

                    namedWorksheet.Cells[$"A3:I3"].Merge = true;
                    namedWorksheet.Cells[3, 1].Style.Font.Size = 13;
                    namedWorksheet.Cells[3, 1].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[3, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[3, 1].Style.Font.Bold = true;

                    var ruleDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2);
                    if (ruleDto != null)
                    {
                        namedWorksheet.Cells[3, 1].Value = $"THƯ VIỆN {ruleDto[0].col10.ToUpper()}";
                    }
                    else
                    {
                        namedWorksheet.Cells[3, 1].Value = $"THƯ VIỆN TRƯỜNG ...";
                    }

                    namedWorksheet.Cells[$"B20:I22"].Merge = true;
                    namedWorksheet.Cells[20, 2].Style.Font.Size = 40;
                    namedWorksheet.Cells[20, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[20, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[20, 2].Style.Font.Bold = true;

                    var userType = _userRepository.getUserType(idUserType);
                    namedWorksheet.Cells[20, 2].Value = "";
                    if (userType != null)
                    {
                        if (userType.TypeName == "HocSinh")
                        {
                            namedWorksheet.Cells[20, 2].Value = "CỦA HỌC SINH";
                        }
                        else namedWorksheet.Cells[20, 2].Value = "CỦA GIÁO VIÊN";
                    }

                    namedWorksheet.Cells[$"B23:I23"].Merge = true;
                    namedWorksheet.Cells[23, 2].Style.Font.Size = 20;
                    namedWorksheet.Cells[23, 2].Style.Font.Name = "Times New Roman";
                    namedWorksheet.Cells[23, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;
                    namedWorksheet.Cells[23, 2].Style.Font.Bold = true;

                    var schoolYearDto = _schoolYearRepository.getSchoolYear();
                    if (schoolYearDto != null)
                    {
                        string year = schoolYearDto.FromYear.Value.ToString("yyyy");
                        namedWorksheet.Cells[23, 2].Value =
                            $"NĂM HỌC: {schoolYearDto.FromYear.Value.ToString("yyyy")} - {schoolYearDto.ToYear.Value.ToString("yyyy")}";
                    }
                    else
                    {
                        namedWorksheet.Cells[23, 2].Value = $"NĂM HỌC: {DateTime.Now.Year} - {DateTime.Now.Year + 1}";
                    }

                    var unit = _userRepository.getUnit(idUnit);
                    namedWorksheet.Cells[48, 1].Value = "Tất cả";
                    if (unit != null)
                    {
                        namedWorksheet.Cells[$"A48:K48"].Merge = true;
                        namedWorksheet.Cells[48, 1].Style.Font.Size = 14;
                        namedWorksheet.Cells[48, 1].Style.Font.Name = "Times New Roman";
                        namedWorksheet.Cells[48, 1].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.CenterContinuous;
                        namedWorksheet.Cells[48, 1].Style.Font.Bold = true;

                        namedWorksheet.Cells[48, 1].Value = unit.UnitName;
                    }

                    int numberRow = 51;
                    for (int i = 0; i < countUser.Count; i++)
                    {
                        namedWorksheet.Row(numberRow).Height = 35;
                        for (int j = 1; j <= 11; j++)
                        {
                            // Kẻ viền trên và dưới cho tất cả các cột
                            namedWorksheet.Cells[numberRow, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet.Cells[numberRow, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                            if (j == 3) // Cột 3: Không kẻ viền bên phải
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.None; // Không kẻ viền bên phải
                            }
                            else if (j == 4) // Cột 4: Không kẻ viền bên trái
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.None; // Không kẻ viền bên trái
                            }
                            else // Các cột khác: Kẻ viền đầy đủ
                            {
                                namedWorksheet.Cells[numberRow, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[numberRow, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            }


                            namedWorksheet.Cells[numberRow, j].Style.Font.Size = 14;
                            namedWorksheet.Cells[numberRow, j].Style.Font.Name = "Times New Roman";
                            namedWorksheet.Cells[numberRow, j].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.CenterContinuous;
                        }

                        //namedWorksheet.Cells[numberRow, 2].Style.WrapText = true;
                        //namedWorksheet.Cells[numberRow, 3].Style.WrapText = true;
                        // Gộp ô của cột 3 và cột 4 tại hàng numberRow
                        var range = namedWorksheet.Cells[numberRow, 3, numberRow, 4]; // Dải ô: từ cột 3 đến cột 4 trên cùng hàng
                        range.Merge = true; // Gộp ô
                        range.Style.WrapText = true;

                        // Đặt giá trị cho ô đã gộp
                        range.Value = countUser[i].NameDocument;
                        //namedWorksheet.Cells[numberRow, 10].Style.WrapText = true;
                        namedWorksheet.Cells[numberRow, 10].Style.HorizontalAlignment =
                                ExcelHorizontalAlignment.Left;

                        namedWorksheet.Cells[numberRow, 1].Value = i + 1;
                        namedWorksheet.Cells[numberRow, 2].Value = countUser[i].NameUser;
                        //namedWorksheet.Cells[numberRow, 3].Value = countUser[i].NameDocument;
                        namedWorksheet.Cells[numberRow, 5].Value = countUser[i].NumIndividual.Split('/')[0];
                        namedWorksheet.Cells[numberRow, 6].Value = countUser[i].fromDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 7].Value = "";
                        namedWorksheet.Cells[numberRow, 8].Value = countUser[i].toDate.ToString("dd/MM/yyyy");
                        namedWorksheet.Cells[numberRow, 9].Value = "";

                        if (countUser[i].IsComplete == true)
                        {
                            if (countUser[i].NumberDayLate == 0)
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đã trả (đúng hạn)";
                            }
                            else
                            {
                                if (countUser[i].NumberDayLate < 0)
                                {
                                    namedWorksheet.Cells[numberRow, 10].Value = "Đã trả trước hạn " + Math.Abs(countUser[i].NumberDayLate) + " ngày";
                                }
                                else
                                {
                                    namedWorksheet.Cells[numberRow, 10].Value = "Đã trả trễ hạn " + countUser[i].NumberDayLate + " ngày";

                                }
                            }

                        }
                        else
                        {
                            TimeSpan difference = DateTime.Now.Date.Subtract(countUser[i].toDate.Date);
                            //namedWorksheet.Cells[numberRow, 10].Value =  difference.Days;
                            if (difference.Days <= 0)
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đang mượn";
                            }
                            else
                            {
                                namedWorksheet.Cells[numberRow, 10].Value = "Đang mượn trễ hạn " + difference.Days + " ngày";
                            }
                        }
                        namedWorksheet.Cells[numberRow, 10].Value = countUser[i].MessageDayLate;
                        // namedWorksheet.Cells[numberRow, 10].Value = countUser[i].DateInReality.ToString();
                        namedWorksheet.Cells[numberRow, 11].Value = "";


                        numberRow++;
                    }
                    for (int j = 1; j <= 11; j++)
                    {
                        namedWorksheet.Column(j).AutoFit();
                        namedWorksheet.Column(j).Width += 2;
                    }
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }


                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                try
                {
                    // Đảm bảo thư mục tồn tại trước khi ghi
                    if (!System.IO.Directory.Exists(directoryPath))
                    {
                        System.IO.Directory.CreateDirectory(directoryPath);
                    }

                    // Ghi file vào đường dẫn
                    System.IO.File.WriteAllBytes(outputPath, fileBytes);
                    Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                    Console.WriteLine(ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                }

                var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                var account = new Account(
                    "dvgdcqn5g",
                    "621798912237287",
                    "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                );

                var cloudinary = new Cloudinary(account);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(docxFilePath),
                    PublicId = Guid.NewGuid().ToString(),
                    Folder = "word"
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);


                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new
                    {
                        Success = true,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                else
                {
                    return Ok(new
                    {
                        Success = false,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystListBorrowByUserTypeDetail
        [HttpGet]
        [Route("AnalystListBorrowByUserTypeDetail")]
        public CustomApiListBorrowByUserTypeDetail AnalystListBorrowByUserTypeDetail(Guid idUnit, Guid idUser, string fromDate, string toDate)
        {
            try
            {
                CustomApiListBorrowByUserTypeDetail listBorrow = new CustomApiListBorrowByUserTypeDetail();
                listBorrow = _analystRepository.CustomApiListBorrowByUserTypesDetail(idUnit, idUser, fromDate, toDate);
                return listBorrow;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystListBorrowByUserType
        [HttpGet]
        [Route("AnalystListBorrowByUserType")]
        public List<CustomApiListBorrowByUserType> AnalystListBorrowByUserType(Guid idUnit, Guid idUserType, string fromDate, string toDate)
        {
            try
            {
                List<CustomApiListBorrowByUserType> listBorrow = new List<CustomApiListBorrowByUserType>();
                listBorrow = _analystRepository.CustomApiListBorrowByUserTypes(idUnit, idUserType, fromDate, toDate);
                return listBorrow;
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetAllCategorySign
        [HttpGet]
        [Route("GetNumberUserByType")]
        public List<CustomApiCountUserByUserType> GetNumberUserByType()
        {
            try
            {
                List<CustomApiCountUserByUserType> countUser = new List<CustomApiCountUserByUserType>();
                countUser = _analystRepository.CountUserByType();
                return countUser;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/GetDocumentByType
        [HttpGet]
        [Route("GetDocumentByType")]
        public List<CustomApiCountDocumentByType> GetDocumentByType()
        {
            try
            {
                List<CustomApiCountDocumentByType> countDoc = new List<CustomApiCountDocumentByType>();
                countDoc = _analystRepository.CountDocumentByType();
                return countDoc;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystUserAndBook
        [HttpGet]
        [Route("AnalystUserAndBook")]
        public CustomApiAnalystUserAndBook AnalystUserAndBook()
        {
            try
            {
                CustomApiAnalystUserAndBook customApiAnalystUserAndBook = new CustomApiAnalystUserAndBook();
                customApiAnalystUserAndBook = _analystRepository.AnalystUserAndBook();
                return customApiAnalystUserAndBook;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystBorrowBookByType
        [HttpGet]
        [Route("AnalystBorrowBookByType")]
        public List<CustomApiBorrowByUserType> AnalystBorrowBookByType(string fromDate, string toDate)
        {
            try
            {
                List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                customApiBorrowByUserTypes = _analystRepository.CustomApiBorrowByUserTypes(fromDate, toDate);
                return customApiBorrowByUserTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/AnalystBookByDocumentType
        [HttpGet]
        [Route("AnalystBookByDocumentType")]
        public IEnumerable<CustomApiAnalystBookByType> AnalystBookByDocumentType(Guid idDocument)
        {
            try
            {
                return _analystRepository.CustomApiAnalystBookByTypes(idDocument);
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/GetExceLAnalystBorowByUserType
        [HttpGet]
        [Route("GetExceLAnalystBorowByUserType")]
        public IActionResult GetExceLAnalystBorowByUserType(string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\",
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                    customApiBorrowByUserTypes =
                        _analystRepository.CustomApiBorrowByUserTypes("NotLate", fromDate, toDate);

                    for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                    {
                        if (i == 0)
                        {
                            namedWorksheet.Cells[2, 2].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 2].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else if (i == 1)
                        {
                            namedWorksheet.Cells[2, 3].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 3].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else
                        {
                            namedWorksheet.Cells[2, 4].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 4].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                    }

                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetExceLAnalystBorowByUserType2")]
        public async Task<IActionResult> GetExceLAnalystBorowByUserType2(string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\",
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                    customApiBorrowByUserTypes =
                        _analystRepository.CustomApiBorrowByUserTypes("NotLate", fromDate, toDate);

                    for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                    {
                        if (i == 0)
                        {
                            namedWorksheet.Cells[2, 2].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 2].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else if (i == 1)
                        {
                            namedWorksheet.Cells[2, 3].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 3].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else
                        {
                            namedWorksheet.Cells[2, 4].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 4].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                    }

                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                try
                {
                    // Đảm bảo thư mục tồn tại trước khi ghi
                    if (!System.IO.Directory.Exists(directoryPath))
                    {
                        System.IO.Directory.CreateDirectory(directoryPath);
                    }

                    // Ghi file vào đường dẫn
                    System.IO.File.WriteAllBytes(outputPath, fileBytes);
                    Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                    Console.WriteLine(ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                }

                var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                var account = new Account(
                    "dvgdcqn5g",
                    "621798912237287",
                    "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                );

                var cloudinary = new Cloudinary(account);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(docxFilePath),
                    PublicId = Guid.NewGuid().ToString(),
                    Folder = "word"
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);


                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new
                    {
                        Success = true,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                else
                {
                    return Ok(new
                    {
                        Success = false,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }


            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/Analyst/GetExceLAnalystByDocumentType
        [HttpGet]
        [Route("GetExceLAnalystByDocumentType")]
        public IActionResult GetExceLAnalystByDocumentType(Guid idDocumentType)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_BaoCaoThongKeSachTheoLoai.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    int rowCount = namedWorksheet.Dimension.Rows;
                    namedWorksheet.Cells["A3:Q1000"].Clear();

                    namedWorksheet.Cells[1, 1].Value = "THỐNG KÊ SÁCH THEO LOẠI";

                    var datas = _analystRepository.AnalystBookByGroupTypes(idDocumentType);

                    int startRow = 3;
                    int numberOfRecords = 0;
                    int remainBooks = 0;
                    int borrowed = 0;
                    int losted = 0;
                    long totalMoneys = 0;
                    for (int i = 0; i < datas.Count; i++)
                    {
                        namedWorksheet.Cells[$"A{startRow}:Q{startRow}"].Merge = true;
                        namedWorksheet.Cells[startRow, 1].Value = datas[i].NameDocmentType;
                        namedWorksheet.Row(startRow).Height = 35;
                        namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;

                        for (int j = 0; j < datas[i].DataAnalystBooks.Count; j++)
                        {
                            numberOfRecords += datas[i].DataAnalystBooks[j].TotalDocument;
                            remainBooks += datas[i].DataAnalystBooks[j].RemainDocument;
                            borrowed += datas[i].DataAnalystBooks[j].BorrowedDocument;
                            losted += datas[i].DataAnalystBooks[j].LostDocument;
                            //var individualPrice = datas[i].DataAnalystBooks[j].individual.Count > 0
                            //        ? datas[i].DataAnalystBooks[j].individual[0].Price
                            //        : datas[i].DataAnalystBooks[j].document?.Price;
                            totalMoneys += datas[i].DataAnalystBooks[j].document?.Price is null
                                ? 0
                                : (long)datas[i].DataAnalystBooks[j].document?.Price;
                            ;

                            startRow++;
                            for (int k = 1; k < 18; k++)
                            {
                                namedWorksheet.Cells[startRow, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            }

                            namedWorksheet.Cells[startRow, 1].Value = datas[i].DataAnalystBooks[j].document.DocName;
                            namedWorksheet.Cells[startRow, 2].Value = datas[i].DataAnalystBooks[j].document.CreatedDate
                                ?.ToString("dd/MM/yyyy");
                            namedWorksheet.Cells[startRow, 3].Value = datas[i].DataAnalystBooks[j].TotalDocument;
                            namedWorksheet.Cells[startRow, 4].Value = datas[i].DataAnalystBooks[j].RemainDocument;
                            namedWorksheet.Cells[startRow, 5].Value = datas[i].DataAnalystBooks[j].BorrowedDocument;
                            namedWorksheet.Cells[startRow, 6].Value = datas[i].DataAnalystBooks[j].LostDocument;
                            var isHavePhy = datas[i].DataAnalystBooks[j].document.IsHavePhysicalVersion;
                            if (isHavePhy == true)
                            {
                                namedWorksheet.Cells[startRow, 7].Value = "Có";
                            }
                            else if (isHavePhy == false || isHavePhy == null)
                            {
                                namedWorksheet.Cells[startRow, 7].Value = "Không";
                            }

                            namedWorksheet.Cells[startRow, 8].Value =
                                datas[i].DataAnalystBooks[j].document.Language ?? "";
                            namedWorksheet.Cells[startRow, 9].Value =
                                datas[i].DataAnalystBooks[j].document.Publisher ?? "";
                            namedWorksheet.Cells[startRow, 10].Value = datas[i].DataAnalystBooks[j].document.PublishYear
                                ?.ToString("dd/MM/yyyy");
                            namedWorksheet.Cells[startRow, 11].Value = datas[i].DataAnalystBooks[j].document.NumberView;
                            namedWorksheet.Cells[startRow, 12].Value = datas[i].DataAnalystBooks[j].document.NumberLike;
                            namedWorksheet.Cells[startRow, 13].Value =
                                datas[i].DataAnalystBooks[j].document.NumberUnlike;

                            if (datas[i].DataAnalystBooks[j].document.ModifiedDate != null)
                            {
                                namedWorksheet.Cells[startRow, 14].Value = datas[i].DataAnalystBooks[j].document
                                    .ModifiedDate?.ToString("dd/MM/yyyy");
                            }
                            else
                            {
                                namedWorksheet.Cells[startRow, 14].Value = " ";
                            }

                            namedWorksheet.Cells[startRow, 15].Value =
                                datas[i].DataAnalystBooks[j].document.Author ?? "";
                            namedWorksheet.Cells[startRow, 16].Value =
                                datas[i].DataAnalystBooks[j].document.Description ?? "";

                            var x = datas[i].DataAnalystBooks[j].individual;
                            //var individualPrice = datas[i].DataAnalystBooks[j].individual.Count > 0
                            //       ? datas[i].DataAnalystBooks[j].individual[0].Price
                            //       : datas[i].DataAnalystBooks[j].document?.Price;

                            namedWorksheet.Cells[startRow, 17].Value = datas[i].DataAnalystBooks[j].document?.Price?.ToString("C0", new CultureInfo("vi-VN"));

                            namedWorksheet.Cells[startRow, 18].Value = "";
                        }

                        startRow++;
                    }

                    for (int k = 1; k < 18; k++)
                    {
                        namedWorksheet.Cells[startRow, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    }

                    namedWorksheet.Cells[$"A{startRow}:B{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 1].Value = "Tổng ";
                    namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;
                    namedWorksheet.Cells[startRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    namedWorksheet.Cells[startRow, 3].Value = numberOfRecords;
                    namedWorksheet.Cells[startRow, 4].Value = remainBooks;
                    namedWorksheet.Cells[startRow, 5].Value = borrowed;
                    namedWorksheet.Cells[startRow, 6].Value = losted;
                    namedWorksheet.Cells[$"G{startRow}:P{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 17].Value = totalMoneys.ToString("C0", new CultureInfo("vi-VN"));
                    namedWorksheet.Cells[startRow, 18].Value = "";

                    for (int i = 1; i <= 18; i++)
                    {
                        namedWorksheet.Column(i).AutoFit();
                        namedWorksheet.Column(i).Width += 2;
                    }
                    //namedWorksheet.Row(startRow).Height = 35;

                    //overwrite to file old
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mau_BaoCaoThongKeSachTheoLoai.xlsx");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetExceLAnalystByDocumentType2")]
        public async Task<IActionResult> GetExceLAnalystByDocumentType2(Guid idDocumentType)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_BaoCaoThongKeSachTheoLoai.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    int rowCount = namedWorksheet.Dimension.Rows;
                    namedWorksheet.Cells["A3:Q1000"].Clear();

                    namedWorksheet.Cells[1, 1].Value = "THỐNG KÊ SÁCH THEO LOẠI";

                    var datas = _analystRepository.AnalystBookByGroupTypes(idDocumentType);

                    int startRow = 3;
                    int numberOfRecords = 0;
                    int remainBooks = 0;
                    int borrowed = 0;
                    int losted = 0;
                    long totalMoneys = 0;
                    for (int i = 0; i < datas.Count; i++)
                    {
                        namedWorksheet.Cells[$"A{startRow}:Q{startRow}"].Merge = true;
                        namedWorksheet.Cells[startRow, 1].Value = datas[i].NameDocmentType;
                        namedWorksheet.Row(startRow).Height = 35;
                        namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;

                        for (int j = 0; j < datas[i].DataAnalystBooks.Count; j++)
                        {
                            numberOfRecords += datas[i].DataAnalystBooks[j].TotalDocument;
                            remainBooks += datas[i].DataAnalystBooks[j].RemainDocument;
                            borrowed += datas[i].DataAnalystBooks[j].BorrowedDocument;
                            losted += datas[i].DataAnalystBooks[j].LostDocument;
                            //var individualPrice = datas[i].DataAnalystBooks[j].individual.Count > 0
                            //        ? datas[i].DataAnalystBooks[j].individual[0].Price
                            //        : datas[i].DataAnalystBooks[j].document?.Price;
                            totalMoneys += datas[i].DataAnalystBooks[j].document?.Price is null
                                ? 0
                                : (long)datas[i].DataAnalystBooks[j].document?.Price;
                            ;

                            startRow++;
                            for (int k = 1; k < 18; k++)
                            {
                                namedWorksheet.Cells[startRow, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                namedWorksheet.Cells[startRow, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            }

                            namedWorksheet.Cells[startRow, 1].Value = datas[i].DataAnalystBooks[j].document.DocName;
                            namedWorksheet.Cells[startRow, 2].Value = datas[i].DataAnalystBooks[j].document.CreatedDate
                                ?.ToString("dd/MM/yyyy");
                            namedWorksheet.Cells[startRow, 3].Value = datas[i].DataAnalystBooks[j].TotalDocument;
                            namedWorksheet.Cells[startRow, 4].Value = datas[i].DataAnalystBooks[j].RemainDocument;
                            namedWorksheet.Cells[startRow, 5].Value = datas[i].DataAnalystBooks[j].BorrowedDocument;
                            namedWorksheet.Cells[startRow, 6].Value = datas[i].DataAnalystBooks[j].LostDocument;
                            var isHavePhy = datas[i].DataAnalystBooks[j].document.IsHavePhysicalVersion;
                            if (isHavePhy == true)
                            {
                                namedWorksheet.Cells[startRow, 7].Value = "Có";
                            }
                            else if (isHavePhy == false || isHavePhy == null)
                            {
                                namedWorksheet.Cells[startRow, 7].Value = "Không";
                            }

                            namedWorksheet.Cells[startRow, 8].Value =
                                datas[i].DataAnalystBooks[j].document.Language ?? "";
                            namedWorksheet.Cells[startRow, 9].Value =
                                datas[i].DataAnalystBooks[j].document.Publisher ?? "";
                            namedWorksheet.Cells[startRow, 10].Value = datas[i].DataAnalystBooks[j].document.PublishYear
                                ?.ToString("dd/MM/yyyy");
                            namedWorksheet.Cells[startRow, 11].Value = datas[i].DataAnalystBooks[j].document.NumberView;
                            namedWorksheet.Cells[startRow, 12].Value = datas[i].DataAnalystBooks[j].document.NumberLike;
                            namedWorksheet.Cells[startRow, 13].Value =
                                datas[i].DataAnalystBooks[j].document.NumberUnlike;

                            if (datas[i].DataAnalystBooks[j].document.ModifiedDate != null)
                            {
                                namedWorksheet.Cells[startRow, 14].Value = datas[i].DataAnalystBooks[j].document
                                    .ModifiedDate?.ToString("dd/MM/yyyy");
                            }
                            else
                            {
                                namedWorksheet.Cells[startRow, 14].Value = " ";
                            }

                            namedWorksheet.Cells[startRow, 15].Value =
                                datas[i].DataAnalystBooks[j].document.Author ?? "";
                            namedWorksheet.Cells[startRow, 16].Value =
                                datas[i].DataAnalystBooks[j].document.Description ?? "";

                            var x = datas[i].DataAnalystBooks[j].individual;
                            //var individualPrice = datas[i].DataAnalystBooks[j].individual.Count > 0
                            //       ? datas[i].DataAnalystBooks[j].individual[0].Price
                            //       : datas[i].DataAnalystBooks[j].document?.Price;

                            namedWorksheet.Cells[startRow, 17].Value = datas[i].DataAnalystBooks[j].document?.Price?.ToString("C0", new CultureInfo("vi-VN"));

                            namedWorksheet.Cells[startRow, 18].Value = "";
                        }

                        startRow++;
                    }

                    for (int k = 1; k < 18; k++)
                    {
                        namedWorksheet.Cells[startRow, k].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        namedWorksheet.Cells[startRow, k].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    }

                    namedWorksheet.Cells[$"A{startRow}:B{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 1].Value = "Tổng ";
                    namedWorksheet.Cells[startRow, 1].Style.Font.Bold = true;
                    namedWorksheet.Cells[startRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    namedWorksheet.Cells[startRow, 3].Value = numberOfRecords;
                    namedWorksheet.Cells[startRow, 4].Value = remainBooks;
                    namedWorksheet.Cells[startRow, 5].Value = borrowed;
                    namedWorksheet.Cells[startRow, 6].Value = losted;
                    namedWorksheet.Cells[$"G{startRow}:P{startRow}"].Merge = true;
                    namedWorksheet.Cells[startRow, 17].Value = totalMoneys.ToString("C0", new CultureInfo("vi-VN"));
                    namedWorksheet.Cells[startRow, 18].Value = "";

                    for (int i = 1; i <= 18; i++)
                    {
                        namedWorksheet.Column(i).AutoFit();
                        namedWorksheet.Column(i).Width += 2;
                    }
                    //namedWorksheet.Row(startRow).Height = 35;

                    //overwrite to file old
                    var fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                try
                {
                    // Đảm bảo thư mục tồn tại trước khi ghi
                    if (!System.IO.Directory.Exists(directoryPath))
                    {
                        System.IO.Directory.CreateDirectory(directoryPath);
                    }

                    // Ghi file vào đường dẫn
                    System.IO.File.WriteAllBytes(outputPath, fileBytes);
                    Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                    Console.WriteLine(ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                }

                var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                var account = new Account(
                    "dvgdcqn5g",
                    "621798912237287",
                    "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                );

                var cloudinary = new Cloudinary(account);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(docxFilePath),
                    PublicId = Guid.NewGuid().ToString(),
                    Folder = "word"
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);


                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new
                    {
                        Success = true,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                else
                {
                    return Ok(new
                    {
                        Success = false,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // GET: api/Analyst/GetExceLAnalystBorowLateByUserType
        [HttpGet]
        [Route("GetExceLAnalystBorowLateByUserType")]
        public IActionResult GetExceLAnalystBorowLateByUserType(string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\",
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                    customApiBorrowByUserTypes =
                        _analystRepository.CustomApiBorrowByUserTypes("Late", fromDate, toDate);

                    for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                    {
                        if (i == 0)
                        {
                            namedWorksheet.Cells[2, 2].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 2].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else if (i == 1)
                        {
                            namedWorksheet.Cells[2, 3].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 3].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else
                        {
                            namedWorksheet.Cells[2, 4].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 4].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                    }

                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetExceLAnalystBorowLateByUserType2")]
        public async Task<IActionResult> GetExceLAnalystBorowLateByUserType2(string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\",
                    "Mau_BaoCaoThongKeSachTheoLoaiNguoiMuon.xlsx");
                FileInfo fi = new FileInfo(path);

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    List<CustomApiBorrowByUserType> customApiBorrowByUserTypes = new List<CustomApiBorrowByUserType>();
                    customApiBorrowByUserTypes =
                        _analystRepository.CustomApiBorrowByUserTypes("Late", fromDate, toDate);

                    for (int i = 0; i < customApiBorrowByUserTypes.Count; i++)
                    {
                        if (i == 0)
                        {
                            namedWorksheet.Cells[2, 2].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 2].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else if (i == 1)
                        {
                            namedWorksheet.Cells[2, 3].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 3].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                        else
                        {
                            namedWorksheet.Cells[2, 4].Value = customApiBorrowByUserTypes[i].NumberUserType;
                            namedWorksheet.Cells[3, 4].Value =
                                string.Format("{0:0.00}", customApiBorrowByUserTypes[i].percent) + "%";
                        }
                    }

                    //overwrite to file old
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                try
                {
                    // Đảm bảo thư mục tồn tại trước khi ghi
                    if (!System.IO.Directory.Exists(directoryPath))
                    {
                        System.IO.Directory.CreateDirectory(directoryPath);
                    }

                    // Ghi file vào đường dẫn
                    System.IO.File.WriteAllBytes(outputPath, fileBytes);
                    Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                    Console.WriteLine(ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                }

                var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                var account = new Account(
                    "dvgdcqn5g",
                    "621798912237287",
                    "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                );

                var cloudinary = new Cloudinary(account);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(docxFilePath),
                    PublicId = Guid.NewGuid().ToString(),
                    Folder = "word"
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);


                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new
                    {
                        Success = true,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                else
                {
                    return Ok(new
                    {
                        Success = false,
                        Url = uploadResult.SecureUrl.ToString()
                    });

                }
                //var filePath = docxFilePath; // Đường dẫn file người dùng upload
                //var folderPath = _appSettingModel.ServerFileTemp; // Đường dẫn thư mục lưu file
                //var fileName2 = Guid.NewGuid().ToString() + ".xlsx"; // Tên file duy nhất
                //var serverFilePath = Path.Combine(folderPath, fileName2); // Kết hợp đường dẫn thư mục và tên file

                //try
                //{
                //    // Kiểm tra và tạo thư mục nếu chưa tồn tại
                //    if (!Directory.Exists(folderPath))
                //    {
                //        Directory.CreateDirectory(folderPath); // Tạo thư mục
                //    }

                //    // Sao chép file vào thư mục
                //    System.IO.File.Copy(filePath, serverFilePath);

                //    // Kiểm tra xem file có tồn tại trong thư mục không
                //    if (System.IO.File.Exists(serverFilePath))
                //    {
                //        var fileUrl = $"https://demo4.thuvienhocduong.vn/uploads/{fileName}";
                //        return Ok(new
                //        {
                //            Success = true,
                //            Url = fileUrl
                //        });
                //    }
                //    else
                //    {
                //        throw new Exception("Không thể lưu tệp vào thư mục.");
                //    }
                //}
                //catch (Exception ex)
                //{
                //    return Ok(new
                //    {
                //        Success = false,
                //        ErrorMessage = ex.Message
                //    });
                //}


            }

            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/GetNumberDocumentByIdStock
        [HttpGet]
        [Route("GetNumberDocumentByIdStock")]
        public List<ListBookNew> GetNumberDocumentByIdStock(Guid id)
        {
            try
            {
                return _analystRepository.ListDocumentByIdStock(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/CountDocumentInStock
        [HttpGet]
        [Route("CountDocumentInStock")]
        public int CountDocumentInStock(Guid id)
        {
            try
            {
                int count = _analystRepository.CountDocumentByIdStock(id);
                return count;
            }
            catch (Exception)
            {
                throw;
            }
        }




        // GET: api/Analyst/GetFileExcelAnalystListReadingLevel
        [HttpGet]
        [Route("GetFileExcelAnalystListReadingLevel")]
        public IActionResult GetFileExcelAnalystListReadingLevel(string fromDate, string toDate)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MAU_SO_DANG_KY_CA_BIET_OLD.xlsx");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    namedWorksheet.Cells["A3:Q20000"].Clear();


                    var listLedger = new List<CustomApiNumIndividualLedgerExcel>();

                    var listDocumentType = _documentType.GetAllDocumentType(1);

                    listDocumentType = listDocumentType.Where(e => e.DocTypeName.Trim().ToLower() == "sách thiếu nhi" && e.Status == 1).ToList();

                    if (listDocumentType.Count <= 0)
                    {
                        return BadRequest("Không tìm thấy loại tài liệu Sách thiếu nhi");
                    }
                    else
                    {
                        foreach (var docType in listDocumentType)
                        {
                            listLedger.AddRange(_analystRepository.CustomApiNumIndividualLedgersExcel(fromDate, toDate, docType.Id));
                        }
                    }

                    int numberRows = 3;
                    int indexNameBook = 1;

                    namedWorksheet.Cells[2, 9].Value = "";
                    namedWorksheet.Cells[2, 10].Value = "";
                    namedWorksheet.Cells[2, 11].Value = "";
                    namedWorksheet.Cells[2, 12].Value = "";

                    if (fromDate != null && toDate != null)
                    {
                        int fromYear = int.Parse(fromDate.Split('-')[0]);
                        int toYear = int.Parse(toDate.Split('-')[0]);

                        int indexStartYear = 12;
                        int yearsToPrint = 5;

                        for (int i = 0; i < yearsToPrint; i++)
                        {
                            namedWorksheet.Cells[2, indexStartYear].Value = fromYear;
                            indexStartYear++;
                            fromYear++;
                        }
                    }

                    for (int i = 0; i < listLedger.Count; i++)
                    {
                        if (listLedger.ElementAt(i).IsDeleteIndividual == true && listLedger.ElementAt(i).IsLiquidation == true) // Sách đã thanh lý
                        {
                            continue;
                        }
                        else if (listLedger.ElementAt(i).IsDeleteIndividual == true && listLedger.ElementAt(i).ExportDate == null && listLedger.ElementAt(i).ReceiptNumber == null) // mã cá biệt đã bị xoá nhưng không có trong kiểm kê lẫn xuất sách
                        {
                            continue;
                        }

                        for (int j = 1; j <= 17; j++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            if (j == 4 || j == 5 || j == 6)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }

                            if (j == 9 || j == 13)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        namedWorksheet.Cells[numberRows, 1].Value = listLedger[i].DateIn?.ToString("dd/MM/yyyy");

                        if (i > 0 && listLedger[i].DocumentName != listLedger[i - 1].DocumentName)
                        {
                            string value = indexNameBook.ToString().PadLeft(3, '0');
                            namedWorksheet.Cells[numberRows, 2].Value = value;
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, 2].Value = i == 0 ? "001" : "";
                        }

                        namedWorksheet.Cells[numberRows, 3].Value = listLedger[i].NameIndividual.Substring(0, listLedger[i].NameIndividual.IndexOf('/')) ?? "";

                        namedWorksheet.Cells[numberRows, 5].Value = listLedger[i].DocumentName;
                        namedWorksheet.Cells[numberRows, 4].Value = listLedger[i].Author ?? "";
                        namedWorksheet.Cells[numberRows, 6].Value = listLedger[i].Publisher ?? "";
                        namedWorksheet.Cells[numberRows, 7].Value = listLedger[i].PublishPlace ?? "";
                        namedWorksheet.Cells[numberRows, 8].Value = listLedger[i].PublishYear.HasValue ? listLedger[i].PublishYear.Value.Year : "";
                        namedWorksheet.Cells[numberRows, 9].Value = listLedger[i].Price;
                        namedWorksheet.Cells[numberRows, 10].Value = listLedger[i].ColorName ?? listLedger[i].SignCode ?? "";

                        namedWorksheet.Cells[numberRows, 11].Value = listLedger[i].DocumentStock;
                        namedWorksheet.Cells[numberRows, 12].Value = "";
                        namedWorksheet.Cells[numberRows, 13].Value = "";
                        namedWorksheet.Cells[numberRows, 14].Value = "";
                        namedWorksheet.Cells[numberRows, 15].Value = "";
                        namedWorksheet.Cells[numberRows, 16].Value = "";



                        int fromYear = fromDate != null ? int.Parse(fromDate.Split('-')[0]) : DateTime.Now.Year;
                        int startIndexPrint = 12;
                        int maxYearsToPrint = 6;
                        int currentYear = DateTime.Now.Year;
                        int yearOfIndividual = listLedger[i].DateIn!.Value.Year;

                        for (int j = 0; j < maxYearsToPrint; j++)
                        {
                            if (fromYear > currentYear)
                                break;

                            if (yearOfIndividual == fromYear)
                            {
                                char ledgerSymbol = (listLedger[i].WasLost == true ? '-' : (listLedger[i].WasLost == false ? '+' : ' '));

                                namedWorksheet.Cells[numberRows, startIndexPrint].Value = ledgerSymbol;
                            }

                            fromYear++;
                            startIndexPrint++;
                        }


                        if (i < listLedger.Count - 1 && listLedger[i].DocumentName != listLedger[i + 1].DocumentName)
                        {
                            indexNameBook++;
                        }

                        numberRows++;
                    }
                    // Lặp qua từng cột từ A đến Q
                    for (int col = 1; col <= 17; col++) // Cột A là 1, Q là 17 (A-Q có 17 cột)
                    {
                        namedWorksheet.Column(col).AutoFit();
                        namedWorksheet.Column(col).Width += 10;
                    }
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetFileExcelAnalystListBorrowLedgerIndividual
        [HttpGet]
        [Route("GetFileExcelAnalystListBorrowLedgerIndividual")]
        public IActionResult GetFileExcelAnalystListBorrowLedgerIndividual(string fromDate, string toDate, Guid documentType)
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MAU_SO_DANG_KY_CA_BIET.xlsx");

                var fi = new FileInfo(path);

                var listDocumentType = _documentType.GetAllDocumentType(1);

                listDocumentType = listDocumentType.Where(e => e.DocTypeName.Trim().ToLower() == "sách thiếu nhi" && e.Status == 1).ToList();

                Guid idDocumentTypeSTN = Guid.Empty;

                idDocumentTypeSTN = listDocumentType.Count > 0 ? listDocumentType[0].Id : Guid.Empty;

                using (var excelPackage = new ExcelPackage(fi))
                {
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    namedWorksheet.Cells["A3:T20000"].Clear();

                    var listLedger = _analystRepository.CustomApiNumIndividualLedgersExcel(fromDate, toDate, documentType);

                    int numberRows = 3;
                    int indexNameBook = 1;

                    namedWorksheet.Cells[2, 11].Value = "";
                    namedWorksheet.Cells[2, 12].Value = "";
                    namedWorksheet.Cells[2, 13].Value = "";
                    namedWorksheet.Cells[2, 14].Value = "";
                    namedWorksheet.Cells[2, 15].Value = "";

                    if (fromDate != null && toDate != null)
                    {
                        int fromYear = int.Parse(fromDate.Split('-')[0]);
                        int indexStartYear = 15;
                        int yearsToPrint = 5;

                        for (int i = 0; i < yearsToPrint; i++)
                        {

                            namedWorksheet.Cells[2, indexStartYear].Value = fromYear;
                            indexStartYear++;
                            fromYear++;
                        }
                    }
                    else
                    {
                        int fromYear = DateTime.Now.Year;
                        int indexStartYear = 15;
                        int yearsToPrint = 5;

                        for (int i = 0; i < yearsToPrint; i++)
                        {

                            namedWorksheet.Cells[2, indexStartYear].Value = fromYear;
                            indexStartYear++;
                            fromYear++;
                        }
                    }

                    for (int i = 0; i < listLedger.Count; i++)
                    {


                        if (listLedger.ElementAt(i).IsDeleteIndividual == true && listLedger.ElementAt(i).IsLiquidation == true) // Sách đã thanh lý
                        {
                            continue;
                        }
                        else if (listLedger.ElementAt(i).IsDeleteIndividual == true && listLedger.ElementAt(i).ExportDate == null && listLedger.ElementAt(i).ReceiptNumber == null) // mã cá biệt đã bị xoá nhưng không có trong kiểm kê lẫn xuất sách
                        {
                            continue;
                        }


                        for (int j = 1; j <= 20; j++)
                        {
                            var cell = namedWorksheet.Cells[numberRows, j].Style;
                            cell.Font.Size = 13;
                            cell.Font.Name = "Times New Roman";
                            cell.HorizontalAlignment = ExcelHorizontalAlignment.CenterContinuous;

                            if (j == 4 || j == 5 || j == 6)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            }

                            if (j == 9 || j == 13)
                            {
                                cell.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            }

                            var borderStyle = cell.Border;
                            borderStyle.Top.Style = ExcelBorderStyle.Thin;
                            borderStyle.Left.Style = ExcelBorderStyle.Thin;
                            borderStyle.Right.Style = ExcelBorderStyle.Thin;
                            borderStyle.Bottom.Style = ExcelBorderStyle.Thin;
                        }


                        namedWorksheet.Cells[numberRows, 1].Value = _individualSampleRepository.GetEntryDateById(listLedger[i].IdIndividual).Date.ToString("dd/MM/yyyy");

                        if (i > 0 && listLedger[i].DocumentName != listLedger[i - 1].DocumentName)
                        {
                            string value = indexNameBook.ToString().PadLeft(3, '0');
                            namedWorksheet.Cells[numberRows, 2].Value = value;
                        }
                        else
                        {

                            namedWorksheet.Cells[numberRows, 2].Value = i == 0 ? "001" : "";
                            if (numberRows == 3)
                            {
                                namedWorksheet.Cells[numberRows, 2].Value = "001";
                            }
                        }

                        namedWorksheet.Cells[numberRows, 3].Value = listLedger[i].NameIndividual.Substring(0, listLedger[i].NameIndividual.IndexOf('/')) ?? "";
                        namedWorksheet.Cells[numberRows, 5].Value = listLedger[i].DocumentName;
                        namedWorksheet.Cells[numberRows, 4].Value = listLedger[i].Author ?? "";
                        namedWorksheet.Cells[numberRows, 6].Value = listLedger[i].Publisher ?? "";
                        namedWorksheet.Cells[numberRows, 7].Value = listLedger[i].PublishPlace ?? "";
                        namedWorksheet.Cells[numberRows, 8].Value = listLedger[i].PublishYear.HasValue ? listLedger[i].PublishYear.Value.Year : "";

                        if (listLedger[i].IsBuy == true)
                        {
                            namedWorksheet.Cells[numberRows, 9].Value = "";
                            namedWorksheet.Cells[numberRows, 10].Value = listLedger[i].Price;
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, 9].Value = listLedger[i].Price;
                            namedWorksheet.Cells[numberRows, 10].Value = "";
                        }


                        if (listLedger[i].DocumentTypeId == idDocumentTypeSTN)
                        {
                            namedWorksheet.Cells[numberRows, 11].Value = listLedger[i].ColorName ?? listLedger[i].SignCode ?? "";
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, 11].Value = listLedger[i].SignCode;
                        }


                        if (listLedger[i].GeneralEntryNumber != null)
                        {
                            namedWorksheet.Cells[numberRows, 12].Value = listLedger[i].GeneralEntryNumber.Trim().ToString();
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, 12].Value = "";
                        }




                        if (listLedger.ElementAt(i).ExportDate != null && listLedger.ElementAt(i).ReceiptNumber != null)
                        {
                            namedWorksheet.Cells[numberRows, 13].Value = listLedger.ElementAt(i).ExportDate.Value.ToString("dd/MM/yyyy") + " - " + listLedger.ElementAt(i).ReceiptNumber;
                        }
                        else
                        {
                            namedWorksheet.Cells[numberRows, 13].Value = "";
                        }

                        namedWorksheet.Cells[numberRows, 13].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        namedWorksheet.Cells[numberRows, 13].Style.VerticalAlignment = ExcelVerticalAlignment.Center;


                        namedWorksheet.Cells[numberRows, 14].Value = listLedger[i].DocumentStock;
                        namedWorksheet.Cells[numberRows, 15].Value = ""; // từ cột thứ 15 đến cột thứ 19 là đánh dấu cho sách trong 5 năm gân
                        namedWorksheet.Cells[numberRows, 16].Value = "";
                        namedWorksheet.Cells[numberRows, 17].Value = "";
                        namedWorksheet.Cells[numberRows, 18].Value = "";
                        namedWorksheet.Cells[numberRows, 19].Value = "";
                        namedWorksheet.Cells[numberRows, 20].Value = "";



                        int fromYear = fromDate != null ? int.Parse(fromDate.Split('-')[0]) : DateTime.Now.Year;
                        int startIndexPrint = 15;
                        int maxYearsToPrint = 5;
                        int currentYear = DateTime.Now.Year;
                        int yearOfIndividual = listLedger[i].DateIn!.Value.Year;

                        for (int j = 0; j < maxYearsToPrint; j++)
                        {
                            if (fromYear > currentYear)
                                break;

                            if (yearOfIndividual == fromYear)
                            {
                                char ledgerSymbol = (listLedger[i].WasLost == true ? '-' : (listLedger[i].WasLost == false ? '+' : ' '));
                                namedWorksheet.Cells[numberRows, startIndexPrint].Value = ledgerSymbol;
                            }

                            fromYear++;
                            startIndexPrint++;
                        }

                        if (i < listLedger.Count - 1 && listLedger[i].DocumentName != listLedger[i + 1].DocumentName)
                        {
                            indexNameBook++;
                        }

                        numberRows++;
                    }

                    // Lặp qua từng cột từ A đến Q
                    for (int col = 1; col <= 20; col++) // Cột A là 1, Q là 17 (A-Q có 17 cột)
                    {
                        namedWorksheet.Column(col).AutoFit();
                        namedWorksheet.Column(col).Width += 10;

                    }
                    //overwrite to file old
                    var fiToSave = new FileInfo(path);

                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauBaoCaoNhieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }



        // GET: api/Analyst/GetLedgerIndividual
        [HttpGet]
        [Route("GetLedgerIndividual")]
        public List<CustomApiNumIndividualLedger> GetLedgerIndividual(string fromDate, string toDate, Guid documentType)
        {
            try
            {
                var result = _analystRepository.CustomApiNumIndividualLedgers(fromDate, toDate, documentType);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Analyst/GetExceLAnalystListTextBook
        [HttpGet]
        [Route("GetExceLAnalystListTextBook")]
        public async Task<IActionResult> GetExceLAnalystListTextBook(string fromDate, string toDate)
        {
            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Khi xuất Số đăng ký theo sách giáo khoa, bạn cần chọn từ ngày đến ngày !"
                });
            }
            else if (DateTime.TryParse(fromDate, out _) == false || DateTime.TryParse(toDate, out _) == false)
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Ngày không hợp lệ !"
                });
            }
            else if (DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) > DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture))
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Ngày bắt đầu không thể lớn hơn ngày kết thúc !"
                });
            }
            try
            {

                string dateFormat = "yyyy-MM-dd";

                var fromDateIndividual = DateTime.ParseExact(fromDate, dateFormat, CultureInfo.InvariantCulture);
                var toDateIndividual = DateTime.ParseExact(toDate, dateFormat, CultureInfo.InvariantCulture);

                var fromDateStartOfDay = fromDateIndividual.Date; // 00:00:00
                var toDateEndOfDay = toDateIndividual.Date.AddDays(1).AddTicks(-1); // 23:59:59

                List<CustomApiListIndividualSampleTextBook> listTextBook = await _analystRepository.GetListDataTextBook(fromDateStartOfDay, toDateEndOfDay);


                List<int> listYears = listTextBook.SelectMany(x => x.TextBookListStatus.Select(y => y.Year)).Distinct().ToList();


                var groupedListTextBook = listTextBook
                            .GroupBy(x => new { x.IdDocument, x.DocumentName })
                            .Select(g => new
                            {
                                IdDocument = g.Key,
                                DocumentName = g.Key.DocumentName,
                                Variants = g.GroupBy(x => new { x.DateIn.Value.Date, x.PublishYear, x.Price, x.ReceiptNumber })
                            }).ToList();


                using (var stream = new MemoryStream())
                {


                    using (var excelPackage = new ExcelPackage(stream))
                    {

                        int row = 1;
                        ExcelWorksheet worksheet;

                        if (excelPackage.Workbook.Worksheets.Count == 0)
                        {
                            worksheet = excelPackage.Workbook.Worksheets.Add("SĐKCB_SGK");
                        }
                        else
                        {
                            worksheet = excelPackage.Workbook.Worksheets[0];
                        }
                        worksheet.Cells["A1:S9999999"].Clear();
                        worksheet.Cells["A1:S9999999"].Style.WrapText = true;

                        for (int k = 1; k <= 18; k++)
                            worksheet.Column(k).Width = 10;


                        foreach (var textBook in groupedListTextBook)
                        {
                            // Gộp ô từ 1 -> 18 sau đó ghi tên sách
                            worksheet.Cells[row, 1, row, 18].Merge = true;
                            worksheet.Cells[row, 1].Value = textBook.DocumentName;
                            worksheet.Cells[row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            worksheet.Cells[row, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 1].Style.Font.Bold = true;
                            worksheet.Cells[row, 1].Style.Font.Size = 13;
                            worksheet.Cells[row, 1].Style.Font.Name = "Times New Roman";
                            row += 2;

                            // Năm học
                            // Ngày vào sổ - Merge dòng row + 1 và row + 2 của cột 1 - Do năm học và ngày vào sổ gộp chung 1 ô
                            worksheet.Column(1).Width = 20;
                            worksheet.Cells[row, 1].Value = "NĂM HỌC";
                            worksheet.Cells[row, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 1].Style.Font.Bold = true;
                            worksheet.Cells[row, 1].Style.Font.Size = 13;
                            worksheet.Cells[row, 1].Style.Font.Name = "Times New Roman";
                            worksheet.Cells[row + 1, 1, row + 2, 1].Merge = true; // Gộp ngày vào sổ
                            worksheet.Cells[row + 1, 1].Value = "NGÀY VÀO SỔ";
                            worksheet.Cells[row + 1, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row + 2, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row + 1, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row + 1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row + 1, 1].Style.Font.Bold = true;
                            worksheet.Cells[row + 1, 1].Style.Font.Size = 11;
                            worksheet.Cells[row + 1, 1].Style.Font.Name = "Times New Roman";


                            // Array chứa tiêu đề các cột và gộp ô
                            string[] headers = { "SỐ ĐĂNG KÝ", "SỐ CHỨNG TỪ", "NĂM XUẤT BẢN", "TỔNG SỐ BẢN", "ĐƠN GIÁ", "THÀNH TIỀN" };
                            for (int j = 0; j < headers.Length; j++)
                            {
                                worksheet.Column(2).Width = 20;
                                worksheet.Column(3).Width = 20;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Merge = true;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Value = headers[j];
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Bold = true;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Size = 13;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Name = "Times New Roman";
                            }

                            // Gộp ô Kiểm kê từ cột 8 đến 17
                            worksheet.Cells[row, 8, row, 17].Merge = true;
                            worksheet.Cells[row, 8].Value = "KIỂM KÊ";
                            worksheet.Cells[row, 8, row, 17].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 8, row, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 8, row, 17].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Bold = true;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Size = 13;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Name = "Times New Roman";



                            // Duyệt qua mảng các năm và thực hiện merge + thiết lập giá trị và border cho mỗi năm
                            for (int yearIndex = 0; yearIndex < listYears.Count; yearIndex++)
                            {
                                int startColumn = 8 + yearIndex * 2;

                                // Merge cho các cột của từng năm
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Merge = true;
                                worksheet.Cells[row + 1, startColumn].Value = listYears.ElementAt(yearIndex).ToString();
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Bold = true;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Size = 13;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Name = "Times New Roman";

                                // Mất
                                worksheet.Cells[row + 2, startColumn].Value = "Mất";
                                worksheet.Cells[row + 2, startColumn].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 2, startColumn].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Bold = true;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Size = 13;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Name = "Times New Roman";

                                // Còn
                                worksheet.Cells[row + 2, startColumn + 1].Value = "Còn";
                                worksheet.Cells[row + 2, startColumn + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 2, startColumn + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn + 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Bold = true;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Size = 13;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Name = "Times New Roman";
                            }

                            // Ghi chú - Merge dòng row và row + 2 của cột 18

                            worksheet.Cells[row, 18, row + 2, 18].Merge = true;
                            worksheet.Cells[row, 18, row + 2, 18].Value = "GHI CHÚ";
                            worksheet.Cells[row, 18, row + 2, 18].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 18, row + 2, 18].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 18, row + 2, 18].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Bold = true;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Size = 13;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Name = "Times New Roman";


                            foreach (var rowIndex in new[] { row, row + 1, row + 2 })
                            {
                                var range = worksheet.Cells[rowIndex, 1, rowIndex, 18];
                                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#dadada")); // Màu vàng
                            }



                            foreach (var item in textBook.Variants)
                            {

                                string yearAndDate = $"NH " + (toDateEndOfDay.Year - 1) + "-" + (toDateEndOfDay.Year) + "\n" + item.Key.Date.ToString("dd/MM/yyyy");


                                List<int> listNumIndividual = new List<int>();

                                foreach (var x in item)
                                {
                                    var parts = x.NumIndividual.Split('/');
                                    var numberPart = parts[0].Replace("SGK", string.Empty);
                                    if (int.TryParse(numberPart, out int number))
                                    {
                                        listNumIndividual.Add(number);
                                    }
                                }



                                string publishYear = item.Key.PublishYear.ToString();
                                int totalRecord = item.Count();
                                long price = item.Key.Price ?? 0;
                                long totalPrice = item.Sum(x => x.Price ?? 0);

                                List<int> countWasLostPerYear = new List<int>(new int[5]);
                                List<int> countNotLostPerYear = new List<int>(new int[5]);

                                foreach (var book in item)
                                {
                                    for (int j = 0; j < 5; j++)
                                    {
                                        var status = book.TextBookListStatus[j];
                                        if (status.WasLost == 1 || status.IsLostedPhysicalVersion == true)
                                        {
                                            countWasLostPerYear[j]++;
                                        }
                                        else if (status.WasLost == 0)
                                        {
                                            countNotLostPerYear[j]++;
                                        }
                                    }
                                }

                                SetCellValue(worksheet, row + 3, 1, yearAndDate, ExcelBorderStyle.Thin, "@");
                                SetCellValue(worksheet, row + 3, 2, FormatNumberRange(listNumIndividual));
                                SetCellValue(worksheet, row + 3, 3, item.Key.ReceiptNumber);
                                SetCellValue(worksheet, row + 3, 4, publishYear);
                                SetCellValue(worksheet, row + 3, 5, totalRecord);
                                SetCellValue(worksheet, row + 3, 6, price);
                                SetCellValue(worksheet, row + 3, 7, totalPrice);

                                for (int j = 0; j < 5; j++)
                                {
                                    SetCellValue(worksheet, row + 3, 8 + j * 2, countWasLostPerYear[j].ToString("0"));
                                    SetCellValue(worksheet, row + 3, 9 + j * 2, countNotLostPerYear[j].ToString("0"));
                                }

                                SetCellValue(worksheet, row + 3, 18, "");

                                row++;
                                countWasLostPerYear.Clear();
                                countNotLostPerYear.Clear();
                            }

                            row += 6;
                        }



                        await excelPackage.SaveAsAsync(stream);
                    }
                    byte[] excelBytes = stream.ToArray();

                    return File(excelBytes, MediaTypeNames.Application.Octet, "Mau_BaoCaoSachGiaoKhoa.xlsx");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        [Route("GetExceLAnalystListTextBook2")]
        public async Task<IActionResult> GetExceLAnalystListTextBook2(string fromDate, string toDate)
        {
            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Khi xuất Số đăng ký theo sách giáo khoa, bạn cần chọn từ ngày đến ngày !"
                });
            }
            else if (DateTime.TryParse(fromDate, out _) == false || DateTime.TryParse(toDate, out _) == false)
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Ngày không hợp lệ !"
                });
            }
            else if (DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) > DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture))
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Ngày bắt đầu không thể lớn hơn ngày kết thúc !"
                });
            }
            try
            {

                string dateFormat = "yyyy-MM-dd";

                var fromDateIndividual = DateTime.ParseExact(fromDate, dateFormat, CultureInfo.InvariantCulture);
                var toDateIndividual = DateTime.ParseExact(toDate, dateFormat, CultureInfo.InvariantCulture);

                var fromDateStartOfDay = fromDateIndividual.Date; // 00:00:00
                var toDateEndOfDay = toDateIndividual.Date.AddDays(1).AddTicks(-1); // 23:59:59

                List<CustomApiListIndividualSampleTextBook> listTextBook = await _analystRepository.GetListDataTextBook(fromDateStartOfDay, toDateEndOfDay);


                List<int> listYears = listTextBook.SelectMany(x => x.TextBookListStatus.Select(y => y.Year)).Distinct().ToList();


                var groupedListTextBook = listTextBook
                            .GroupBy(x => new { x.IdDocument, x.DocumentName })
                            .Select(g => new
                            {
                                IdDocument = g.Key,
                                DocumentName = g.Key.DocumentName,
                                Variants = g.GroupBy(x => new { x.DateIn.Value.Date, x.PublishYear, x.Price, x.ReceiptNumber })
                            }).ToList();


                using (var stream = new MemoryStream())
                {


                    using (var excelPackage = new ExcelPackage(stream))
                    {

                        int row = 1;
                        ExcelWorksheet worksheet;

                        if (excelPackage.Workbook.Worksheets.Count == 0)
                        {
                            worksheet = excelPackage.Workbook.Worksheets.Add("SĐKCB_SGK");
                        }
                        else
                        {
                            worksheet = excelPackage.Workbook.Worksheets[0];
                        }
                        worksheet.Cells["A1:S9999999"].Clear();
                        worksheet.Cells["A1:S9999999"].Style.WrapText = true;

                        for (int k = 1; k <= 18; k++)
                            worksheet.Column(k).Width = 10;


                        foreach (var textBook in groupedListTextBook)
                        {
                            // Gộp ô từ 1 -> 18 sau đó ghi tên sách
                            worksheet.Cells[row, 1, row, 18].Merge = true;
                            worksheet.Cells[row, 1].Value = textBook.DocumentName;
                            worksheet.Cells[row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            worksheet.Cells[row, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 1].Style.Font.Bold = true;
                            worksheet.Cells[row, 1].Style.Font.Size = 13;
                            worksheet.Cells[row, 1].Style.Font.Name = "Times New Roman";
                            row += 2;

                            // Năm học
                            // Ngày vào sổ - Merge dòng row + 1 và row + 2 của cột 1 - Do năm học và ngày vào sổ gộp chung 1 ô
                            worksheet.Column(1).Width = 20;
                            worksheet.Cells[row, 1].Value = "NĂM HỌC";
                            worksheet.Cells[row, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 1].Style.Font.Bold = true;
                            worksheet.Cells[row, 1].Style.Font.Size = 13;
                            worksheet.Cells[row, 1].Style.Font.Name = "Times New Roman";
                            worksheet.Cells[row + 1, 1, row + 2, 1].Merge = true; // Gộp ngày vào sổ
                            worksheet.Cells[row + 1, 1].Value = "NGÀY VÀO SỔ";
                            worksheet.Cells[row + 1, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row + 2, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row + 1, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row + 1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row + 1, 1].Style.Font.Bold = true;
                            worksheet.Cells[row + 1, 1].Style.Font.Size = 11;
                            worksheet.Cells[row + 1, 1].Style.Font.Name = "Times New Roman";


                            // Array chứa tiêu đề các cột và gộp ô
                            string[] headers = { "SỐ ĐĂNG KÝ", "SỐ CHỨNG TỪ", "NĂM XUẤT BẢN", "TỔNG SỐ BẢN", "ĐƠN GIÁ", "THÀNH TIỀN" };
                            for (int j = 0; j < headers.Length; j++)
                            {
                                worksheet.Column(2).Width = 20;
                                worksheet.Column(3).Width = 20;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Merge = true;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Value = headers[j];
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Bold = true;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Size = 13;
                                worksheet.Cells[row, j + 2, row + 2, j + 2].Style.Font.Name = "Times New Roman";
                            }

                            // Gộp ô Kiểm kê từ cột 8 đến 17
                            worksheet.Cells[row, 8, row, 17].Merge = true;
                            worksheet.Cells[row, 8].Value = "KIỂM KÊ";
                            worksheet.Cells[row, 8, row, 17].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 8, row, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 8, row, 17].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Bold = true;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Size = 13;
                            worksheet.Cells[row, 8, row, 17].Style.Font.Name = "Times New Roman";



                            // Duyệt qua mảng các năm và thực hiện merge + thiết lập giá trị và border cho mỗi năm
                            for (int yearIndex = 0; yearIndex < listYears.Count; yearIndex++)
                            {
                                int startColumn = 8 + yearIndex * 2;

                                // Merge cho các cột của từng năm
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Merge = true;
                                worksheet.Cells[row + 1, startColumn].Value = listYears.ElementAt(yearIndex).ToString();
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Bold = true;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Size = 13;
                                worksheet.Cells[row + 1, startColumn, row + 1, startColumn + 1].Style.Font.Name = "Times New Roman";

                                // Mất
                                worksheet.Cells[row + 2, startColumn].Value = "Mất";
                                worksheet.Cells[row + 2, startColumn].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 2, startColumn].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Bold = true;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Size = 13;
                                worksheet.Cells[row + 2, startColumn].Style.Font.Name = "Times New Roman";

                                // Còn
                                worksheet.Cells[row + 2, startColumn + 1].Value = "Còn";
                                worksheet.Cells[row + 2, startColumn + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                worksheet.Cells[row + 2, startColumn + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn + 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Bold = true;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Size = 13;
                                worksheet.Cells[row + 2, startColumn + 1].Style.Font.Name = "Times New Roman";
                            }

                            // Ghi chú - Merge dòng row và row + 2 của cột 18

                            worksheet.Cells[row, 18, row + 2, 18].Merge = true;
                            worksheet.Cells[row, 18, row + 2, 18].Value = "GHI CHÚ";
                            worksheet.Cells[row, 18, row + 2, 18].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[row, 18, row + 2, 18].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[row, 18, row + 2, 18].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Bold = true;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Size = 13;
                            worksheet.Cells[row, 18, row + 2, 18].Style.Font.Name = "Times New Roman";


                            foreach (var rowIndex in new[] { row, row + 1, row + 2 })
                            {
                                var range = worksheet.Cells[rowIndex, 1, rowIndex, 18];
                                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#dadada")); // Màu vàng
                            }



                            foreach (var item in textBook.Variants)
                            {

                                string yearAndDate = $"NH " + (toDateEndOfDay.Year - 1) + "-" + (toDateEndOfDay.Year) + "\n" + item.Key.Date.ToString("dd/MM/yyyy");


                                List<int> listNumIndividual = new List<int>();

                                foreach (var x in item)
                                {
                                    var parts = x.NumIndividual.Split('/');
                                    var numberPart = parts[0].Replace("SGK", string.Empty);
                                    if (int.TryParse(numberPart, out int number))
                                    {
                                        listNumIndividual.Add(number);
                                    }
                                }



                                string publishYear = item.Key.PublishYear.ToString();
                                int totalRecord = item.Count();
                                long price = item.Key.Price ?? 0;
                                long totalPrice = item.Sum(x => x.Price ?? 0);

                                List<int> countWasLostPerYear = new List<int>(new int[5]);
                                List<int> countNotLostPerYear = new List<int>(new int[5]);

                                foreach (var book in item)
                                {
                                    for (int j = 0; j < 5; j++)
                                    {
                                        var status = book.TextBookListStatus[j];
                                        if (status.WasLost == 1 || status.IsLostedPhysicalVersion == true)
                                        {
                                            countWasLostPerYear[j]++;
                                        }
                                        else if (status.WasLost == 0)
                                        {
                                            countNotLostPerYear[j]++;
                                        }
                                    }
                                }

                                SetCellValue(worksheet, row + 3, 1, yearAndDate, ExcelBorderStyle.Thin, "@");
                                SetCellValue(worksheet, row + 3, 2, FormatNumberRange(listNumIndividual));
                                SetCellValue(worksheet, row + 3, 3, item.Key.ReceiptNumber);
                                SetCellValue(worksheet, row + 3, 4, publishYear);
                                SetCellValue(worksheet, row + 3, 5, totalRecord);
                                SetCellValue(worksheet, row + 3, 6, price);
                                SetCellValue(worksheet, row + 3, 7, totalPrice);

                                for (int j = 0; j < 5; j++)
                                {
                                    SetCellValue(worksheet, row + 3, 8 + j * 2, countWasLostPerYear[j].ToString("0"));
                                    SetCellValue(worksheet, row + 3, 9 + j * 2, countNotLostPerYear[j].ToString("0"));
                                }

                                SetCellValue(worksheet, row + 3, 18, "");

                                row++;
                                countWasLostPerYear.Clear();
                                countNotLostPerYear.Clear();
                            }

                            row += 6;
                        }



                        await excelPackage.SaveAsAsync(stream);
                    }
                    byte[] fileBytes = stream.ToArray();
                    string directoryPath = _appSettingModel.ServerFileTemp; // Thư mục lưu trữ file
                    string id = Guid.NewGuid().ToString(); // ID bất kỳ (ví dụ: sử dụng GUID)
                    string fileName = $"{id}.xlsx"; // Định dạng file với ID, bạn có thể thay đổi phần mở rộng file
                    string outputPath = System.IO.Path.Combine(directoryPath, fileName); // Kết hợp đường dẫn và tên file

                    try
                    {
                        // Đảm bảo thư mục tồn tại trước khi ghi
                        if (!System.IO.Directory.Exists(directoryPath))
                        {
                            System.IO.Directory.CreateDirectory(directoryPath);
                        }

                        // Ghi file vào đường dẫn
                        System.IO.File.WriteAllBytes(outputPath, fileBytes);
                        Console.WriteLine("File đã được lưu thành công tại: " + outputPath);
                    }
                    catch (UnauthorizedAccessException ex)
                    {
                        Console.WriteLine("Lỗi: Không có quyền ghi vào thư mục. Vui lòng kiểm tra quyền.");
                        Console.WriteLine(ex.Message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Lỗi xảy ra khi lưu file: " + ex.Message);
                    }

                    var docxFilePath = _appSettingModel.ServerFileTemp + "\\" + id + ".xlsx";
                    var account = new Account(
                        "dvgdcqn5g",
                        "621798912237287",
                        "7FqPAOtqqppKEAdWsxiZmmqx-bs"
                    );

                    var cloudinary = new Cloudinary(account);

                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(docxFilePath),
                        PublicId = Guid.NewGuid().ToString(),
                        Folder = "word"
                    };

                    var uploadResult = await cloudinary.UploadAsync(uploadParams);


                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        return Ok(new
                        {
                            Success = true,
                            Url = uploadResult.SecureUrl.ToString()
                        });

                    }
                    else
                    {
                        return Ok(new
                        {
                            Success = false,
                            Url = uploadResult.SecureUrl.ToString()
                        });

                    }

                }
            }
            catch (Exception)
            {
                throw;
            }
        }



        // POST: api/Analyst/GetAnalystMagazine
        [HttpPost]
        [Route("GetAnalystMagazine")]
        public List<CustomApiAnalystMagazine> GetAnalystMagazine(GetExceLAnalystMagazinePayLoad analystMagazinePayLoad)
        {
            try
            {
                if (string.IsNullOrEmpty(analystMagazinePayLoad.SchoolYearOrFinancialYear) || string.IsNullOrEmpty(analystMagazinePayLoad.MonthOrYear) || analystMagazinePayLoad.ListIdDocumentType.Count <= 0)
                {
                    return null;
                }
                else if (analystMagazinePayLoad.SchoolYearOrFinancialYear != "namhoc" && analystMagazinePayLoad.SchoolYearOrFinancialYear != "namtaichinh")
                {
                    return null;
                }
                else if (analystMagazinePayLoad.MonthOrYear != "ngay" && analystMagazinePayLoad.MonthOrYear != "thang")
                {
                    return null;
                }

                int typeExportWord = 0;

                if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namhoc" && analystMagazinePayLoad.MonthOrYear == "ngay")
                {
                    typeExportWord = 1; // Năm học - ngày
                }
                else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namhoc" && analystMagazinePayLoad.MonthOrYear == "thang")
                {
                    typeExportWord = 2; // Năm học - tháng
                }
                else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namtaichinh" && analystMagazinePayLoad.MonthOrYear == "ngay")
                {
                    typeExportWord = 3; // Năm tài chính - ngày
                }
                else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namtaichinh" && analystMagazinePayLoad.MonthOrYear == "thang")
                {
                    typeExportWord = 4; // Năm tài chính - tháng
                }

                int startYear = analystMagazinePayLoad.StartYear.Value.Year;


                return _analystRepository.GetListDataApiAnalystMagazine(startYear, typeExportWord, analystMagazinePayLoad.ListIdDocumentType);

            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Analyst/GetExceLAnalystMagazine
        [HttpPost]
        [Route("GetExceLAnalystMagazine")]
        public async Task<IActionResult> GetExceLAnalystMagazine(GetExceLAnalystMagazinePayLoad analystMagazinePayLoad)
        {

            if (string.IsNullOrEmpty(analystMagazinePayLoad.SchoolYearOrFinancialYear) || string.IsNullOrEmpty(analystMagazinePayLoad.MonthOrYear) || analystMagazinePayLoad.ListIdDocumentType.Count <= 0)
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Dữ liệu đầu vào không chính xác."
                });
            }
            else if (analystMagazinePayLoad.SchoolYearOrFinancialYear != "namhoc" && analystMagazinePayLoad.SchoolYearOrFinancialYear != "namtaichinh")
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Kỳ báo cáo không hợp lệ."
                });
            }
            else if (analystMagazinePayLoad.MonthOrYear != "ngay" && analystMagazinePayLoad.MonthOrYear != "thang")
            {
                return Ok(new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "In theo không hợp lệ."
                });
            }

            int typeExportWord = 0;

            if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namhoc" && analystMagazinePayLoad.MonthOrYear == "ngay")
            {
                typeExportWord = 1; // Năm học - ngày
            }
            else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namhoc" && analystMagazinePayLoad.MonthOrYear == "thang")
            {
                typeExportWord = 2; // Năm học - tháng
            }
            else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namtaichinh" && analystMagazinePayLoad.MonthOrYear == "ngay")
            {
                typeExportWord = 3; // Năm tài chính - ngày
            }
            else if (analystMagazinePayLoad.SchoolYearOrFinancialYear == "namtaichinh" && analystMagazinePayLoad.MonthOrYear == "thang")
            {
                typeExportWord = 4; // Năm tài chính - tháng
            }

            int startYear = analystMagazinePayLoad.StartYear.Value.Year;

            string[] arrayDinhKy = { "Hàng ngày", "2 số/tuần", "3 số/tuần", "Hàng tuần", "2 số/tháng", "3 số/tháng", "Hàng tháng", "Hàng quý", "Khác" };

            try
            {
                using (var stream = new MemoryStream())
                {
                    // Tạo tài liệu Word trong bộ nhớ
                    using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(stream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
                    {

                        List<CustomAnalystMagazine> analystMagazines = await _analystRepository.GetListDataAnalystMagazine(startYear, typeExportWord, analystMagazinePayLoad.ListIdDocumentType);

                        var ruleDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2);

                        MainDocumentPart mainPart = wordDocument.AddMainDocumentPart();

                        mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document();

                        Body body = mainPart.Document.AppendChild(new Body());

                        SectionProperties sectionProperties = new SectionProperties();
                        PageSize pageSize = new PageSize
                        {
                            Width = 16838,
                            Height = 11906,
                            Orient = PageOrientationValues.Landscape
                        };

                        sectionProperties.Append(pageSize);

                        body.Append(sectionProperties);


                        AddTitleContentToFirstPage(body, ruleDto[0].col10.ToUpper());


                        body.Append(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Break() { Type = BreakValues.Page })));





                        foreach (var item in analystMagazines)
                        {
                            DocumentFormat.OpenXml.Wordprocessing.Table tableTitle = new DocumentFormat.OpenXml.Wordprocessing.Table();

                            DocumentFormat.OpenXml.Wordprocessing.Table tableData = new DocumentFormat.OpenXml.Wordprocessing.Table();

                            DocumentFormat.OpenXml.Wordprocessing.Table tableFooter = new DocumentFormat.OpenXml.Wordprocessing.Table();

                            int releaseTerm = 9;

                            if (item.ReleaseTerm != null)
                            {
                                releaseTerm = item.ReleaseTerm ?? 9;
                            }

                            if (typeExportWord == 1)
                            {
                                AddTableOne(body, tableTitle, tableData, typeExportWord,
                                    "Tên báo: " + item.DocumentTypeName,
                                    nam: $"Năm học: {startYear} - {startYear + 1}",
                                    diaChi: "Địa chỉ: " + item.PlaceOfProduction,
                                    dinhKy: "Định kỳ: " + arrayDinhKy[releaseTerm - 1],
                                    ngonNgu: "Ngôn ngữ: " + item.Language,
                                    slDangKy: "SL đăng ký: " + item.NumberOfCopies,
                                    khoGiay: "Khổ giấy: " + item.PaperSize);
                            }
                            else if (typeExportWord == 3)
                            {
                                AddTableOne(body, tableTitle, tableData, typeExportWord,
                                    "Tên báo: " + item.DocumentTypeName,
                                    nam: null,
                                    diaChi: "Địa chỉ: " + item.PlaceOfProduction,
                                    dinhKy: "Định kỳ: " + arrayDinhKy[releaseTerm - 1],
                                    ngonNgu: "Ngôn ngữ: " + item.Language,
                                    slDangKy: "SL đăng ký: " + item.NumberOfCopies,
                                    khoGiay: "Khổ giấy: " + item.PaperSize);
                            }
                            else
                            {
                                AddTableTwo(body, tableTitle, tableData, typeExportWord,
                                    "Tên báo: " + item.DocumentTypeName,
                                    startYear,
                                    nam: (typeExportWord == 2) ? $"Năm học: {startYear} - {startYear + 1}" : null,
                                    diaChi: "Địa chỉ: " + item.PlaceOfProduction,
                                    dinhKy: "Định kỳ: " + arrayDinhKy[releaseTerm - 1],
                                    ngonNgu: "Ngôn ngữ: " + item.Language,
                                    slDangKy: "SL đăng ký: " + item.NumberOfCopies,
                                    khoGiay: "Khổ giấy: " + item.PaperSize);
                            }

                            if (typeExportWord == 1 || typeExportWord == 3)
                            {
                                for (int row = 0; row < item.ListMagazineOne.GetLength(0); row++)
                                {
                                    for (int col = 0; col < item.ListMagazineOne.GetLength(1); col++)
                                    {
                                        WordSetCellContent(tableData, col + 2, row + 1, string.Join(", ", item.ListMagazineOne[row, col]), JustificationValues.Left, false);
                                    }
                                }
                            }
                            else if (typeExportWord == 2)
                            {
                                for (int col = 0; col < item.ListMagazineTwo.GetLength(1); col++)
                                {
                                    WordSetCellContent(tableData, 2, col + 1, string.Join(", ", item.ListMagazineTwo[0, col]), JustificationValues.Left, false);
                                }

                            }
                            else if (typeExportWord == 4)
                            {
                                for (int row = 0; row < item.ListMagazineTwo.GetLength(0); row++)
                                {
                                    for (int col = 0; col < item.ListMagazineTwo.GetLength(1); col++)
                                    {
                                        WordSetCellContent(tableData, row + 2, col + 1, string.Join(", ", item.ListMagazineTwo[row, col]), JustificationValues.Left, false);
                                    }
                                }
                            }



                            body.Append(CreateParagraph("", "28", JustificationValues.Left, 0));

                            body.Append(CreateParagraph("Ghi chú: ", "28", JustificationValues.Left, 0, true));


                            AddTableFooter(body, tableFooter);

                            // Kiểm tra nếu item không phải là phần tử cuối cùng thì thêm page break
                            if (!item.Equals(analystMagazines.Last()))
                            {
                                body.Append(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Break() { Type = BreakValues.Page })));
                            }



                        }


                        // Lưu tài liệu
                        mainPart.Document.Save();
                    }

                    // Chuyển đổi tài liệu Word thành mảng byte
                    byte[] wordBytes = stream.ToArray();

                    // Trả về file Word dưới dạng FileResult
                    return File(wordBytes, MediaTypeNames.Application.Octet, "SoDangKyBaoTapChi.docx");
                }
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ nếu có lỗi
                throw new Exception("Error generating Word file", ex);
            }



        }


        #endregion


        #region EXCEL, WORD

        private void AddTitleContentToFirstPage(Body body, string schoolName)
        {

            // Thêm đoạn văn cho tiêu đề "Thư viện"
            body.Append(CreateParagraph("THƯ VIỆN", "28", JustificationValues.Center, 0));

            // Thêm đoạn văn cho tiêu đề schoolName
            body.Append(CreateParagraph(schoolName.Trim(), "28", JustificationValues.Center, 240));

            // Thêm các đoạn văn trống để tạo khoảng cách
            for (int i = 0; i < 7; i++)
            {
                body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));
            }

            // Thêm đoạn văn mới với nội dung "SỔ ĐĂNG KÝ BÁO, TẠP CHÍ"
            body.Append(CreateParagraph("SỔ ĐĂNG KÝ BÁO, TẠP CHÍ", "52", JustificationValues.Center, 240));

            // Thêm đoạn văn mới với nội dung "Số: ..."
            body.Append(CreateParagraph("SỐ: ...", "28", JustificationValues.Center, 0));
        }

        private string FormatNumberRange(List<int> numbers)
        {
            if (numbers == null || !numbers.Any())
                return string.Empty;

            // Sắp xếp các số và loại bỏ các số trùng lặp
            var sortedNumbers = numbers.Distinct().OrderBy(n => n).ToList();
            var ranges = new List<string>();

            int start = sortedNumbers[0];
            int end = start;

            for (int i = 1; i < sortedNumbers.Count; i++)
            {
                if (sortedNumbers[i] == end + 1)
                {
                    end = sortedNumbers[i];
                }
                else
                {
                    // Xử lý khoảng liên tiếp
                    if (start == end)
                    {
                        ranges.Add(start.ToString());
                    }
                    else
                    {
                        ranges.Add($"{start}-{end}");
                    }

                    // Bắt đầu một khoảng mới
                    start = sortedNumbers[i];
                    end = start;
                }
            }

            // Thêm khoảng cuối cùng
            if (start == end)
            {
                ranges.Add(start.ToString());
            }
            else
            {
                ranges.Add($"{start}-{end}");
            }

            return string.Join(", ", ranges);
        }

        private void SetCellStyle(ExcelRange cell, ExcelBorderStyle borderStyle, ExcelHorizontalAlignment hAlign, ExcelVerticalAlignment vAlign, string numberFormat = null)
        {
            cell.Style.Border.BorderAround(borderStyle);
            cell.Style.HorizontalAlignment = hAlign;
            cell.Style.VerticalAlignment = vAlign;
            cell.Style.WrapText = true;
            cell.Style.Font.Name = "Times New Roman";
            cell.Style.Font.Size = 13; // Thiết lập kích thước font
            if (numberFormat != null)
            {
                cell.Style.Numberformat.Format = numberFormat;
            }
        }

        private void SetCellValue(ExcelWorksheet worksheet, int row, int col, object value, ExcelBorderStyle borderStyle = ExcelBorderStyle.Thin, string numberFormat = null)
        {
            var cell = worksheet.Cells[row, col];
            cell.Value = value;
            SetCellStyle(cell, borderStyle, ExcelHorizontalAlignment.Center, ExcelVerticalAlignment.Center, numberFormat);
        }

        private void WordSetCellContent(DocumentFormat.OpenXml.Wordprocessing.Table table, int rowIndex, int columnIndex, string data, JustificationValues justification, bool isBold = true, bool isFillColor = false)
        {
            TableCell cell = table.Elements<TableRow>()
                                   .ElementAt(rowIndex)
                                   .Elements<TableCell>()
                                   .ElementAt(columnIndex);

            cell.RemoveAllChildren<DocumentFormat.OpenXml.Wordprocessing.Paragraph>();

            TableCellProperties cellProperties = new TableCellProperties(
                new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center },
                isFillColor ? new Shading { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "BFBFBF" } : null
            );


            // Thêm thuộc tính và đoạn văn vào ô
            cell.Append(cellProperties);
            cell.Append(CreateParagraph(data, "22", justification, 0, isBold));
        }

        private DocumentFormat.OpenXml.Wordprocessing.Paragraph CreateParagraph(string text, string fontSize, JustificationValues justification, int spacingAfter, bool isBold = true)
        {
            return new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                new ParagraphProperties(
                    new Justification { Val = justification },
                    new SpacingBetweenLines { After = spacingAfter.ToString() }
                ),
                new DocumentFormat.OpenXml.Wordprocessing.Run(
                    new DocumentFormat.OpenXml.Wordprocessing.RunProperties(
                        isBold ? new DocumentFormat.OpenXml.Wordprocessing.Bold() : null,
                        new RunFonts { Ascii = "Times New Roman", HighAnsi = "Times New Roman" },
                        new DocumentFormat.OpenXml.Wordprocessing.FontSize { Val = fontSize }
                    ),
                    new DocumentFormat.OpenXml.Wordprocessing.Text(text)
                )
            );
        }

        private void AddTableOne(Body body, DocumentFormat.OpenXml.Wordprocessing.Table tableTitle, DocumentFormat.OpenXml.Wordprocessing.Table table, int typeExportWord, string documentTypeName, string diaChi = "Địa chỉ: ...", string nam = "Năm: ...", string ngonNgu = "Tiếng: ...", string khoGiay = "Khổ: ...", string dinhKy = "Định kỳ: ....", string slDangKy = "SL đăng ký: ...Tờ/số")
        {
            DocumentFormat.OpenXml.Wordprocessing.Paragraph paragraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                new ParagraphProperties(
                    new Justification { Val = JustificationValues.Center }
                ),
                new DocumentFormat.OpenXml.Wordprocessing.Run(
                    new DocumentFormat.OpenXml.Wordprocessing.RunProperties(
                        new DocumentFormat.OpenXml.Wordprocessing.Bold(),
                        new DocumentFormat.OpenXml.Wordprocessing.FontSize { Val = "28" },
                        new RunFonts { Ascii = "Times New Roman", HighAnsi = "Times New Roman" }

                    ),
                    new DocumentFormat.OpenXml.Wordprocessing.Text(documentTypeName.ToUpper().Trim())
                )
            );
            body.Append(paragraph);
            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));


            DocumentFormat.OpenXml.Wordprocessing.TableProperties tableTitleProperties = new DocumentFormat.OpenXml.Wordprocessing.TableProperties(
                new TableWidth { Width = "100%", Type = TableWidthUnitValues.Pct }
            );

            tableTitle.AppendChild(tableTitleProperties);

            // Tạo 2 dòng với 3 cột
            for (int row = 0; row < 2; row++)
            {
                TableRow tableRow = new TableRow();

                for (int col = 0; col < 3; col++)
                {
                    TableCell cell = new TableCell(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Text(""))));
                    TableCellProperties cellProperties = new TableCellProperties(
                        new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center }
                    );
                    cell.Append(cellProperties);
                    tableRow.Append(cell);
                }

                tableTitle.Append(tableRow);
            }

            WordSetCellContent(tableTitle, 0, 0, diaChi, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 0, nam, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 0, 1, ngonNgu, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 1, khoGiay, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 0, 2, dinhKy, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 2, slDangKy, JustificationValues.Left, false);


            body.Append(tableTitle);

            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));


            TableProperties tableProperties = new TableProperties(
                new TableWidth { Width = "100%", Type = TableWidthUnitValues.Pct },
                new TableBorders(
                    new DocumentFormat.OpenXml.Wordprocessing.TopBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.BottomBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.LeftBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.RightBorder { Val = BorderValues.Single, Size = 4 },
                    new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4 },
                    new InsideVerticalBorder { Val = BorderValues.Single, Size = 4 }
                )
            );
            table.AppendChild(tableProperties);

            // Tạo 14 dòng với 32 cột
            for (int row = 0; row < 14; row++)
            {
                TableRow tableRow = new TableRow();

                for (int col = 0; col < 32; col++)
                {
                    TableCell cell = new TableCell(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Text(""))));
                    TableCellProperties cellProperties = new TableCellProperties(
                        new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center }
                    );
                    cell.Append(cellProperties);
                    tableRow.Append(cell);
                }

                table.Append(tableRow);
            }

            WordSetCellContent(table, 0, 0, "Ngày", JustificationValues.Center, true, true);

            WordSetCellContent(table, 1, 0, "Tháng", JustificationValues.Center, true, true);

            for (int i = 1; i <= 31; i++)
            {
                // Lấy ô của dòng đầu tiên tại cột i
                TableRow firstRow = table.Elements<TableRow>().ElementAt(0);
                TableCell firstCell = firstRow.Elements<TableCell>().ElementAt(i);

                // Lấy ô của dòng thứ hai tại cột i
                TableRow secondRow = table.Elements<TableRow>().ElementAt(1);
                TableCell secondCell = secondRow.Elements<TableCell>().ElementAt(i);

                WordSetCellContent(table, 0, i, $"{i}", JustificationValues.Center, true, true);

                firstCell.Append(new TableCellProperties(
                    new VerticalMerge { Val = MergedCellValues.Restart } // Bắt đầu gộp theo cột
                ));

                // Cài đặt thuộc tính gộp cho ô thứ hai
                secondCell.Append(new TableCellProperties(
                    new VerticalMerge { Val = MergedCellValues.Continue } // Tiếp tục gộp theo cột
                ));
            }

            if (typeExportWord == 1)
            {
                int[] months = new int[] { 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7 };
                for (int i = 3; i <= 14; i++)
                {
                    int month = months[i - 3];
                    WordSetCellContent(table, i - 1, 0, month.ToString(), JustificationValues.Center);
                }
            }
            else
            {
                for (int i = 3; i <= 14; i++)
                {
                    WordSetCellContent(table, i - 1, 0, $"{i - 2}", JustificationValues.Center);
                }
            }


            // Thêm bảng vào tài liệu
            body.Append(table);
        }

        private void AddTableTwo(Body body, DocumentFormat.OpenXml.Wordprocessing.Table tableTitle, DocumentFormat.OpenXml.Wordprocessing.Table table, int typeExportWord, string documentTypeName, int year = 0, string diaChi = "Địa chỉ: ...", string nam = "Năm: ...", string ngonNgu = "Tiếng: ...", string khoGiay = "Khổ: ...", string dinhKy = "Định kỳ: ....", string slDangKy = "SL đăng ký: ...Tờ/số")
        {
            DocumentFormat.OpenXml.Wordprocessing.Paragraph paragraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                new ParagraphProperties(
                    new Justification { Val = JustificationValues.Center }
                ),
                new DocumentFormat.OpenXml.Wordprocessing.Run(
                    new DocumentFormat.OpenXml.Wordprocessing.RunProperties(
                        new DocumentFormat.OpenXml.Wordprocessing.Bold(),
                        new DocumentFormat.OpenXml.Wordprocessing.FontSize { Val = "28" },
                        new RunFonts { Ascii = "Times New Roman", HighAnsi = "Times New Roman" }

                    ),
                    new DocumentFormat.OpenXml.Wordprocessing.Text(documentTypeName.ToUpper().Trim())
                )
            );
            body.Append(paragraph);
            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));


            TableProperties tableTitleProperties = new TableProperties(
                new TableWidth { Width = "100%", Type = TableWidthUnitValues.Pct }
            );

            tableTitle.AppendChild(tableTitleProperties);

            // Tạo 2 dòng với 3 cột
            for (int row = 0; row < 2; row++)
            {
                TableRow tableRow = new TableRow();

                for (int col = 0; col < 3; col++)
                {
                    TableCell cell = new TableCell(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Text(""))));
                    TableCellProperties cellProperties = new TableCellProperties(
                        new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center }
                    );
                    cell.Append(cellProperties);
                    tableRow.Append(cell);
                }

                tableTitle.Append(tableRow);
            }

            WordSetCellContent(tableTitle, 0, 0, diaChi, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 0, nam, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 0, 1, ngonNgu, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 1, khoGiay, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 0, 2, dinhKy, JustificationValues.Left, false);
            WordSetCellContent(tableTitle, 1, 2, slDangKy, JustificationValues.Left, false);


            body.Append(tableTitle);

            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));


            TableProperties tableProperties = new TableProperties(
                new TableWidth { Width = "100%", Type = TableWidthUnitValues.Pct },
                new TableBorders(
                    new DocumentFormat.OpenXml.Wordprocessing.TopBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.BottomBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.LeftBorder { Val = BorderValues.Single, Size = 4 },
                    new DocumentFormat.OpenXml.Wordprocessing.RightBorder { Val = BorderValues.Single, Size = 4 },
                    new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4 },
                    new InsideVerticalBorder { Val = BorderValues.Single, Size = 4 }
                )
            );
            table.AppendChild(tableProperties);


            int rowInit = 3;

            if (typeExportWord == 4)
            {
                rowInit = 4;
            }


            for (int row = 0; row < rowInit; row++)
            {
                TableRow tableRow = new TableRow();

                for (int col = 0; col < 14; col++)
                {
                    TableCell cell = new TableCell(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Text(""))));
                    TableCellProperties cellProperties = new TableCellProperties(
                        new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center }
                    );
                    cell.Append(cellProperties);
                    tableRow.Append(cell);
                }

                table.Append(tableRow);
            }



            WordSetCellContent(table, 0, 0, "Tháng", JustificationValues.Center, true, true);

            WordSetCellContent(table, 1, 0, "Năm", JustificationValues.Center, true, true);

            int[] months = new int[] { 0, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7 };

            for (int i = 1; i <= 13; i++)
            {
                // Lấy ô của dòng đầu tiên tại cột i
                TableRow firstRow = table.Elements<TableRow>().ElementAt(0);
                TableCell firstCell = firstRow.Elements<TableCell>().ElementAt(i);

                // Lấy ô của dòng thứ hai tại cột i
                TableRow secondRow = table.Elements<TableRow>().ElementAt(1);
                TableCell secondCell = secondRow.Elements<TableCell>().ElementAt(i);

                if (i == 13)
                {
                    WordSetCellContent(table, 0, i, "Ghi chú", JustificationValues.Center, true, true);
                }
                else
                {
                    if (typeExportWord == 2)
                    {
                        WordSetCellContent(table, 0, i, $"{months.ElementAt(i)}", JustificationValues.Center, true, true);
                    }
                    else
                    {
                        WordSetCellContent(table, 0, i, $"{i}", JustificationValues.Center, true, true);
                    }

                }

                firstCell.Append(new TableCellProperties(
                    new VerticalMerge { Val = MergedCellValues.Restart } // Bắt đầu gộp theo cột
                ));

                // Cài đặt thuộc tính gộp cho ô thứ hai
                secondCell.Append(new TableCellProperties(
                    new VerticalMerge { Val = MergedCellValues.Continue } // Tiếp tục gộp theo cột
                ));
            }


            if (typeExportWord == 2)
            {
                WordSetCellContent(table, 2, 0, $"{year} - {year + 1}", JustificationValues.Center);
            }
            else
            {
                WordSetCellContent(table, 2, 0, year.ToString(), JustificationValues.Center);
                WordSetCellContent(table, 3, 0, (year + 1).ToString(), JustificationValues.Center);
            }




            // Thêm bảng vào tài liệu
            body.Append(table);
        }

        private void AddTableFooter(Body body, DocumentFormat.OpenXml.Wordprocessing.Table tableFooter)
        {

            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));


            TableProperties tableTitleProperties = new TableProperties(
                new TableWidth { Width = "100%", Type = TableWidthUnitValues.Pct }
            );

            tableFooter.AppendChild(tableTitleProperties);

            // Tạo 3 dòng với 2 cột
            for (int row = 0; row < 3; row++)
            {
                TableRow tableRow = new TableRow();

                for (int col = 0; col < 2; col++)
                {
                    TableCell cell = new TableCell(new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new DocumentFormat.OpenXml.Wordprocessing.Run(new DocumentFormat.OpenXml.Wordprocessing.Text(""))));
                    TableCellProperties cellProperties = new TableCellProperties(
                        new TableCellVerticalAlignment { Val = TableVerticalAlignmentValues.Center }
                    );
                    cell.Append(cellProperties);
                    tableRow.Append(cell);
                }

                tableFooter.Append(tableRow);
            }

            WordSetCellContent(tableFooter, 0, 0, "Cán bộ thư viện", JustificationValues.Center, true);
            WordSetCellContent(tableFooter, 0, 1, ".........., ngày ... tháng ... năm ..........", JustificationValues.Center, false);
            WordSetCellContent(tableFooter, 1, 1, "Hiệu Trưởng", JustificationValues.Center, true);
            WordSetCellContent(tableFooter, 2, 1, "(ký tên và đóng dấu)", JustificationValues.Center, false);




            body.Append(tableFooter);

            body.Append(CreateParagraph("", "28", JustificationValues.Center, 0));

        }

        #endregion
    }
}