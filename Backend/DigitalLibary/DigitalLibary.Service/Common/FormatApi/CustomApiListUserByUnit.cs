﻿using System;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class CustomApiListUserByUnit
    {
        public CustomApiListUserByUnit()
        {

        }
        public string NameUser { get; set; }
        public string NameDocument { get; set; }
        public string NumIndividual { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public string Note { get; set; }
        public bool? IsComplete { get; set; }
        public int NumberDayLate { get; set; }
        public String? MessageDayLate { get; set; }
        public DateTime? DateInReality { get; set; }
    }
}
