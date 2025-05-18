using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using DigitalLibary.Service.Utils;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class StatusBookRepository : IStatusBookRepository
    {
        #region Variables
        private readonly IMapper _mapper;
        public DataContext _DbContext;
        private readonly IConfiguration _configuration;
        #endregion

        #region Constructors
        public StatusBookRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }
        #endregion

        #region METHOD
        public IEnumerable<StatusBookDto> GetAll(int pageNumber, int pageSize)
        {
            try
            {
                var statusBooks = new List<StatusBook>();
                statusBooks = _DbContext.StatusBook.ToList();

                if (pageNumber != 0 && pageSize != 0)
                {
                    if (pageNumber < 0) { pageNumber = 1; }
                    statusBooks = statusBooks.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                var result = new List<StatusBookDto>();
                result = _mapper.Map<List<StatusBookDto>>(statusBooks);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        } 
        public IEnumerable<StatusBookDto> GetAllStatusBook(int pageNumber, int pageSize, int Type)
        {
            try
            {
                var statusBooks = new List<StatusBook>();
                statusBooks = _DbContext.StatusBook.Where(e => e.Status == Type).ToList();

                if (pageNumber != 0 && pageSize != 0)
                {
                    if (pageNumber < 0) { pageNumber = 1; }
                    statusBooks = statusBooks.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                var result = new List<StatusBookDto>();
                result = _mapper.Map<List<StatusBookDto>>(statusBooks);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public IEnumerable<StatusBookDto> GetAllStatusBook(int pageNumber, int pageSize)
        {
            try
            {
                var statusBooks = new List<StatusBook>();
                statusBooks = _DbContext.StatusBook.ToList();

                if (pageNumber != 0 && pageSize != 0)
                {
                    if (pageNumber < 0) { pageNumber = 1; }
                    statusBooks = statusBooks.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                var result = new List<StatusBookDto>();
                result = _mapper.Map<List<StatusBookDto>>(statusBooks);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TemplateApi<StatusBookDto>> GetStatusBookByIdDocument(Guid idDocument, List<AuditBookListDto> auditBookLists)
        {
            try
            {
                var listStatusBook = _DbContext.StatusBook.ToList();

                var auditBookList = auditBookLists.Where(e => e.IdDocument == idDocument).OrderByDescending(e => e.CreatedDate).FirstOrDefault();

                if (auditBookList == null)
                {
                    StatusBookDto status = new StatusBookDto();
                    status.Id = Guid.Parse("fe34f7dd-49b5-4534-8e64-209dd8030318");
                    status.NameStatusBook = "Còn nguyên vẹn";
                    status.Status = 0;
                    status.CreatedDate = DateTime.Now;
                    return new Pagination().HandleGetByIdRespond(status);
                }
                else
                {
                    Guid idStatusBook = auditBookList.IdStatusBook ?? Guid.Empty;
                    return new Pagination().HandleGetByIdRespond(_mapper.Map<StatusBookDto>(listStatusBook.Where(e => e.Id == idStatusBook).FirstOrDefault()));

                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public IEnumerable<StatusBookDto> GetAllListStatusBookNotPagination()
        {
            var listStatusBook = _DbContext.StatusBook.ToList();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<StatusBook, StatusBookDto>());
            var mapper = new Mapper(config);
            IEnumerable<StatusBookDto> StatusBookDtos = listStatusBook.Select(c => mapper.Map<StatusBookDto>(c));
            return StatusBookDtos;
        }
        public async Task<TemplateApi<StatusBookDto>> GetById(Guid id)
        {
            var unit = _DbContext.StatusBook.Where(e => e.Id == id).FirstOrDefault();

            StatusBookDto xxx = new StatusBookDto();
            xxx.Id = unit.Id;
            xxx.NameStatusBook = unit.NameStatusBook;
            xxx.Status = unit.Status;
            xxx.CreatedDate = unit.CreatedDate;
            return new Pagination().HandleGetByIdRespond(xxx);
        }
        public Response Insert(StatusBookDto StatusBookDto, String fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                StatusBook StatusBook = new StatusBook();
                StatusBook = _mapper.Map<StatusBook>(StatusBookDto);

                _DbContext.StatusBook.Add(StatusBook);
                _DbContext.SaveChanges();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                var diary = new Diary()
                {
                    Id = Guid.NewGuid(),
                    Content = $"{fullName} đã thêm mới bảng StatusBook",
                    UserId = idUserCurrent,
                    UserName = fullName,
                    DateCreate = DateTime.Now,
                    Title = "Thêm mới CSDL",
                    Operation = "Create",
                    Table = "StatusBook",
                    IsSuccess = true,
                    WithId = StatusBook.Id
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
        public Response Update(StatusBookDto StatusBookDto, String fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                StatusBook StatusBook = new StatusBook();
                StatusBook = _DbContext.StatusBook.Where(e => e.Id == StatusBookDto.Id).FirstOrDefault();

                if (StatusBook != null)
                {
                    // define some col with data concrete
                    StatusBook.NameStatusBook = String.IsNullOrEmpty(StatusBookDto.NameStatusBook) ? StatusBook.NameStatusBook : StatusBookDto.NameStatusBook;
                    if (StatusBookDto.Status != null)
                    {
                        StatusBook.Status = StatusBookDto.Status;
                    }
                    _DbContext.StatusBook.Update(StatusBook);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    var diary = new Diary()
                    {
                        Id = Guid.NewGuid(),
                        Content = $"{fullName} đã cập nhật bảng StatusBook",
                        UserId = idUserCurrent,
                        UserName = fullName,
                        DateCreate = DateTime.Now,
                        Title = "Cập nhật CSDL",
                        Operation = "Create",
                        Table = "StatusBook",
                        IsSuccess = true,
                        WithId = StatusBook.Id
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
        public Response Delete(Guid IdStatusBook, string fullName, Guid idUserCurrent)
        {
            Response response = new Response();
            try
            {
                StatusBook StatusBook = new StatusBook();
                StatusBook = _DbContext.StatusBook.Where(e => e.Id == IdStatusBook).FirstOrDefault();

                if (StatusBook != null)
                {

                    _DbContext.StatusBook.Remove(StatusBook);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
                    };
                    var diary = new Diary()
                    {
                        Id = Guid.NewGuid(),
                        Content = $"{fullName} đã xóa trong bảng StatusBook",
                        UserId = idUserCurrent,
                        UserName = fullName,
                        DateCreate = DateTime.Now,
                        Title = "Xóa CSDL",
                        Operation = "Delete",
                        Table = "StatusBook",
                        IsSuccess = true,
                        WithId = StatusBook.Id
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
