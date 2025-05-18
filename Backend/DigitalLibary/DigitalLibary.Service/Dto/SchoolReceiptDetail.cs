using DigitalLibary.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class SchoolReceiptDetail
    {
        public Guid? Id { get; set; }
        public Guid? IdDocument { get; set; }
        public Guid? IdIndividualSample { get; set; }
        public Guid? IdSchool { get; set; }
        public int? ReceiptType { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? CreatedDateIndi { get; set; }
        public string? DocTypeName { get; set; }
    }
}
