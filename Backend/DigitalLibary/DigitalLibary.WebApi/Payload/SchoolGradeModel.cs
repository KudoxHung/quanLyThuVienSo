using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Dto;
using System;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Payload
{
    public class SchoolGradeModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool? IsDeleted { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int STT { get; set; }
    }
    public class SchoolModel
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
        public SchoolGradeModel Grade { get; set; }
    }
    public class SchoolDocumentsModel
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public string DocName { get; set; }
        public string DocTypeName { get; set; }
        public string StatusBookName { get; set; }
        public string DocStatusName { get; set; }
        public DateTime ModifiedDate { get; set; }
        public SchoolModel School { get; set; }
        public DateTime CreatedDate { get; set; }

    }
    public class SchoolAuditDetailModel
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public SchoolModel School { get; set; }
        public Guid DocId { get; set; }
        public string DocName { get; set; }
        public string StatusName { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool WasLost
        {
            get; set;
        }
        public bool IsLostedPhysicalVersion
        {
            get; set;
        }
    }

    public class ReportSchoolModel
    {
        public SchoolModel School { get; set; }
        public double SachGiaoKhoa { get; set; }
        public double SachThamKhao { get; set; }
        public double SachNghiemVu { get; set; }
        public double SachThieuNhi { get; set; }
        public double SachKhac { get; set; }
        public double TongSoSach { get { return SachGiaoKhoa + SachThamKhao + SachNghiemVu + SachThieuNhi + SachKhac; } }
        public string Name { get { return School.Name; } }
        public Guid Key { get { return School.Id; } }

    }
   
    public class ReportGradeModel
    {
        public Guid Key { get; set; }
        public string Name { get; set; }
        public double SachGiaoKhoa { get; set; }
        public double SachThamKhao { get; set; }
        public double SachNghiemVu { get; set; }
        public double SachThieuNhi { get; set; }
        public double SachKhac { get; set; }
        public double TongSoSach { get { return SachGiaoKhoa + SachThamKhao + SachNghiemVu + SachThieuNhi + SachKhac; } }
        public List<ReportSchoolModel> Children { get; set; }
    }

    public class ReportDocumentTotalModel
    {
        public ReportDocumentTotalModel()
        {
            Children = new List<ReportDocumentTotalModel>();
        }
        public Guid Key { get; set; }
        public string Name { get; set; }
        public double SachGiaoKhoa { get; set; }
        public double SachThamKhao { get; set; }
        public double SachNghiemVu { get; set; }
        public double SachThieuNhi { get; set; }
        public double SachKhac { get; set; }
        public double TongSoSach { get { return SachGiaoKhoa + SachThamKhao + SachNghiemVu + SachThieuNhi + SachKhac; } }
        public SchoolModel School { get; set; }
        public List<ReportDocumentTotalModel> Children { get; set; }
    }
    public class ReportDocumentDetailModel
    {
        public ReportDocumentDetailModel()
        {
            Children = new List<ReportDocumentDetailModel>();
        }
        public Guid Key { get; set; }
        public string Name { get; set; }
        public double DauNam { get; set; }
        public double RachNat { get; set; }
        public double LacHau { get; set; }
        public double Mat { get; set; }
        public double XuatSach { get; set; }
        public double CuoiNam { get; set; }
        public SchoolModel School { get; set; }
        public List<ReportDocumentDetailModel> Children { get; set; }
    }
}
