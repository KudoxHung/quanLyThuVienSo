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
    public class VesRepository : IVESRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        #endregion

        #region Constructors

        public VesRepository(DataContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        #endregion

        #region METHOD

        public Response DeleteVESByList(List<Guid> idVes)
        {
            var dataVes = _dbContext.VES.Where(ar => idVes.Contains(ar.Id)).ToList();
            if (!dataVes.Any())
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu cần xóa !"
                };
            }

            if (dataVes.Any(e => e.IsPublish == false))
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Đã có dữ liệu riêng tư không thể xóa !"
                };
            }

            _dbContext.VES.RemoveRange(dataVes);
            _dbContext.SaveChanges();

            return new Response() { Success = true, Fail = false, Message = "Xóa thành công !" };
        }

        public IEnumerable<VESDto> GetAllVES(int pageNumber, int pageSize)
        {
            var dataVes = _dbContext.VES.OrderBy(e => e.Number).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                dataVes = dataVes.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return _mapper.Map<List<VESDto>>(dataVes);
        }

        public IEnumerable<VESDto> GetAllVESByMediaType(int pageNumber, int pageSize, int[] mediaType)
        {
            var vesQuery = _dbContext.VES
                .Where(e => e.MediaType != null && mediaType.Contains((int)e.MediaType))
                .OrderBy(e => e.Number).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                vesQuery = vesQuery.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return _mapper.Map<List<VESDto>>(vesQuery);
        }

        public IEnumerable<VESDto> GetAllVESAvailable(int pageNumber, int pageSize)
        {
            var dataVes = _dbContext.VES.Where(e => e.IsHide == false).OrderBy(e => e.Number).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                dataVes = dataVes.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return _mapper.Map<List<VESDto>>(dataVes);
        }

        public IEnumerable<VESDto> GetAllVESByIdGroupVes(int pageNumber, int pageSize, Guid idGroupVes,
            string? emailUser)
        {
            var vesData = new List<VES>();

            if (emailUser is not null)
            {
                var idUser = _dbContext.User.FirstOrDefault(e => e.Email == emailUser)?.Id;

                var dataVesByPublish = _dbContext.VES.Where(e => e.IsHide == false && e.IdGroupVes == idGroupVes
                    && e.IsPublish == false).ToList();

                var getAllVesRoleByIdVes = _dbContext.VESRole
                    .Where(e => dataVesByPublish.Select(r => r.Id).Contains(e.IdVES))
                    .ToList();

                vesData.AddRange(from item in dataVesByPublish
                    let vesRole = getAllVesRoleByIdVes.Exists(e => e.IdUser == idUser)
                    where vesRole
                    select item);
            }

            var dataVesPublish = _dbContext.VES.Where(e => e.IsHide == false && e.IdGroupVes == idGroupVes
                                                                             && e.IsPublish == true).ToList();
            vesData.AddRange(dataVesPublish);
            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }
                vesData = vesData.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }
            return _mapper.Map<List<VESDto>>(vesData.OrderBy(e => e.Number));
        }
        public VESDto GetVESById(Guid idVes)
        {
            var dataVes = _dbContext.VES.FirstOrDefault(e => e.Id == idVes);
            var vesRole = _dbContext.VESRole.Where(e => e.IdVES == idVes);
            var vesDto = _mapper.Map<VESDto>(dataVes);
            vesDto.VesRoles = vesRole.ToList();
            return vesDto;
        }
        public Response HideVESByList(List<Guid> idVes, bool isHide)
        {
            var dataVes = _dbContext.VES.Where(ar => idVes.Contains(ar.Id)).ToList();
            if (!dataVes.Any())
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu cần chỉnh sửa !"
                };
            }

            dataVes.ForEach(category => category.IsHide = isHide);

            _dbContext.VES.UpdateRange(dataVes);
            _dbContext.SaveChanges();

            return new Response()
                { Success = true, Fail = false, Message = $"{(isHide ? "Khóa" : "Hủy khóa")} thành công !" };
        }

        public Response InsertVES(VESDto vesDto)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                var dataVes = _mapper.Map<VES>(vesDto);

                _dbContext.VES.Add(dataVes);
                _dbContext.SaveChanges();

                if (vesDto.IsPublish == false && vesDto.IdsUser is not null)
                {
                    var numberOfUser = vesDto.IdsUser.Split(',');

                    var vesRoles = numberOfUser.Select(item => new VESRole()
                        {
                            Id = Guid.NewGuid(),
                            CreatedDate = DateTime.Now,
                            Status = 0,
                            IdVES = vesDto.Id,
                            IdUser = new Guid(item)
                        })
                        .ToList();

                    _dbContext.VESRole.AddRange(vesRoles);
                    _dbContext.SaveChanges();
                }

                transaction.Commit();
                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public Response UpdateVES(Guid idVes, VESDto vesDto)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                var dataVes = _dbContext.VES.Find(idVes);
                if (dataVes == null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy thông tin !"
                    };
                }

                dataVes.MediaTitle = vesDto.MediaTitle;
                dataVes.MediaPath = vesDto.MediaPath;
                dataVes.MediaDescription = vesDto.MediaDescription;
                dataVes.MediaLinkType = vesDto.MediaLinkType;
                dataVes.MediaType = vesDto.MediaType;
                dataVes.IdGroupVes = vesDto.IdGroupVes;
                dataVes.Number = vesDto.Number;

                if (vesDto.IdFile is null)
                {
                    if (vesDto.FileNameDocument is null)
                    {
                        dataVes.FileNameDocument = null;
                        dataVes.FileNameExtention = null;
                    }
                    else
                    {
                        dataVes.FileNameDocument = vesDto.FileNameDocument;
                        dataVes.FileNameExtention = vesDto.FileNameExtention;
                    }
                }

                _dbContext.VES.Update(dataVes);
                _dbContext.SaveChanges();

                var vesRoleByIdVes = _dbContext.VESRole.Where(e => e.IdVES == vesDto.Id);
                _dbContext.VESRole.RemoveRange(vesRoleByIdVes);

                if (vesDto.IsPublish == false && vesDto.IdsUser is not null)
                {
                    var numberOfUser = vesDto.IdsUser.Split(',');

                    var vesRoles = numberOfUser.Select(item => new VESRole()
                        {
                            Id = Guid.NewGuid(),
                            CreatedDate = DateTime.Now,
                            Status = 0,
                            IdVES = vesDto.Id,
                            IdUser = new Guid(item)
                        })
                        .ToList();

                    _dbContext.VESRole.AddRange(vesRoles);
                    _dbContext.SaveChanges();
                }

                transaction.Commit();
                return new Response() { Success = true, Fail = false, Message = "Cập nhật thành công !" };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public Response UpdateVESWhenInsertImageAvatar(Guid idVes, string fileNameExtention, string fileNameAvatar)
        {
            var dataVes = _dbContext.VES.Find(idVes);
            if (dataVes == null)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy thông tin !"
                };
            }

            dataVes.Avatar = fileNameAvatar;
            dataVes.FileAvatarExtention = fileNameExtention;

            _dbContext.VES.Update(dataVes);
            _dbContext.SaveChanges();

            return new Response() { Success = true, Fail = false, Message = "" };
        }

        public IEnumerable<CategoryVes> GetAllCategoryVesByVideo(int pageNumber, int pageSize)
        {
            var dataVes = _dbContext.VES.Where(e => e.IsHide == false && e.MediaType == 0).Select(e => e.IdGroupVes)
                .ToList();
            if (!dataVes.Any())
            {
                return Enumerable.Empty<CategoryVes>();
            }

            var groupVes = _dbContext.GroupVes.Where(e => e.IsHide == false && dataVes.Contains(e.Id))
                .Select(e => e.IdcategoryVes).ToList();
            if (!dataVes.Any())
            {
                return Enumerable.Empty<CategoryVes>();
            }

            var categoryVes = _dbContext.CategoryVes.Where(e => e.IsHide == false && groupVes.Contains(e.Id)).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                categoryVes = categoryVes.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return categoryVes;
        }

        public IEnumerable<CategoryVes> GetAllCategoryVesByVesSound(int pageNumber, int pageSize)
        {
            var dataVes = _dbContext.VES.Where(e => e.IsHide == false && e.MediaType == 3 || e.MediaType == 4)
                .Select(e => e.IdGroupVes).ToList();
            if (!dataVes.Any())
            {
                return Enumerable.Empty<CategoryVes>();
            }

            var groupVes = _dbContext.GroupVes.Where(e => e.IsHide == false && dataVes.Contains(e.Id))
                .Select(e => e.IdcategoryVes).ToList();
            if (!dataVes.Any())
            {
                return Enumerable.Empty<CategoryVes>();
            }

            var categoryVes = _dbContext.CategoryVes.Where(e => e.IsHide == false && groupVes.Contains(e.Id)).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                categoryVes = categoryVes.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return categoryVes;
        }

        #endregion
    }
}