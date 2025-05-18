using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    public class School
    {
        public School()
        {

        }
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
        public SchoolGrade Grade { get; set; }
        public List<SchoolDocuments> SchoolDocuments { get; set; }
    }
    public class SchoolDocuments
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public string DocName { get; set; }
        public string DocTypeName { get; set; }
        public string StatusBookName { get; set; }
        public School School { get; set; }
        public DateTime CreatedDate { get; set; }
        public int DoctypeStatus { get; set; }
        //public DateTime ModifiedDate { get; set; }
    } 
   
    public class SchoolAuditDetail
    {
        public Guid? Id { get; set; }
        public Guid? SchoolId { get; set; }
        public School? School { get; set; }
        public Guid? DocId { get; set; }
        public string? DocName { get; set; }
        public string? StatusName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? WasLost { get; set; }
        public bool? IsLostedPhysicalVersion { get; set; }
    }
    public class SchoolReceiptDetail
    {
        public Guid? Id { get; set; }
        public Guid? IdDocument { get; set; }
        public Guid? IdIndividualSample { get; set; }
        public Guid? IdSchool { get; set; }
        public int? ReceiptType { get; set; }
        public int? Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? CreateDateIndi { get; set; }
        public string? DocTypeName { get; set; }
    }
}
