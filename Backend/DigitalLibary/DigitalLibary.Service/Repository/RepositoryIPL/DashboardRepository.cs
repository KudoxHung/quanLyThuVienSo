using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class DashboardRepository :IDashboardRepository
    {
        #region Variables
        private readonly IMapper _mapper;
        public DataContext _DbContext;
        #endregion

        #region Constructors
        public DashboardRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }
        #endregion
        public async Task<int> RunAllDataProceduresGetDataAsync()
        {
            try
            {
                await _DbContext.Database.ExecuteSqlRawAsync("EXEC sp_RunAllDataProcedures_GetData");
                return 0; // Trả về 0 nếu stored procedure chạy thành công
            }
            catch
            {
                return -1; // Trả về -1 hoặc giá trị khác nếu xảy ra lỗi
            }
        }
    }
}
