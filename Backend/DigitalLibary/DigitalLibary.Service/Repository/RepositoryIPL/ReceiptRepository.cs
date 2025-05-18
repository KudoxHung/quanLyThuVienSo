using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class ReceiptRepository : IReceiptRepository
    {
        #region Variables
        private readonly IMapper _mapper;
        public DataContext _DbContext;
        #endregion

        #region Constructors
        public ReceiptRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }
        #endregion



        #region Method
        public Response DeleteReceipt(Guid Id)
        {
            Response response = new Response();
            try
            {
                // Tìm phiếu theo Id
                Receipt receipt = _DbContext.Receipt.FirstOrDefault(x => x.IdReceipt == Id);
                if (receipt == null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu!"
                    };
                }
                List<Guid> listIdIindi = null;
                if (receipt.ReceiptType == 0)
                {
                    // Lấy danh sách mã cá biệt từ chi tiết phiếu
                    listIdIindi = _DbContext.IndividualSample
                        .Where(x => x.IdReceipt == Id)
                        .Select(x => x.Id)
                        .ToList();

                    if (!listIdIindi.Any())
                    {
                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Không tìm thấy mã cá biệt nào trong phiếu!"
                        };
                    }
                }
                else
                {
                    List<Guid?> lstIDIn = _DbContext.ReceiptDetail.Where(x => x.IdReceipt == Id).Select(x => x.IdIndividualSample).ToList();
                    // Lấy danh sách mã cá biệt từ chi tiết phiếu

                    if (lstIDIn.Count > 0)
                    {

                        listIdIindi = _DbContext.IndividualSample
                           .Where(x => lstIDIn.Contains(x.Id))
                           .Select(x => x.Id)
                           .ToList();

                    }
                    if (!listIdIindi.Any())
                    {
                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Không tìm thấy mã cá biệt nào trong phiếu!"
                        };
                    }
                }

                // Kiểm tra các điều kiện không thể xóa
                if (receipt.Status == 1 && receipt.ReceiptType == 1)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu đã được xuất, không thể xóa được nữa!"
                    };
                }

                //bool existsInAuditBookList = _DbContext.AuditBookList
                //    .Any(x => listIdIindi.Contains(x.IdIndividualSample));

                //if (existsInAuditBookList)
                //{
                //    return new Response()
                //    {
                //        Success = false,
                //        Fail = true,
                //        Message = "Phiếu có chứa các sách đã được kiểm kê, không thể xóa được nữa!"
                //    };
                //}

                bool existsInDocumentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Any(x => listIdIindi.Contains(x.IdIndividual) && (x.IsCompleted == false));



                if (existsInDocumentInvoiceDetail)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Sách chưa trả thì không xóa được!"
                    };
                }

                // Xóa phiếu và chi tiết phiếu
                receipt.IsDeleted = true;
                _DbContext.Receipt.Update(receipt);

                List<ReceiptDetail> list = _DbContext.ReceiptDetail
                    .Where(x => x.IdReceipt == receipt.IdReceipt)
                    .ToList();

                foreach (var item in list)
                {
                    item.IsDeleted = true;
                    _DbContext.ReceiptDetail.Update(item);
                }

                List<IndividualSample> listIndi = _DbContext.IndividualSample
                    .Where(x => x.IdReceipt == receipt.IdReceipt)
                    .ToList();

                foreach (var item in listIndi)
                {
                    _DbContext.IndividualSample.Remove(item);
                }

                _DbContext.SaveChanges();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Xóa thành công!"
                };
            }
            catch (Exception ex)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    //Message = "Xóa không thành công! Lỗi: " + ex.InnerException.Message
                    Message = "Xóa không thành công"
                };
            }
        }

        public List<ReceiptDto> getAllReceipt(int pageNumber, int pageSize)
        {
            try
            {
                List<Receipt> receipts = new List<Receipt>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    receipts = _DbContext.Receipt.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(e => e.CreatedDate)
                    .ToList();
                }
                else
                {
                    receipts = _DbContext.Receipt.
                    Where(e => e.IsDeleted == false)
                    .OrderByDescending(e => e.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<ReceiptDto> receiptDtos = new List<ReceiptDto>();

                for (int i = 0; i < receipts.Count; i++)
                {
                    List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e =>
                    e.IdReceipt == receipts[i].IdReceipt).ToList();
                    ReceiptDto receiptDto = new ReceiptDto();

                    receiptDto = _mapper.Map<ReceiptDto>(receipts[i]);
                    receiptDto.ReceiptDetail = receiptDetails;

                    receiptDtos.Add(receiptDto);
                    ;
                }
                return receiptDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public DocumentDto GetDocumentType(Guid Id)
        {
            try
            {
                Document document = _DbContext.Document.AsNoTracking()
                .Where(e => e.ID == Id).FirstOrDefault();

                DocumentDto documentDto = new DocumentDto();
                documentDto = _mapper.Map<DocumentDto>(document);

                return documentDto;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public ReceiptDto getReceipt(Guid Id)
        {
            try
            {
                Receipt receipts = new Receipt();
                ReceiptDto receiptDtos = new ReceiptDto();

                receipts = _DbContext.Receipt.
                Where(e => e.IsDeleted == false && e.IdReceipt == Id)
                .FirstOrDefault();

                if (receipts != null)
                {
                    List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e =>
                    e.IdReceipt == receipts.IdReceipt).ToList();


                    List<Participants> participants = _DbContext.Participants.Where(e => e.IdReceipt == Id).ToList();


                    receiptDtos = _mapper.Map<ReceiptDto>(receipts);
                    receiptDtos.ReceiptDetail = receiptDetails;
                    receiptDtos.participants = participants;
                    List<Guid> documentIds = receiptDetails.Select(rd => rd.IdDocument).ToList();


                    receiptDtos.DocumentListId = _DbContext.Document
                                .Where(d => documentIds.Contains(d.ID))
                                .Select(d => new DocumentListId
                                {
                                    IdDocument = d.ID,
                                })
                                .ToList();
                }

                return receiptDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public DataOfOneIdReceipt GetReceiptExportBooksById(Guid id)
        {
            try
            {

                DataOfOneIdReceipt dataOfOneId = new DataOfOneIdReceipt()
                {
                    DocumentListId = new List<CustomApiReceiptExportBooks>(),
                    Participants = new List<Participants>(),
                    Receipt = new Receipt()
                };


                List<AuditBookList> auditBookLists = _DbContext.AuditBookList.ToList();

                List<AuditReceipt> auditReceiptDtos = _DbContext.AuditReceipt.OrderByDescending(e => e.ReportCreateDate).ToList();

                List<StatusBook> statusBooks = _DbContext.StatusBook.ToList();

                Receipt receipts = new Receipt();

                receipts = _DbContext.Receipt.Where(e => e.IsDeleted == false && e.IdReceipt == id).FirstOrDefault();

                if (receipts == null) return null;

                List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e => e.IdReceipt == receipts.IdReceipt).ToList();

                List<Participants> participants = _DbContext.Participants.Where(e => e.IdReceipt == id).ToList();


                foreach (var item in receiptDetails)
                {

                    bool check = false;
                    string statusIndividual = "";
                    foreach (var auditReceipt in auditReceiptDtos)
                    {
                        var auditBookList = auditBookLists.Where(e => e.IdDocument == item.IdDocument && e.IdIndividualSample == item.IdIndividualSample && e.IdAuditReceipt == auditReceipt.Id).OrderByDescending(e => e.CreatedDate).FirstOrDefault();

                        if (auditBookList != null)
                        {
                            var statusBook = statusBooks.Where(e => e.Id == auditBookList.IdStatusBook).FirstOrDefault();

                            if (statusBook == null)
                            {
                                statusIndividual = "Không thể xác định Tình trạng";
                                check = true;
                                break;
                            }
                            else
                            {
                                statusIndividual = statusBook.NameStatusBook;
                                check = true;
                                break;
                            }


                        }
                    }
                    if (check == false) statusIndividual = "Còn nguyên vẹn";


                    Document document = _DbContext.Document.Where(e => e.ID == item.IdDocument).FirstOrDefault();

                    IndividualSample individualSample = _DbContext.IndividualSample.Where(e => e.Id == item.IdIndividualSample).FirstOrDefault();

                    if (document == null || individualSample == null) continue;

                    CustomApiReceiptExportBooks bookData = new CustomApiReceiptExportBooks()
                    {
                        IdDocument = document.ID,
                        DocumentName = document.DocName,
                        Price = individualSample.Price ?? document.Price ?? 0,
                        Publisher = document.Publisher,
                        NumIndividual = individualSample.NumIndividual,
                        IdIndividual = individualSample.Id,
                        Author = document.Author,
                        IdDocumentType = document.DocumentTypeId,
                        StatusIndividual = statusIndividual,
                        Note = item.Note
                    };

                    if (bookData != null)
                    {
                        dataOfOneId.DocumentListId.Add(bookData);
                    }
                }

                dataOfOneId.Receipt = receipts;

                dataOfOneId.Participants = participants;

                return dataOfOneId;

            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<CustomApiReceiptExportBooks> GetListBookToRecepiptExportBooks(string filter, Guid idDocumentType, int pageNumber, int pageSize)
        {
            var bookData = (from d in _DbContext.Document
                            join i in _DbContext.IndividualSample on d.ID equals i.IdDocument
                            join dt in _DbContext.DocumentType on d.DocumentTypeId equals dt.Id
                            where d.IsDeleted == false && i.IsDeleted == false
                                                       && dt.IsDeleted == false && dt.Status == 1
                            select new CustomApiReceiptExportBooks
                            {
                                IdDocument = d.ID,
                                DocumentName = d.DocName,
                                Price = i.Price ?? d.Price ?? 0,
                                Publisher = d.Publisher,
                                NumIndividual = i.NumIndividual,
                                IdIndividual = i.Id,
                                Author = d.Author,
                                IdDocumentType = d.DocumentTypeId,
                                StatusIndividual = null
                            }).ToList();


            List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.ToList();

            List<AuditReceipt> auditReceiptDtos = _DbContext.AuditReceipt.OrderByDescending(e => e.ReportCreateDate).ToList();

            List<AuditBookList> auditBookLists = _DbContext.AuditBookList.ToList();

            List<StatusBook> statusBooks = _DbContext.StatusBook.ToList();

            List<DocumentInvoiceDetail> documentInvoiceDetails = _DbContext.DocumentInvoiceDetail.ToList();

            var itemsToRemove = new List<CustomApiReceiptExportBooks>();


            foreach (var item in bookData)
            {

                if (receiptDetails.FirstOrDefault(e => e.IdDocument == item.IdDocument && e.IdIndividualSample == item.IdIndividual && e.IsDeleted == false) != null)
                {
                    itemsToRemove.Add(item);
                    continue;
                }
                else if (documentInvoiceDetails.FirstOrDefault(e => e.IdDocument == item.IdDocument && e.IdIndividual == item.IdIndividual && e.IsCompleted == false) != null)
                {
                    itemsToRemove.Add(item);
                    continue;
                }

                bool check = false;
                foreach (var auditReceipt in auditReceiptDtos.OrderByDescending(e => e.ReportToDate).ToList())
                {
                    var auditBookList = auditBookLists.Where(e => e.IdDocument == item.IdDocument && e.IdIndividualSample == item.IdIndividual && e.IdAuditReceipt == auditReceipt.Id).FirstOrDefault();

                    if (auditBookList != null)
                    {
                        //auditBookList.WasLost == true || mất nhưng vẫn hiện ở phiếu xuất
                        if (auditBookList.IsLiquidation == true)
                        {
                            itemsToRemove.Add(item);
                            check = true;
                            break;
                        }

                        var statusBook = statusBooks.Where(e => e.Id == auditBookList.IdStatusBook).FirstOrDefault();
                        item.StatusIndividual = statusBook.NameStatusBook;
                        check = true;
                        break;
                    }
                }
                if (check == false)
                {
                    item.StatusIndividual = "Còn nguyên vẹn";
                }
            }

            foreach (var itemToRemove in itemsToRemove)
            {
                bookData.Remove(itemToRemove);
            }


            if (idDocumentType != Guid.Empty)
            {
                bookData = bookData.Where(e => e.IdDocumentType == idDocumentType).ToList();
            }

            if (filter is not null)
            {
                var tempFilter = Regex.Replace(filter, @"\s+", " ").Trim().ToLower();
                bookData = bookData.Where(e => (e.DocumentName ?? "").ToLower().Contains(tempFilter)
                                               || (e.Author ?? "").ToLower().Contains(tempFilter)).ToList();
            }

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                bookData = bookData.Skip((pageNumber - 1) * pageSize).Take(pageSize)
                    .ToList();
            }

            var sortedList = bookData.OrderBy(e => e.DocumentName).ThenBy(e => ExtractNumber(e.NumIndividual)).ToList();

            return sortedList;
        }
        public int GetMaxReceiptCode(string Code)
        {
            try
            {
                int ReceiptCodeMax = 0;

                List<Receipt> receipts = _DbContext.Receipt
                .Where(x => x.ReceiptCode.Substring(0, Code.Length).ToLower() == Code.ToLower() && x.IsDeleted == false).ToList();

                for (int i = 0; i < receipts.Count; i++)
                {
                    string number = receipts[i].ReceiptCode.Substring(Code.Length);
                    int numberInt = int.Parse(number);

                    if (ReceiptCodeMax < numberInt)
                    {
                        ReceiptCodeMax = numberInt;
                    }
                }
                return ReceiptCodeMax;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<ReceiptDto> getAllReceipt(SortReceiptAndSearch sortReceiptAndSearch, int type = 0)
        {
            try
            {
                List<Receipt> receipts = new List<Receipt>();
                int countRecord = 0;

                receipts = _DbContext.Receipt
                .Where(e => e.IsDeleted == false && e.ReceiptType == type)
                .OrderByDescending(e => e.CreatedDate)
                .ToList();
                receipts = receipts.OrderByDescending(e => long.Parse(new string(e.ReceiptCode.ToCharArray().Where(char.IsDigit).ToArray()))).ToList();

                countRecord = receipts.Count();

                if (sortReceiptAndSearch.ReceiptCode != null)
                {
                    receipts = receipts.Where(a => a.ReceiptCode.ToLower()
                    .Contains(sortReceiptAndSearch.ReceiptCode[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }
                if (sortReceiptAndSearch.ReceiverName != null)
                {
                    receipts = receipts.Where(a => a.ReceiverName.ToLower()
                    .Contains(sortReceiptAndSearch.ReceiverName[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }

                if (sortReceiptAndSearch.ReceiverPosition != null)
                {
                    receipts = receipts.Where(a => a.ReceiverPosition.ToLower()
                    .Contains(sortReceiptAndSearch.ReceiverPosition[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }

                if (sortReceiptAndSearch.ReceiverUnitRepresent != null)
                {
                    receipts = receipts.Where(a => a.ReceiverUnitRepresent.ToLower()
                    .Contains(sortReceiptAndSearch.ReceiverUnitRepresent[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }

                if (sortReceiptAndSearch.DeliverName != null)
                {
                    receipts = receipts.Where(a => a.DeliverName.ToLower()
                    .Contains(sortReceiptAndSearch.DeliverName[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }

                if (sortReceiptAndSearch.DeliverPosition != null)
                {
                    receipts = receipts.Where(a => a.DeliverPosition.ToLower()
                    .Contains(sortReceiptAndSearch.DeliverPosition[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }

                if (sortReceiptAndSearch.DeliverUnitRepresent != null)
                {
                    receipts = receipts.Where(a => a.DeliverUnitRepresent.ToLower()
                    .Contains(sortReceiptAndSearch.DeliverUnitRepresent[0].ToLower())).ToList();
                    countRecord = receipts.Count();
                }


                if (sortReceiptAndSearch.sortOrder == "ascend")
                {
                    if (sortReceiptAndSearch.sortField == "receiptCode")
                    {
                        receipts.Sort((x, y) => x.ReceiptCode.Substring(2).CompareTo(y.ReceiptCode.Substring(2)));
                    }
                    if (sortReceiptAndSearch.sortField == "createdDate")
                    {
                        if (receipts.Count == 0)
                        {
                            receipts = receipts
                            .OrderBy(e => e.CreatedDate)
                            .ToList();
                        }
                    }
                }
                else
                {
                    if (sortReceiptAndSearch.sortField == "receiptCode")
                    {
                        receipts.Sort((x, y) => y.ReceiptCode.Substring(2).CompareTo(x.ReceiptCode.Substring(2)));
                    }
                    if (sortReceiptAndSearch.sortField == "createdDate")
                    {
                        if (receipts.Count == 0)
                        {
                            receipts = receipts
                           .OrderByDescending(e => e.CreatedDate)
                           .ToList();
                        }
                    }
                }

                List<ReceiptDto> receiptDtos = new List<ReceiptDto>();

                for (int i = 0; i < receipts.Count; i++)
                {
                    List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e =>
                    e.IdReceipt == receipts[i].IdReceipt).ToList();
                    ReceiptDto receiptDto = new ReceiptDto();

                    receiptDto = _mapper.Map<ReceiptDto>(receipts[i]);
                    receiptDto.ReceiptDetail = receiptDetails;
                    receiptDto.total = countRecord;

                    receiptDtos.Add(receiptDto);
                }
                return receiptDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<string> GetlistOriginal()
        {
            try
            {
                List<string> Original = _DbContext.Receipt.Where(e => e.Original != null && e.IsDeleted == false).Select(e => e.Original).ToList();
                return Original.Distinct().ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<string> GetlistBookStatus()
        {
            try
            {
                List<string> BookStatus = _DbContext.Receipt.Where(e => e.BookStatus != null && e.IsDeleted == false).Select(e => e.BookStatus).ToList();
                return BookStatus.Distinct().ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
        private string GetSortableString(string str)
        {
            int slashIndex = str.IndexOf('/');
            string charsBeforeNumber = str.Substring(0, slashIndex);
            string numbersBeforeSlash = str.Substring(slashIndex + 1).Split('/')[0];

            return charsBeforeNumber + numbersBeforeSlash;
        }

        private static int ExtractNumber(string numIndividual)
        {
            var match = Regex.Match(numIndividual, @"\d+");
            return match.Success ? int.Parse(match.Value) : 0;
        }
        public Response InsertReceipt(ReceiptDto receiptDto)
        {
            Response response = new Response();
            try
            {
                if (!receiptDto.RecordBookDate.HasValue || !receiptDto.ImportDate.HasValue)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Ngày nhập và Ngày vào sổ không được để trống !"
                    };
                    return response;
                }
                else if (receiptDto.DocumentListId.Count == 0)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Danh sách sách không được để trống !"
                    };
                    return response;
                }

                Receipt receipt = new Receipt();
                receipt = _mapper.Map<Receipt>(receiptDto);
                _DbContext.Receipt.Add(receipt);

                //save date to table receipt detail
                for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                {
                    Document document = _DbContext.Document.Where(e =>
                    e.ID == receiptDto.DocumentListId[i].IdDocument).FirstOrDefault();

                    if (document == null)
                    {
                        continue;
                    }

                    ReceiptDetail receiptDetail = new ReceiptDetail()
                    {
                        IdReceiptDetail = Guid.NewGuid(),
                        IdDocument = receiptDto.DocumentListId[i].IdDocument,
                        DocumentName = document.DocName,
                        Quantity = receiptDto.DocumentListId[i].Quantity,
                        Price = receiptDto.DocumentListId[i].Price,
                        Total = receiptDto.DocumentListId[i].Price * receiptDto.DocumentListId[i].Quantity,
                        IdReceipt = receiptDto.IdReceipt,
                        IdPublisher = receiptDto.DocumentListId[i].IdPublisher,
                        NamePublisher = document.Publisher,
                        Note = receiptDto.DocumentListId[i].Note,
                        Status = 0,
                        CreatedDate = DateTime.Now.AddMilliseconds(i)
                    };
                    _DbContext.ReceiptDetail.Add(receiptDetail);
                    _DbContext.SaveChanges();

                }




                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }
        public Response InsertReceiptExportBooks(ReceiptDto receiptDto)
        {
            using var context = _DbContext;

            Response response = new Response();

            using var transaction = context.Database.BeginTransaction();

            try
            {
                if (!receiptDto.RecordBookDate.HasValue || !receiptDto.ExportDate.HasValue)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Ngày xuất và Ngày vào sổ không được để trống !"
                    };

                    transaction.Rollback();

                    return response;
                }
                else if (receiptDto.DocumentListId.Count == 0)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Danh sách sách không được để trống !"
                    };

                    transaction.Rollback();

                    return response;
                }

                List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.ToList();

                Receipt receipt = new Receipt();

                receipt = _mapper.Map<Receipt>(receiptDto);

                _DbContext.Receipt.Add(receipt);

                for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                {
                    Document document = _DbContext.Document.Where(e => e.ID == receiptDto.DocumentListId[i].IdDocument).FirstOrDefault();

                    if (document == null)
                    {
                        continue;
                    }

                    ReceiptDetail receiptDetail1 = receiptDetails.FirstOrDefault(e => e.IdDocument == receiptDto.DocumentListId[i].IdDocument && e.IdIndividualSample == receiptDto.DocumentListId[i].IdIndividualSample && e.IsDeleted == false);

                    if (receiptDetail1 != null)
                    {
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Tên sách: " + document.DocName + " có số mã cá biệt: " + receiptDetail1.IdIndividualSample + " đã tồn tại trong một phiếu xuất khác có trong hệ thống !"
                        };

                        transaction.Rollback();

                        return response;
                    }



                    ReceiptDetail receiptDetail = new ReceiptDetail()
                    {
                        IdReceiptDetail = Guid.NewGuid(),
                        IdDocument = receiptDto.DocumentListId[i].IdDocument,
                        DocumentName = document.DocName,
                        Quantity = 1,
                        Price = receiptDto.DocumentListId[i].Price,
                        Total = receiptDto.DocumentListId[i].Price,
                        IdReceipt = receiptDto.IdReceipt,
                        IdPublisher = Guid.Empty,
                        NamePublisher = document.Publisher,
                        Note = receiptDto.DocumentListId[i].Note,
                        Status = 0,
                        IdIndividualSample = receiptDto.DocumentListId[i].IdIndividualSample,
                        CreatedDate = receiptDto.CreatedDate,
                        StatusIndividual = receiptDto.DocumentListId[i].StatusIndividual

                    };

                    _DbContext.ReceiptDetail.Add(receiptDetail);

                }

                _DbContext.SaveChanges();

                transaction.Commit();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }
        public async Task<Response> UpdateReceipt(ReceiptDto receiptDto)
        {
            using var context = _DbContext;
            using var transaction = context.Database.BeginTransaction();

            Response response = new Response();

            try
            {
                if (!string.IsNullOrEmpty(receiptDto.ReceiptNumber))
                {
                    List<Receipt> receipts = await _DbContext.Receipt.Where(e => e.IdReceipt != receiptDto.IdReceipt && e.ReceiptNumber == receiptDto.ReceiptNumber && !e.IsDeleted).ToListAsync();

                    if (receipts.Count > 0)
                    {
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Số chứng từ này đã tồn tại trong 1 phiếu nhập khác!"
                        };
                        return response;
                    }
                }
                Receipt receipt = await _DbContext.Receipt.Where(e => e.IdReceipt == receiptDto.IdReceipt).FirstOrDefaultAsync();
                if (receipt is not null)
                {

                    // update receipt
                    receipt.Original = receiptDto.Original;
                    receipt.BookStatus = receiptDto.BookStatus;
                    receipt.Reason = receiptDto.Reason;
                    receipt.ReceiverName = receiptDto.ReceiverName;
                    receipt.ReceiverPosition = receiptDto.ReceiverPosition;
                    receipt.ReceiverUnitRepresent = receiptDto.ReceiverUnitRepresent;
                    receipt.DeliverName = receiptDto.DeliverName;
                    receipt.DeliverPosition = receiptDto.DeliverPosition;
                    receipt.DeliverUnitRepresent = receiptDto.DeliverUnitRepresent;
                    receipt.ReceiverIdUser = receiptDto.ReceiverIdUser;
                    receipt.CreatedDate = receiptDto.CreatedDate;
                    receipt.ImportDate = receiptDto.ImportDate;
                    receipt.ReceiptNumber = receiptDto.ReceiptNumber;



                    // lấy ra danh sách sách trong phiếu nhập
                    var listReceiptDetail = await _DbContext.ReceiptDetail.Where(e => e.IdReceipt == receiptDto.IdReceipt).ToListAsync();
                    string messageError = "";
                    foreach (var item in listReceiptDetail)
                    {
                        List<IndividualSample> individuals = await _DbContext.IndividualSample.Where(e => e.IdDocument == item.IdDocument && e.IdReceipt == item.IdReceipt).ToListAsync();

                        foreach (var individual in individuals)
                        {
                            bool anyDocumentInvoiceDetailExists = _DbContext.DocumentInvoiceDetail.Any(e => e.IdIndividual == individual.Id);

                            bool anyAuditBookListExists = _DbContext.AuditBookList.Any(e => e.IdIndividualSample == individual.Id);

                            if (anyAuditBookListExists)
                            {
                                messageError = "Cập nhật thành công thông tin phiếu, Danh sách các sách không cập nhật vì đã có phiếu kiểm kê phát sinh !";
                                break;
                            }
                            else if (anyDocumentInvoiceDetailExists)
                            {
                                messageError = "Cập nhật thành công thông tin phiếu, Danh sách các sách không cập nhật vì đã có phiếu mượn phát sinh !";
                                break;
                            }
                        }
                    }

                    if (!string.IsNullOrEmpty(messageError))
                    {
                        _DbContext.Receipt.Update(receipt);

                        await _DbContext.SaveChangesAsync();

                        transaction.Commit();

                        response = new Response()
                        {
                            Success = true,
                            Fail = true,
                            Message = messageError
                        };
                        return response;
                    }

                    receipt.RecordBookDate = receiptDto.RecordBookDate;

                    receipt.GeneralEntryNumber = receiptDto.GeneralEntryNumber ?? null;

                    _DbContext.Receipt.Update(receipt);


                    for (int i = 0; i < listReceiptDetail.Count; i++)
                    {
                        var individual = await _DbContext.IndividualSample.Where(e => e.IdDocument == listReceiptDetail[i].IdDocument && e.IdReceipt == listReceiptDetail[i].IdReceipt)
                            .ToListAsync();
                        _DbContext.IndividualSample.RemoveRange(individual);
                    }

                    _DbContext.ReceiptDetail.RemoveRange(listReceiptDetail);


                    //save new record to table receipt detail
                    for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                    {
                        Document document = await _DbContext.Document.Where(e => e.ID == receiptDto.DocumentListId[i].IdDocument).FirstOrDefaultAsync();

                        if (document == null)
                        {
                            continue;
                        }

                        ReceiptDetail receiptDetail = new ReceiptDetail()
                        {
                            IdReceiptDetail = Guid.NewGuid(),
                            IdDocument = receiptDto.DocumentListId[i].IdDocument,
                            IdReceipt = receiptDto.IdReceipt,
                            DocumentName = document.DocName,
                            Quantity = receiptDto.DocumentListId[i].Quantity,
                            Price = receiptDto.DocumentListId[i].Price,
                            Total = receiptDto.DocumentListId[i].Price * receiptDto.DocumentListId[i].Quantity,
                            IdPublisher = receiptDto.DocumentListId[i].IdPublisher,
                            NamePublisher = document.Publisher,
                            Note = receiptDto.DocumentListId[i].Note,
                            Status = 0,
                            CreatedDate = DateTime.Now,
                        };

                        var result = await _DbContext.ReceiptDetail.AddAsync(receiptDetail);
                    }

                    //update participants
                    var participants = await _DbContext.Participants.Where(e => e.IdReceipt == receipt.IdReceipt).ToListAsync();
                    _DbContext.Participants.RemoveRange(participants);

                    for (int i = 0; i < receiptDto.participants.Count; i++)
                    {
                        Participants participant = new Participants()
                        {
                            Id = Guid.NewGuid(),
                            IdReceipt = receiptDto.IdReceipt,
                            Name = receiptDto.participants[i].Name,
                            Position = receiptDto.participants[i].Position,
                            Mission = receiptDto.participants[i].Mission,
                            Note = receiptDto.participants[i].Note,
                            CreatedDate = DateTime.Now,
                            Status = 0
                        };
                        await _DbContext.Participants.AddAsync(participant);
                    }

                    await _DbContext.SaveChangesAsync();

                    transaction.Commit();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;



                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy ID !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
        public async Task<Response> UpdateReceiptExportBooks(ReceiptDto receiptDto)
        {
            using var context = _DbContext;

            using var transaction = context.Database.BeginTransaction();

            Response response = new Response();

            try
            {

                List<Receipt> receipts = await _DbContext.Receipt.ToListAsync();

                List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.ToList();


                if (receipts != null && receipts.Where(e => e.ReceiptNumber == receiptDto.ReceiptNumber && e.IdReceipt != receiptDto.IdReceipt && !e.IsDeleted).Count() > 0)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Số chứng từ này đã tồn tại trong 1 phiếu nhập khác!"
                    };
                    return response;
                }


                Receipt receipt = await _DbContext.Receipt.Where(e => e.IdReceipt == receiptDto.IdReceipt).FirstOrDefaultAsync();


                if (receipt == null)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy ID !"
                    };
                    transaction.Rollback();
                    return response;
                }
                else if (receipt.Status == 1)
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu đã được xuất, không thể chỉnh sửa được nữa !"
                    };
                    transaction.Rollback();
                    return response;
                }


                receipt.Original = receiptDto.Original;
                receipt.BookStatus = receiptDto.BookStatus;
                receipt.Reason = receiptDto.Reason;
                receipt.ReceiverName = receiptDto.ReceiverName;
                receipt.ReceiverPosition = receiptDto.ReceiverPosition;
                receipt.ReceiverUnitRepresent = receiptDto.ReceiverUnitRepresent;
                receipt.DeliverName = receiptDto.DeliverName;
                receipt.DeliverPosition = receiptDto.DeliverPosition;
                receipt.DeliverUnitRepresent = receiptDto.DeliverUnitRepresent;
                receipt.ReceiverIdUser = receiptDto.ReceiverIdUser;
                receipt.CreatedDate = receiptDto.CreatedDate;
                receipt.RecordBookDate = receiptDto.RecordBookDate;
                receipt.ReceiptNumber = receiptDto.ReceiptNumber;
                receipt.ExportDate = receiptDto.ExportDate;
                receipt.ImportDate = receiptDto.ImportDate;
                _DbContext.Receipt.Update(receipt);

                var listReceiptDetail = await _DbContext.ReceiptDetail.Where(e => e.IdReceipt == receiptDto.IdReceipt).ToListAsync();

                if (listReceiptDetail != null && listReceiptDetail.Count > 0) _DbContext.ReceiptDetail.RemoveRange(listReceiptDetail);

                for (int i = 0; i < receiptDto.DocumentListId.Count; i++)
                {
                    Document document = await _DbContext.Document.Where(e => e.ID == receiptDto.DocumentListId[i].IdDocument).FirstOrDefaultAsync();

                    if (document == null) continue;


                    ReceiptDetail receiptDetail1 = receiptDetails.FirstOrDefault(e => e.IdReceipt != receiptDto.IdReceipt && e.IdDocument == receiptDto.DocumentListId[i].IdDocument && e.IdIndividualSample == receiptDto.DocumentListId[i].IdIndividualSample && e.IsDeleted == false);

                    if (receiptDetail1 != null)
                    {
                        transaction.Rollback();

                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Tên sách: " + document.DocName + " có số mã cá biệt: " + receiptDetail1.IdIndividualSample + " đã tồn tại trong một phiếu xuất khác có trong hệ thống !"
                        };
                        return response;
                    }


                    ReceiptDetail receiptDetail = new ReceiptDetail()
                    {
                        IdReceiptDetail = Guid.NewGuid(),
                        IdDocument = receiptDto.DocumentListId[i].IdDocument,
                        DocumentName = document.DocName,
                        Quantity = receiptDto.DocumentListId[i].Quantity,
                        Price = receiptDto.DocumentListId[i].Price,
                        Total = receiptDto.DocumentListId[i].Price,
                        IdReceipt = receiptDto.IdReceipt,
                        IdPublisher = receiptDto.DocumentListId[i].IdPublisher,
                        NamePublisher = document.Publisher,
                        Note = receiptDto.DocumentListId[i].Note,
                        Status = 0,
                        CreatedDate = receiptDto.CreatedDate,
                        IdIndividualSample = receiptDto.DocumentListId[i].IdIndividualSample,
                    };

                    var result = await _DbContext.ReceiptDetail.AddAsync(receiptDetail);

                }

                var participants = await _DbContext.Participants.Where(e => e.IdReceipt == receipt.IdReceipt).ToListAsync();

                _DbContext.Participants.RemoveRange(participants);

                for (int i = 0; i < receiptDto.participants.Count; i++)
                {
                    Participants participant = new Participants()
                    {
                        Id = Guid.NewGuid(),
                        IdReceipt = receiptDto.IdReceipt,
                        Name = receiptDto.participants[i].Name,
                        Position = receiptDto.participants[i].Position,
                        Mission = receiptDto.participants[i].Mission,
                        Note = receiptDto.participants[i].Note,
                        CreatedDate = DateTime.Now,
                        Status = 0
                    };
                    await _DbContext.Participants.AddAsync(participant);
                }

                await _DbContext.SaveChangesAsync();

                transaction.Commit();

                return response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
        public ReceiptDto SearchReceipt(string code)
        {
            try
            {
                Receipt receipts = new Receipt();
                ReceiptDto receiptDtos = new ReceiptDto();

                receipts = _DbContext.Receipt.
                Where(e => e.IsDeleted == false && e.ReceiptCode == code)
                .FirstOrDefault();

                if (receipts != null)
                {
                    List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e =>
                    e.IdReceipt == receipts.IdReceipt).ToList();

                    receiptDtos = _mapper.Map<ReceiptDto>(receipts);
                    receiptDtos.ReceiptDetail = receiptDetails;
                }

                return receiptDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public Response ConfirmExportBooks(Guid idReceipt)
        {
            using var transaction = _DbContext.Database.BeginTransaction();
            try
            {
                Receipt receipt = _DbContext.Receipt.Where(e => e.IdReceipt == idReceipt && e.IsDeleted == false).FirstOrDefault();

                if (receipt == null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy ID Receipt !"
                    };
                }
                else if (receipt.Status == 1)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu đã được xuất !"
                    };
                }

                List<ReceiptDetail> receiptDetails = _DbContext.ReceiptDetail.Where(e => e.IdReceipt == idReceipt && e.IsDeleted == false).ToList();

                if (receiptDetails == null || receiptDetails.Count == 0)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu xuất này hiện tại chưa có sách, vui lòng thêm sách vào Phiếu xuất này !"
                    };
                }


                foreach (var item in receiptDetails)
                {

                    IndividualSample individualSample = _DbContext.IndividualSample.Where(e => e.Id == item.IdIndividualSample).FirstOrDefault();

                    string numIndividual = "";

                    if (individualSample == null)
                    {
                        transaction.Rollback();

                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Có lỗi khi tìm mã cá biệt của sách: " + item.DocumentName
                        };
                    }
                    else if (individualSample.IsDeleted == true)
                    {
                        transaction.Rollback();

                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Sách: " + item.DocumentName + " có mã cá biệt: " + individualSample.NumIndividual + " đã bị mất hoặc thanh lý khỏi hệ thống !"
                        };
                    }
                    else
                    {
                        if (individualSample.NumIndividual.Split("/").Length <= 0)
                        {
                            numIndividual = individualSample.NumIndividual;
                        }
                        else
                        {
                            numIndividual = individualSample.NumIndividual.Split("/")[0];
                        }

                        if (individualSample.IsDeleted == true)
                        {
                            transaction.Rollback();

                            return new Response()
                            {
                                Success = false,
                                Fail = true,
                                Message = "Sách: " + item.DocumentName + " có mã cá biệt: " + numIndividual + " đã bị mất hoặc thanh lý khỏi hệ thống !"
                            };
                        }
                    }
                    DocumentInvoiceDetail documentInvoiceDetail = _DbContext.DocumentInvoiceDetail.Where(e => e.IdDocument == item.IdDocument && e.IdIndividual == item.IdIndividualSample).FirstOrDefault();

                    if (documentInvoiceDetail != null && documentInvoiceDetail.IsCompleted == false)
                    {
                        transaction.Rollback();

                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Sách: " + item.DocumentName + " có mã cá biệt là: " + numIndividual + " đang có dữ liệu ở phiếu mượn, không thể xuất sách !"
                        };
                    }

                    //bool auditBookList = _DbContext.AuditBookList.Any(e =>
                    //    e.IdDocument == item.IdDocument &&
                    //    e.IdIndividualSample == item.IdIndividualSample &&
                    //    (e.IsLiquidation == true || e.WasLost == true));

                    //if (auditBookList)
                    //{
                    //    transaction.Rollback();

                    //    return new Response()
                    //    {
                    //        Success = false,
                    //        Fail = true,
                    //        Message = "Sách: " + item.DocumentName + " có mã cá biệt là: " + numIndividual + " đã bị mất hoặc thanh lý, không thể xuất sách !"
                    //    };
                    //}



                    individualSample.IsDeleted = true;

                    _DbContext.IndividualSample.Update(individualSample);
                }

                receipt.Status = 1;

                receipt.ExportDate = DateTime.Now;

                _DbContext.Receipt.Update(receipt);

                _DbContext.SaveChanges();

                transaction.Commit();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Xác nhận xuất sách thành công !"
                };
            }
            catch (Exception)
            {
                throw;
            }


        }


        public Tuple<DateTime, string> GetExportDateAndReceiptNumber(Guid idIndividualSample)
        {
            var result = new List<Tuple<DateTime, string>>();

            var getDataIndividualSample = (from rd in _DbContext.ReceiptDetail
                                           join r in _DbContext.Receipt on rd.IdReceipt equals r.IdReceipt
                                           where rd.IdIndividualSample == idIndividualSample && r.Status == 1 && r.ReceiptType == 1
                                           select new
                                           {
                                               r.ExportDate,
                                               r.ReceiptNumber,
                                               r.CreatedDate
                                           }).FirstOrDefault();

            if (getDataIndividualSample != null)
            {
                return new Tuple<DateTime, string>(getDataIndividualSample.ExportDate ?? getDataIndividualSample.CreatedDate ?? DateTime.Now, getDataIndividualSample.ReceiptNumber);
            }

            return new Tuple<DateTime, string>(DateTime.Now, null);
        }




        #endregion
    }




}
