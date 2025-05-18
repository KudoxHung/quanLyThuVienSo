using AutoMapper;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mime;


namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : Controller
    {
        #region Variables

        private readonly ICategoryPublisherRepository _categoryPublisherRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IIndividualSampleRepository _individualSampleRepository;
        private readonly IDocumentTypeRepository _documentTypeRepository;
        private readonly ICategorySign_V1Repository _categorySign_V1Repository;
        private readonly ICategorySignParentsRepository _categorySignParents;
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<BookController> _logger;
        private readonly SaveToDiary _saveToDiary;
        private readonly ICategorySignRepository _categorySignRepository;
        private readonly IDocumentStockRepository _documentStockRepository;
        private readonly ICategoryColor _categoryColor;

        #endregion

        #region Contructor

        public BookController(IBookRepository bookRepository,
            IOptionsMonitor<AppSettingModel> optionsMonitor,
            IDocumentStockRepository documentStockRepository,
            IIndividualSampleRepository individualSampleRepository,
            IMapper mapper,
            IDocumentTypeRepository documentTypeRepository,
            ICategorySign_V1Repository categorySign_V1Repository,
            ICategorySignParentsRepository categorySignParents,
            SaveToDiary saveToDiary,
            ICategorySignRepository categorySignRepository,
            ILogger<BookController> logger,
            ICategoryPublisherRepository categoryPublisherRepository,
            JwtService jwtService, IUserRepository userRepository,
            ICategoryColor categoryColor)
        {
            _categoryColor = categoryColor;
            _appSettingModel = optionsMonitor.CurrentValue;
            _documentStockRepository = documentStockRepository;
            _mapper = mapper;
            _jwtService = jwtService;
            _categorySign_V1Repository = categorySign_V1Repository;
            _categorySignParents = categorySignParents;
            _documentTypeRepository = documentTypeRepository;
            _userRepository = userRepository;
            _saveToDiary = saveToDiary;
            _bookRepository = bookRepository;
            _individualSampleRepository = individualSampleRepository;
            _categoryPublisherRepository = categoryPublisherRepository;
            _categorySignRepository = categorySignRepository;
            _logger = logger;
        }

        #endregion

        #region Admin Site

        // GET: api/Book/GetSpineBookByMultipleDocumentType
        [HttpGet]
        [Route("GetSpineBookByMultipleDocumentType")]
        public List<SpineBookModel> GetSpineBookByMultipleDocumentType()
        {
            try
            {
                var result = _bookRepository.GetSpineBookByMultipleDocumentType();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookExistIndividualCode
        [HttpGet]
        [Route("GetBookExistIndividualCode")]
        public List<ListBookNew> GetBookExistIndividualCode(int pageNumber, int pageSize, int documentType)
        {
            try
            {
                var document = _bookRepository.GetBookExistIndividualCode(pageNumber, pageSize, documentType);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/Book/GetBookAll
        [HttpGet]
        [Route("GetBookAll")]
        public List<DocumentModel> GetBookAll(int pageNumber, int pageSize)
        {
            try
            {
                List<DocumentDto> documentDtos = new List<DocumentDto>();
                documentDtos = _bookRepository.getAllBook(pageNumber, pageSize);

                List<DocumentModel> documentModels = new List<DocumentModel>();
                documentModels = _mapper.Map<List<DocumentModel>>(documentDtos);

                return documentModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // HttpPost: /api/Book/InsertBookAndIndividualByExcel
        [HttpPost]
        [Route("InsertBookAndIndividualByExcel")]
        public IActionResult InsertBookAndIndividualByExcel()
        {
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                bool checkAddUser = false;
                var addCategorySignByExcels = new List<AddCategorySignByExcel>();

                using (var package = new ExcelPackage(Request.Form.Files[0].OpenReadStream()))
                {
                    // Get the first worksheet in the workbook
                    var worksheet = package.Workbook.Worksheets[0];

                    // Read the cell values in the worksheet
                    for (int row = 2; row <= worksheet.Dimension.Rows; row++)
                    {
                        var documentDto = new DocumentDto();
                        var categoryV1 = new CategorySign_V1Dto();
                        int cnt = 0;
                        for (int j = 1; j <= worksheet.Dimension.Columns; j++)
                        {
                            if (worksheet.Cells[row, j].Value == null)
                            {
                                cnt++;
                            }
                        }
                        if (cnt == worksheet.Dimension.Columns)
                        {
                            break;
                        }
                        else
                        {
                            for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                            {
                                // Get the cell value at the current row and column
                                string cellValue = worksheet.Cells[row, col].Value?.ToString();

                                // Process the cell value
                                if (col == 1)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.DocName = cellValue;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }
                                }
                                else if (col == 2)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.Language = cellValue;
                                    }

                                }
                                else if (col == 3)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.Publisher = cellValue;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }
                                }
                                else if (col == 4)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.PublishPlace = cellValue;
                                    }

                                }
                                else if (col == 5)
                                {
                                    if (cellValue is not null)
                                    {
                                        var temp = cellValue.Split('/');
                                        if (temp.Length > 1)
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[2].Split(' ')[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                        else
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                    }
                                }
                                else if (col == 6)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.IsHavePhysicalVersion = bool.Parse(cellValue);
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }
                                }
                                else if (col == 7)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.Author = cellValue;
                                    }

                                }
                                else if (col == 8)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.Price = long.Parse(cellValue.Replace(",", "").Replace(".", ""));
                                    }

                                }
                                else if (col == 9)
                                {
                                    if (cellValue is not null)
                                    {
                                        documentDto.Description = cellValue;
                                    }
                                }
                                else if (col == 10)
                                {
                                    if (cellValue is not null)
                                    {
                                        var z = col + 1;
                                        var idd = worksheet.Cells[row, z].Value.ToString();
                                        var name = cellValue;
                                        var idCategorySign_V1 = Guid.Empty;
                                        var namedWorksheet1 = package.Workbook.Worksheets[2];
                                        var categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < categorySign_V1Dtos.Count; t++)
                                        {
                                            var cellVal = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                            var idVal = namedWorksheet1.Cells[rowSignV1, 3].Value;
                                            if (cellVal != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellVal.ToString();

                                                    if (cellGuid == name && idVal.ToString() == idd)
                                                    {
                                                        idCategorySign_V1 = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }

                                        documentDto.IdCategorySign_V1 = idCategorySign_V1;
                                        categoryV1.Id = idCategorySign_V1;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }


                                }
                                else if (col == 12)
                                {
                                    if (cellValue is not null)
                                    {
                                        var id = _categorySign_V1Repository.getAllCategorySignV1ById(categoryV1.Id);
                                        if (id != null)
                                        {
                                            if (id.IdCategoryParent == null || id.IdCategoryParent == Guid.Empty)
                                            {
                                                var name = cellValue;
                                                var idCatogoryParent = Guid.Empty;
                                                var namedWorksheet1 = package.Workbook.Worksheets[3];
                                                var CatogoryParent = _categorySignParents.getAllCategorySignParent();
                                                int rowSignV1 = 2;
                                                for (int t = 0; t < CatogoryParent.Count; t++)
                                                {
                                                    var cellVal = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                                    if (cellValue != null)
                                                    {
                                                        try
                                                        {
                                                            var cellGuid = cellVal.ToString();

                                                            if (cellGuid == name)
                                                            {
                                                                idCatogoryParent = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                                break;
                                                            }
                                                        }
                                                        catch (FormatException)
                                                        {

                                                        }
                                                    }
                                                    rowSignV1++;
                                                }
                                                documentDto.IdCategoryParent = idCatogoryParent;
                                                categoryV1.IdCategoryParent = idCatogoryParent;


                                            }
                                            else
                                            {
                                                documentDto.IdCategoryParent = id.IdCategoryParent;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }

                                }
                                else if (col == 13)
                                {
                                    if (cellValue is not null)
                                    {
                                        var name = cellValue;
                                        var idDocumentType = Guid.Empty;
                                        var namedWorksheet1 = package.Workbook.Worksheets[1];
                                        var categorySign_V1Dtos = _documentTypeRepository.GetAllDocumentType();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < categorySign_V1Dtos.Count; t++)
                                        {
                                            var cellVal = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                            if (cellVal != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellVal.ToString();

                                                    if (cellGuid == name)
                                                    {
                                                        idDocumentType = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }
                                        documentDto.DocumentTypeId = idDocumentType;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + row + " cột " + col + " không được để trống"
                                        });
                                    }

                                }
                                else if (col == 18)
                                {

                                    if (cellValue is not null)
                                    {
                                        Guid idCategoryColor = _categoryColor.GetIdByColorName(cellValue);
                                        documentDto.IdCategoryColor = idCategoryColor;
                                    }

                                }
                            }
                        }
                        _categorySign_V1Repository.UpdateCategorySignV11(categoryV1);
                        if (documentDto.DocName == null)
                        {
                            continue;
                        }

                        documentDto.ID = Guid.NewGuid();
                        documentDto.IsApproved = false;
                        documentDto.CreatedBy = checkModel.Id;
                        documentDto.Status = 0;
                        documentDto.CreatedDate = DateTime.Now;
                        documentDto.IsDeleted = false;
                        documentDto.NumberLike = 0;
                        documentDto.NumberUnlike = 0;
                        documentDto.NumberView = 0;
                        //documentDto.IsHavePhysicalVersion = false;
                        try
                        {
                            documentDto.EncryptDocumentName =
                            _individualSampleRepository.GetCodeBookNameEncrypt(documentDto.DocName);
                        }
                        catch (Exception e)
                        {
                            _logger.LogError($"Đã xảy ra lỗi: {e}");
                            throw;
                        }

                        var response = new Response();
                        response = _bookRepository.InsertDocument(documentDto);

                        var documentAvatar = new DocumentAvatarDto
                        {
                            Id = Guid.NewGuid(),
                            Path = _appSettingModel.ServerFileImage + @"\",
                            Status = 0,
                            CreateBy = checkModel.Id,
                            CreateDate = DateTime.Now,
                            FileNameExtention = "jpg",
                            SizeImage = "1",
                            IdDocument = documentDto.ID
                        };

                        if (response.Success)
                        {
                            //insert document avatar
                            response = _bookRepository.InsertDocumentAvatar(documentAvatar);

                            int quantity = 1;
                            string NumberIndividual = "";
                            var IdCategorySign = new Guid();
                            var StockId = new Guid();

                            if (worksheet.Cells[row, 14].Value != null)
                            {
                                var name = worksheet.Cells[row, 14].Value.ToString();
                                var idStock = Guid.Empty;
                                var namedWorksheet1 = package.Workbook.Worksheets[6];
                                var listStock = _documentStockRepository.GetAllDocumentStocks();
                                int rowSignV1 = 2;
                                for (int t = 0; t < listStock.Count; t++)
                                {
                                    var cellVal = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                    if (cellVal != null)
                                    {
                                        try
                                        {
                                            var cellGuid = cellVal.ToString();

                                            if (cellGuid == name)
                                            {
                                                idStock = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                break;
                                            }
                                        }
                                        catch (FormatException)
                                        {

                                        }
                                    }
                                    rowSignV1++;
                                }
                                StockId = idStock;
                            }
                            else
                            {
                                return Ok(new
                                {
                                    Success = false,
                                    Message = "Dòng " + row + " cột " + 14 + " không được để trống"
                                });
                            }
                            if (worksheet.Cells[row, 16].Value != null)
                            {
                                NumberIndividual = worksheet.Cells[row, 16].Value.ToString();
                            }
                            else
                            {
                                return Ok(new
                                {
                                    Success = false,
                                    Message = "Dòng " + row + " cột " + 1 + " không được để trống"
                                });
                            }
                            if (worksheet.Cells[row, 15].Value != null)
                            {
                                IdCategorySign = new Guid(worksheet.Cells[row, 15].Value.ToString());
                            }
                            else
                            {
                                return Ok(new
                                {
                                    Success = false,
                                    Message = "Dòng " + row + " cột " + 16 + " không được để trống"
                                });
                            }
                            if (worksheet.Cells[row, 17].Value != null)
                                quantity = int.Parse(worksheet.Cells[row, 17].Value.ToString());


                            string SignIndividual = "";
                            for (int t = 1; t < NumberIndividual.Split('-').Length; t++)
                            {
                                if (t == 1)
                                {
                                    SignIndividual += NumberIndividual.Split('-')[t].Trim();

                                }
                                else
                                {
                                    SignIndividual += "-" + NumberIndividual.Split('-')[t].Trim();

                                }
                            }


                            for (int j = 0; j < quantity; j++)
                            {
                                if (SignIndividual == "SGK")
                                {
                                    // return false if no record otherwise
                                    bool checkExitDocumentAndDocumentType = _individualSampleRepository
                                        .CheckExitDocumnentAndDocumentType(documentDto.ID, documentDto.DocumentTypeId);

                                    if (!checkExitDocumentAndDocumentType)
                                    {
                                        string sign = SignIndividual;
                                        // generate number Individual
                                        int increase = 1;
                                        NumberIndividual = sign + increase + "/" + IdCategorySign;
                                    }
                                    else
                                    {
                                        string sign = SignIndividual;
                                        Guid IdDocument = documentDto.ID;
                                        Guid IdDocumentType = documentDto.DocumentTypeId;
                                        int maxNumberIndividual =
                                            _individualSampleRepository.getNumIndividualMax(IdCategorySign, IdDocument,
                                                IdDocumentType);
                                        // generate number Individual
                                        int increase = maxNumberIndividual + 1;
                                        NumberIndividual = sign + increase + "/" + IdCategorySign;
                                    }
                                }
                                else
                                {
                                    // invidualsample increase here
                                    int maxNumberIndividual =
                                        _individualSampleRepository.getNumIndividualMaxByIdCategorySign(IdCategorySign);
                                    string sign = SignIndividual;
                                    // generate number Individual
                                    int increase = maxNumberIndividual + 1;
                                    NumberIndividual = sign + increase + "/" + IdCategorySign;
                                }
                                var individualSampleDto = new IndividualSampleDto
                                {
                                    Id = Guid.NewGuid(),
                                    NumIndividual = NumberIndividual,
                                    Barcode = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
                                    IsLostedPhysicalVersion = false,
                                    IsDeleted = false,
                                    Status = 1,
                                    CreatedBy = checkModel.Id,
                                    CreatedDate = DateTime.Now,
                                    IdDocument = documentDto.ID,
                                    StockId = StockId,
                                    DocumentTypeId = documentDto.DocumentTypeId
                                };

                                _individualSampleRepository.InsertIndividualSample(individualSampleDto);
                            }
                        }

                        if (!response.Success)
                        {
                            checkAddUser = true;
                            AddCategorySignByExcel addCategorySignByExcel = new AddCategorySignByExcel();
                            addCategorySignByExcel.ID = documentDto.ID;
                            addCategorySignByExcel.SignName = documentDto.DocName;

                            addCategorySignByExcels.Add(addCategorySignByExcel);
                        }
                    }
                }

                if (checkAddUser)
                {
                    return Ok(new
                    {
                        Success = false,
                        Fail = true,
                        Message = "Thêm mới không thành công !"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        Success = true,
                        Fail = false,
                        Message = "Thêm mới thành công !"
                    });
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetFileExcelImportBookAndIndividual
        [HttpGet]
        [Route("GetFileExcelImportBookAndIndividual")]
        public IActionResult GetFileExcelImportBookAndIndividual()
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MauThemSachVaMaCaBiet.xlsm");
                FileInfo fi = new FileInfo(path);
                string fileCodeName = Guid.NewGuid().ToString();

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet0 = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet0.Cells["A2:R10000000"].Clear();

                    #region LOAD INFORMATION IN SHEET 1

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];
                    namedWorksheet.Cells["A2:C1000000"].Clear();

                    // get all table document type
                    List<DocumentTypeDto> documentTypeDto = _documentTypeRepository.GetAllDocumentType();
                    int row = 2;
                    for (int i = 0; i < documentTypeDto.Count; i++)
                    {
                        if (documentTypeDto[i].Status == 1)
                        {
                            namedWorksheet.Cells[row, 1].Value = documentTypeDto[i].Id;
                            namedWorksheet.Cells[row, 2].Value = documentTypeDto[i].DocTypeName;
                            if (documentTypeDto[i].Status == 1)
                            {
                                namedWorksheet.Cells[row, 3].Value = "Sách";
                            }

                            row++;
                        }
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 2

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet1 = excelPackage.Workbook.Worksheets[2];
                    namedWorksheet1.Cells["A2:D1000000"].Clear();

                    // get all table category sign v1
                    List<CategorySign_V1Dto> categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();


                    int rowSignV1 = 2;
                    for (int i = 0; i < categorySign_V1Dtos.Count; i++)
                    {
                        namedWorksheet1.Cells[rowSignV1, 1].Value = categorySign_V1Dtos[i].Id;
                        namedWorksheet1.Cells[rowSignV1, 2].Value = categorySign_V1Dtos[i].SignName;
                        namedWorksheet1.Cells[rowSignV1, 3].Value = categorySign_V1Dtos[i].SignCode;
                        if (categorySign_V1Dtos[i].IdCategoryParent == null)
                        {
                            namedWorksheet1.Cells[rowSignV1, 4].Value = "";
                        }
                        else
                        {
                            namedWorksheet1.Cells[rowSignV1, 4].Value = categorySign_V1Dtos[i].ParentName;
                        }

                        rowSignV1++;
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 3

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet3 = excelPackage.Workbook.Worksheets[3];

                    namedWorksheet3.Cells["A2:C1000000"].Clear();

                    // get all table category sign parent
                    var categoryparent1 = _categorySignParents.getAllCategorySignParent();

                    int rowSignV3 = 2;
                    for (int i = 0; i < categoryparent1.Count; i++)
                    {
                        namedWorksheet3.Cells[rowSignV3, 1].Value = categoryparent1[i].Id;
                        namedWorksheet3.Cells[rowSignV3, 2].Value = categoryparent1[i].ParentName;
                        namedWorksheet3.Cells[rowSignV3, 3].Value = categoryparent1[i].ParentCode;
                        rowSignV3++;
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 5

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet4 = excelPackage.Workbook.Worksheets[5];
                    namedWorksheet4.Cells["A2:B1000000"].Clear();

                    var result = _categoryPublisherRepository.GetAllPublisher();
                    int rowCategoryPublisher = 2;
                    for (int i = 0; i < result.Count; i++)
                    {
                        for (int j = 1; j <= 2; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Fill.PatternType =
                                    ExcelFillStyle.Solid;
                                namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Top.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Left.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Right.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;

                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Font.Size = 13;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet4.Cells[rowCategoryPublisher, 1].Value = result[i].Item1;
                        namedWorksheet4.Cells[rowCategoryPublisher, 2].Value = result[i].Item2;
                        rowCategoryPublisher++;
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 6

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw
                    ExcelWorksheet namedWorksheet5 = excelPackage.Workbook.Worksheets[6];
                    namedWorksheet5.Cells["A2:B1000000"].Clear();
                    var listDocumentStock = _documentStockRepository.GetIdAndNameDocumentStock();
                    int rowDocumentStock = 2;
                    for (int i = 0; i < listDocumentStock.Count; i++)
                    {
                        for (int j = 1; j <= 2; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet5.Cells[rowDocumentStock, j].Style.Fill.PatternType =
                                    ExcelFillStyle.Solid;
                                namedWorksheet5.Cells[rowDocumentStock, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;

                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Font.Size = 13;
                            namedWorksheet5.Cells[rowDocumentStock, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet5.Cells[rowDocumentStock, 1].Value = listDocumentStock[i].Item1;
                        namedWorksheet5.Cells[rowDocumentStock, 2].Value = listDocumentStock[i].Item2;
                        rowDocumentStock++;
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 7

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet6 = excelPackage.Workbook.Worksheets[7];
                    namedWorksheet6.Cells["A2:B10000000"].Clear();
                    var listIdAndSignCodeCategorySign = _categorySignRepository.GetIdAndSignCodeCategorySign();
                    int rowCategorySign = 2;
                    for (int i = 0; i < listIdAndSignCodeCategorySign.Count; i++)
                    {
                        for (int j = 1; j <= 2; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet6.Cells[rowCategorySign, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                namedWorksheet6.Cells[rowCategorySign, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet6.Cells[rowCategorySign, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategorySign, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategorySign, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategorySign, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                            namedWorksheet6.Cells[rowCategorySign, j].Style.Font.Size = 13;
                            namedWorksheet6.Cells[rowCategorySign, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet6.Cells[rowCategorySign, 1].Value = listIdAndSignCodeCategorySign[i].Item1;
                        namedWorksheet6.Cells[rowCategorySign, 2].Value = listIdAndSignCodeCategorySign[i].Item2 +
                                                                          " - " +
                                                                          listIdAndSignCodeCategorySign[i].Item3;
                        rowCategorySign++;
                    }

                    #endregion

                    #region LOAD INFORMATION IN SHEET 8
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet7 = excelPackage.Workbook.Worksheets[8];
                    namedWorksheet7.Cells["A2:B1000000"].Clear();
                    IEnumerable<CategoryColorDto> listCategoryColorTemp = _categoryColor.GetAllListCategoryColorNotPagination().ToList();
                    List<CategoryColorDto> listCategoryColor = listCategoryColorTemp.ToList();
                    int rowCategoryColor = 2;
                    for (int i = 0; i < listCategoryColor.Count; i++)
                    {
                        for (int j = 1; j <= 4; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet7.Cells[rowCategoryColor, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                namedWorksheet7.Cells[rowCategoryColor, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Font.Size = 13;
                            namedWorksheet7.Cells[rowCategoryColor, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet7.Cells[rowCategoryColor, 1].Value = listCategoryColor[i].Id;
                        namedWorksheet7.Cells[rowCategoryColor, 2].Value = listCategoryColor[i].ColorName;
                        namedWorksheet7.Cells[rowCategoryColor, 3].Value = listCategoryColor[i].ReadingLevel;
                        namedWorksheet7.Cells[rowCategoryColor, 4].Value = listCategoryColor[i].ColorCode;

                        rowCategoryColor++;
                    }
                    #endregion


                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                _logger.LogInformation("Tai file thanh cong");
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet,
                    "Mẫu thêm sách và mã cá biệt.xlsx");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Đã xảy ra lỗi: {ex}");
                throw;
            }
        }

        // POST: api/Book/InsertDocumentAndIndividualSample
        [HttpPost]
        [Route("InsertDocumentAndIndividualSample")]
        public IActionResult InsertDocumentAndIndividualSample(
            [FromForm] DocumentAndIndividualSampleModel documentModel)
        {
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                var documentDto = new DocumentDto();
                documentDto = _mapper.Map<DocumentDto>(documentModel);

                // define some col with data concrete
                documentDto.ID = Guid.NewGuid();
                documentDto.NumberView = 0;
                documentDto.NumberLike = 0;
                documentDto.NumberUnlike = 0;
                documentDto.ModifiedDate = DateTime.Now;
                documentDto.IsApproved = false;
                documentDto.Status = 0;
                documentDto.CreatedDate = DateTime.Now;
                documentDto.IsDeleted = false;
                documentDto.CreatedBy = checkModel.Id;
                documentDto.IsHavePhysicalVersion = false;

                if (documentModel.Author == "undefined" || documentModel.Author == "null")
                {
                    documentDto.Author = null;
                }

                if (documentModel.Description == "undefined" || documentModel.Description == "null")
                {
                    documentDto.Description = null;
                }

                var documentAvatar = new DocumentAvatarDto();
                // set data document avatar
                documentAvatar.Id = Guid.NewGuid();
                documentAvatar.Path = _appSettingModel.ServerFileImage + @"\";
                documentAvatar.Status = 0;
                documentAvatar.CreateBy = checkModel.Id;
                documentAvatar.CreateDate = DateTime.Now;
                documentAvatar.FileNameExtention = "jpg";
                documentAvatar.SizeImage = "1";
                documentAvatar.IdDocument = documentDto.ID;


                if (Request.Form.Files.Count > 0)
                {
                    foreach (var file in Request.Form.Files)
                    {
                        var fileContentType = file.ContentType;

                        if (fileContentType == "image/jpeg" || fileContentType == "image/png")
                        {
                            documentAvatar.NameFileAvatar = file.FileName;

                            // prepare path to save file image
                            string pathTo = _appSettingModel.ServerFileImage;
                            // get extention form file name
                            string IdFile = documentAvatar.Id.ToString() + ".jpg";

                            // set file path to save file
                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            // save file
                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }
                        }
                        else if (fileContentType == "application/pdf")
                        {
                            documentDto.OriginalFileName = file.FileName;
                            documentDto.FileName = documentDto.ID.ToString() + ".pdf";
                            documentDto.FileNameExtention = "pdf";
                            documentDto.FilePath = _appSettingModel.ServerFilePdf;

                            string pathTo = _appSettingModel.ServerFilePdf;
                            string IdFile = documentDto.ID.ToString() + "." + documentDto.FileNameExtention;

                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }
                        }
                    }
                }

                var result = _bookRepository.InsertDocument(documentDto);
                if (result.Success)
                {
                    if (documentModel.Quantity != "null")
                    {
                        //insert individual of book
                        for (int i = 0; i < int.Parse(documentModel.Quantity); i++)
                        {
                            var individualSampleDto = new IndividualSampleDto();
                            string NumberIndividual = "";

                            if (documentModel.SignIndividual == "SGK")
                            {
                                // return false if no record otherwire
                                bool checkExitDocumentAndDocumentType = _individualSampleRepository
                                    .CheckExitDocumnentAndDocumentType(documentDto.ID, documentDto.DocumentTypeId);

                                if (!checkExitDocumentAndDocumentType)
                                {
                                    var id = Guid.Parse(documentModel.IdCategory);
                                    string sign = documentModel.SignIndividual;

                                    // generate number Individual
                                    int increase = 1;
                                    NumberIndividual = sign + increase + "/" + documentModel.IdCategory;
                                }
                                else
                                {
                                    var id = Guid.Parse(documentModel.IdCategory);
                                    string sign = documentModel.SignIndividual;
                                    Guid IdDocument = documentDto.ID;
                                    Guid IdDocumentType = documentDto.DocumentTypeId;
                                    int maxNumberIndividual =
                                        _individualSampleRepository.getNumIndividualMax(id, IdDocument, IdDocumentType);
                                    // generate number Individual
                                    int increase = maxNumberIndividual + 1;
                                    NumberIndividual = sign + increase + "/" + documentModel.IdCategory;
                                }
                            }
                            else
                            {
                                var idCategorySign = Guid.Parse(documentModel.IdCategory);
                                int maxNumberIndividual =
                                    _individualSampleRepository.getNumIndividualMaxByIdCategorySign(idCategorySign);
                                string sign = documentModel.SignIndividual;

                                // generate number Individual
                                int increase = maxNumberIndividual + 1;
                                NumberIndividual = sign + increase + "/" + documentModel.IdCategory;
                            }

                            // define some col with data concrete
                            individualSampleDto.Id = Guid.NewGuid();
                            individualSampleDto.NumIndividual = NumberIndividual;
                            individualSampleDto.Barcode = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
                            individualSampleDto.IsLostedPhysicalVersion = false;
                            individualSampleDto.IsDeleted = false;
                            individualSampleDto.Status = 1;
                            individualSampleDto.CreatedBy = checkModel.Id;
                            individualSampleDto.CreatedDate = DateTime.Now;
                            individualSampleDto.IdDocument = documentDto.ID;
                            individualSampleDto.StockId = Guid.Parse(documentModel.IdStock);
                            individualSampleDto.IdCategory = Guid.Parse(documentModel.IdCategory);
                            individualSampleDto.DocumentTypeId = documentDto.DocumentTypeId;
                            individualSampleDto.EntryDate = documentModel.EntryDate ?? DateTime.Now;
                            individualSampleDto.GeneralEntryNumber = documentModel.GeneralEntryNumber;
                            individualSampleDto.Price = documentModel.Price;

                            result = _individualSampleRepository.InsertIndividualSample(individualSampleDto);
                        }
                    }

                    //insert document avatar
                    result = _bookRepository.InsertDocumentAvatar(documentAvatar);
                }

                if (result.Success)
                {
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetFileImageWordInsertBook
        [HttpGet]
        [Route("GetFileImageWordInsertBook")]
        public IActionResult GetFileImageWordInsertBook(String Type)
        {
            try
            {
                if (Type == "1")
                {
                    var fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileWord, "\\",
                        "BIEN_BAN_NHAP_SACH.docx"));
                    return File(fileBytes, "application/octet-stream", "BIEN_BAN_NHAP_SACH.docx");
                }

                if (Type == "2")
                {
                    var fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileWord, "\\",
                        "PHIEU_NHAP_SACH.docx"));
                    return File(fileBytes, "application/octet-stream", "PHIEU_NHAP_SACH.docx");
                }

                if (Type == "3")
                {
                    var fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileWord, "\\",
                                               "PHIEU_XUAT_SACH.docx"));
                    return File(fileBytes, "application/octet-stream", "PHIEU_XUAT_SACH.docx");
                }

                if (Type == "4")
                {
                    var fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileWord, "\\",
                                               "BIEN_BAN_XUAT_SACH.docx"));
                    return File(fileBytes, "application/octet-stream", "BIEN_BAN_XUAT_SACH.docx");
                }

                return Ok("Không tìm thấy file !");
            }
            catch (Exception)
            {
                return BadRequest("Không tìm thấy file !");
            }
        }

        // HttpPost: /api/Book/ImportFileWordInsertBook
        [HttpPost]
        [Route("ImportFileWordInsertBook")]
        public IActionResult ImportFileWordInsertBook(String Type)
        {
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                // If directory does not exist, create it. 
                if (!Directory.Exists(_appSettingModel.ServerFileWord))
                {
                    Directory.CreateDirectory(_appSettingModel.ServerFileWord);
                }

                if (Request.Form.Files.Count > 0)
                {
                    foreach (var file in Request.Form.Files)
                    {
                        var fileContentType = file.ContentType;

                        if (fileContentType ==
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                        {
                            // prepare path to save file image
                            string pathTo = _appSettingModel.ServerFileWord;

                            // set file path to save file
                            string filename = "";

                            if (Type == "1")
                            {
                                filename = Path.Combine(pathTo, Path.GetFileName("BIEN_BAN_NHAP_SACH.docx"));
                            }

                            if (Type == "2")
                            {
                                filename = Path.Combine(pathTo, Path.GetFileName("PHIEU_NHAP_SACH.docx"));
                            }

                            if (Type == "3")
                            {
                                filename = Path.Combine(pathTo, Path.GetFileName("PHIEU_XUAT_SACH.docx"));
                            }

                            if (Type == "4")
                            {
                                filename = Path.Combine(pathTo, Path.GetFileName("BIEN_BAN_XUAT_SACH.docx"));
                            }



                            //delete file before save
                            if (System.IO.File.Exists(filename))
                            {
                                System.IO.File.Delete(filename);
                            }

                            // save file
                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }

                            return Ok("Thêm mẫu thành công !");
                        }
                    }
                }

                return Ok("Không tìm thấy file !");
            }
            catch (Exception)
            {
                return BadRequest("Không tìm thấy file !");
            }
        }





        // HttpGet: api/Book/GetEncryptDocumentName
        [HttpGet]
        [Route("GetEncryptDocumentName")]
        public String GetEncryptDocumentName(String bookName)
        {
            try
            {
                String documentName = _individualSampleRepository.GetCodeBookNameEncrypt(bookName);
                return documentName;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // HttpPost: api/Book/GetListDocument
        [HttpPost]
        [Route("GetListDocument")]
        public List<ListBookNew> GetListDocument(SortAndSearchListDocument sortAndSearchListDocument)
        {
            try
            {
                List<ListBookNew> document = _bookRepository.getBookAdminSite(sortAndSearchListDocument);
                return document;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Đã xảy ra lỗi: {ex}");
                throw;
            }
        }
        [HttpPost]
        [Route("GetListDocumentConnect")]
        public List<ListBookNew> GetListDocumentConnect(SortAndSearchListDocument sortAndSearchListDocument)
        {
            try
            {
                List<ListBookNew> documents = _bookRepository.getBookAdminSite(sortAndSearchListDocument);

                // Lọc ra những tài liệu có DocumentTypeId = 4 và UnitConnectedCode trùng khớp
                List<ListBookNew> filteredDocuments = documents
                    .Where(doc => doc.Document.UnitConnectedCode == sortAndSearchListDocument.UnitConnectedCode &&
                                   doc.Document.UnitConnectedName == sortAndSearchListDocument.UnitConnectedName)
                    .ToList();

                return filteredDocuments;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Đã xảy ra lỗi khi lấy danh sách tài liệu: {ex}");
                throw;
            }



        }

        // HttpPost: /api/Book/InsertBookByExcel
        [HttpPost]
        [Route("InsertBookByExcel")]
        public IActionResult InsertBookByExcel()
        {
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                // string IdFile = "";
                // // check file exit and save file to sevrer
                // if (Request.Form.Files.Count > 0)
                // {
                //     foreach (var file in Request.Form.Files)
                //     {
                //         string pathTo = _appSettingModel.ServerFileExcel;
                //         IdFile = DateTimeOffset.Now.ToUnixTimeSeconds().ToString() + ".xlsx";
                //
                //         // set file path to save file
                //         var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));
                //
                //         // save file
                //         using (var stream = System.IO.File.Create(filename))
                //         {
                //             file.CopyTo(stream);
                //         }
                //     }
                // }
                //
                // // path to open file excel
                // var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", IdFile);
                // FileInfo fi = new FileInfo(path);
                // string fileCodeName = Guid.NewGuid().ToString();


                bool checkAddUser = false;
                bool checkParent = false;
                var addCategorySignByExcels = new List<AddCategorySignByExcel>();

                using (var excelPackage = new ExcelPackage(Request.Form.Files[0].OpenReadStream()))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    int rowCount = namedWorksheet.Dimension.Rows;
                    int colCount = namedWorksheet.Dimension.Columns;
                    for (int i = 2; i <= rowCount; i++)
                    {
                        var documentDto = new DocumentDto();
                        var categoryV1 = new CategorySign_V1Dto();
                        int cnt = 0;
                        for (int j = 1; j <= colCount; j++)
                        {
                            if (namedWorksheet.Cells[i, j].Value == null)
                            {
                                cnt++;
                            }
                        }
                        if (cnt == colCount)
                        {
                            break;
                        }
                        else
                        {
                            for (int j = 1; j <= colCount; j++)
                            {
                                string cells = "";
                                //if (namedWorksheet.Cells[i, j].Value != null)
                                //{


                                if (j == 1)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.DocName = cells;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 2)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Language = cells;
                                    }

                                }
                                else if (j == 3)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Publisher = cells;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 4)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var temp = cells.Split('/');
                                        if (temp.Length > 1)
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[2].Split(' ')[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                        else
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                    }


                                }
                                else if (j == 5)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.IsHavePhysicalVersion = bool.Parse(cells);
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 6)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Author = cells;
                                    }

                                }
                                else if (j == 7)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Price = long.Parse(cells);
                                    }
                                }
                                else if (j == 8)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Description = cells;
                                    }
                                }
                                else if (j == 9)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var z = j + 1;
                                        var idd = namedWorksheet.Cells[i, z].Value.ToString();
                                        var name = cells;
                                        var idCategorySign_V1 = Guid.Empty;
                                        var namedWorksheet1 = excelPackage.Workbook.Worksheets[2];
                                        var categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < categorySign_V1Dtos.Count; t++)
                                        {
                                            var cellValue = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                            var maValue = namedWorksheet1.Cells[rowSignV1, 3].Value;
                                            if (cellValue != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellValue.ToString();

                                                    if (cellGuid == name && maValue.ToString() == idd)
                                                    {
                                                        idCategorySign_V1 = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }

                                        documentDto.IdCategorySign_V1 = idCategorySign_V1;
                                        categoryV1.Id = idCategorySign_V1;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }


                                }
                                else if (j == 11)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var id = _categorySign_V1Repository.getAllCategorySignV1ById(categoryV1.Id);
                                        if (id != null)
                                        {
                                            if (id.IdCategoryParent == null)
                                            {
                                                var name = cells;
                                                var idCatogoryParent = Guid.Empty;
                                                var namedWorksheet1 = excelPackage.Workbook.Worksheets[3];
                                                var CatogoryParent = _categorySignParents.getAllCategorySignParent();
                                                int rowSignV1 = 2;
                                                for (int t = 0; t < CatogoryParent.Count; t++)
                                                {
                                                    var cellValue = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                                    if (cellValue != null)
                                                    {
                                                        try
                                                        {
                                                            var cellGuid = cellValue.ToString();

                                                            if (cellGuid == name)
                                                            {
                                                                idCatogoryParent = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                                break;
                                                            }
                                                        }
                                                        catch (FormatException)
                                                        {

                                                        }
                                                    }
                                                    rowSignV1++;
                                                }
                                                documentDto.IdCategoryParent = idCatogoryParent;
                                                categoryV1.IdCategoryParent = idCatogoryParent;

                                            }
                                            else
                                            {
                                                documentDto.IdCategoryParent = id.IdCategoryParent;
                                                checkParent = true;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 12)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var name = cells;
                                        var idDocumentType = Guid.Empty;
                                        var namedWorksheet1 = excelPackage.Workbook.Worksheets[1];
                                        var documentType = _documentTypeRepository.GetAllDocumentType();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < documentType.Count; t++)
                                        {
                                            var cellValue = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                            if (cellValue != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellValue.ToString();

                                                    if (cellGuid == name)
                                                    {
                                                        idDocumentType = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }
                                        documentDto.DocumentTypeId = idDocumentType;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }


                                }
                                else if (j == 13)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.PublishPlace = cells;
                                    }

                                }
                                else if (j == 14)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Supply = cells;
                                    }

                                }
                                else if (j == 15)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        Guid idCategoryColor = _categoryColor.GetIdByColorName(cells);
                                        documentDto.IdCategoryColor = idCategoryColor;
                                    }


                                }

                            }
                        }

                        _categorySign_V1Repository.UpdateCategorySignV11(categoryV1);
                        if (documentDto.DocName == null)
                        {
                            continue;
                        }

                        documentDto.ID = Guid.NewGuid();
                        documentDto.IsApproved = false;
                        documentDto.CreatedBy = checkModel.Id;
                        documentDto.Status = 0;
                        documentDto.CreatedDate = DateTime.Now;
                        documentDto.IsDeleted = false;
                        documentDto.NumberLike = 0;
                        documentDto.NumberUnlike = 0;
                        documentDto.NumberView = 0;
                        //documentDto.IsHavePhysicalVersion = false;
                        documentDto.EncryptDocumentName =
                            _individualSampleRepository.GetCodeBookNameEncrypt(documentDto.DocName);

                        var response = new Response();
                        response = _bookRepository.InsertDocument(documentDto);

                        //insert document avatar
                        var documentAvatar = new DocumentAvatarDto();
                        // set data document avatar
                        documentAvatar.Id = Guid.NewGuid();
                        documentAvatar.Path = _appSettingModel.ServerFileImage + @"\";
                        documentAvatar.Status = 0;
                        documentAvatar.CreateBy = checkModel.Id;
                        documentAvatar.CreateDate = DateTime.Now;
                        documentAvatar.FileNameExtention = "jpg";
                        documentAvatar.SizeImage = "1";
                        documentAvatar.IdDocument = documentDto.ID;

                        if (response.Success)
                        {
                            response = _bookRepository.InsertDocumentAvatar(documentAvatar);
                        }

                        if (!response.Success)
                        {
                            checkAddUser = true;
                            var addCategorySignByExcel = new AddCategorySignByExcel();
                            addCategorySignByExcel.ID = documentDto.ID;
                            addCategorySignByExcel.SignName = documentDto.DocName;

                            addCategorySignByExcels.Add(addCategorySignByExcel);
                        }
                    }
                }

                if (checkAddUser)
                {
                    return Ok(new
                    {
                        Success = false,
                        Body = addCategorySignByExcels
                    });
                }
                else
                {
                    if (checkParent == true)
                    {
                        return Ok(new
                        {
                            Success = true,
                            Message = "Kí hiệu phân loại con này đã tồn tại trong cha khác"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            Success = true,
                            Message = "Thêm mới thành công"
                        });
                    }

                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetFileExcelImportDocumentDigital
        [HttpGet]
        [Route("GetFileExcelImportDocumentDigital")]
        public IActionResult GetFileExcelImportDocumentDigital()
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MauThemTaiLieu.xlsx");
                FileInfo fi = new FileInfo(path);
                string fileCodeName = Guid.NewGuid().ToString();

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];

                    namedWorksheet.Cells["A2:C1000"].Clear();

                    // get all table document type
                    List<DocumentTypeDto> documentTypeDto = _documentTypeRepository.GetAllDocumentType();

                    int row = 2;
                    for (int i = 0; i < documentTypeDto.Count; i++)
                    {
                        if (documentTypeDto[i].Status == 3)
                        {
                            namedWorksheet.Cells[row, 1].Value = documentTypeDto[i].Id;
                            namedWorksheet.Cells[row, 2].Value = documentTypeDto[i].DocTypeName;
                            namedWorksheet.Cells[row, 3].Value = "Tài liệu số";
                            row++;
                        }
                    }

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet1 = excelPackage.Workbook.Worksheets[2];

                    namedWorksheet1.Cells["A2:K1000"].Clear();

                    // get all table category sign v1
                    List<CategorySign_V1Dto> categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();

                    int rowSignV1 = 2;
                    for (int i = 0; i < categorySign_V1Dtos.Count; i++)
                    {
                        namedWorksheet1.Cells[rowSignV1, 1].Value = categorySign_V1Dtos[i].Id;
                        namedWorksheet1.Cells[rowSignV1, 2].Value = categorySign_V1Dtos[i].SignName;
                        namedWorksheet1.Cells[rowSignV1, 3].Value = categorySign_V1Dtos[i].SignCode;
                        rowSignV1++;
                    }

                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauThemTaiLieu.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPost]
        [Route("InsertDocumentDigital")]
        public IActionResult InsertDocumentDigital()
        {
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }


                bool checkAddUser = false;
                bool checkParent = false;
                var addCategorySignByExcels = new List<AddCategorySignByExcel>();

                using (var excelPackage = new ExcelPackage(Request.Form.Files[0].OpenReadStream()))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    int rowCount = namedWorksheet.Dimension.Rows;
                    int colCount = namedWorksheet.Dimension.Columns;
                    for (int i = 2; i <= rowCount; i++)
                    {
                        var documentDto = new DocumentDto();
                        var categoryV1 = new CategorySign_V1Dto();
                        int cnt = 0;
                        for (int j = 1; j <= colCount; j++)
                        {
                            if (namedWorksheet.Cells[i, j].Value == null)
                            {
                                cnt++;
                            }
                        }
                        if (cnt == colCount)
                        {
                            break;
                        }
                        else
                        {
                            for (int j = 1; j <= colCount; j++)
                            {
                                string cells = "";

                                if (j == 1)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.DocName = cells;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 2)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Language = cells;
                                    }

                                }
                                else if (j == 3)
                                {
                                    cells = namedWorksheet.Cells[i, j].Value.ToString();
                                    documentDto.Publisher = cells;
                                }
                                else if (j == 4)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var temp = cells.Split('/');
                                        if (temp.Length > 1)
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[2].Split(' ')[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                        else
                                        {
                                            DateTime PublishYear = new DateTime(int.Parse(temp[0]), 01, 01);
                                            documentDto.PublishYear = PublishYear;
                                        }
                                    }


                                }
                                else if (j == 5)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.IsHavePhysicalVersion = bool.Parse(cells);
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }
                                }
                                else if (j == 6)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Author = cells;
                                    }

                                }
                                else if (j == 7)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Price = long.Parse(cells);
                                    }
                                }
                                else if (j == 8)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        documentDto.Description = cells;
                                    }
                                }
                                else if (j == 9)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();

                                        var name = cells;
                                        var idCategorySign_V1 = Guid.Empty;
                                        var namedWorksheet1 = excelPackage.Workbook.Worksheets[2];
                                        var categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < categorySign_V1Dtos.Count; t++)
                                        {
                                            var cellValue = namedWorksheet1.Cells[rowSignV1, 2].Value;

                                            if (cellValue != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellValue.ToString();

                                                    if (cellGuid == name)
                                                    {
                                                        idCategorySign_V1 = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }

                                        documentDto.IdCategorySign_V1 = idCategorySign_V1;
                                        categoryV1.Id = idCategorySign_V1;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }


                                }
                                else if (j == 10)
                                {
                                    if (namedWorksheet.Cells[i, j].Value != null)
                                    {
                                        cells = namedWorksheet.Cells[i, j].Value.ToString();
                                        var name = cells;
                                        var idDocumentType = Guid.Empty;
                                        var namedWorksheet1 = excelPackage.Workbook.Worksheets[1];
                                        var documentType = _documentTypeRepository.GetAllDocumentType();
                                        int rowSignV1 = 2;
                                        for (int t = 0; t < documentType.Count; t++)
                                        {
                                            var cellValue = namedWorksheet1.Cells[rowSignV1, 2].Value;
                                            if (cellValue != null)
                                            {
                                                try
                                                {
                                                    var cellGuid = cellValue.ToString();

                                                    if (cellGuid == name)
                                                    {
                                                        idDocumentType = new Guid(namedWorksheet1.Cells[rowSignV1, 1].Value.ToString());
                                                        break;
                                                    }
                                                }
                                                catch (FormatException)
                                                {

                                                }
                                            }
                                            rowSignV1++;
                                        }
                                        documentDto.DocumentTypeId = idDocumentType;
                                    }
                                    else
                                    {
                                        return Ok(new
                                        {
                                            Success = false,
                                            Message = "Dòng " + i + " cột " + j + " không được để trống"
                                        });
                                    }


                                }
                            }
                        }

                        _categorySign_V1Repository.UpdateCategorySignV11(categoryV1);
                        if (documentDto.DocName == null)
                        {
                            continue;
                        }

                        documentDto.ID = Guid.NewGuid();
                        documentDto.IsApproved = false;
                        documentDto.CreatedBy = checkModel.Id;
                        documentDto.Status = 0;
                        documentDto.CreatedDate = DateTime.Now;
                        documentDto.IsDeleted = false;
                        documentDto.NumberLike = 0;
                        documentDto.NumberUnlike = 0;
                        documentDto.NumberView = 0;
                        //documentDto.IsHavePhysicalVersion = false;
                        documentDto.EncryptDocumentName =
                            _individualSampleRepository.GetCodeBookNameEncrypt(documentDto.DocName);

                        var response = new Response();
                        response = _bookRepository.InsertDocument(documentDto);

                        //insert document avatar
                        var documentAvatar = new DocumentAvatarDto();
                        // set data document avatar
                        documentAvatar.Id = Guid.NewGuid();
                        documentAvatar.Path = _appSettingModel.ServerFileImage + @"\";
                        documentAvatar.Status = 0;
                        documentAvatar.CreateBy = checkModel.Id;
                        documentAvatar.CreateDate = DateTime.Now;
                        documentAvatar.FileNameExtention = "jpg";
                        documentAvatar.SizeImage = "1";
                        documentAvatar.IdDocument = documentDto.ID;

                        if (response.Success)
                        {
                            response = _bookRepository.InsertDocumentAvatar(documentAvatar);
                        }

                        if (!response.Success)
                        {
                            checkAddUser = true;
                            var addCategorySignByExcel = new AddCategorySignByExcel();
                            addCategorySignByExcel.ID = documentDto.ID;
                            addCategorySignByExcel.SignName = documentDto.DocName;

                            addCategorySignByExcels.Add(addCategorySignByExcel);
                        }
                    }
                }

                if (checkAddUser)
                {
                    return Ok(new
                    {
                        Success = false,
                        Body = addCategorySignByExcels
                    });
                }
                else
                {
                    if (checkParent == true)
                    {
                        return Ok(new
                        {
                            Success = true,
                            Message = "Kí hiệu phân loại con này đã tồn tại trong cha khác"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            Success = true,
                            Message = "Thêm mới thành công"
                        });
                    }

                }

            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/Book/GetFileExcelImportBook
        [HttpGet]
        [Route("GetFileExcelImportBook")]
        public IActionResult GetFileExcelImportBook()
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "MauThemSach.xlsm");
                var fi = new FileInfo(path);

                using (var excelPackage = new ExcelPackage(fi))
                {
                    ExcelWorksheet namedWorksheet0 = excelPackage.Workbook.Worksheets[0];
                    namedWorksheet0.Cells["A2:O10000000"].Clear();
                    //namedWorksheet0.Cells["L2:O100000"].Clear();
                    #region SHEET 1

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet = excelPackage.Workbook.Worksheets[1];

                    namedWorksheet.Cells["A2:C10000000"].Clear();

                    // get all table document type
                    var documentTypeDto = _documentTypeRepository.GetAllDocumentType();

                    int row = 2;
                    for (int i = 0; i < documentTypeDto.Count; i++)
                    {
                        if (documentTypeDto[i].Status == 1)
                        {
                            namedWorksheet.Cells[row, 1].Value = documentTypeDto[i].Id;
                            namedWorksheet.Cells[row, 2].Value = documentTypeDto[i].DocTypeName;
                            if (documentTypeDto[i].Status == 1)
                            {
                                namedWorksheet.Cells[row, 3].Value = "Sách";
                            }

                            row++;
                        }
                    }

                    #endregion

                    #region SHEET 2

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet1 = excelPackage.Workbook.Worksheets[2];

                    namedWorksheet1.Cells["A2:K1000000"].Clear();

                    // get all table category sign v1
                    var categorySign_V1Dtos = _categorySign_V1Repository.getAllCategorySignV1();

                    int rowSignV1 = 2;
                    for (int i = 0; i < categorySign_V1Dtos.Count; i++)
                    {
                        namedWorksheet1.Cells[rowSignV1, 1].Value = categorySign_V1Dtos[i].Id;
                        namedWorksheet1.Cells[rowSignV1, 2].Value = categorySign_V1Dtos[i].SignName;
                        namedWorksheet1.Cells[rowSignV1, 3].Value = categorySign_V1Dtos[i].SignCode;
                        namedWorksheet1.Cells[rowSignV1, 4].Value = categorySign_V1Dtos[i].ParentName;

                        rowSignV1++;
                    }

                    #endregion

                    #region SHEET 3

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    var namedWorksheet3 = excelPackage.Workbook.Worksheets[3];

                    namedWorksheet3.Cells["A2:C1000000"].Clear();

                    // get all table category sign parent
                    var categoryparent1 = _categorySignParents.getAllCategorySignParent();

                    int rowSignV3 = 2;
                    for (int i = 0; i < categoryparent1.Count; i++)
                    {
                        namedWorksheet3.Cells[rowSignV3, 1].Value = categoryparent1[i].Id;
                        namedWorksheet3.Cells[rowSignV3, 2].Value = categoryparent1[i].ParentName;
                        namedWorksheet3.Cells[rowSignV3, 3].Value = categoryparent1[i].ParentCode;
                        rowSignV3++;
                    }

                    #endregion

                    #region SHEET 5

                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet4 = excelPackage.Workbook.Worksheets[5];
                    namedWorksheet4.Cells["A2:B1000000"].Clear();

                    var result = _categoryPublisherRepository.GetAllPublisher();

                    int rowCategoryPublisher = 2;
                    for (int i = 0; i < result.Count; i++)
                    {
                        for (int j = 1; j <= 2; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Fill.PatternType =
                                    ExcelFillStyle.Solid;
                                namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Top.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Left.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Right.Style =
                                ExcelBorderStyle.Thin;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Border.Bottom.Style =
                                ExcelBorderStyle.Thin;

                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Font.Size = 13;
                            namedWorksheet4.Cells[rowCategoryPublisher, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet4.Cells[rowCategoryPublisher, 1].Value = result[i].Item1;
                        namedWorksheet4.Cells[rowCategoryPublisher, 2].Value = result[i].Item2;
                        rowCategoryPublisher++;
                    }

                    #endregion

                    #region SHEET 6
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet6 = excelPackage.Workbook.Worksheets[6];
                    namedWorksheet6.Cells["A2:D1000000"].Clear();
                    IEnumerable<CategoryColorDto> listCategoryColorTemp = _categoryColor.GetAllListCategoryColorNotPagination().ToList();
                    List<CategoryColorDto> listCategoryColor = listCategoryColorTemp.ToList();
                    int rowCategoryColor = 2;
                    for (int i = 0; i < listCategoryColor.Count; i++)
                    {
                        for (int j = 1; j <= 4; j++)
                        {
                            if (i % 2 == 0)
                            {
                                Color colFromHex = ColorTranslator.FromHtml("#E5DFDF");
                                namedWorksheet6.Cells[rowCategoryColor, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                namedWorksheet6.Cells[rowCategoryColor, j].Style.Fill.BackgroundColor
                                    .SetColor(colFromHex);
                            }

                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Font.Size = 13;
                            namedWorksheet6.Cells[rowCategoryColor, j].Style.Font.Name = "Times New Roman";
                        }

                        namedWorksheet6.Cells[rowCategoryColor, 1].Value = listCategoryColor[i].Id;
                        namedWorksheet6.Cells[rowCategoryColor, 2].Value = listCategoryColor[i].ColorName;
                        namedWorksheet6.Cells[rowCategoryColor, 3].Value = listCategoryColor[i].ReadingLevel;
                        namedWorksheet6.Cells[rowCategoryColor, 4].Value = listCategoryColor[i].ColorCode;

                        rowCategoryColor++;
                    }
                    #endregion
                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }

                //download file excel
                _logger.LogInformation("Tai file thanh cong");
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, MediaTypeNames.Application.Octet, "MauThemSach.xlsx");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Đã xảy ra lỗi: {ex}");
                throw;
            }
        }

        // GET: api/Book/GetBookByBarcode
        [HttpGet]
        [Route("GetBookByBarcode")]
        public CustomApiListDocumentByStock GetBookByBarcode(string Barcode)
        {
            try
            {
                CustomApiListDocumentByStock customApiListDocumentByStock =
                    _bookRepository.ListDocumentByBarcode(Barcode);
                return customApiListDocumentByStock;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookAndIndividualManyParam
        [HttpPost]
        [Route("GetBookAndIndividualManyParam")]
        public CustomApiDocumentAndIndividual GetBookAndIndividualManyParam(
            IndividualByDocumentDto individualByDocumentDto)
        {
            try
            {
                CustomApiDocumentAndIndividual customApiDocumentAndIndividuals = new CustomApiDocumentAndIndividual();
                customApiDocumentAndIndividuals =
                    _bookRepository.GetBookAndIndividualManyParam(individualByDocumentDto);
                return customApiDocumentAndIndividuals;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookByCategoryAdminSite
        [HttpGet]
        [Route("GetBookByCategoryAdminSite")]
        public Object GetBookByCategoryAdminSite(int pageNumber, int pageSize, Guid IdDocumentType)
        {
            List<ListBookNew> bookNew = new List<ListBookNew>();
            try
            {
                bookNew = _bookRepository.getBookByCategoryAdminSite(pageNumber, pageSize, IdDocumentType);
                return bookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookByIdAdminSite
        [HttpGet]
        [Route("GetBookByIdAdminSite")]
        public ListBookNew GetBookByIdAdminSite(Guid Id)
        {
            try
            {
                ListBookNew listBookNew = new ListBookNew();
                listBookNew = _bookRepository.getBookByIdAdminSite(Id);
                return listBookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookAndIndividual
        [HttpGet]
        [Route("GetBookAndIndividual")]
        public CustomApiDocumentAndIndividual GetBookAndIndividual(Guid Id)
        {
            try
            {
                CustomApiDocumentAndIndividual customApiDocumentAndIndividuals = new CustomApiDocumentAndIndividual();
                customApiDocumentAndIndividuals = _bookRepository.customApiDocumentAndIndividuals(Id);
                return customApiDocumentAndIndividuals;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookAndIndividualNotBorrow
        [HttpGet]
        [Route("GetBookAndIndividualNotBorrow")]
        public CustomApiDocumentAndIndividual GetBookAndIndividualNotBorrow(Guid Id)
        {
            try
            {
                CustomApiDocumentAndIndividual customApiDocumentAndIndividuals = new CustomApiDocumentAndIndividual();
                customApiDocumentAndIndividuals = _bookRepository.customApiDocumentAndIndividualsNotBorrow(Id);
                return customApiDocumentAndIndividuals;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // POST: api/Book/ApporeBook
        [HttpPost]
        [Route("ApporeBook")]
        public IActionResult ApporeBook(Guid Id, bool isApprove)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            string content = isApprove ? "duyệt cuốn sách" : "bỏ duyệt cuốn sách";
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                if (checkModel != null) IdUserCurrent = checkModel.Id;

                Guid ApprovedBy = checkModel.Id;
                Response result = _bookRepository.Approved(Id, isApprove, ApprovedBy);

                if (result.Success)
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "Document", true, Id, content);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "Document", false, Id, content);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.ModifyDiary(IdUserCurrent, "Update", "Document", false, Id, content);
                throw;
            }
        }

        // GET: api/Book/GetBookAdminSite
        [HttpGet]
        [Route("GetBookAdminSite")]
        public List<ListBookNew> GetBookAdminSite(int pageNumber, int pageSize, int DocumentType, string ListIdDocument = "")
        {
            try
            {
                var document = _bookRepository.getBookAdminSite(pageNumber, pageSize, DocumentType, ListIdDocument);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // POST: api/Book/GetBookAdminSite
        [HttpPost]
        [Route("GetBookAdminSiteVer2")]
        public List<ListBookNew> GetBookAdminSite_Ver2(GetAllBookVerPayload payload)
        {
            try
            {
                var document = _bookRepository.getBookAdminSite(payload.PageNumber, payload.PageSize, payload.DocumentType, payload.ListIdDocument);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // POST: api/Book/InsertDocument
        [HttpPost]
        [Route("InsertDocument")]
        public IActionResult InsertDocument([FromForm] DocumentModel documentModel)
        {
            //  documentModel.UnitConnectedCode = _appSettingModel.UnitConnectedCode;
            //  documentModel.UnitConnectedName = _appSettingModel.UnitConnectedName;
            Guid IdUserCurrent = Guid.NewGuid();
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                if (checkModel != null) IdUserCurrent = checkModel.Id;

                var documentDto = new DocumentDto();
                documentDto = _mapper.Map<DocumentDto>(documentModel);

                // define some col with data concrete
                documentDto.ID = Guid.NewGuid();
                documentDto.NumberView = 0;
                documentDto.NumberLike = 0;
                documentDto.NumberUnlike = 0;
                documentDto.ModifiedDate = DateTime.Now;
                documentDto.IsApproved = false;
                documentDto.Status = 0;
                documentDto.CreatedDate = DateTime.Now;
                documentDto.IsDeleted = false;
                documentDto.CreatedBy = checkModel.Id;
                documentDto.IsHavePhysicalVersion = false;

                if (documentModel.Author == "undefined" || documentModel.Author == "null")
                {
                    documentDto.Author = null;
                }

                if (documentModel.Description == "undefined" || documentModel.Description == "null")
                {
                    documentDto.Description = null;
                }

                if (documentModel.PublishPlace == "undefined" || documentModel.PublishPlace == "null")
                {
                    documentDto.PublishPlace = null;
                }

                var documentAvatar = new DocumentAvatarDto();
                // set data document avatar
                documentAvatar.Id = Guid.NewGuid();
                documentAvatar.Path = _appSettingModel.ServerFileImage + @"\";
                documentAvatar.Status = 0;
                documentAvatar.CreateBy = checkModel.Id;
                documentAvatar.CreateDate = DateTime.Now;
                documentAvatar.FileNameExtention = "jpg";
                documentAvatar.SizeImage = "1";
                documentAvatar.IdDocument = documentDto.ID;


                if (Request.Form.Files.Count > 0)
                {
                    foreach (var file in Request.Form.Files)
                    {
                        var fileContentType = file.ContentType;

                        if (fileContentType == "image/jpeg" || fileContentType == "image/png")
                        {
                            documentAvatar.NameFileAvatar = file.FileName;

                            // prepare path to save file image
                            string pathTo = _appSettingModel.ServerFileImage;
                            // get extention form file name
                            string IdFile = documentAvatar.Id.ToString() + ".jpg";

                            // set file path to save file
                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            // save file
                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }
                        }
                        else if (fileContentType == "application/pdf")
                        {
                            documentDto.OriginalFileName = file.FileName;
                            documentDto.FileName = documentDto.ID.ToString() + ".pdf";
                            documentDto.FileNameExtention = "pdf";
                            documentDto.FilePath = _appSettingModel.ServerFilePdf;

                            string pathTo = _appSettingModel.ServerFilePdf;
                            string IdFile = documentDto.ID.ToString() + "." + documentDto.FileNameExtention;

                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }
                        }
                    }
                }

                var result = _bookRepository.InsertDocument(documentDto);
                if (result.Success)
                {
                    result = _bookRepository.InsertDocumentAvatar(documentAvatar);
                }

                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "Document", true, documentDto.ID);
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "DocumentAvatar", true, documentAvatar.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "DocumentAvatar", false, documentAvatar.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // POST: api/Book/UpdateDocument
        [HttpPost]
        [Route("UpdateDocument")]
        public IActionResult UpdateDocument([FromForm] DocumentModel documentModel)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                if (checkModel != null) IdUserCurrent = checkModel.Id;

                var documentDto = new DocumentDto();
                documentDto = _mapper.Map<DocumentDto>(documentModel);
                documentDto.ModifiedBy = checkModel.Id;
                documentDto.ModifiedDate = DateTime.Now;

                var documentAvatar = new DocumentAvatarDto();
                // set data document avatar
                documentAvatar.Id = documentDto.IdDocumentAvartar;
                documentAvatar.FileNameExtention = "jpg";
                documentAvatar.SizeImage = "1";
                documentAvatar.IdDocument = documentDto.ID;

                // check file exits
                if (Request.Form.Files.Count > 0)
                {
                    foreach (var file in Request.Form.Files)
                    {
                        var fileContentType = file.ContentType;

                        if (fileContentType == "image/jpeg" || fileContentType == "image/png")
                        {
                            // prepare path to save file image
                            string pathTo = _appSettingModel.ServerFileImage;
                            // get extention form file name
                            string IdFile = documentDto.IdDocumentAvartar.ToString() + ".jpg";

                            // set file path to save file
                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            //delete file before save
                            if (System.IO.File.Exists(filename))
                            {
                                System.IO.File.Delete(filename);
                            }

                            // save file
                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }

                            // set data document avatar
                            documentAvatar.NameFileAvatar = file.FileName;
                        }
                        else if (fileContentType == "application/pdf")
                        {
                            documentDto.OriginalFileName = file.FileName;
                            documentDto.FileName = documentDto.ID.ToString() + ".pdf";
                            documentDto.FileNameExtention = "pdf";
                            documentDto.FilePath = _appSettingModel.ServerFilePdf;

                            string pathTo = _appSettingModel.ServerFilePdf;
                            string IdFile = documentDto.ID.ToString() + "." + documentDto.FileNameExtention;

                            var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                            //delete file before save
                            if (System.IO.File.Exists(filename))
                            {
                                System.IO.File.Delete(filename);
                            }

                            // save file pdf
                            using (var stream = System.IO.File.Create(filename))
                            {
                                file.CopyTo(stream);
                            }
                        }
                    }
                }

                if (documentModel.Author == "undefined" || documentModel.Author == "null")
                {
                    documentDto.Author = null;
                }

                if (documentModel.Description == "undefined" || documentModel.Description == "null")
                {
                    documentDto.Description = null;
                }

                if (documentModel.PublishPlace == "undefined" || documentModel.PublishPlace == "null")
                {
                    documentDto.PublishPlace = null;
                }
                Response result = _bookRepository.UpdateDocument(documentDto);

                if (documentDto.Status == 2 && result.Success)
                {
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }

                if (result.Success)
                {
                    result = _bookRepository.UpdateDocumentAvartar(documentAvatar);
                }

                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "Document", true, documentDto.ID);
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "DocumentAvatar", true, documentAvatar.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "Document", false, documentDto.ID);
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "DocumentAvatar", false, documentAvatar.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Update", "Document", false, documentModel.ID);
                _saveToDiary.SaveDiary(IdUserCurrent, "Update", "DocumentAvatar", false,
                    (Guid)documentModel.IdDocumentAvartar);
                throw;
            }
        }

        // POST: api/CategorySign/DeleteBookByID
        [HttpPost]
        [Route("DeleteBookByID")]
        public IActionResult DeleteBookByID(Guid Id)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                if (checkModel != null) IdUserCurrent = checkModel.Id;

                Response result = _bookRepository.DeleteDocument(Id);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Document", true, Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Document", false, Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Delete", "Document", false, Id);
                throw;
            }
        }

        #endregion



        #region Method


        [HttpGet]
        [Route("GetListBookImportBooks")]
        public List<ListBookNew> GetListBookImportBooks(int pageNumber, int pageSize, int DocumentType, string searchDocName = null)
        {
            try
            {
                var document = _bookRepository.getListBookImportBooks(pageNumber, pageSize, DocumentType, searchDocName);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }



        // GET: api/Book/SuggestBook
        [HttpGet]
        [Route("SuggestBook")]
        public List<SuggestSearch> SuggestBook(string values)
        {
            try
            {
                List<SuggestSearch> document = new List<SuggestSearch>();
                document = _bookRepository.SuggestSearchBook(values);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookNew
        [HttpGet]
        [Route("GetBookNew")]
        public Object GetBookNew(int pageNumber, int pageSize)
        {
            List<ListBookNew> bookNew = new List<ListBookNew>();
            try
            {
                bookNew = _bookRepository.getBookNews(pageNumber, pageSize);
                return bookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookByNumberView
        [HttpGet]
        [Route("GetBookByNumberView")]
        public Object BookByNumberView(int pageNumber, int pageSize)
        {
            List<ListBookNew> bookNew = new List<ListBookNew>();
            try
            {
                bookNew = _bookRepository.getBookByNumberView(pageNumber, pageSize);
                return bookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookById
        [HttpGet]
        [Route("GetBookById")]
        public Object BookById(Guid Id)
        {
            ListBookNew bookNew = new ListBookNew();
            try
            {
                bookNew = _bookRepository.getBookById(Id);
                return bookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetBookByCategory
        [HttpGet]
        [Route("GetBookByCategory")]
        public Object BookByCategory(int pageNumber, int pageSize, Guid IdDocumentType)
        {
            List<ListBookNew> bookNew = new List<ListBookNew>();
            try
            {
                bookNew = _bookRepository.getBookByCategory(pageNumber, pageSize, IdDocumentType);
                return bookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetNumberBook
        [HttpGet]
        [Route("GetNumberBook")]
        public int GetNumberBook()
        {
            int number = 0;
            try
            {
                number = _bookRepository.GetAllNumberBook();
                return number;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetDocumentTypes
        [HttpGet]
        [Route("GetDocumentTypes")]
        public List<DocumentType> GetDocumentTypes()
        {
            try
            {
                List<DocumentType> documentTypes = new List<DocumentType>();
                documentTypes = _bookRepository.GetDocumentTypes();
                return documentTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/SearchBook
        [HttpGet]
        [Route("SearchBook")]
        public List<ListBookNew> SearchBook(string values, int pageNumber, int pageSize)
        {
            try
            {
                List<ListBookNew> document = new List<ListBookNew>();
                document = _bookRepository.SearchBook(values, pageNumber, pageSize);
                return document;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetFileImageSlide
        [HttpGet]
        [Route("GetFileImageSlide")]
        public IActionResult GetFileImageSlide(string fileNameId)
        {
            var temp = fileNameId.Split('.');
            byte[] fileBytes = new byte[] { };
            try
            {
                if (temp[1] == "jpg" || temp[1] == "png")
                {
                    fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileSlide, "\\",
                        fileNameId));
                }
                return File(fileBytes, "image/jpeg");
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    message = "Không tìm thấy file"
                });
            }
        }

        // GET: api/Book/GetFileImage
        [HttpGet]
        [Route("GetFileImage")]
        public IActionResult GetFileImage(string fileNameId)
        {
            try
            {
                var temp = fileNameId.Split('.');
                byte[] fileBytes = new byte[] { };
                if (temp[1] == "jpg" || temp[1] == "png")
                {
                    fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileImage, "\\",
                        fileNameId));
                }

                return File(fileBytes, "image/jpeg");
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    message = "Không tìm thấy file"
                });
            }
        }

        // GET: api/Book/GetFilePdf
        [HttpGet]
        [Route("GetFilePdf")]
        public IActionResult GetFilePdf(string fileNameId)
        {
            try
            {
                byte[] fileBytes = new byte[] { };
                var temp = fileNameId.Split('.');
                var fileNameDown = "";

                ListBookNew pdf = new ListBookNew();
                pdf = _bookRepository.getBookById(new Guid(temp[0]));
                fileNameDown = pdf.Document.OriginalFileName;
                if (temp[1] == "pdf")
                {
                    fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFilePdf, "\\",
                        fileNameId));
                    return File(fileBytes, MediaTypeNames.Application.Octet, fileNameDown);
                }
                fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFilePdf, "\\",
                    fileNameId));
                return File(fileBytes, MediaTypeNames.Application.Octet, fileNameDown);
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    message = "Không tìm thấy file"
                });
            }
        }

        // GET: api/Book/GetFilePdfSiteAdmin
        [HttpGet]
        [Route("GetFilePdfSiteAdmin")]
        public IActionResult GetFilePdfSiteAdmin(string fileNameId)
        {
            try
            {
                byte[] fileBytes = new byte[] { };
                var temp = fileNameId.Split('.');
                var fileNameDown = "";

                ListBookNew pdf = new ListBookNew();
                pdf = _bookRepository.getBookByIdAdminSite(new Guid(temp[0]));
                fileNameDown = pdf.Document.OriginalFileName;
                if (temp[1] == "pdf")
                {
                    fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFilePdf, "\\",
                        fileNameId));
                    return File(fileBytes, MediaTypeNames.Application.Octet, fileNameDown);
                }

                fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFilePdf, "\\",
                    fileNameId));
                return File(fileBytes, MediaTypeNames.Application.Octet, fileNameDown);
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Book/GetFileAvatar
        [HttpGet]
        [Route("GetFileAvatar")]
        public IActionResult GetFileAvatar(string fileNameId)
        {
            //try
            //{
            //    var temp = fileNameId.Split('.');
            //    byte[] fileBytes = new byte[] { };
            //    if (temp != null &&temp.Length >1 && temp[1] == "jpg" || temp[1] == "png")
            //    {
            //        fileBytes = System.IO.File.ReadAllBytes(string.Concat(_appSettingModel.ServerFileAvartar, "\\",
            //            fileNameId));
            //    }

            //    return File(fileBytes, "image/jpeg");
            //}
            //catch (Exception)
            //{
            //    throw;
            //}
            try
            {
                byte[] fileBytes;
                string filePath;

                // Nếu fileNameId là null hoặc rỗng, sử dụng file mặc định
                if (string.IsNullOrEmpty(fileNameId) || fileNameId == "null")
                {
                    filePath = Path.Combine(_appSettingModel.ServerFileAvartar, "default.png");
                }
                else
                {
                    var temp = fileNameId.Split('.');
                    // Kiểm tra loại file hợp lệ
                    if (temp.Length > 1 && (temp[1] == "jpg" || temp[1] == "png"))
                    {
                        filePath = Path.Combine(_appSettingModel.ServerFileAvartar, fileNameId);
                    }
                    else
                    {
                        return BadRequest("Invalid file type. Only jpg and png are supported.");
                    }
                }

                // Kiểm tra sự tồn tại của file trước khi đọc
                if (System.IO.File.Exists(filePath))
                {
                    fileBytes = System.IO.File.ReadAllBytes(filePath);
                }
                else
                {
                    return NotFound("File not found.");
                }

                return File(fileBytes, "image/jpeg");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpPost]
        [Route("DeleteBookByListId")]
        public IActionResult DeleteBookByListId(List<Guid> ListId)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            Guid IdError = Guid.NewGuid();
            try
            {
                //check role admin
                Request.Headers.TryGetValue("Authorization", out var headerValue);
                if (headerValue.Count == 0)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
                CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

                if (!checkModel.check)
                {
                    return BadRequest(new
                    {
                        message = "Bạn cần đăng nhập tài khoản Admin"
                    });
                }

                if (checkModel != null) IdUserCurrent = checkModel.Id;

                for (int i = 0; i < ListId.Count; i++)
                {
                    IdError = ListId[i];
                    Response result = _bookRepository.DeleteDocumentInList(ListId[i]);
                    if (result.Success)
                    {
                        _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Document", true, ListId[i]);
                    }
                    else
                    {
                        _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Document", false, ListId[i]);
                        return BadRequest(new
                        {
                            message = result.Message
                        });
                    }
                }
                return Ok(new
                {
                    message = "Xóa thành công " + ListId.Count + " cuốn sách đã chọn",
                });

            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Delete", "Document", false, IdError);
                throw;
            }
        }
        #endregion
    }
}