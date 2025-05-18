using System;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Payload
{
    public class UpdateListUserByIdUnitModel
    {
        public List<Guid> IdUser { get; set; }
        public Guid IdUnit { get; set; }
    }
}