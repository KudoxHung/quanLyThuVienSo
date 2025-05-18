namespace DigitalLibary.WebApi.Payload
{
    public class GetAllBookVerPayload
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int DocumentType { get; set; }
        public string ListIdDocument { get; set; }
    }
}
