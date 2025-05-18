using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Repository.RepositoryIPL;
using DigitalLibary.WebApi.Helper;
using DigitalLibary.WebApi.Payload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System;
using DigitalLibary.Data.Entity;
using System.Linq;

namespace DigitalLibary.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplyController :Controller
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
        private readonly ISupplyRepository _supplyRepository;

        #endregion

        #region Contructor

        public SupplyController(IAnalystRepository analystRepository,
            IOptionsMonitor<AppSettingModel> optionsMonitor,
            ISchoolYearRepository schoolYearRepository,
            IUnitRepository unitRepository,
            ILogger<BookController> logger,
            IContactAndIntroductionRepository contactAndIntroductionRepository,
            IUserRepository userRepository,
            IIndividualSampleRepository individualSampleRepository,
            IReceiptRepository receiptRepository,
            IDocumentTypeRepository documentType,
            ISupplyRepository supplyRepository)
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
            _supplyRepository = supplyRepository;
        }

        #endregion
        // GET: api/Supply/GetSupply
        [HttpGet]
        [Route("GetSupply")]
        public List<SupplyDto> GetSupply(int pageNumber, int pageSize)
        {
            try
            {
                List<SupplyDto> supply = _supplyRepository.GetSupply(pageNumber, pageSize);

               
                return supply.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Đã xảy ra lỗi khi lấy danh sách cung cấp: {ex}");
                throw;
            }
        }
    }
}
