using DigitalLibary.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class SchoolYearDto
    {
        public SchoolYearDto()
        {

        }
        public Guid Id { get; set; }
        public DateTime? FromYear { get; set; }
        public DateTime? ToYear { get; set; }
        public DateTime? StartSemesterI { get; set; }
        public DateTime? StartSemesterII { get; set; }
        public DateTime? EndAllSemester { get; set; }
        public bool? IsActived { get; set; }
        public int? Status { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
    public class SchoolGradeDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool? IsDeleted { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int STT { get; set; }
    }
    public class SchoolDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? CreatedBy { get; set; }
        public string StoreName { get; set; }
        public Guid GradeId { get; set; }
        public string DatabaseName { get; set; }
        public bool? IsDeleted { get; set; }
        public SchoolGradeDto Grade { get; set; }
    }
    public class SchoolDocumentsDto
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public string DocName { get; set; }
        public string DocTypeName { get; set; }
        public string StatusBookName { get; set; }
        public SchoolDto School { get; set; }
        public DateTime CreatedDate { get; set; }
        public string DocStatusName { get; set; }
        //public DateTime ModifiedDate { get; set; }
    }
    public class SchoolAuditDetailDto
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public SchoolDto School { get; set; }
        public Guid DocId { get; set; }
        public string DocName { get; set; }
        public string StatusName { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool WasLost { get; set; }
        public bool IsLostedPhysicalVersion { get; set; }
    }

    public class ReportSchoolDto
    {
        public SchoolDto School { get; set; }
        public double SachGiaoKhoa { get; set; }
        public double SachThamKhao { get; set; }
        public double SachNghiemVu { get; set; }
        public double SachThieuNhi { get; set; }
        public double SachKhac { get; set; }
    }
    public class ReportDocumentDetailDto
    {
        public Guid Key { get; set; }
        public string Name { get; set; }
        public double DauNam { get; set; }
        public double RachNat { get; set; }
        public double LacHau { get; set; }
        public double Mat { get; set; }
        public double XuatSach { get; set; }
        public double CuoiNam { get; set; }
        public SchoolDto School { get; set; }
        public List<ReportDocumentDetailDto> Children { get; set; }

    }
    public class ReportDocumentTotalDto
    {
        public ReportDocumentTotalDto()
        {
            Children = new List<ReportDocumentTotalDto>();
        }
        public Guid Key { get; set; }
        public string Name { get; set; }
        public double SachGiaoKhoa { get; set; }
        public double SachThamKhao { get; set; }
        public double SachNghiemVu { get; set; }
        public double SachThieuNhi { get; set; }
        public double SachKhac { get; set; }
        public double TongSoSach { get { return SachGiaoKhoa + SachThamKhao + SachNghiemVu + SachThieuNhi + SachKhac; } }
        public SchoolDto School { get; set; }
        public List<ReportDocumentTotalDto> Children { get; set; }
    }
    public class FilterDto
    {
        public FilterDto()
        {
            GradeId = new List<Guid>();
            SchoolId = new List<Guid>();
        }
        public Guid YearId { get; set; }
        public List<Guid> GradeId { get; set; }
        public List<Guid> SchoolId { get; set; }
        public List<string> SchoolCode { get; set; }
    }
}
