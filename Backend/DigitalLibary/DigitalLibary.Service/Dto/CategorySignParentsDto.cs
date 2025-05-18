using System;
using System.ComponentModel.DataAnnotations;
namespace DigitalLibary.Service.Dto
{
    public class CategorySignParentsDto
    {
        public CategorySignParentsDto()
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
