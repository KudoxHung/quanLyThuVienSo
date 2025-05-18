using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class SupplyRepository : ISupplyRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        private readonly DataContext _DbContext;

        #endregion
        public SupplyRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }

        public List<SupplyDto> GetSupply(int pageNumber, int pageSize)
        {

            try
            {
                List<Supply> supply = new List<Supply>();
                if (pageNumber == 0 && pageSize == 0)    
                {
                    supply = _DbContext.Supply.
                    Where(e => e.ID != Guid.Empty)
                    .ToList();
                }
                else
                {
                    supply = _DbContext.Supply.
                    Where(e => e.ID != Guid.Empty)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<SupplyDto> supplyLst = new List<SupplyDto>();
                supplyLst = _mapper.Map<List<SupplyDto>>(supply);
                return supplyLst;
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
