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
    public class CategoryVesRepository: ICategoryVesRepository
    {
        #region Variables
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext; 
        #endregion

        #region Constructors
        public CategoryVesRepository(DataContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        #endregion

        #region METHOD
        public IEnumerable<CategoryVesDto> GetAllCategoryVesByELecture(int pageNumber, int pageSize)
        {
            var categoryVess = _dbContext.CategoryVes.Where(e => e.Status == 1).OrderByDescending(e => e.CreatedDate).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0) { pageNumber = 1; }
                categoryVess = categoryVess.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            
            return _mapper.Map<List<CategoryVesDto>>(categoryVess);
        }
        public IEnumerable<CategoryVesDto> GetAllCategoryVesByVideo(int pageNumber, int pageSize)
        {
            var categoryVess = _dbContext.CategoryVes.Where(e => e.Status == 2).OrderByDescending(e => e.CreatedDate).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0) { pageNumber = 1; }
                categoryVess = categoryVess.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return _mapper.Map<List<CategoryVesDto>>(categoryVess);
        }
        public IEnumerable<CategoryVesDto> GetAllCategoryVesBySound(int pageNumber, int pageSize)
        {
            var categoryVess = _dbContext.CategoryVes.Where(e => e.Status == 3).OrderByDescending(e => e.CreatedDate).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0) { pageNumber = 1; }
                categoryVess = categoryVess.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            
            return _mapper.Map<List<CategoryVesDto>>(categoryVess);
        }
        public Response DeleteCategoryVesByList(List<Guid> idCategoryVes)
        {
            var categoryVess = _dbContext.CategoryVes.Where(ar => idCategoryVes.Contains(ar.Id)).ToList();
            if (!categoryVess.Any())
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu cần xóa !"
                };
            }
            var groupVes = _dbContext.GroupVes.Where(ar => idCategoryVes.Contains((Guid)ar.IdcategoryVes)).ToList();
            if (groupVes.Any())
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Danh mục đã có nhóm không thể xóa !"
                };
            }

            _dbContext.CategoryVes.RemoveRange(categoryVess);
            _dbContext.SaveChanges();

            return new Response() { Success = true, Fail = false, Message = "Xóa thành công !" };
        }

        public IEnumerable<CategoryVesDto> GetAllCategoryVes(int pageNumber, int pageSize)
        {
            var categoryVess = _dbContext.CategoryVes.OrderByDescending(e => e.CreatedDate).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0) { pageNumber = 1; }
                categoryVess = categoryVess.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            
            return _mapper.Map<List<CategoryVesDto>>(categoryVess);
        }

        public IEnumerable<CategoryVesDto> GetAllCategoryVesAvailable(int pageNumber, int pageSize)
        {
            var categoryVess = _dbContext.CategoryVes.Where(e => e.IsHide == false).OrderByDescending(e => e.CreatedDate).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0) { pageNumber = 1; }
                categoryVess = categoryVess.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            
            return _mapper.Map<List<CategoryVesDto>>(categoryVess);
        }

        public CategoryVesDto GetAllCategoryVesById(Guid idCategoryVes)
        {
            var categoryVess = _dbContext.CategoryVes.FirstOrDefault(e => e.Id == idCategoryVes);
            return _mapper.Map<CategoryVesDto>(categoryVess);
        }

        public Response HideCategoryVesByList(List<Guid> idCategoryVes, bool isHide)
        {
            var categoryVess = _dbContext.CategoryVes.Where(ar => idCategoryVes.Contains(ar.Id)).ToList();
            if (!categoryVess.Any())
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu cần chỉnh sửa !"
                };
            }

            var groupVes = _dbContext.GroupVes.Where(ar => idCategoryVes.Contains((Guid)ar.IdcategoryVes)).ToList();
            if (groupVes.Any() && isHide)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Danh mục đã có nhóm không thể ẩn !"
                };
            }

            categoryVess.ForEach(category => category.IsHide = isHide);

            _dbContext.CategoryVes.UpdateRange(categoryVess);
            _dbContext.SaveChanges();

            return new Response() { Success = true, Fail = false, Message = $"{(isHide ? "Khóa" : "Hủy khóa")} thành công !" };
        }

        public Response InsertCategoryVes(CategoryVesDto categoryVesDto)
        {
            var categoryVes = _mapper.Map<CategoryVes>(categoryVesDto);

            _dbContext.CategoryVes.Add(categoryVes);
            _dbContext.SaveChanges();

            return new Response()
            {
                Success = true,
                Fail = false,
                Message = "Thêm mới thành công !"
            };
        }

        public Response UpdateCategoryVes(Guid idCategoryVes, CategoryVesDto categoryVesDto)
        {
            var categoryVes = _dbContext.CategoryVes.Find(idCategoryVes);
            if (categoryVes == null)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy thông tin !"
                };
            }
            categoryVes.CategoryVesName = categoryVesDto.CategoryVesName;
            categoryVes.Status = categoryVesDto.Status;

            _dbContext.CategoryVes.Update(categoryVes);
            _dbContext.SaveChanges();

            return new Response() { Success = true, Fail = false, Message = "Cập nhật thành công !" };
        }
        #endregion
    }
}
