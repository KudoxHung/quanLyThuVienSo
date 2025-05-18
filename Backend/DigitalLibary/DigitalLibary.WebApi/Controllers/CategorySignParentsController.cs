using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategorySignParentsController : ControllerBase
    {
        #region Variables
        private readonly ICategorySignParentsRepository _categorySignParent;
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly ICategorySignRepository _categorySignRepository;
        private readonly SaveToDiary _saveToDiary;
        private readonly DataContext _context;
        #endregion

        #region Contructor
        public CategorySignParentsController(ICategorySignParentsRepository signParentRepository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        IMapper mapper,
        SaveToDiary saveToDiary,
        ICategorySignRepository categorySignRepository,
        JwtService jwtService, IUserRepository userRepository,
        DataContext context)
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _mapper = mapper;
            _categorySignParent = signParentRepository;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _categorySignRepository = categorySignRepository;
            _saveToDiary = saveToDiary;
            _context = context;
        }
        #endregion

        #region MeThod
        //POST: api/CategorySignParent/HideCategoryParentById
        [HttpPost]
        [Route("HideCategoryParentById")]
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


                Response result = _categorySignParent.HideCategorySignParent(Id, check);
                if (result.Success)
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "CategorySignParents", true, Id, content);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.ModifyDiary(checkModel.Id, "Update", "CategorySignParents", false, Id, content);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.ModifyDiary(IdUserCurrent, "Update", "CategorySignParents", false, Id, content);
                throw;
            }
        }
        // GET: api/CategorySignParent/GetCategorySignParentWithPage
        [HttpGet]
        [Route("GetCategorySignParentWithPage")]
        public List<CategorySignParentModel> GetCategoryParentWithPage(int pageNumber, int pageSize)
        {
            try
            {
                List<CategorySignParentsDto> categorySignDtos = new List<CategorySignParentsDto>();
                categorySignDtos = _categorySignParent.getAllCategorySignParent(pageNumber, pageSize);

                List<CategorySignParentModel> categorySignModels = new List<CategorySignParentModel>();
                categorySignModels = _mapper.Map<List<CategorySignParentModel>>(categorySignDtos);

                return categorySignModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        // GET: api/CategorySignParent/GetCategorySignParentById
        [HttpGet]
        [Route("GetCategorySignParentById")]
        public CategorySignParentModel GetCategorySignParentById(Guid Id)
        {
            try
            {
                CategorySignParentsDto categorySignDtos = new CategorySignParentsDto();
                categorySignDtos = _categorySignParent.getAllCategorySignParentId(Id);

                CategorySignParentModel categorySignModels = new CategorySignParentModel();
                categorySignModels = _mapper.Map<CategorySignParentModel>(categorySignDtos);

                return categorySignModels;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //POST: api/CategorySignParent/DeleteCategorySignParentByID
        [HttpPost]
        [Route("DeleteCategorySignParentByID")]
        public IActionResult DeleteCategoryParentByID(Guid Id)
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


                Response result = _categorySignParent.DeleteCategorySignParent(Id);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "CategorySignParents", true, Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Delete", "CategorySignParents", false, Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Delete", "CategorySignParents", false, Id);
                throw;
            }
        }
        //// POST: api/CategorySignParent/InsertCategoryParent
        [HttpPost]
        [Route("InsertCategoryParent")]
        public async Task<IActionResult> InsertCategory(CategorySignParentModel categorySignModel)
        {
            Guid IdUserCurrent = Guid.NewGuid();

            Guid IdCategorySignParents = Guid.NewGuid();
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


                //bool check = _categorySignParent.CheckExitsCategorySignCode(categorySignModel.SignCode);
                //if (check)
                //{
                //    return BadRequest(new
                //    {
                //        message = "Mã kí hiệu này đã tồn tại "
                //    });
                //}

                CategorySignParentsDto categorySignDto = new CategorySignParentsDto();
                categorySignDto = _mapper.Map<CategorySignParentsDto>(categorySignModel);

                // define some col with data concrete
                categorySignDto.Id = Guid.NewGuid();
                //categorySignDto.ParentName = "";
                categorySignDto.IsDeleted = false;
                categorySignDto.CreateBy = checkModel.Id;
                categorySignDto.CreateDate = DateTime.Now;
                categorySignDto.IsHided = false;
                categorySignDto.Status = 0;

                IdCategorySignParents = categorySignDto.Id;

                var checkName = await _context.CategorySignParents.Where(e => e.ParentName.ToLower().Trim() == categorySignDto.ParentName.ToLower().Trim() && e.IsDeleted == false).FirstOrDefaultAsync();

                if (checkName != null)
                {
                    return BadRequest(new
                    {
                        message = "Tên ký hiệu phân loại cha này đã được sử dụng."
                    });
                }



                Response result = _categorySignParent.InsertCategorySignParent(categorySignDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignParents", true, categorySignDto.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignParents", false, categorySignDto.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Create", "CategorySignParents", false, IdCategorySignParents);
                throw;
            }
        }
        // POST: api/CategorySignParent/UpdateCategorySignParent
        [HttpPost]
        [Route("UpdateCategorySignParent")]
        public IActionResult UpdateCategoryParent(CategorySignParentModel categorySignModel)
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

                CategorySignParentsDto categorySignDto = new CategorySignParentsDto();
                categorySignDto = _mapper.Map<CategorySignParentsDto>(categorySignModel);

                Response result = _categorySignParent.UpdateCategorySignParent(categorySignDto);
                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategorySignParents", true, categorySignDto.Id);
                    return Ok(new
                    {
                        message = result.Message,
                    });
                }
                else
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategorySignParents", false, categorySignDto.Id);
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }
            }
            catch (Exception)
            {
                _saveToDiary.SaveDiary(IdUserCurrent, "Update", "CategorySignParents", false, categorySignModel.Id);
                throw;
            }
        }
        // HttpPost: /api/CategorySignParent/InsertCategorySignParentExcel
        //[HttpPost]
        //[Route("InsertCategorySignByExcel")]
        //public IActionResult InsertCategorySignByExcel()
        //{
        //    Guid IdUserCurrent = Guid.NewGuid();
        //    try
        //    {
        //        //check role admin
        //        Request.Headers.TryGetValue("Authorization", out var headerValue);
        //        if (headerValue.Count == 0)
        //        {
        //            return BadRequest(new
        //            {
        //                message = "Bạn cần đăng nhập tài khoản Admin"
        //            });
        //        }
        //        CheckRoleSystem checkRoleSystem = new CheckRoleSystem(_jwtService, _userRepository);
        //        CheckAdminModel checkModel = checkRoleSystem.CheckAdmin(headerValue);

        //        if (!checkModel.check)
        //        {
        //            return BadRequest(new
        //            {
        //                message = "Bạn cần đăng nhập tài khoản Admin"
        //            });
        //        }

        //        if (checkModel != null) IdUserCurrent = checkModel.Id;

        //        string IdFile = "";
        //        // check file exit and save file to sevrer
        //        if (Request.Form.Files.Count > 0)
        //        {
        //            foreach (var file in Request.Form.Files)
        //            {
        //                string pathTo = _appSettingModel.ServerFileExcel;
        //                IdFile = DateTimeOffset.Now.ToUnixTimeSeconds().ToString() + ".xlsx";

        //                // set file path to save file
        //                var filename = Path.Combine(pathTo, Path.GetFileName(IdFile));

        //                // save file
        //                using (var stream = System.IO.File.Create(filename))
        //                {
        //                    file.CopyTo(stream);
        //                }
        //            }
        //        }

        //        // path to open file excel
        //        var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", IdFile);
        //        FileInfo fi = new FileInfo(path);
        //        string fileCodeName = Guid.NewGuid().ToString();

        //        bool checkAddUser = false;
        //        List<AddCategorySignByExcel> addCategorySignByExcels = new List<AddCategorySignByExcel>();

        //        using (ExcelPackage excelPackage = new ExcelPackage(fi))
        //        {
        //            //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
        //            ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[0];

        //            int rowCount = namedWorksheet.Dimension.Rows;
        //            int colCount = namedWorksheet.Dimension.Columns;
        //            for (int i = 2; i <= rowCount; i++)
        //            {
        //                CategorySign_V1Dto categorySign_V1Dto = new CategorySign_V1Dto();
        //                for (int j = 1; j <= colCount; j++)
        //                {
        //                    string cells = "";
        //                    if (namedWorksheet.Cells[i, j].Value != null)
        //                    {
        //                        cells = namedWorksheet.Cells[i, j].Value.ToString();

        //                        if (j == 1) categorySign_V1Dto.SignName = cells;
        //                        else if (j == 2) categorySign_V1Dto.SignCode = cells;
        //                        else if (j == 3) categorySign_V1Dto.IdCategory = new Guid(cells);
        //                    }
        //                }
        //                if (categorySign_V1Dto.SignName == null || categorySign_V1Dto.SignCode == null)
        //                {
        //                    continue;
        //                }
        //                bool check = _categorySign_V1Repository.CheckExitsCategorySignCode(categorySign_V1Dto.SignCode);
        //                if (check)
        //                {
        //                    continue;
        //                }

        //                categorySign_V1Dto.Id = Guid.NewGuid();
        //                categorySign_V1Dto.Status = 0;
        //                categorySign_V1Dto.CreatedDate = DateTime.Now;
        //                categorySign_V1Dto.CreatedBy = checkModel.Id;
        //                categorySign_V1Dto.IsHided = false;
        //                categorySign_V1Dto.IsDeleted = false;

        //                Response response = new Response();
        //                response = _categorySign_V1Repository.InsertCategorySignV1(categorySign_V1Dto);

        //                _saveToDiary.SaveDiary(checkModel.Id, "Create", "CategorySignV1", true, categorySign_V1Dto.Id);

        //                if (!response.Success)
        //                {
        //                    checkAddUser = true;
        //                    AddCategorySignByExcel addCategorySignByExcel = new AddCategorySignByExcel();
        //                    addCategorySignByExcel.ID = categorySign_V1Dto.Id;
        //                    addCategorySignByExcel.SignName = categorySign_V1Dto.SignName;

        //                    addCategorySignByExcels.Add(addCategorySignByExcel);
        //                }
        //            }
        //        }
        //        if (checkAddUser)
        //        {
        //            for (int i = 0; i < addCategorySignByExcels.Count; i++)
        //            {
        //                _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategorySignV1", false, addCategorySignByExcels[i].ID);
        //            }
        //            return Ok(new
        //            {
        //                Success = false,
        //                Body = addCategorySignByExcels
        //            });
        //        }
        //        else
        //        {
        //            return Ok(new
        //            {
        //                Success = true,
        //                Message = "Thêm mới thành công"
        //            });
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
        //// GET: api/CategorySign_V1/GetFileExcelCategorySign
        //[HttpGet]
        //[Route("GetFileExcelCategorySign")]
        //public IActionResult GetFileExcelCategorySign()
        //{
        //    try
        //    {
        //        var path = string.Concat(_appSettingModel.ServerFileExcel, "\\", "Mau_ImportKiHieuPhanLoai.xlsx");
        //        FileInfo fi = new FileInfo(path);
        //        string fileCodeName = Guid.NewGuid().ToString();

        //        using (ExcelPackage excelPackage = new ExcelPackage(fi))
        //        {
        //            //Get a WorkSheet by name. If the worksheet doesn't exist, throw an exeption
        //            ExcelWorksheet namedWorksheet = excelPackage.Workbook.Worksheets[1];

        //            namedWorksheet.Cells["A2:B200"].Clear();

        //            // get all table unit
        //            List<Category> units = new List<Category>();
        //            units = _categorySignRepository.getAllCategory();
        //            int row = 2;
        //            for (int i = 0; i < units.Count; i++)
        //            {
        //                if (units[i].Id == new Guid("6d7cbf33-7c6b-4020-a6ad-7c31f94297bb"))
        //                {
        //                    namedWorksheet.Cells[row, 1].Value = units[i].Id;
        //                    namedWorksheet.Cells[row, 2].Value = units[i].CategoryName;
        //                    row++;
        //                }
        //            }

        //            FileInfo fiToSave = new FileInfo(path);
        //            //Save your file
        //            excelPackage.SaveAs(fiToSave);
        //        }
        //        //download file excel
        //        byte[] fileBytes = System.IO.File.ReadAllBytes(path);
        //        return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "Mau_ImportKiHieuPhanLoai.xlsx");
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
        #endregion
    }

}
