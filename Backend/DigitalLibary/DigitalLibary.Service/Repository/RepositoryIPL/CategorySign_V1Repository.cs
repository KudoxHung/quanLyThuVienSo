﻿using AutoMapper;
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
    public class CategorySign_V1Repository : ICategorySign_V1Repository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors
        public CategorySign_V1Repository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }
        #endregion

        #region CRUD TABLE CATEGORYSIGN
        public bool CheckExitsCategorySignCode(string signCode)
        {
            try
            {
                CategorySign_V1 categorySign = _DbContext.CategorySign_V1.Where(c => c.SignCode == signCode && c.IsDeleted == false).FirstOrDefault();

                if (categorySign != null)
                {
                    return true;
                }
                else return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public Response DeleteCategorySignV1(Guid Id)
        {
            Response response = new Response();
            try
            {
                Document documentBySign_V1_Id = _DbContext.Document.Where(e => e.IdCategorySign_V1 == Id && e.IsDeleted == false).FirstOrDefault();
                if (documentBySign_V1_Id is not null)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Đã có sách hoặc tài liệu không thể xóa !"
                    };
                    return response;
                }

                CategorySign_V1 categorySign = _DbContext.CategorySign_V1.Where(x => x.Id == Id).FirstOrDefault();

                if (categorySign != null)
                {
                    categorySign.IsDeleted = true;
                    _DbContext.CategorySign_V1.Update(categorySign);
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
        public List<CategorySign_V1Dto> getAllCategorySignV1()
        {
            //try
            //{
            //    List<CategorySign_V1> categorySigns = _DbContext.CategorySign_V1.
            //    Where(e => e.IsDeleted == false)
            //    .OrderByDescending(x => x.CreatedDate)
            //    .ToList();

            //    List<CategorySign_V1Dto> categorySignDtos = new List<CategorySign_V1Dto>();
            //    categorySignDtos = _mapper.Map<List<CategorySign_V1Dto>>(categorySigns);
            //    return categorySignDtos;
            //}
            //catch (Exception)
            //{
            //    throw;
            //}
            try
            {
                var categorySignDtos = (from sign in _DbContext.CategorySign_V1
                                        join parent in _DbContext.CategorySignParents
                                        on sign.IdCategoryParent equals parent.Id
                                        where sign.IsDeleted == false && parent.IsDeleted == false
                                        orderby sign.CreatedDate descending
                                        select new CategorySign_V1Dto
                                        {
                                            Id = sign.Id,
                                            ParentId = sign.ParentId,
                                            SignName = sign.SignName,
                                            SignCode = sign.SignCode,
                                            Status = sign.Status,
                                            CreatedDate = sign.CreatedDate,
                                            CreatedBy = sign.CreatedBy,
                                            IdCategory = sign.IdCategory,
                                            IsHided = sign.IsHided,
                                            IsDeleted = sign.IsDeleted,
                                            IdCategoryParent = sign.IdCategoryParent,
                                            ParentName = parent.ParentName
                                        }).ToList();

                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CategorySign_V1Dto> getAllCategorySignV1(int pageNumber, int pageSize)
        {
            try
            {
                List<CategorySign_V1> categorySigns = null;
                if (pageNumber == 0 && pageSize == 0)
                {
                    categorySigns = _DbContext.CategorySign_V1.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(x => x.CreatedDate)
                    .ToList();
                }
                else
                {
                    categorySigns = _DbContext.CategorySign_V1.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(x => x.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }
                List<CategorySign_V1Dto> categorySignDtos = new List<CategorySign_V1Dto>();
                categorySignDtos = _mapper.Map<List<CategorySign_V1Dto>>(categorySigns);
                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CategorySign_V1Dto getAllCategorySignV1ById(Guid Id)
        {
            try
            {
                CategorySign_V1 categorySigns = _DbContext.CategorySign_V1.
                Where(e => e.Id == Id).FirstOrDefault();

                CategorySign_V1Dto categorySignDtos = new CategorySign_V1Dto();
                categorySignDtos = _mapper.Map<CategorySign_V1Dto>(categorySigns);
                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<CategorySign_V1Dto> getAllCategorySignV1ByIdParent(Guid Id)
        {
            try
            {
                List<CategorySign_V1> categorySigns = _DbContext.CategorySign_V1.
                Where(e => e.IdCategoryParent == Id && e.IsDeleted == false).ToList();


                List<CategorySign_V1Dto> categorySignDtos = _mapper.Map<List<CategorySign_V1Dto>>(categorySigns);

                return categorySignDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response HideCategorySignV1(Guid Id, bool check)
        {
            Response response = new Response();
            try
            {
                Document documentBySign_V1_Id = _DbContext.Document.Where(e => e.IdCategorySign_V1 == Id && e.IsDeleted == false).FirstOrDefault();
                if (documentBySign_V1_Id is not null)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Đã có sách hoặc tài liệu không thể ẩn !"
                    };
                    return response;
                }

                CategorySign_V1 categorySign = _DbContext.CategorySign_V1.Where(x => x.Id == Id).FirstOrDefault();

                if (categorySign != null)
                {
                    categorySign.IsHided = check;
                    _DbContext.CategorySign_V1.Update(categorySign);
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

        public Response InsertCategorySignV1(CategorySign_V1Dto categorySign_V1)
        {
            Response response = new Response();
            try
            {
                CategorySign_V1 categorySign = new CategorySign_V1();
                categorySign = _mapper.Map<CategorySign_V1>(categorySign_V1);

                _DbContext.CategorySign_V1.Add(categorySign);
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
        public Response UpdateCategorySignV11(CategorySign_V1Dto categorySign_V1)
        {
            Response response = new Response();
            try
            {

                CategorySign_V1 categorySign = new CategorySign_V1();
                categorySign = _DbContext.CategorySign_V1.Where(e => e.Id == categorySign_V1.Id).FirstOrDefault();
                if (categorySign != null)
                {
                    // define some col with data concrete
                    //categorySign.ParentId = categorySign_V1.ParentId.HasValue ? categorySign_V1.ParentId : categorySign.ParentId;
                    categorySign.IdCategoryParent = categorySign_V1.IdCategoryParent;

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

        public Response UpdateCategorySignV1(CategorySign_V1Dto categorySign_V1)
        {
            Response response = new Response();
            try
            {

                var categorySign = _DbContext.CategorySign_V1.Where(e => e.Id == categorySign_V1.Id).FirstOrDefault();

                if (categorySign == null)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Mã kí hiệu này không tồn tại !"
                    };

                    return response;
                }

                if (!string.IsNullOrEmpty(categorySign_V1.SignCode))
                {
                    var categorySignTemp = _DbContext.CategorySign_V1.Where(e => e.IsDeleted == false &&
                                                                                         (e.SignCode.ToLower().Trim() == categorySign_V1.SignCode.ToLower().Trim()) &&
                                                                                         e.Id != categorySign.Id).FirstOrDefault();

                    if (categorySignTemp != null)
                    {
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Mã kí hiệu này đã tồn tại !"
                        };
                        return response;
                    }
                }



                if (categorySign != null)
                {
                    // define some col with data concrete
                    categorySign.ParentId = categorySign_V1.ParentId.HasValue ? categorySign_V1.ParentId : categorySign.ParentId;
                    categorySign.SignName = string.IsNullOrEmpty(categorySign_V1.SignName) ? categorySign.SignName : categorySign_V1.SignName;
                    categorySign.SignCode = string.IsNullOrEmpty(categorySign_V1.SignCode) ? categorySign.SignCode : categorySign_V1.SignCode;
                    categorySign.Status = categorySign_V1.Status.HasValue ? categorySign_V1.Status : categorySign.Status;
                    categorySign.CreatedDate = categorySign_V1.CreatedDate.HasValue ? categorySign_V1.CreatedDate : categorySign.CreatedDate;
                    categorySign.CreatedBy = categorySign_V1.CreatedBy.HasValue ? categorySign_V1.CreatedBy : categorySign.CreatedBy;
                    categorySign.IdCategory = categorySign_V1.IdCategory.HasValue ? categorySign_V1.IdCategory : categorySign.IdCategory;
                    categorySign.IdCategoryParent = categorySign_V1.IdCategoryParent.HasValue ? categorySign_V1.IdCategoryParent : categorySign.IdCategoryParent;
                    _DbContext.CategorySign_V1.Update(categorySign);
                    _DbContext.SaveChanges();
                    var documentsToUpdate = _DbContext.Document
                   .Where(d => d.IdCategorySign_V1 == categorySign.Id)
                   .ToList();
                    foreach (var doc in documentsToUpdate)
                    {
                        doc.IdCategoryParent = categorySign.IdCategoryParent;
                        _DbContext.Document.Update(doc);
                    }

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
            catch (Exception ex)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !" + ex.InnerException.Message
                };
                return response;
            }
        }
        #endregion
    }
}