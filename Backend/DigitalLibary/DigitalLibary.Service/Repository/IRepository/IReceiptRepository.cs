using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IReceiptRepository
    {
        #region CRUD TABLE RECEIPT
        public List<ReceiptDto> getAllReceipt(int pageNumber, int pageSize);
        public List<ReceiptDto> getAllReceipt(SortReceiptAndSearch sortReceiptAndSearch, int type);
        public ReceiptDto getReceipt(Guid Id);
        public DocumentDto GetDocumentType(Guid Id);
        public List<string> GetlistOriginal();
        public int GetMaxReceiptCode(string Code);
        public List<string> GetlistBookStatus();
        public DataOfOneIdReceipt GetReceiptExportBooksById(Guid id);
        public List<CustomApiReceiptExportBooks> GetListBookToRecepiptExportBooks(string filter, Guid IdDocumentType, int pageNumber, int pageSize);
        public ReceiptDto SearchReceipt(string code);
        public Response InsertReceipt(ReceiptDto receiptDto);
        public Response InsertReceiptExportBooks(ReceiptDto receiptDto);
        public Task<Response> UpdateReceipt(ReceiptDto receiptDto);
        public Task<Response> UpdateReceiptExportBooks(ReceiptDto receiptDto);
        public Response DeleteReceipt(Guid Id);
        public Response ConfirmExportBooks(Guid idReceipt);
        public Tuple<DateTime, string> GetExportDateAndReceiptNumber(Guid idIndividualSample);
        #endregion
    }
}
