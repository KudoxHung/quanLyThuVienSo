using Microsoft.EntityFrameworkCore;
using System;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class CustomModelGeneralRegister
    {
        public Guid ID { get; set; }
        public string DocName { get; set; }
        public Guid DocumentTypeId { get; set; }
        public string DocTypeName { get; set; }
        public string CountIndividualSamples { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Language { get; set; }
        public long? Price { get; set; }
    }
}