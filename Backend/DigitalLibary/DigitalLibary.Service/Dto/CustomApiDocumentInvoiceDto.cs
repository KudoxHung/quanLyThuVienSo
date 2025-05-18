using DigitalLibary.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class CustomApiDocumentInvoiceDto
    {
        public CustomApiDocumentInvoiceDto() { }
        public List<DocumentInvoiceDto> ListDocumentInvoice{ get; set; }
        public List<User>? ListUser { get; set; }

    }
    
}
