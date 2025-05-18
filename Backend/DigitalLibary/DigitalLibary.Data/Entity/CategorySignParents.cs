using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    [Table("CategorySignParents")]
    public class CategorySignParents
    {
        public CategorySignParents()
        {

        }
        public Guid Id { get; set; }
        public string? ParentName { get; set; }
        public string? ParentCode { get; set; }
        public bool? IsDeleted { get; set; }
        public Guid? CreateBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public bool? IsHided { get; set; }
        public int? Status { get; set; }
    }
}
