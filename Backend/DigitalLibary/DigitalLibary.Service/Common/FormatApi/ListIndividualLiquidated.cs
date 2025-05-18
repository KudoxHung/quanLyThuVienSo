using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Dto;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class ListIndividualLiquidated
    {
        public string DocumentTypeName { get; set; }
        public List<BookNameAndNumIndividual> BookNameAndNumIndividuals { get; set; }
    }

    public class BookNameAndNumIndividual
    {
        public string NameBook { get; set; }
        public List<string> NumIndividual { get; set; }
        public long? Price { get; set; }
        public string? Note { get; set; }
    }
}