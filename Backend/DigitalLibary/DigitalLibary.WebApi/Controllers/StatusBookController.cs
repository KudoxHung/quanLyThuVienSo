using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Utils;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusBookController : Controller
    {
        #region Variables
        private readonly IStatusBookRepository _statusBookRepository;
        private readonly IAuditBookListRepository _auditBookListRepository;
        private readonly AppSettingModel _appSettingModel;
        private readonly ILogger<StatusBookController> _logger;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly SaveToDiary _saveToDiary;


        #endregion

        #region Contructor
        public StatusBookController(IStatusBookRepository statusBookRepository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        ILogger<StatusBookController> logger,
        IUserRepository userRepository,
        IAuditBookListRepository auditBookListRepository,
        SaveToDiary saveToDiary,
        JwtService jwtService)
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _statusBookRepository = statusBookRepository;
            _logger = logger;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _saveToDiary = saveToDiary;
            _auditBookListRepository = auditBookListRepository;
        }
        #endregion

        #region METHOD
        // GET: api/StatusBook/GetAll
        [HttpGet]
        [Route("GetAll")]
        public IEnumerable<StatusBookDto> GetAll(int pageNumber, int pageSize, int Type)
        {
            var result = _statusBookRepository.GetAll(pageNumber, pageSize);
            return result;
        }
        // GET: api/StatusBook/GetAllStatusBook
        [HttpGet]
        [Route("GetAllStatusBook")]
        public IEnumerable<StatusBookDto> GetAllStatusBook(int pageNumber, int pageSize, int Type)
        {
            var result = _statusBookRepository.GetAllStatusBook(pageNumber, pageSize, Type);
            return result;
        }

        // GET: api/StatusBook/GetListStatusBook
        [HttpGet]
        [Route("GetListStatusBook")]
        public IEnumerable<StatusBookDto> GetListStatusBook(int pageNumber, int pageSize)
        {
            var result = _statusBookRepository.GetAllStatusBook(pageNumber, pageSize);
            return result;
        }

        // GET: api/StatusBook/GetStatusBookByIdDocument
        [HttpGet]
        [Route("GetStatusBookByIdDocument")]
        public async Task<IActionResult> GetStatusBookByIdDocument(Guid idDocument)
        {
            List<AuditBookListDto> listAuditBookList = (List<AuditBookListDto>)_auditBookListRepository.GetAllAuditBookList(0, 0);

            var result = _statusBookRepository.GetStatusBookByIdDocument(idDocument, listAuditBookList);

            return Ok(result);
        }



        [HttpGet]
        [Route("GetAllListStatusBookNotPagination")]
        public TemplateApi<StatusBookDto> GetAllListStatusBookNotPagination()
        {
            try
            {
                var result = _statusBookRepository.GetAllListStatusBookNotPagination();
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



        [HttpGet("getStatusBookById")]
        public async Task<IActionResult> GetStatusBookById(Guid idStatusBook)
        {
            var templateApi = await _statusBookRepository.GetById(idStatusBook);
            _logger.LogInformation("Thành công : {message}", templateApi.Message);
            return Ok(templateApi);
        }

        [HttpPost("insertStatusBook")]
        public async Task<IActionResult> InsertCategorynationality(StatusBookDto StatusBookDto)
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

            StatusBookDto.Id = Guid.NewGuid();
            StatusBookDto.CreatedDate = DateTime.Now;
            StatusBookDto.Status = 1;
            var nameuser = _userRepository.getUserByID(IdUserCurrent).Fullname;
            var result = _statusBookRepository.Insert(StatusBookDto, nameuser, IdUserCurrent);

            if (result.Success)
            {
                _saveToDiary.SaveDiary(checkModel.Id, "Insert", "StatusBook", true, StatusBookDto.Id);
                _logger.LogInformation("Thành công : {message}", result.Message);
                return Ok(result);
            }
            return BadRequest(new
            {
                message = "Thêm mới không thành công"
            });
        }

        [HttpPost("updateStatusBook")]
        public async Task<IActionResult> UpdateStatusBook(StatusBookDto StatusBookDto)
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
            var result = _statusBookRepository.Update(StatusBookDto, nameuser, IdUserCurrent);

            if (result.Success)
            {
                _saveToDiary.SaveDiary(checkModel.Id, "Update", "StatusBook", true, StatusBookDto.Id);
                _logger.LogInformation("Thành công : {message}", result.Message);
                return Ok(result);
            }
            return BadRequest(new
            {
                message = "Cập nhật không thành công"
            });
        }

        [HttpPost("deleteStatusBookById")]
        public async Task<IActionResult> DeleteStatusBookById(StatusBookDto StatusBookDto)
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
            var result = _statusBookRepository.Delete(StatusBookDto.Id, nameuser, IdUserCurrent);

            if (result.Success)
            {
                _saveToDiary.SaveDiary(checkModel.Id, "Delete", "StatusBook", true, StatusBookDto.Id);
                _logger.LogInformation("Thành công : {message}", result.Message);
                return Ok(result);
            }
            return BadRequest(new
            {
                message = "Xóa không thành công"
            });
        }
        #endregion
    }
}
