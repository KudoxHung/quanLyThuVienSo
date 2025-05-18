
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DigitalLibary.Service.Dto
{
    public class SortAndSearchListDocumentInvoice
    {
        public SortAndSearchListDocumentInvoice()
        {

        }
        public string? sortOrder { get; set; }
        public string? sortField { get; set; }
        public int page { get; set; }
        public int results { get; set; }
        public List<Guid>? userId { get; set; }
        public List<Guid>? userCode { get; set; }
        public List<String>? invoiceCode { get; set; }

        public List<DateTime?>? createDate { get; set; }
        public List<int?>? status { get; set; }
       
    }
}
