using System;

namespace DigitalLibary.WebApi.Payload
{
    public class SchoolYearModel
    {
        public Guid Id { get; set; }
        public DateTime? FromYear { get; set; }
        public DateTime? ToYear { get; set; }
        public DateTime? StartSemesterI { get; set; }
        public DateTime? StartSemesterII { get; set; }
        public DateTime? EndAllSemester { get; set; }
        public bool? IsActived { get; set; }
        public int? Status { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string SchoolYear
        {
            get
            {
                var _YearFom = FromYear.HasValue != null ? FromYear.Value.Year.ToString() : DateTime.Now.Year.ToString();
                var _YearTo = ToYear.HasValue != null ? ToYear.Value.Year.ToString() : DateTime.Now.Year.ToString();
                return _YearFom + "-" + _YearTo;
            }
        }
    }
}
