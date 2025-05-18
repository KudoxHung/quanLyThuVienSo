using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;
using DigitalLibary.Service.Common.Models;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IAuditReceiptRepository
    {
        IEnumerable<AuditReceiptAndAuditorList> AuditReceiptAndAuditorLists (List<Guid> idsIndividual);
        IEnumerable<AuditReceiptDto> GetAllAuditReceipt(int pageNumber, int pageSize, string reportCreateDate, string reportToDate);
        DataOfOneIdAuditReceipt GetAuditReceiptById(Guid idAuditReceipt);
        GroupDataOfOneIdAuditReceipt GetAuditReceiptByIdForLiquid(Guid idAuditReceipt);
        Response InsertAuditReceipt(AuditReceiptDto auditReceiptDto);
        Response UpdateAuditReceipt(Guid idAuditReceipt, AuditReceiptDto auditReceiptDto);
        Response DeleteAuditReceipt(Guid idAuditReceipt);
        Response LiquidationAuditReceiptByListId(List<LiquidationBook> liquidationBooks); 
        bool CheckDocumentInvoice(List<LiquidationBook> liquidationBooks);
        Response DeleteAuditReceiptByList(List<Guid> IdAuditReceipt);
        CustomApiAuditReceipt GetDataBookByBarcode(string barcode);
        Tuple<string, string> GetUnitAndTypeOfUser(Guid IdUser);
        List<CustomApiAuditReceipt> ConfirmLostBook(int pageNumber, int pageSize, List<Guid> IdIndividual);
        ReportAuditReceipt ReportAuditReceipt(Guid IdAuditReceipt);
        AuditTraditionalDocument PrintListDataDocument(Guid IdDocumentType, int sortByCondition);
        Int64 CountAllNumberOfBook();
        List<CustomApiAuditReceipt> GetListBookToAuditReceipt(string filter, Guid IdDocumentType, int pageNumber, int pageSize);
    }
}