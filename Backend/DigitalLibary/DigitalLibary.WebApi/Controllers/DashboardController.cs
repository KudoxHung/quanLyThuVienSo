using AutoMapper;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.WebApi.Common;
using DigitalLibary.WebApi.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController :Controller
    {
        #region Variables
        private readonly AppSettingModel _appSettingModel;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IDashboardRepository _dashboardRepository;
        private readonly SaveToDiary _saveToDiary;
        #endregion

        #region Contructor
        public DashboardController(IDashboardRepository dashboardRepository,
        IOptionsMonitor<AppSettingModel> optionsMonitor,
        IMapper mapper,
        SaveToDiary saveToDiary,
        JwtService jwtService)
        {
            _appSettingModel = optionsMonitor.CurrentValue;
            _mapper = mapper;
            _dashboardRepository = dashboardRepository;
            _jwtService = jwtService;
            _saveToDiary = saveToDiary;
        }
        #endregion
        #region Methods
        [HttpPost("RunProcedure")]
        public async Task<IActionResult> RunProcedure()
        {
            int result = await _dashboardRepository.RunAllDataProceduresGetDataAsync();

            if (result == 0)
            {
                return Ok(new {Success =true, Message = "Đã cập nhật thành công" });
            }
            else
            {
                return BadRequest(new { Success = false, Message = "Lỗi không cập nhật được dashboard" });
            }
        }
        #endregion
    }
}
