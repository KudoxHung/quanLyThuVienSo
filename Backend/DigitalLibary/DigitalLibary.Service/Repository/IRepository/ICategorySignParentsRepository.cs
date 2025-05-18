using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface ICategorySignParentsRepository
    {
        List<CategorySignParentsDto> getAllCategorySignParent(int pageNumber, int pageSize);
        List<CategorySignParentsDto> getAllCategorySignParent();
        CategorySignParentsDto getAllCategorySignParentId(Guid Id);
        Response InsertCategorySignParent(CategorySignParentsDto categorySignParent);
        Response UpdateCategorySignParent(CategorySignParentsDto categorySignParent);
        Response DeleteCategorySignParent(Guid Id);
        Response HideCategorySignParent(Guid Id, bool check);
        Boolean CheckExitsCategorySignParent(string signCode);
    }
}
