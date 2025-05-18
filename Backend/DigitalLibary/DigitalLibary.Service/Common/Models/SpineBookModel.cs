using System;

namespace DigitalLibary.Service.Common.Models
{
    public class SpineBookModel
    {
        public Guid ID { get; set; }
        public string? DocName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}