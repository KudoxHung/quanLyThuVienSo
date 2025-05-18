using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Utils;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IStatusBookRepository
    {
        IEnumerable<StatusBookDto> GetAllStatusBook(int pageNumber, int pageSize, int Type);
        IEnumerable<StatusBookDto> GetAll(int pageNumber, int pageSize);
        IEnumerable<StatusBookDto> GetAllStatusBook(int pageNumber, int pageSize);

        Task<TemplateApi<StatusBookDto>> GetStatusBookByIdDocument(Guid idDocument, List<AuditBookListDto> auditBookLists);
        public Task<TemplateApi<StatusBookDto>> GetById(Guid id);
        IEnumerable<StatusBookDto> GetAllListStatusBookNotPagination();
        public Response Insert(StatusBookDto StatusBookDto, String fullName, Guid idUserCurrent);
        public Response Update(StatusBookDto StatusBookDto, String fullName, Guid idUserCurrent);
        public Response Delete(Guid IdStatusBook, String fullName, Guid idUserCurrent);
    }
}
