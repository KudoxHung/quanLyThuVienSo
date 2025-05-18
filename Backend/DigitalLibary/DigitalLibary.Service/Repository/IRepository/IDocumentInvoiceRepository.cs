using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IDocumentInvoiceRepository
    {
        #region CRUD TABLE DOCUMENTINVOICE

        List<CustomApiSearchDocumentInvoice> ListDocumentInvoice(string name);
        List<DocumentInvoiceDto> getListBorrowLate(string fromDate, string toDate);
        List<DocumentInvoiceDto> GetDocumentInvoice(int pageNumber, int pageSize);
        CustomApiDocumentInvoiceDto GetDocumentInvoiceTest(int pageNumber, int pageSize);
        DocumentInvoiceDto GetDocumentInvoiceById(Guid Id);
        List<DocumentInvoiceDetailDto> GetListDocumentInvoiceById(Guid Id);
        Response InsertDocumentInvoice(DocumentInvoiceDto documentInvoiceDto);
        Response UpdateDocumentInvoice(DocumentInvoiceDto documentInvoiceDto);
        Response ChangeStatusDocumentInvoice(Guid Id, int status);
        List<DocumentInvoiceDto> GetDocumentInvoiceByStatus(int status);
        List<DocumentInvoiceDetailDto> GetDocumentInvoiceDetailByIdDocumentIncoice(Guid Id);
        Response ChangeStatusCompleteInvoice(Guid Id);
        Task<Response> ChangeStatusDocumentInvoiceVer2(List<Guid> idsDocumentInvoiceDetail, int status);
        Task<Response> ExtendPeriodOfInvoice(List<Guid> idsDocumentInvoiceDetail, string extendDay);
        Response EditNoteContentDocumentInvoiceDetailById(Guid DocumentInvoiceDetailById, String NoteContent);
        DocumentInvoiceDetailDto GetDocumentInvoiceDetailById(Guid Id);
        List<DocumentInvoiceDto> getAllDocumentInvoice(SortAndSearchListDocumentInvoice sortAndSearchListDocumentInvoice);
       CustomApiDocumentInvoiceDto getAllDocumentInvoiceTest(SortAndSearchListDocumentInvoice sortAndSearchListDocumentInvoice);
        #endregion
    }
}