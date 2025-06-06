﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Dto
{
    public class CategoryColorDto
    {
        public Guid Id { get; set; }
        public string? ColorName { get; set; }
        public string? ReadingLevel { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ColorCode { get; set; }
    }
}
