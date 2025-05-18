using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using DigitalLibary.Service.Common;
using Microsoft.EntityFrameworkCore;
using Dapper;
using DigitalLibary.Service.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using DigitalLibary.Service.Queries;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class CategoryColorImpl : ICategoryColor
    {
        #region Variable
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        #endregion
        #region Contructor
        public CategoryColorImpl(DataContext context, IConfiguration configuration)
        {
            _context = context;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<CategoryColorDto, CategoryColor>());
            _mapper = new Mapper(config);
            _configuration = configuration;
        }
        #endregion
        #region Method Implement
        IEnumerable<CategoryColorDto> ICategoryColor.GetAllListCategoryColor(int pageNumber, int pageSize)
        {
            var skipAmount = pageSize * (pageNumber - 1);
            var listCategoryColor = _context.CategoryColor
                .Skip(skipAmount)
                .Take(pageSize)
                .ToList();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<CategoryColor, CategoryColorDto>());
            var mapper = new Mapper(config);
            IEnumerable<CategoryColorDto> categoryColorDtos = listCategoryColor.Select(c => mapper.Map<CategoryColorDto>(c));
            return categoryColorDtos;
        }
        public IEnumerable<CategoryColorDto> GetAllListCategoryColorNotPagination()
        {
            var listCategoryColor = _context.CategoryColor.ToList();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<CategoryColor, CategoryColorDto>());
            var mapper = new Mapper(config);
            IEnumerable<CategoryColorDto> categoryColorDtos = listCategoryColor.Select(c => mapper.Map<CategoryColorDto>(c));
            return categoryColorDtos;
        }

        public Guid GetIdByColorName(string colorName)
        {
            var result = _context.CategoryColor.Where(x => x.ColorName.Trim().ToLower() == colorName.Trim().ToLower()).Select(x => x.Id).FirstOrDefault();
            if(result != Guid.Empty)
            {
                return result;
            }
            return Guid.Empty;
        }
        public async Task<TemplateApi<CategoryColorDto>> GetById(Guid id)
        {
            var unit = _context.CategoryColor.Where(e => e.Id == id).FirstOrDefault();

            CategoryColorDto xxx = new CategoryColorDto();
            xxx.Id = unit.Id;
            xxx.ColorName = unit.ColorName;
            xxx.ColorCode = unit.ColorCode;
            xxx.ReadingLevel = unit.ReadingLevel;
            xxx.Status = unit.Status;
            xxx.CreatedDate = unit.CreatedDate;
            return new Pagination().HandleGetByIdRespond(xxx);
        }
        public Response Insert(CategoryColorDto categoryColorDto, String fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                CategoryColor categoryColor = new CategoryColor();
                categoryColor = _mapper.Map<CategoryColor>(categoryColorDto);

                _context.CategoryColor.Add(categoryColor);
                _context.SaveChanges();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                var diary = new Diary()
                {
                    Id = Guid.NewGuid(),
                    Content = $"{fullName} đã thêm mới bảng CategoryColor",
                    UserId = idUserCurrent,
                    UserName = fullName,
                    DateCreate = DateTime.Now,
                    Title = "Thêm mới CSDL",
                    Operation = "Create",
                    Table = "CategoryColor",
                    IsSuccess = true,
                    WithId = categoryColor.Id
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
        public Response Update(CategoryColorDto CategoryColorDto, String fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                CategoryColor categoryColor = new CategoryColor();
                categoryColor = _context.CategoryColor.Where(e => e.Id == CategoryColorDto.Id).FirstOrDefault();

                if (categoryColor != null)
                {
                    // define some col with data concrete
                    categoryColor.ColorCode = String.IsNullOrEmpty(CategoryColorDto.ColorCode) ? categoryColor.ColorCode : CategoryColorDto.ColorCode;
                    categoryColor.ColorName = String.IsNullOrEmpty(CategoryColorDto.ColorName) ? categoryColor.ColorName : CategoryColorDto.ColorName;
                    categoryColor.ReadingLevel = String.IsNullOrEmpty(CategoryColorDto.ReadingLevel) ? categoryColor.ReadingLevel : CategoryColorDto.ReadingLevel;
                    if(CategoryColorDto.Status != null)
                    {
                        categoryColor.Status = CategoryColorDto.Status;
                    }
                    _context.CategoryColor.Update(categoryColor);
                    _context.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    var diary = new Diary()
                    {
                        Id = Guid.NewGuid(),
                        Content = $"{fullName} đã cập nhật bảng CategoryColor",
                        UserId = idUserCurrent,
                        UserName = fullName,
                        DateCreate = DateTime.Now,
                        Title = "Cập nhật CSDL",
                        Operation = "Create",
                        Table = "CategoryColor",
                        IsSuccess = true,
                        WithId = categoryColor.Id
                    };

                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật không thành công !"
                };
                return response;
            }
        }
        public Response Delete(Guid IdCategoryColor, string fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                CategoryColor categoryColor = new CategoryColor();
                categoryColor = _context.CategoryColor.Where(e => e.Id == IdCategoryColor).FirstOrDefault();
                var document = _context.Document.FirstOrDefault(e => e.IdCategoryColor == IdCategoryColor);
                bool isExist = (document == null);

                if (categoryColor != null && isExist)
                {
                    
                    _context.CategoryColor.Remove(categoryColor);
                    _context.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
                    };
                    var diary = new Diary()
                    {
                        Id = Guid.NewGuid(),
                        Content = $"{fullName} đã xóa trong bảng CategoryColor",
                        UserId = idUserCurrent,
                        UserName = fullName,
                        DateCreate = DateTime.Now,
                        Title = "Xóa CSDL",
                        Operation = "Delete",
                        Table = "CategoryColor",
                        IsSuccess = true,
                        WithId = categoryColor.Id
                    };

                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Xóa không thành công !"
                };
                return response;
            }
        }

        #endregion
    }
}