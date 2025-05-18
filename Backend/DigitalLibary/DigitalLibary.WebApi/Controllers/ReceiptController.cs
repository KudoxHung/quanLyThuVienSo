using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MiniSoftware;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceiptController : Controller
    {
        #region Variables
        private readonly IReceiptRepository _receiptRepository;
        private readonly IContactAndIntroductionRepository _contactAndIntroductionRepository;
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly IIndividualSampleRepository _individualSampleRepository;
        private readonly ICategorySignRepository _categorySignRepository;
        private readonly IBookRepository _bookRepository;
        private readonly SaveToDiary _saveToDiary;
        private readonly IParticipantsRepository _participantsRepository;
        private readonly IAuditBookListRepository _auditBookListRepository;
        private readonly IStatusBookRepository _statusBookRepository;
        private readonly DataContext _context;
        #endregion

        #region Contructor
        public ReceiptController(IReceiptRepository receiptRepository,
        IContactAndIntroductionRepository contactAndIntroductionRepository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        IMapper mapper,
        ICategorySignRepository categorySignRepository,
        IBookRepository bookRepository,
        SaveToDiary saveToDiary,
        IIndividualSampleRepository individualSampleRepository,
        IParticipantsRepository participantsRepository,
        IAuditBookListRepository auditBookListRepository,
        IStatusBookRepository statusBookRepository,
        JwtService jwtService, IUserRepository userRepository,
        DataContext context
        )
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _mapper = mapper;
            _receiptRepository = receiptRepository;
            _contactAndIntroductionRepository = contactAndIntroductionRepository;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _individualSampleRepository = individualSampleRepository;
            _categorySignRepository = categorySignRepository;
            _saveToDiary = saveToDiary;
            _participantsRepository = participantsRepository;
            _bookRepository = bookRepository;
            _auditBookListRepository = auditBookListRepository;
            _statusBookRepository = statusBookRepository;
            _context = context;
        }
        #endregion

        #region Method
        // GET: api/Receipt/GetListBookStatus
        [HttpGet]
        [Route("GetListBookStatus")]
        public IActionResult GetListBookStatus()
        {
            try
            {
                List<string> Original = new List<string>();
                Original = _receiptRepository.GetlistBookStatus();

                return Ok(Original);
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/Receipt/GetListOriginal
        [HttpGet]
        [Route("GetListOriginal")]
        public IActionResult GetListOriginal()
        {
            try
            {
                List<string> Original = new List<string>();
                Original = _receiptRepository.GetlistOriginal();

                return Ok(Original);
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/Receipt/GetListReceipt
        [HttpPost]
        [Route("GetListReceipt")]
        public List<ReceiptModel> GetListReceipt(SortReceiptAndSearch sortReceiptAndSearch)
        {
            try
            {
                List<ReceiptDto> receiptDtos = new List<ReceiptDto>();
                receiptDtos = _receiptRepository.getAllReceipt(sortReceiptAndSearch, 0);

                List<ReceiptModel> receiptModels = new List<ReceiptModel>();
                receiptModels = _mapper.Map<List<ReceiptModel>>(receiptDtos);

                return receiptModels;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET: api/Receipt/GetListReceiptExport
        [HttpPost]
        [Route("GetListReceiptExport")]
        public List<ReceiptModel> GetListReceiptExport(SortReceiptAndSearch sortReceiptAndSearch)
        {
            try
            {
                List<ReceiptDto> receiptDtos = new List<ReceiptDto>();
                receiptDtos = _receiptRepository.getAllReceipt(sortReceiptAndSearch, 1);

                List<ReceiptModel> receiptModels = new List<ReceiptModel>();
                receiptModels = _mapper.Map<List<ReceiptModel>>(receiptDtos);

                return receiptModels;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // HttpGet: api/Receipt/GetListBookToReceiptExportBooks
        [HttpGet]
        [Route("GetListBookToReceiptExportBooks")]
        public IActionResult GetListBookToReceiptExportBooks(string filter, Guid idDocumentType, int pageNumber, int pageSize)
        {
            try
            {
                var result = _receiptRepository.GetListBookToRecepiptExportBooks(filter, idDocumentType, pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        // GET: api/Receipt/GetAllReceipt
        [HttpGet]
        [Route("GetAllReceipt")]
        public List<ReceiptModel> GetAllReceipt(int pageNumber, int pageSize)
        {
            try
            {
                List<ReceiptDto> receiptDtos = new List<ReceiptDto>();
                receiptDtos = _receiptRepository.getAllReceipt(pageNumber, pageSize);

                List<ReceiptModel> receiptModels = new List<ReceiptModel>();
                receiptModels = _mapper.Map<List<ReceiptModel>>(receiptDtos);

                return receiptModels;
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Receipt/GetReceiptById
        [HttpGet]
        [Route("GetReceiptById")]
        public ReceiptModel GetReceiptById(Guid Id)
        {
            try
            {
                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _receiptRepository.getReceipt(Id);

                ReceiptModel receipt = new ReceiptModel();
                receipt = _mapper.Map<ReceiptModel>(receiptDto);

                return receipt;
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Receipt/GetReceiptExportBooksById
        [HttpGet]
        [Route("GetReceiptExportBooksById")]
        public DataOfOneIdReceipt GetReceiptExportBooksById(Guid Id)
        {
            try
            {
                DataOfOneIdReceipt dataOfOneIdReceipt = new DataOfOneIdReceipt();
                dataOfOneIdReceipt = _receiptRepository.GetReceiptExportBooksById(Id);

                return dataOfOneIdReceipt;
            }
            catch (Exception)
            {
                throw;
            }
        }


        //CRUD Table CategorySign
        // POST: api/Receipt/DeleteReceiptById
        [HttpPost]
        [Route("DeleteReceiptById")]
        public IActionResult DeleteReceiptById(Guid Id)
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



                Response result = _receiptRepository.DeleteReceipt(Id);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Receipt", true, Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "Receipt", false, Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Delete", "Receipt", false, Id);
                throw;
            }
        }

        // POST: api/Receipt/InsertReceipt
        [HttpPost]
        [Route("InsertReceipt")]
        public IActionResult InsertReceipt(ReceiptModel receiptModel)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            Guid IdReceipt = Guid.NewGuid();
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

                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _mapper.Map<ReceiptDto>(receiptModel);

                int ReceiptCodeMax = _receiptRepository.GetMaxReceiptCode("PN");
                ReceiptCodeMax += 1;
                string Receipt = "PN" + ReceiptCodeMax;


                // define some col with data concrete
                receiptDto.IdReceipt = Guid.NewGuid();
                receiptDto.Status = 0;
                receiptDto.IsDeleted = false;
                receiptDto.ReceiptCode = Receipt;
                receiptDto.ReceiptNumber = Receipt;
                IdReceipt = receiptDto.IdReceipt;

                Response result = _receiptRepository.InsertReceipt(receiptDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "Receipt", true, IdReceipt);

                    for (int i = 0; i < receiptDto.participants.Count; i++)
                    {
                        ParticipantsDto participantsDto = new ParticipantsDto()
                        {
                            Id = Guid.NewGuid(),
                            IdReceipt = receiptDto.IdReceipt,
                            Name = receiptDto.participants[i].Name,
                            Position = receiptDto.participants[i].Position,
                            Mission = receiptDto.participants[i].Mission,
                            Note = receiptDto.participants[i].Note,
                            CreatedDate = DateTime.Now,
                            Status = 0
                        };

                        _participantsRepository.InsertParticipants(participantsDto);
                    }

                    for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                    {
                        var document = _context.Document.Where(e => e.ID == receiptDto.DocumentListId[i].IdDocument && !e.IsDeleted).FirstOrDefault();

                        if (document == null) continue;

                        var documentType = _context.DocumentType.Where(e => e.Id == document.DocumentTypeId && !e.IsDeleted);

                        if (documentType == null) continue;


                        for (int j = 0; j < receiptDto.DocumentListId[i].Quantity; j++)
                        {
                            CategorySignDto categorySignDto = _categorySignRepository.getCategorySignById(receiptDto.DocumentListId[i].IdCategory);

                            Guid id = categorySignDto.Id;
                            string sign = categorySignDto.SignCode;
                            //get document type id from table book
                            DocumentDto book = _receiptRepository.GetDocumentType(receiptDto.DocumentListId[i].IdDocument);

                            int maxNumberIndividual = 0;

                            if (categorySignDto.SignCode == "SGK")
                            {
                                bool checkExitDocumentAndDocumentType = _individualSampleRepository.CheckExitDocumnentAndDocumentType(document.ID, document.DocumentTypeId);

                                if (!checkExitDocumentAndDocumentType)
                                {
                                    maxNumberIndividual = 0;
                                }
                                else
                                {
                                    maxNumberIndividual = _individualSampleRepository.getNumIndividualMax(id, receiptDto.DocumentListId[i].IdDocument, book.DocumentTypeId);
                                }
                            }
                            else
                            {
                                maxNumberIndividual = _individualSampleRepository
                                .getNumIndividualMaxByInsertReceipt(id);
                            }

                            maxNumberIndividual += 1;

                            string NumberIndividual = sign + maxNumberIndividual + "/" + id;


                            string Barcode = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();

                            IndividualSampleDto individualSampleDto = new IndividualSampleDto()
                            {
                                Id = Guid.NewGuid(),
                                IdDocument = receiptDto.DocumentListId[i].IdDocument,
                                StockId = receiptDto.DocumentListId[i].IdStock,
                                NumIndividual = NumberIndividual,
                                Barcode = Barcode,
                                IsLostedPhysicalVersion = false,
                                IsDeleted = false,
                                Status = 1,
                                CreatedBy = checkModel.Id,
                                CreatedDate = DateTime.Now,
                                DocumentTypeId = book.DocumentTypeId,
                                EntryDate = receiptModel.RecordBookDate ?? DateTime.Now,
                                GeneralEntryNumber = string.IsNullOrEmpty(receiptModel.GeneralEntryNumber) ? null : receiptModel.GeneralEntryNumber,
                                IdReceipt = receiptDto.IdReceipt,
                                Price = (long)receiptDto.DocumentListId[i].Price
                            };

                            Response rs = _individualSampleRepository.InsertIndividualSample(individualSampleDto);

                            if (rs.Success)
                            {
                                _saveToDiary.SaveDiary(checkModel.Id, "Create", "Individual", true, individualSampleDto.Id);
                            }
                            else
                            {
                                _saveToDiary.SaveDiary(checkModel.Id, "Create", "Individual", false, individualSampleDto.Id);
                            }
                        }
                    }
                    return Ok(new
                    {
                        IdReceipt = receiptDto.IdReceipt
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(IdUserCurrent, "Create", "Receipt", false, IdReceipt);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Create", "Receipt", false, IdReceipt);
                throw;
            }
        }




        // POST: api/Receipt/InsertReceiptExportBooks
        [HttpPost]
        [Route("InsertReceiptExportBooks")]
        public IActionResult InsertReceiptExportBooks(ReceiptModel receiptModel)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            Guid IdReceipt = Guid.NewGuid();
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

                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _mapper.Map<ReceiptDto>(receiptModel);

                int ReceiptCodeMax = _receiptRepository.GetMaxReceiptCode("PX");
                ReceiptCodeMax += 1;
                string Receipt = "PX" + ReceiptCodeMax;


                // define some col with data concrete
                receiptDto.IdReceipt = Guid.NewGuid();
                receiptDto.Status = 0;
                receiptDto.IsDeleted = false;
                receiptDto.ReceiptCode = Receipt;
                receiptDto.ReceiptNumber = Receipt;
                receiptDto.ReceiptType = 1;
                IdReceipt = receiptDto.IdReceipt;

                Response result = _receiptRepository.InsertReceiptExportBooks(receiptDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "Receipt", true, IdReceipt);

                    for (int i = 0; i < receiptDto.participants.Count; i++)
                    {
                        ParticipantsDto participantsDto = new ParticipantsDto()
                        {
                            Id = Guid.NewGuid(),
                            IdReceipt = receiptDto.IdReceipt,
                            Name = receiptDto.participants[i].Name,
                            Position = receiptDto.participants[i].Position,
                            Mission = receiptDto.participants[i].Mission,
                            Note = receiptDto.participants[i].Note,
                            CreatedDate = DateTime.Now,
                            Status = 0
                        };

                        _participantsRepository.InsertParticipants(participantsDto);
                    }
                    return Ok(result);
                }
                else
                {
                    _saveToDiary.SaveDiary(IdUserCurrent, "Create Receipt Export Books", "Receipt", false, IdReceipt);
                    return Ok(result);
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Create Receipt Export Books", "Receipt", false, IdReceipt);
                throw;
            }
        }


        // GET: api/Receipt/SearchReceipt
        [HttpGet]
        [Route("SearchReceipt")]
        public ReceiptModel SearchReceipt(string code)
        {
            try
            {
                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _receiptRepository.SearchReceipt(code);

                ReceiptModel receiptModel = new ReceiptModel();
                receiptModel = _mapper.Map<ReceiptModel>(receiptDto);
                return receiptModel;
            }
            catch (Exception)
            {
                throw;
            }
        }


        // POST: api/Receipt/UpdateReceipt
        [HttpPost]
        [Route("UpdateReceipt")]
        public async Task<IActionResult> UpdateReceipt(ReceiptModel receiptModel)
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

                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _mapper.Map<ReceiptDto>(receiptModel);

                Response result = await _receiptRepository.UpdateReceipt(receiptDto);


                if (result.Success == true && result.Fail == false)
                {
                    //insert individual
                    for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                    {
                        for (int j = 0; j < receiptDto.DocumentListId[i].Quantity; j++)
                        {
                            CategorySignDto categorySignDto = _categorySignRepository.getCategorySignById(receiptDto.DocumentListId[i].IdCategory);

                            Guid id = categorySignDto.Id;
                            string sign = categorySignDto.SignCode;
                            //get document type id from table book
                            DocumentDto book = _receiptRepository.GetDocumentType(receiptDto.DocumentListId[i].IdDocument);

                            int maxNumberIndividual = 0;

                            if (categorySignDto.SignCode == "SGK")
                            {
                                maxNumberIndividual = _individualSampleRepository.getNumIndividualMax(id, receiptDto.DocumentListId[i].IdDocument, book.DocumentTypeId);
                            }
                            else
                            {
                                maxNumberIndividual = _individualSampleRepository.getNumIndividualMaxByInsertReceipt(id);
                            }

                            maxNumberIndividual += 1;
                            string NumberIndividual = sign + maxNumberIndividual + "/" + id;

                            string Barcode = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();

                            IndividualSampleDto individualSampleDto = new IndividualSampleDto()
                            {
                                Id = Guid.NewGuid(),
                                IdDocument = receiptDto.DocumentListId[i].IdDocument,
                                StockId = receiptDto.DocumentListId[i].IdStock,
                                NumIndividual = NumberIndividual,
                                Barcode = Barcode,
                                IsLostedPhysicalVersion = false,
                                IsDeleted = false,
                                Status = 1,
                                CreatedBy = checkModel.Id,
                                CreatedDate = DateTime.Now,
                                DocumentTypeId = book.DocumentTypeId,
                                EntryDate = receiptModel.RecordBookDate ?? DateTime.Now,
                                GeneralEntryNumber = string.IsNullOrEmpty(receiptModel.GeneralEntryNumber) ? null : receiptModel.GeneralEntryNumber,
                                IdReceipt = receiptDto.IdReceipt,
                                Price = (long)receiptDto.DocumentListId[i].Price
                            };

                            Response rs = _individualSampleRepository.InsertIndividualSample(individualSampleDto);
                        }
                    }
                    return Ok(result);
                }


                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }



        // POST: api/Receipt/UpdateReceiptExportBooks
        [HttpPost]
        [Route("UpdateReceiptExportBooks")]
        public async Task<IActionResult> UpdateReceiptExportBooks(ReceiptModel receiptModel)
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

                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto = _mapper.Map<ReceiptDto>(receiptModel);

                Response result = await _receiptRepository.UpdateReceiptExportBooks(receiptDto);

                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }


        // GET: api/Receipt/ConfirmExportBooks
        [HttpGet]
        [Route("ConfirmExportBooks")]
        public async Task<IActionResult> ConfirmExportBooks(Guid idReceipt)
        {
            try
            {
                var confirm = _receiptRepository.ConfirmExportBooks(idReceipt);

                return Ok(confirm);
            }
            catch (Exception)
            {
                throw;
            }
        }


        #endregion


        #region Export PDF

        // API này dành cho Xuất sách - old
        /*[HttpGet]
        [Route("ExportBooksToWord")]
        [Obsolete]
        public async Task<IActionResult> ExportBooksToWord(Guid id, int typeExport)
        {
            try
            {
                string PATH_TEMPLATE = _appSettingModel.ServerFileWord + "/PHIEU_XUAT_SACH.docx";
                string PATH_EXPORT = _appSettingModel.ServerFileWord + "/PHIEU_XUAT_SACH_EXPORT.docx";
                string PATH_TEMPLATE_REPORT = _appSettingModel.ServerFileWord + "/BIEN_BAN_XUAT_SACH.docx";
                string PATH_EXPORT_REPORT = _appSettingModel.ServerFileWord + "/BIEN_BAN_XUAT_SACH_EXPORT.docx";

                // Lấy dữ liệu từ repository
                ReceiptDto receiptDto = _receiptRepository.getReceipt(id);

                if (receiptDto == null)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu xuất !"
                    });
                }
                else if (receiptDto.ReceiptType == 0)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này không phải là phiếu xuất sách !"
                    });
                }
                else if (receiptDto.Status == 0)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này chưa xác nhận xuất sạch !"
                    });
                }

                List<ContactAndIntroductionDto> contactAndIntroductionDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2).ToList();
                List<IndividualSampleDto> individualSampleDtos = _individualSampleRepository.getAllIndividualSample();
                List<CategorySignDto> categorySigns = _categorySignRepository.getAllCategorySign();
                DateTime createDate = DateTime.Now;

                var participantsDictionary = new List<Dictionary<string, object>>();
                var receiptDetailsDictionary = new List<Dictionary<string, object>>();
                var categorySignCounts = new Dictionary<string, int>();

                if (receiptDto.participants.Count == 0)
                {
                    participantsDictionary.Add(new Dictionary<string, object>
                    {
                        { "Name", "" },
                        { "Position", "" },
                        { "Mission", "" }
                    });
                }
                else
                {
                    foreach (var item in receiptDto.participants)
                    {
                        participantsDictionary.Add(new Dictionary<string, object>
                        {
                            { "Name", item.Name },
                            { "Position", item.Position },
                            { "Mission", item.Mission }
                        });
                    }
                }

                int totalQuality = 0;
                double totalPrice = 0;
                string statusBook = "";

                List<AuditBookListDto> auditBookLists = _auditBookListRepository.GetAllAuditBookList(0, 0).ToList();
                List<StatusBookDto> statusBookDtos = _statusBookRepository.GetAllListStatusBookNotPagination().ToList();

                var tempList = new List<Dictionary<string, object>>();

                for (int i = 0; i < receiptDto.ReceiptDetail.Count; i++)
                {
                    var individualSample = individualSampleDtos.FirstOrDefault(x => x.IdDocument == receiptDto.ReceiptDetail[i].IdDocument && x.Id == receiptDto.ReceiptDetail[i].IdIndividualSample);

                    var idArray = individualSample.NumIndividual.Split('/');

                    var categorySign = categorySigns.FirstOrDefault(x => x.IsDeleted == false && x.IsHided == false && x.Id == new Guid(idArray[1]));

                    var auditBookList = auditBookLists.Where(e => e.IdDocument == receiptDto.ReceiptDetail[i].IdDocument).OrderByDescending(e => e.CreatedDate).FirstOrDefault();

                    statusBook = auditBookList == null ? "Còn nguyên vẹn" : statusBookDtos.FirstOrDefault(e => e.Id == auditBookList.IdStatusBook).NameStatusBook;

                    tempList.Add(new Dictionary<string, object>
                    {
                        { "Stt", (i + 1).ToString() },
                        { "NumIndividual", individualSample.NumIndividual },
                        { "DocumentName", receiptDto.ReceiptDetail[i].DocumentName },
                        { "Quantity", 1},
                        { "Price", String.Format(new System.Globalization.CultureInfo("vi-VN"),"{0:N0}", receiptDto.ReceiptDetail[i].Price) },
                        { "NamePublisher", receiptDto.ReceiptDetail[i].NamePublisher },
                        { "Note", receiptDto.ReceiptDetail[i].Note },
                        { "StatusBook", statusBook }
                    });

                    if (categorySign != null)
                    {
                        var signName = categorySign.SignName;
                        if (!categorySignCounts.ContainsKey(signName))
                        {
                            categorySignCounts[signName] = 0;
                        }
                        categorySignCounts[signName] += 1;
                    }

                    totalPrice += receiptDto.ReceiptDetail[i].Price ?? 0;
                    totalQuality += 1;
                }

                var sortedList = tempList.OrderBy(x => ExtractNumber(x["NumIndividual"].ToString())).ToList();

                for (int i = 0; i < sortedList.Count; i++)
                {
                    sortedList[i]["Stt"] = (i + 1).ToString();
                    sortedList[i]["NumIndividual"] = sortedList[i]["NumIndividual"].ToString().Split('/')[0];
                }

                receiptDetailsDictionary = sortedList;

                string analystBooksStr = "";
                string analystBooksReportStr = "";

                foreach (var item in categorySignCounts)
                {
                    analystBooksStr += item.Key + ": " + item.Value + " bản \n";
                    analystBooksReportStr += (item.Value + " bản " + item.Key + ", ");
                }

                var values = new Dictionary<string, object>()
                {
                    { "Unit", contactAndIntroductionDto[0].col10 },
                    { "ReceiptNumber", receiptDto.ReceiptNumber },
                    { "day", createDate.Day.ToString() },
                    { "month", createDate.Month.ToString() },
                    { "year", createDate.Year.ToString() },
                    { "Participants", participantsDictionary },
                    { "ReceiptDetails", receiptDetailsDictionary },
                    { "analystBooks", analystBooksStr },
                    { "analystBooksReport", analystBooksReportStr.TrimEnd(' ', ',')},
                    { "totalQuality", totalQuality },
                    { "totalPrice", String.Format(new System.Globalization.CultureInfo("vi-VN"), "{0:C0}", totalPrice) },
                    { "reason", receiptDto.Reason }
                };

                if (typeExport == 1)
                {
                    MiniWord.SaveAsByTemplate(PATH_EXPORT, PATH_TEMPLATE, values);
                }
                else
                {
                    MiniWord.SaveAsByTemplate(PATH_EXPORT_REPORT, PATH_TEMPLATE_REPORT, values);
                }

                if (typeExport == 1)
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(PATH_EXPORT);
                    return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "UpdatedFile.docx");
                }
                else
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(PATH_EXPORT_REPORT);
                    return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "UpdatedFile.docx");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
*/


        // API này dành cho Xuất sách - new
        [HttpGet]
        [Route("ExportBooksToWord")]
        [Obsolete]
        public async Task<IActionResult> ExportBooksToWord(Guid id, int typeExport)
        {
            try
            {
                string PATH_TEMPLATE = _appSettingModel.ServerFileWord + "/PHIEU_XUAT_SACH.docx";
                string PATH_EXPORT = _appSettingModel.ServerFileWord + "/PHIEU_XUAT_SACH_EXPORT.docx";
                string PATH_TEMPLATE_REPORT = _appSettingModel.ServerFileWord + "/BIEN_BAN_XUAT_SACH.docx";
                string PATH_EXPORT_REPORT = _appSettingModel.ServerFileWord + "/BIEN_BAN_XUAT_SACH_EXPORT.docx";

                // Lấy dữ liệu từ repository
                ReceiptDto receiptDto = _receiptRepository.getReceipt(id);

                if (receiptDto == null)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu xuất !"
                    });
                }
                else if (receiptDto.ReceiptType == 0)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này không phải là phiếu xuất sách !"
                    });
                }
                else if (receiptDto.Status == 0)
                {
                    return Ok(new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này chưa xác nhận xuất sạch !"
                    });
                }

                List<ContactAndIntroductionDto> contactAndIntroductionDto = _contactAndIntroductionRepository.getAllRule(1, 1, 2).ToList();
                List<IndividualSampleDto> individualSampleDtos = _individualSampleRepository.getAllIndividualSample();
                List<CategorySignDto> categorySigns = _categorySignRepository.getAllCategorySign();
                DateTime createDate = DateTime.Now;

                var participantsDictionary = new List<Dictionary<string, object>>();
                var receiptDetailsDictionary = new List<Dictionary<string, object>>();
                var categorySignCounts = new Dictionary<string, int>();

                if (receiptDto.participants.Count == 0)
                {
                    participantsDictionary.Add(new Dictionary<string, object>
                    {
                        { "Name", "" },
                        { "Position", "" },
                        { "Mission", "" }
                    });
                }
                else
                {
                    foreach (var item in receiptDto.participants)
                    {
                        participantsDictionary.Add(new Dictionary<string, object>
                        {
                            { "Name", item.Name },
                            { "Position", item.Position },
                            { "Mission", item.Mission }
                        });
                    }
                }

                int totalQuality = 0;
                double totalPrice = 0;
                string statusBook = "";

                List<AuditBookListDto> auditBookLists = _auditBookListRepository.GetAllAuditBookList(0, 0).ToList();
                List<StatusBookDto> statusBookDtos = _statusBookRepository.GetAllListStatusBookNotPagination().ToList();


                List<AuditBookList> auditBookListsTemp = _context.AuditBookList.ToList();

                List<AuditReceipt> auditReceiptDtosTemp = _context.AuditReceipt.OrderByDescending(e => e.ReportCreateDate).ToList();
                List<StatusBook> statusBooks = _context.StatusBook.ToList();

                var tempList = new List<Dictionary<string, object>>();

                for (int i = 0; i < receiptDto.ReceiptDetail.Count; i++)
                {
                    var individualSample = individualSampleDtos.FirstOrDefault(x => x.IdDocument == receiptDto.ReceiptDetail[i].IdDocument && x.Id == receiptDto.ReceiptDetail[i].IdIndividualSample);

                    var idArray = individualSample.NumIndividual.Split('/');

                    var categorySign = categorySigns.FirstOrDefault(x => x.IsDeleted == false && x.IsHided == false && x.Id == new Guid(idArray[1]));

                    var auditBookList = auditBookLists.Where(e => e.IdDocument == receiptDto.ReceiptDetail[i].IdDocument).OrderByDescending(e => e.CreatedDate).FirstOrDefault();

                    statusBook = auditBookList == null ? "Còn nguyên vẹn" : statusBookDtos.FirstOrDefault(e => e.Id == auditBookList.IdStatusBook).NameStatusBook;


                    bool check = false;
                    string statusIndividual = "";
                    foreach (var auditReceipt in auditReceiptDtosTemp)
                    {
                        var auditBookListTemp = auditBookLists.Where(e => e.IdDocument == receiptDto.ReceiptDetail[i].IdDocument && e.IdIndividualSample == individualSample.Id && e.IdAuditReceipt == auditReceipt.Id).OrderByDescending(e => e.CreatedDate).FirstOrDefault();

                        if (auditBookListTemp != null)
                        {
                            var statusBookk = statusBooks.Where(e => e.Id == auditBookListTemp.IdStatusBook).FirstOrDefault();

                            if (statusBookk == null)
                            {
                                statusIndividual = "Không thể xác định Tình trạng";
                                check = true;
                                break;
                            }
                            else
                            {
                                statusIndividual = statusBookk.NameStatusBook;
                                check = true;
                                break;
                            }


                        }
                    }
                    if (check == false) statusIndividual = "Còn nguyên vẹn";


                    tempList.Add(new Dictionary<string, object>
                    {
                        { "Stt", (i + 1).ToString() },
                        { "NumIndividual", individualSample.NumIndividual },
                        { "DocumentName", receiptDto.ReceiptDetail[i].DocumentName },
                        { "Quantity", 1},
                        { "Price", String.Format(new System.Globalization.CultureInfo("vi-VN"),"{0:N0}", receiptDto.ReceiptDetail[i].Price) },
                        { "NamePublisher", receiptDto.ReceiptDetail[i].NamePublisher },
                        { "Note", receiptDto.ReceiptDetail[i].Note },
                        { "StatusBook", statusIndividual }
                    });

                    if (categorySign != null)
                    {
                        var signName = categorySign.SignName;
                        if (!categorySignCounts.ContainsKey(signName))
                        {
                            categorySignCounts[signName] = 0;
                        }
                        categorySignCounts[signName] += 1;
                    }

                    totalPrice += receiptDto.ReceiptDetail[i].Price ?? 0;
                    totalQuality += 1;
                }

                var sortedList = tempList.OrderBy(x => ExtractNumber(x["NumIndividual"].ToString())).ToList();

                for (int i = 0; i < sortedList.Count; i++)
                {
                    sortedList[i]["Stt"] = (i + 1).ToString();
                    sortedList[i]["NumIndividual"] = sortedList[i]["NumIndividual"].ToString().Split('/')[0];
                }

                receiptDetailsDictionary = sortedList;

                string analystBooksStr = "";
                string analystBooksReportStr = "";

                foreach (var item in categorySignCounts)
                {
                    analystBooksStr += item.Key + ": " + item.Value + " bản \n";
                    analystBooksReportStr += (item.Value + " bản " + item.Key + ", ");
                }

                var values = new Dictionary<string, object>()
                {
                    { "Unit", contactAndIntroductionDto[0].col10 },
                    { "ReceiptNumber", receiptDto.ReceiptNumber },
                    { "day", createDate.Day.ToString() },
                    { "month", createDate.Month.ToString() },
                    { "year", createDate.Year.ToString() },
                    { "Participants", participantsDictionary },
                    { "ReceiptDetails", receiptDetailsDictionary },
                    { "analystBooks", analystBooksStr },
                    { "analystBooksReport", analystBooksReportStr.TrimEnd(' ', ',')},
                    { "totalQuality", totalQuality },
                    { "totalPrice", String.Format(new System.Globalization.CultureInfo("vi-VN"), "{0:C0}", totalPrice) },
                    { "reason", receiptDto.Reason }
                };

                if (typeExport == 1)
                {
                    MiniWord.SaveAsByTemplate(PATH_EXPORT, PATH_TEMPLATE, values);
                }
                else
                {
                    MiniWord.SaveAsByTemplate(PATH_EXPORT_REPORT, PATH_TEMPLATE_REPORT, values);
                }

                if (typeExport == 1)
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(PATH_EXPORT);
                    return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "UpdatedFile.docx");
                }
                else
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(PATH_EXPORT_REPORT);
                    return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "UpdatedFile.docx");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        private static int ExtractNumber(string numIndividual)
        {
            var match = Regex.Match(numIndividual, @"\d+");
            return match.Success ? int.Parse(match.Value) : 0;
        }


        #endregion
    }
}
