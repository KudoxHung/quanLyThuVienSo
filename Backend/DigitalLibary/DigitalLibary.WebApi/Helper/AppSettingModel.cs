﻿namespace DigitalLibary.WebApi.Helper
{
    public class AppSettingModel
    {
        public string SecretKey { get; set; }
        public string Url { get; set; }
        public string fromMail { get; set; }
        public string password { get; set; }
        // support register system
        public string RoleDefault { get; set; }
        public string UserTypeDefault { get; set; }
        public string Unit { get; set; }
        public string ServerFileImage { get; set; }
        public string ServerFileTemp { get; set; }
        public string ServerFilePdf { get; set; }
        public string ServerFileSlide { get; set; }
        public string ServerFileAvartar { get; set; }
        public string ServerFileExcel { get; set; }
        public string ServerFileWord { get; set; }
        public string ServerFileImageIntroduction { get; set; }
        public string Root { get; set; }
        public string ServerFileVes { get; set; }
        public string ServerFileVesAvatar { get; set; }
        public string SchoolName { get; set; }
        public string DistrictName { get; set; }
        public string NameFooter { get; set; }
        public string UnitConnectedCode { get; set; }
        public string UnitConnectedName { get; set; }

    }
}