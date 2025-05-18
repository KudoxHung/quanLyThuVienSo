using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    public class SchoolDocumentIndividual
    {
        public Guid Id { get; set; }
        public Guid SchoolId { get; set; }
        public Guid DocumentId { get; set; }
        public string DocTypeName { get; set; }
        public string NumIndividual { get; set; }
        public School School { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Status { get; set; }
        //public DateTime ModifiedDate { get; set; }
    }
}
