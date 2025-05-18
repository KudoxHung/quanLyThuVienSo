using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategorySign_V1Controller : Controller
    {
        #region Variables
        private readonly ICategorySign_V1Repository _categorySign_V1Repository;
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly ICategorySignRepository _categorySignRepository;
        private readonly ICategorySignParentsRepository _categorySignParentsRepository;
        private readonly DataContext _context;

        private readonly SaveToDiary _saveToDiary;
        #endregion

        #region Contructor
        public CategorySign_V1Controller(ICategorySign_V1Repository categorySign_V1Repository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        IMapper mapper,
        SaveToDiary saveToDiary,
        ICategorySignRepository categorySignRepository,
        JwtService jwtService, IUserRepository userRepository, ICategorySignParentsRepository categorySignParentsRepository,
        DataContext context)
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _mapper = mapper;
            _categorySign_V1Repository = categorySign_V1Repository;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _categorySignRepository = categorySignRepository;
            _saveToDiary = saveToDiary;
            _categorySignParentsRepository = categorySignParentsRepository;
            _context = context;
        }
        #endregion

        #region MeThod
        // POST: api/CategorySign_V1/HideCategoryById
        [HttpPost]
        [Route("HideCategoryById")]
        public IActionResult HideCategoryById(Guid Id, bool check)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            string content = check ? "ẩn kí hiệu phân loại" : "hiển thị kí hiệu phân loại";
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


                Response result = _categorySign_V1Repository.HideCategorySignV1(Id, check);
                if (result.Success)
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "CategorySignV1", true, Id, content);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "CategorySignV1", false, Id, content);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.ModifyDiary(IdUserCurrent, "Update", "CategorySignV1", false, Id, content);
                throw;
            }
        }
        // GET: api/CategorySign_V1/GetCategorySignWithPage
        [HttpGet]
        [Route("GetCategorySignWithPage")]
        public List<CategorySign_V1Model> GetCategorySignWithPage(int pageNumber, int pageSize)
        {
            try
            {
                List<CategorySign_V1Dto> categorySignDtos = new List<CategorySign_V1Dto>();
                categorySignDtos = _categorySign_V1Repository.getAllCategorySignV1(pageNumber, pageSize);

                List<CategorySign_V1Model> categorySignModels = new List<CategorySign_V1Model>();
                categorySignModels = _mapper.Map<List<CategorySign_V1Model>>(categorySignDtos);

                return categorySignModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/CategorySign_V1/GetCategorySignById
        [HttpGet]
        [Route("GetCategorySignById")]
        public CategorySign_V1Model GetCategorySignById(Guid Id)
        {
            try
            {
                CategorySign_V1Dto categorySignDtos = new CategorySign_V1Dto();
                categorySignDtos = _categorySign_V1Repository.getAllCategorySignV1ById(Id);

                CategorySign_V1Model categorySignModels = new CategorySign_V1Model();
                categorySignModels = _mapper.Map<CategorySign_V1Model>(categorySignDtos);

                return categorySignModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/CategorySign_V1/GetCategorySignByIdCategoryParent
        [HttpGet]
        [Route("GetCategorySignByIdCategoryParent")]
        public List<CategorySign_V1Model> GetCategorySignByIdParent(Guid Id)
        {
            try
            {
                List<CategorySign_V1Dto> categorySignDtos = new List<CategorySign_V1Dto>();
                categorySignDtos = _categorySign_V1Repository.getAllCategorySignV1ByIdParent(Id);

                List<CategorySign_V1Model> categorySignModels = new List<CategorySign_V1Model>();
                categorySignModels = _mapper.Map<List<CategorySign_V1Model>>(categorySignDtos);


                return categorySignModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // POST: api/CategorySign_V1/DeleteCategoryByID
        [HttpPost]
        [Route("DeleteCategoryByID")]
        public IActionResult DeleteCategoryByID(Guid Id)
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


                Response result = _categorySign_V1Repository.DeleteCategorySignV1(Id);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "CategorySignV1", true, Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "CategorySignV1", false, Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Delete", "CategorySignV1", false, Id);
                throw;
            }
        }
        // POST: api/CategorySign_V1/InsertCategory
        [HttpPost]
        [Route("InsertCategory")]
        public IActionResult InsertCategory(CategorySign_V1Model categorySignModel)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            Guid IdCategorySign_V1 = Guid.NewGuid();
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


                bool check = _categorySign_V1Repository.CheckExitsCategorySignCode(categorySignModel.SignCode);
                if (check)
                {
                    return BadRequest(new
                    {
                        message = "Mã kí hiệu này đã tồn tại "
                    });
                }

                CategorySign_V1Dto categorySignDto = new CategorySign_V1Dto();
                categorySignDto = _mapper.Map<CategorySign_V1Dto>(categorySignModel);

                // define some col with data concrete
                categorySignDto.Id = Guid.NewGuid();
                categorySignDto.Status = 0;
                categorySignDto.CreatedDate = DateTime.Now;
                categorySignDto.CreatedBy = checkModel.Id;
                categorySignDto.IsDeleted = false;
                categorySignDto.IsHided = false;

                IdCategorySign_V1 = categorySignDto.Id;

                Response result = _categorySign_V1Repository.InsertCategorySignV1(categorySignDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignV1", true, categorySignDto.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignV1", false, categorySignDto.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Create", "CategorySignV1", false, IdCategorySign_V1);
                throw;
            }
        }
        // POST: api/CategorySign_V1/UpdateCategorySignV1
        [HttpPost]
        [Route("UpdateCategorySignV1")]
        public IActionResult UpdateCategorySign(CategorySign_V1Model categorySignModel)
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

                CategorySign_V1Dto categorySignDto = new CategorySign_V1Dto();
                categorySignDto = _mapper.Map<CategorySign_V1Dto>(categorySignModel);

                Response result = _categorySign_V1Repository.UpdateCategorySignV1(categorySignDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategorySignV1", true, categorySignDto.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategorySignV1", false, categorySignDto.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Update", "CategorySignV1", false, categorySignModel.Id);
                throw;
            }
        }
        // HttpPost: /api/CategorySign_V1/InsertCategorySignByExcel
        [HttpPost]
        [Route("InsertCategorySignByExcel")]
        public IActionResult InsertCategorySignByExcel()
        {
            Guid IdUserCurrent = Guid.NewGuid();

            var transaction = _context.Database.BeginTransaction();


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

                string IdFile = "";
                // check file exit and save file to sevrer
                if (Request.Form.Files.Count > 0)
                {
                    foreach (var file in Request.Form.Files)
                    {
                        string pathTo = _appSettingModel.ServerFileExcel;
                        IdFile = DateTimeOffset.Now.ToUnixTimeSeconds().ToString() + ".xlsx";

                        // set file path to save file
                        var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

                        // save file
                        using (var stream = System.IO.File.Create(filename))
                        {
                            file.CopyTo(stream);
                        }
                    }
                }

                // path to open file excel
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", IdFile);
                FileInfo fi = new FileInfo(path);
                string fileCodeName = Guid.NewGuid().ToString();

                bool checkAddUser = false;
                List<AddCategorySignByExcel> addCategorySignByExcels = new List<AddCategorySignByExcel>();



                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {

                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

                    int rowCount = namedWorksheet.Dimension.Rows;

                    int colCount = namedWorksheet.Dimension.Columns;



                    for (int i = 2; i <= rowCount; i++)
                    {


                        if (namedWorksheet.Cells[i, 1].Value == null && namedWorksheet.Cells[i, 2].Value == null && namedWorksheet.Cells[i, 3].Value == null)
                        {
                            continue;
                        }
                        else if (namedWorksheet.Cells[i, 1].Value == null || namedWorksheet.Cells[i, 2].Value == null || namedWorksheet.Cells[i, 3].Value == null)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = "Dòng số " + i + ": Dữ liệu chưa đầy đủ"
                            });
                        }



                        string signName = namedWorksheet.Cells[i, 1].Value.ToString();
                        string signCode = namedWorksheet.Cells[i, 2].Value.ToString();
                        string categoryName = namedWorksheet.Cells[i, 3].Value.ToString();



                        var cts = _context.CategorySign_V1.Where(e => e.SignName.ToLower().Trim() == signName.ToLower().Trim()).FirstOrDefault();

                        if (cts != null)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = "Dòng số " + i + ": Tên ký hiệu phân loại đã tồn tại trên hệ thống"
                            });
                        }

                        bool check = _categorySign_V1Repository.CheckExitsCategorySignCode(signCode);

                        if (check)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = "Dòng số " + i + ": Mã ký hiệu phân loại đã tồn tại trên hệ thống"
                            });
                        }

                        var ctp = _context.CategorySignParents.Where(e => e.ParentName.ToLower().Trim() == categoryName.ToLower().Trim()).FirstOrDefault();

                        CategorySign_V1 categorySign_V1 = new CategorySign_V1
                        {
                            Id = Guid.NewGuid(),
                            IdCategoryParent = ctp.Id,
                            SignName = signName,
                            SignCode = signCode,
                            Status = 0,
                            CreatedDate = DateTime.Now,
                            CreatedBy = checkModel.Id,
                            IsHided = false,
                            IsDeleted = false
                        };

                        // Insert the new CategorySign_V1Dto entity
                        _context.CategorySign_V1.Add(categorySign_V1);

                        // Save changes to the database
                        _context.SaveChanges();

                        // Log the creation of this CategorySign
                        _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignV1", true, categorySign_V1.Id);

                    }

                    transaction.Commit();
                }


                return Ok(new
                {
                    Success = true,
                    Message = "Thêm mới thành công"
                });
            }
            catch (Exception)
            {
                transaction.Rollback();

                throw;
            }
        }
        // GET: api/CategorySign_V1/GetFileExcelCategorySign
        [HttpGet]
        [Route("GetFileExcelCategorySign")]
        public IActionResult GetFileExcelCategorySign()
        {
            try
            {
                var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_ImportKiHieuPhanLoai.xlsx");
                FileInfo fi = new FileInfo(path);
                string fileCodeName = Guid.NewGuid().ToString();

                using (ExcelPackage excelPackage = new ExcelPackage(fi))
                {
                    //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
                    ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];

                    namedWorksheet.Cells["A2:B2000000"].Clear();

                    // get all table unit
                    var csp = _categorySignParentsRepository.getAllCategorySignParent().OrderBy(e => e.ParentName).ToList();
                    int row = 2;
                    for (int i = 0; i < csp.Count; i++)
                    {

                        namedWorksheet.Cells[row, 1].Value = csp[i].Id;
                        namedWorksheet.Cells[row, 2].Value = csp[i].ParentName;
                        row++;
                    }

                    FileInfo fiToSave = new FileInfo(path);
                    //Save your file
                    excelPackage.SaveAs(fiToSave);
                }
                //download file excel
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "Mau_ImportKiHieuPhanLoai.xlsx");
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion
    }
}
