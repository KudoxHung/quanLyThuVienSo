using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class CustomApiListBorrowByUserTypesDetails
    {
        public CustomApiListBorrowByUserTypesDetails()
        {

        }
        public string NameUser { get; set; }
        public string NameUnit { get; set; }
        public string Address { get; set; }
        public List<ListBorrowByUserIds> listBorrowByUserIds { get; set; }

    }


    public class ListBorrowByUserIds
    {
        public ListBorrowByUserIds()
        {

        }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Note { get; set; }
        public string NameDocument { get; set; }
        public string NumIndividual { get; set; }
        public bool? IsComplete { get; set; }
        public DateTime? DateInReality { get; set; }
        public int NumberDayLate { get; set; }
        public String? MessageDayLate { get; set; }


    }
}
