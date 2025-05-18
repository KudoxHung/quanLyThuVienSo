using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.IRepository
{
    public interface IAnalystRepository
    {
        #region CUSTOM API Analyst

        List<ListIndividualLiquidated> ListIndividualLiquidated(IndividualLiquidatedModel individualLiquidatedModel);


        List<CustomApiCountUserByUserType> CountUserByType();

        List<CustomApiCountDocumentByType> CountDocumentByType();

        CustomApiAnalystUserAndBook AnalystUserAndBook();

        List<CustomApiBorrowByUserType> CustomApiBorrowByUserTypes(string status, string fromdate, string todate);

        List<CustomApiAnalystBookByType> CustomApiAnalystBookByTypes(Guid IdDocumentType);

        List<AnalystBookByGroupType> AnalystBookByGroupTypes(Guid IdDocumentType);

        List<ListBookNew> ListDocumentByIdStock(Guid IdStock);

        int CountDocumentByIdStock(Guid IdStock);
        List<TotalBooksByYear> TotalBooks2(Guid IdSchoolYear);
        List<CustomApiBorrowByUserType> CustomApiBorrowByUserTypes(string fromdate, string todate);

        List<CustomApiListUserByUnit> CustomApiListUserByUnit(Guid IdUnit, Guid IdUserType, string fromDate, string toDate);

        List<CustomApiListBorrowByUserType> CustomApiListBorrowByUserTypes(Guid IdUnit, Guid IdUserType, string fromDate, string toDate);

        CustomApiListBorrowByUserTypeDetail CustomApiListBorrowByUserTypesDetail(Guid IdUnit, Guid IdUser, string fromDate, string toDate);

        CustomApiListBorrowByUserTypesDetails CustomApiListBorrowByUserTypesDetails(Guid IdUnit, Guid IdUser, string fromDate, string toDate);

        List<CustomApiListBorrowLateByUserType> CustomApiListBorrowLateByUserTypes(Guid IdUserType, string toDate);

        List<CustomApiNumIndividualLedger> CustomApiNumIndividualLedgers(string fromDate, string toDate, Guid documentType);

        List<CustomApiNumIndividualLedgerExcel> CustomApiNumIndividualLedgersExcel(string fromDate, string toDate, Guid documentType);

        Task<List<AnalystBorrowBookMonthly>> AnalystBorrowBookMonthly(Guid idUnit, Guid idUserType, string fromDate, string toDate);

        List<AnalystBorrowedBooksByQuarter> AnalystBorrowedBooksByQuarter(List<Guid> unitIds, Guid idUserType, int quarter, int year);

        List<CustomModelGeneralRegister> GetFileExcelGeneralRegister(string fromDate, string toDate);
        List<CustomModelGeneralRegister> GetFileExcelGeneralRegister_Ver2(string fromDate, string toDate);

        List<CustomModelGeneralRegisterBySchoolYearImportStock> GetFileExcelGeneralRegisterBySchoolYearImportStock(Guid IdSchoolYear);
        List<CustomModelGeneralRegisterBySchoolYearExportStock> GetFileExcelGeneralRegisterBySchoolYearExportStock(Guid IdSchoolYear);

        Task<List<CustomApiListIndividualSampleTextBook>> GetListDataTextBook(DateTime fromDate, DateTime toDate);

        Task<List<CustomAnalystMagazine>> GetListDataAnalystMagazine(int year, int typeAnalyst, List<Guid> listDocumentType);
        List<CustomApiAnalystMagazine> GetListDataApiAnalystMagazine(int year, int typeAnalyst, List<Guid> listDocumentType);

        #endregion
    }
}