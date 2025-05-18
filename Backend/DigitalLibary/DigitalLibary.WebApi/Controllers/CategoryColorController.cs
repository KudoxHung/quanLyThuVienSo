using AutoMapper;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Utils;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.WebApi.Controllers
{
    [Route("api/v1/CatagoryColor")]
    [ApiController]
    public class CategoryColorController : Controller
    {
        #region Variables
        private readonly ICategoryColor _categoryColor ;
        private readonly ILogger<CategoryColorController> _logger;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly SaveToDiary _saveToDiary;


        #endregion
        #region Contructor
        public CategoryColorController(ICategoryColor ICategoryColor,
            ILogger<CategoryColorController> logger,
            IUserRepository userRepository,
        SaveToDiary saveToDiary, 
        JwtService jwtService)
        {
            _categoryColor = ICategoryColor;
            _logger = logger;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _saveToDiary = saveToDiary;
        }
        #endregion
        [HttpGet]
        [Route("GetAllListCategoryColor")]
        public TemplateApi<CategoryColorDto> GetAllListCategoryColor(int pageNumber, int pageSize)
        {
            try
            {
                var result = _categoryColor.GetAllListCategoryColor(pageNumber, pageSize);
                _logger.LogInformation("Lấy danh sách thành công !");

                Pagination pagination = new Pagination();

                int totalCount = result.Count();
                return pagination.HandleGetAllRespond(pageNumber, pageSize, result, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError("Lấy danh sách không thành công: {message}\n{stackTrace}", ex.Message, ex.StackTrace);
                throw;
            }

        }
        [HttpGet]
        [Route("GetAllListCategoryColorNotPagination")]
        public TemplateApi<CategoryColorDto> GetAllListCategoryColorNotPagination()
        {
            try
            {
                var result = _categoryColor.GetAllListCategoryColorNotPagination();
                _logger.LogInformation("Lấy danh sách thành công !");

                Pagination pagination = new Pagination();

                int totalCount = result.Count();
                return pagination.HandleGetAllRespond(0, 0, result, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError("Lấy danh sách không thành công: {message}\n{stackTrace}", ex.Message, ex.StackTrace);
                throw;
            }

        }
        [HttpGet("getCategoryColorById")]
        public async Task<IActionResult> GetCategoryColorById(Guid idCategoryNationality)
        {
            var templateApi = await _categoryColor.GetById(idCategoryNationality);
            _logger.LogInformation("Thành công : {message}", templateApi.Message);
            return Ok(templateApi);
        }
        [HttpPost("insertCategoryColor")]
        public async Task<IActionResult> InsertCategorynationality(CategoryColorDto CategoryColorDto)
        {
            Guid IdUserCurrent = Guid.NewGuid();
            
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

                CategoryColorDto.Id = Guid.NewGuid();
                CategoryColorDto.CreatedDate = DateTime.Now;
                CategoryColorDto.Status = 0;
                var nameuser = _userRepository.getUserByID(IdUserCurrent).Fullname;
                var result = _categoryColor.Insert(CategoryColorDto, nameuser, IdUserCurrent );

                if (result.Success)
                {
                    _saveToDiary.SaveDiary(checkModel.Id, "Insert", "CategoryColor", true, CategoryColorDto.Id);
                    _logger.LogInformation("Thành công : {message}", result.Message);
                    return Ok(result);
                }
            return BadRequest(new
            {
                message = "Thêm mới không thành công"
            });
        }
        [HttpPost("updateCategoryColor")]
        public async Task<IActionResult> UpdateCategoryColor(CategoryColorDto CategoryColorDto)
        {
            Guid IdUserCurrent = Guid.NewGuid();
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

            var nameuser = _userRepository.getUserByID(IdUserCurrent).Fullname;
            var result = _categoryColor.Update(CategoryColorDto, nameuser, IdUserCurrent);

            if (result.Success)
            {
                _saveToDiary.SaveDiary(checkModel.Id, "Update", "CategoryColor", true, CategoryColorDto.Id);
                _logger.LogInformation("Thành công : {message}", result.Message);
                return Ok(result);
            }
            return BadRequest(new
            {
                message = "Cập nhật không thành công"
            });
        }
        [HttpPost("deleteCategoryColorById")]
        public async Task<IActionResult> DeleteCategoryColorById(CategoryColorDto categoryColorDto)
        {
            Guid IdUserCurrent = Guid.NewGuid();
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

            var nameuser = _userRepository.getUserByID(IdUserCurrent).Fullname;
            var result = _categoryColor.Delete(categoryColorDto.Id, nameuser, IdUserCurrent);

            if (result.Success)
            {
                _saveToDiary.SaveDiary(checkModel.Id, "Delete", "CategoryColor", true, categoryColorDto.Id);
                _logger.LogInformation("Thành công : {message}", result.Message);
                return Ok(result);
            }
            return BadRequest(new
            {
                message = "Xóa không thành công"
            });
        }


    }
}
