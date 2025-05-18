using DigitalLibary.Data.Entity;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class DataOfOneIdReceipt
    {

        public DataOfOneIdReceipt()
        {

        }
        public Receipt Receipt { get; set; }
        public List<CustomApiReceiptExportBooks> DocumentListId { get; set; }
        public List<Participants> Participants { get; set; }

    }
}
