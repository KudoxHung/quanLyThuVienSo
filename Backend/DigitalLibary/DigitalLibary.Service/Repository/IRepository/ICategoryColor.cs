using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface ICategoryColor
    {
         public Task<TemplateApi<CategoryColorDto>> GetById(Guid id);
         public Guid GetIdByColorName(string colorName);
         IEnumerable<CategoryColorDto> GetAllListCategoryColor(int pageNumber, int pageSize);
         IEnumerable<CategoryColorDto> GetAllListCategoryColorNotPagination();
         public Response Insert(CategoryColorDto CategoryColorDto, String fullName, Guid idUserCurrent);
         public Response Update(CategoryColorDto CategoryColorDto, String fullName, Guid idUserCurrent);
         public Response Delete(Guid IdCategoryColor, String fullName, Guid idUserCurrent);


    }
}