using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    public class SchoolGrade
    {
        public SchoolGrade()
        {

        }
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool? IsDeleted { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int STT { get; set; }
    }
}
