using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class CategorySignParentsRepository : ICategorySignParentsRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors
        public CategorySignParentsRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }

        public List<CategorySignParentsDto> getAllCategorySignParent()
        {
            try
            {
                List<CategorySignParents> categorySigns = _DbContext.CategorySignParents
                 .Where(e => e.IsDeleted == false)
                 .OrderByDescending(x => x.CreateDate)
                 .ToList();

                List<CategorySignParentsDto> categorySignDtos = new List<CategorySignParentsDto>();
                categorySignDtos = _mapper.Map<List<CategorySignParentsDto>>(categorySigns);
                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CategorySignParentsDto> getAllCategorySignParent(int pageNumber, int pageSize)
        {
            try
            {
                List<CategorySignParents> categorySigns = null;
                if (pageNumber == 0 && pageSize == 0)
                {
                    categorySigns = _DbContext.CategorySignParents.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(x => x.CreateDate)
                    .ToList();
                }
                else
                {
                    categorySigns = _DbContext.CategorySignParents.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(x => x.CreateDate)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }
                List<CategorySignParentsDto> categorySignDtos = new List<CategorySignParentsDto>();
                categorySignDtos = _mapper.Map<List<CategorySignParentsDto>>(categorySigns);
                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CategorySignParentsDto getAllCategorySignParentId(Guid Id)
        {
            try
            {
                CategorySignParents categorySigns = _DbContext.CategorySignParents.
                Where(e => e.Id == Id).FirstOrDefault();

                CategorySignParentsDto categorySignDtos = new CategorySignParentsDto();
                categorySignDtos = _mapper.Map<CategorySignParentsDto>(categorySigns);
                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public bool CheckExitsCategorySignParent(string signCode)
        {
            throw new NotImplementedException();
        }

        public Response DeleteCategorySignParent(Guid Id)
        {
            Response response = new Response();
            try
            {
                CategorySignParents categorySign = _DbContext.CategorySignParents.Where(x => x.Id == Id).FirstOrDefault();

                if (categorySign is not null)
                {
                    IndividualSample individualSample = _DbContext.IndividualSample
                        .Where(e => e.NumIndividual == $"{categorySign.ParentCode}1/{categorySign.Id}").FirstOrDefault();
                    if (individualSample is not null)
                    {
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Mã cá biệt này đã đăng kí cho sách không thể xóa !"
                        };
                        return response;
                    }
                }

                if (categorySign != null)
                {
                    categorySign.IsDeleted = true;
                    _DbContext.CategorySignParents.Update(categorySign);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
                    };
                    return response;
                }
                else
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy kết quả !"
                    };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Xóa không thành công !"
                };
                return response;
            }
        }

        public Response HideCategorySignParent(Guid Id, bool check)
        {
            Response response = new Response();
            try
            {
                //Document documentBySign_V1_Id = _DbContext.Document.Where(e => e.IdCategorySign_V1 == Id && e.IsDeleted == false).FirstOrDefault();
                //if (documentBySign_V1_Id is not null)
                //{
                //    response = new Response()
                //    {
                //        Success = false,
                //        Fail = true,
                //        Message = "Đã có sách hoặc tài liệu không thể ẩn !"
                //    };
                //    return response;
                //}

                CategorySignParents categorySign = _DbContext.CategorySignParents.Where(x => x.Id == Id).FirstOrDefault();

                if (categorySign != null)
                {
                    categorySign.IsHided = check;
                    _DbContext.CategorySignParents.Update(categorySign);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Ẩn thành công !"
                    };
                    return response;
                }
                else
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy kết quả !"
                    };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Xóa không thành công !"
                };
                return response;
            }
        }

        public Response InsertCategorySignParent(CategorySignParentsDto categorySignParent)
        {
            Response response = new Response();
            try
            {
                CategorySignParents categorySign = new CategorySignParents();
                categorySign = _mapper.Map<CategorySignParents>(categorySignParent);

                _DbContext.CategorySignParents.Add(categorySign);
                _DbContext.SaveChanges();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }

        public Response UpdateCategorySignParent(CategorySignParentsDto categorySignParent)
        {
            Response response = new Response();
            try
            {
                CategorySignParents categorySign = new CategorySignParents();
                categorySign = _DbContext.CategorySignParents.Where(e => e.Id == categorySignParent.Id).FirstOrDefault();
                if (categorySign != null)
                {
                    // define some col with data concrete
                    categorySign.ParentName = String.IsNullOrEmpty(categorySignParent.ParentName) ? categorySign.ParentName : categorySignParent.ParentName;
                    categorySign.ParentCode = String.IsNullOrEmpty(categorySignParent.ParentCode) ? categorySign.ParentCode : categorySignParent.ParentCode;
                    categorySign.Status = categorySignParent.Status.HasValue ? categorySignParent.Status : categorySign.Status;
                    categorySign.CreateDate = categorySignParent.CreateDate.HasValue ? categorySignParent.CreateDate : categorySign.CreateDate;
                    categorySign.CreateBy = categorySignParent.CreateBy.HasValue ? categorySignParent.CreateBy : categorySign.CreateBy;
                    //categorySign.IdCategory = categorySignParent.IdCategory.HasValue ? categorySignParent.IdCategory : categorySign.IdCategory;

                    _DbContext.CategorySignParents.Update(categorySign);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
                return response;
            }
        }
        #endregion


    }
}
