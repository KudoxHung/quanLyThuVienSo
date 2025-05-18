using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class CustomAnalystMagazine
    {
        public string? DocumentTypeName { get; set; }
        public int? ReleaseTerm { get; set; }
        public string? Language { get; set; }
        public string? PlaceOfProduction { get; set; }
        public string? PaperSize { get; set; }
        public string? NumberOfCopies { get; set; }

        public List<string>[,] ListMagazineOne = new List<string>[31, 12];
        public List<string>[,] ListMagazineTwo = new List<string>[2, 12];
    }
}
