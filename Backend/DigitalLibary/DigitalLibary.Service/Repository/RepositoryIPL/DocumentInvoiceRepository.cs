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
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class DocumentInvoiceRepository : IDocumentInvoiceRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors

        public DocumentInvoiceRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }

        #endregion

        #region CRUD TABLE DOCUMENTINVOICE

        public Response ChangeStatusDocumentInvoice(Guid id, int status)
        {
            try
            {
                var documentInvoice = _DbContext.DocumentInvoice.FirstOrDefault(x => x.Id == id);

                if (documentInvoice != null)
                {
                    if (status != 3)
                    {
                        documentInvoice.DateInReality = DateTime.Now;
                    }

                    var documentInvoiceDetails = _DbContext.DocumentInvoiceDetail
                        .Where(x => x.IdDocumentInvoice == id).ToList();

                    for (int i = 0; i < documentInvoiceDetails.Count; i++)
                    {
                        var sample =
                            _DbContext.IndividualSample.FirstOrDefault(e =>
                                e.Id == documentInvoiceDetails[i].IdIndividual);

                        if (sample != null)
                        {
                            if (status == 3)
                            {
                                sample.IsLostedPhysicalVersion = true;
                            }

                            sample.Status = status;
                            _DbContext.IndividualSample.Update(sample);
                        }

                        if (sample != null && sample.IsLostedPhysicalVersion == true)
                        {
                            sample.Status = 3;
                            _DbContext.IndividualSample.Update(sample);
                        }
                    }

                    documentInvoice.Status = status;
                    _DbContext.DocumentInvoice.Update(documentInvoice);

                    bool checkLostBook = false;
                    for (int j = 0; j < documentInvoiceDetails.Count; j++)
                    {
                        var individualSample = _DbContext.IndividualSample
                            .FirstOrDefault(e => e.Id == documentInvoiceDetails[j].IdIndividual);

                        if (individualSample != null && individualSample.IsLostedPhysicalVersion == true)
                        {
                            checkLostBook = true;
                            break;
                        }
                    }

                    if (checkLostBook)
                    {
                        documentInvoice.Status = 4;
                        _DbContext.DocumentInvoice.Update(documentInvoice);
                    }

                    _DbContext.SaveChanges();

                    return new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Thay đổi thành công !"
                    };
                }

                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy kết quả !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thay đổi không thành công !"
                };
            }
        }
        public CustomApiDocumentInvoiceDto GetDocumentInvoiceTest(int pageNumber, int pageSize)
        {
            try
            {
                var customApiDocumentInvoices = new CustomApiDocumentInvoiceDto();
                var documentInvoices = new List<DocumentInvoice>();
                var documentInvoiceDtos = new List<DocumentInvoiceDto>();


                //Hùng thêm biến total ở dto nên đang có thêm dòng này
                int total = _DbContext.DocumentInvoice.Count(e => e.Id != Guid.Empty);

                if (pageNumber == 0 && pageSize == 0)
                {
                    documentInvoices = _DbContext.DocumentInvoice.Where(e => e.Id != Guid.Empty)
                        .OrderByDescending(e => e.CreateDate)
                        .ToList();
                }
                else
                {
                    documentInvoices = _DbContext.DocumentInvoice.Where(e => e.Id != Guid.Empty)
                        .OrderByDescending(e => e.CreateDate)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                for (int i = 0; i < documentInvoices.Count; i++)
                {
                    var documentAndIndividuals = new List<DocumentAndIndividualView>();
                    var documentInvoiceDto = _mapper.Map<DocumentInvoiceDto>(documentInvoices[i]);

                    var documentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoices[i].Id).ToList();

                    for (int j = 0; j < documentInvoiceDetail.Count; j++)
                    {
                        var documentAndIndividual = new DocumentAndIndividualView
                        {
                            idDocument = (Guid)documentInvoiceDetail[j].IdDocument,
                            idIndividual = (Guid)documentInvoiceDetail[j].IdIndividual
                        };
                        documentAndIndividuals.Add(documentAndIndividual);
                    }

                    documentInvoiceDto.DocumentAndIndividualView = documentAndIndividuals;

                    documentInvoiceDto.DocumentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoices[i].Id).ToList();
                    documentInvoiceDto.Total = total;
                    documentInvoiceDtos.Add(documentInvoiceDto);
                }
                customApiDocumentInvoices.ListDocumentInvoice = documentInvoiceDtos;
                var userIds = _DbContext.DocumentInvoice.Select(X => X.UserId).Distinct(); // Lấy danh sách các UserId trong documentInvoiceDtos

                customApiDocumentInvoices.ListUser = _DbContext.User
                    .Where(user => userIds.Contains(user.Id)) // Lọc các user có Id nằm trong danh sách UserId đã lấy từ documentInvoiceDtos
                    .ToList(); // Chuyển kết quả thành danh sách

                return customApiDocumentInvoices;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<DocumentInvoiceDto> GetDocumentInvoice(int pageNumber, int pageSize)
        {
            try
            {
                var documentInvoices = new List<DocumentInvoice>();
                var documentInvoiceDtos = new List<DocumentInvoiceDto>();

                //Hùng thêm biến total ở dto nên đang có thêm dòng này
                int total = _DbContext.DocumentInvoice.Count(e => e.Id != Guid.Empty);

                if (pageNumber == 0 && pageSize == 0)
                {
                    documentInvoices = _DbContext.DocumentInvoice.Where(e => e.Id != Guid.Empty)
                        .OrderByDescending(e => e.CreateDate)
                        .ToList();
                }
                else
                {
                    documentInvoices = _DbContext.DocumentInvoice.Where(e => e.Id != Guid.Empty)
                        .OrderByDescending(e => e.CreateDate)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                for (int i = 0; i < documentInvoices.Count; i++)
                {
                    var documentAndIndividuals = new List<DocumentAndIndividualView>();
                    var documentInvoiceDto = _mapper.Map<DocumentInvoiceDto>(documentInvoices[i]);

                    var documentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoices[i].Id).ToList();

                    for (int j = 0; j < documentInvoiceDetail.Count; j++)
                    {
                        var documentAndIndividual = new DocumentAndIndividualView
                        {
                            idDocument = (Guid)documentInvoiceDetail[j].IdDocument,
                            idIndividual = (Guid)documentInvoiceDetail[j].IdIndividual
                        };
                        documentAndIndividuals.Add(documentAndIndividual);
                    }

                    documentInvoiceDto.DocumentAndIndividualView = documentAndIndividuals;

                    documentInvoiceDto.DocumentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoices[i].Id).ToList();
                    documentInvoiceDto.Total = total;
                    documentInvoiceDtos.Add(documentInvoiceDto);
                }

                return documentInvoiceDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public CustomApiDocumentInvoiceDto getAllDocumentInvoiceTest(SortAndSearchListDocumentInvoice sortAndSearchListDocumentInvoice)
        {
            try
            {
                List<DocumentInvoice> documentInvoice = new List<DocumentInvoice>();
                int countRecord = 0;

                documentInvoice = _DbContext.DocumentInvoice.OrderByDescending(e => e.CreateDate).ToList();

                countRecord = documentInvoice.Count();

                if (sortAndSearchListDocumentInvoice.userId != null)
                {
                    documentInvoice = documentInvoice
                       .Where(a => sortAndSearchListDocumentInvoice.userId.Contains(a.UserId))
                       .ToList();
                    countRecord = documentInvoice.Count();


                }

                if (sortAndSearchListDocumentInvoice.userCode != null)
                {

                    documentInvoice = documentInvoice
                       .Where(a => sortAndSearchListDocumentInvoice.userCode.Contains(a.UserId))
                       .ToList();

                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.invoiceCode != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                        sortAndSearchListDocumentInvoice.invoiceCode.Contains(a.InvoiceCode))
                        .ToList();
                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.createDate != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                        sortAndSearchListDocumentInvoice.createDate.Contains(a.CreateDate)).ToList();

                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.status != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                       sortAndSearchListDocumentInvoice.status.Contains(a.Status)).ToList();

                    countRecord = documentInvoice.Count();
                }

                if (!documentInvoice.Any())
                {
                    // Trả về danh sách trống
                    return new CustomApiDocumentInvoiceDto();
                }


                if (sortAndSearchListDocumentInvoice.sortOrder == "ascend")
                {
                    if (sortAndSearchListDocumentInvoice.sortField == "createdDate")
                    {
                        if (documentInvoice.Count == 0)
                        {
                            documentInvoice = documentInvoice
                                .OrderBy(e => e.CreateDate)
                                .ToList();
                        }
                    }
                }
                else
                {
                    if (sortAndSearchListDocumentInvoice.sortField == "createdDate")
                    {
                        if (documentInvoice.Count == 0)
                        {
                            documentInvoice = documentInvoice
                                .OrderByDescending(e => e.CreateDate)
                                .ToList();
                        }
                    }
                }



                List<DocumentInvoiceDto> result = new List<DocumentInvoiceDto>();



                result = _mapper.Map<List<DocumentInvoiceDto>>(documentInvoice);

                if (sortAndSearchListDocumentInvoice.page != 0 && sortAndSearchListDocumentInvoice.results != 0)
                {
                    if (sortAndSearchListDocumentInvoice.page < 0)
                    {
                        sortAndSearchListDocumentInvoice.page = 1;
                    }

                    result = result.Skip((sortAndSearchListDocumentInvoice.page - 1) * sortAndSearchListDocumentInvoice.results)
                        .Take(sortAndSearchListDocumentInvoice.results).ToList();
                }


                if (result.Any())
                {
                    result[0].Total = countRecord;
                }

                var ans = new CustomApiDocumentInvoiceDto();
                ans.ListDocumentInvoice = result;
                // Lấy danh sách các UserId trong documentInvoiceDtos
                var userIds = _DbContext.DocumentInvoice.Select(X => X.UserId).Distinct();
                ans.ListUser = _DbContext.User
                    .Where(user => userIds.Contains(user.Id)) // Lọc các user có Id nằm trong danh sách UserId đã lấy từ documentInvoiceDtos
                    .ToList(); // Chuyển kết quả thành danh sách
                return ans;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<DocumentInvoiceDto> getAllDocumentInvoice(SortAndSearchListDocumentInvoice sortAndSearchListDocumentInvoice)
        {
            try
            {
                List<DocumentInvoice> documentInvoice = new List<DocumentInvoice>();
                int countRecord = 0;

                documentInvoice = _DbContext.DocumentInvoice.OrderByDescending(e => e.CreateDate).ToList();

                countRecord = documentInvoice.Count();

                if (sortAndSearchListDocumentInvoice.userId != null)
                {
                    documentInvoice = documentInvoice
                       .Where(a => sortAndSearchListDocumentInvoice.userId.Contains(a.UserId))
                       .ToList();
                    countRecord = documentInvoice.Count();


                }

                if (sortAndSearchListDocumentInvoice.userCode != null)
                {

                    documentInvoice = documentInvoice
                       .Where(a => sortAndSearchListDocumentInvoice.userCode.Contains(a.UserId))
                       .ToList();

                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.invoiceCode != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                        sortAndSearchListDocumentInvoice.invoiceCode.Contains(a.InvoiceCode))
                        .ToList();
                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.createDate != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                        sortAndSearchListDocumentInvoice.createDate.Contains(a.CreateDate)).ToList();

                    countRecord = documentInvoice.Count();
                }

                if (sortAndSearchListDocumentInvoice.status != null)
                {
                    documentInvoice = documentInvoice.Where(a =>
                       sortAndSearchListDocumentInvoice.status.Contains(a.Status)).ToList();

                    countRecord = documentInvoice.Count();
                }

                if (!documentInvoice.Any())
                {
                    // Trả về danh sách trống
                    return new List<DocumentInvoiceDto>();
                }


                if (sortAndSearchListDocumentInvoice.sortOrder == "ascend")
                {
                    if (sortAndSearchListDocumentInvoice.sortField == "createdDate")
                    {
                        if (documentInvoice.Count == 0)
                        {
                            documentInvoice = documentInvoice
                                .OrderBy(e => e.CreateDate)
                                .ToList();
                        }
                    }
                }
                else
                {
                    if (sortAndSearchListDocumentInvoice.sortField == "createdDate")
                    {
                        if (documentInvoice.Count == 0)
                        {
                            documentInvoice = documentInvoice
                                .OrderByDescending(e => e.CreateDate)
                                .ToList();
                        }
                    }
                }



                List<DocumentInvoiceDto> result = new List<DocumentInvoiceDto>();



                result = _mapper.Map<List<DocumentInvoiceDto>>(documentInvoice);

                if (sortAndSearchListDocumentInvoice.page != 0 && sortAndSearchListDocumentInvoice.results != 0)
                {
                    if (sortAndSearchListDocumentInvoice.page < 0)
                    {
                        sortAndSearchListDocumentInvoice.page = 1;
                    }

                    result = result.Skip((sortAndSearchListDocumentInvoice.page - 1) * sortAndSearchListDocumentInvoice.results)
                        .Take(sortAndSearchListDocumentInvoice.results).ToList();
                }


                if (result.Any())
                {
                    result[0].Total = countRecord;
                }


                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public DocumentInvoiceDto GetDocumentInvoiceById(Guid Id)
        {
            try
            {
                var documentInvoice = _DbContext.DocumentInvoice
                    .FirstOrDefault(e => e.Id == Id);

                var documentInvoiceDto = _mapper.Map<DocumentInvoiceDto>(documentInvoice);

                if (documentInvoice != null)
                {
                    var documentAndIndividuals = new List<DocumentAndIndividualView>();

                    var documentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoice.Id).ToList();

                    for (int j = 0; j < documentInvoiceDetail.Count; j++)
                    {
                        var indi = _DbContext.IndividualSample.Where(x => x.Id == (Guid)documentInvoiceDetail[j].IdIndividual);
                        var documentAndIndividual = new DocumentAndIndividualView
                        {
                            idDocument = (Guid)documentInvoiceDetail[j].IdDocument,
                            idIndividual = (Guid)documentInvoiceDetail[j].IdIndividual,
                            numIndividual = indi.Select(x => x.NumIndividual).FirstOrDefault(),
                            status = indi.Select(x => x.Status).FirstOrDefault(),
                            isLostedPhysicalVersion = indi.Select(x => x.IsLostedPhysicalVersion).FirstOrDefault(),
                            docName = _DbContext.Document.Where(x => x.ID == (Guid)documentInvoiceDetail[j].IdDocument).Select(x => x.DocName).FirstOrDefault()
                        };
                        documentAndIndividuals.Add(documentAndIndividual);
                    }

                    documentInvoiceDto.DocumentAndIndividualView = documentAndIndividuals;
                    documentInvoiceDto.DocumentInvoiceDetail = _DbContext.DocumentInvoiceDetail
                        .Where(e => e.IdDocumentInvoice == documentInvoice.Id).ToList();
                }

                return documentInvoiceDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<DocumentInvoiceDetailDto> GetListDocumentInvoiceById(Guid Id)
        {
            try
            {
                var documentInvoices = _DbContext.DocumentInvoiceDetail
                    .Where(e => e.IdDocumentInvoice == Id)
                    .ToList();

                var documentInvoiceDtos = _mapper.Map<List<DocumentInvoiceDetailDto>>(documentInvoices);
                return documentInvoiceDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<DocumentInvoiceDto> getListBorrowLate(string fromDate, string toDate)
        {
            try
            {
                DateTime FromDate = new DateTime();
                DateTime ToDate = new DateTime();

                List<DocumentInvoice> documentInvoice;
                if (fromDate != null && toDate != null)
                {
                    FromDate = DateTime.Parse(fromDate, new CultureInfo("en-CA"));
                    ToDate = DateTime.Parse(toDate, new CultureInfo("en-CA"));

                    documentInvoice = _DbContext.DocumentInvoice.Where(e => e.DateInReality > e.DateIn && e.Status == 2
                            && e.CreateDate >= FromDate && e.CreateDate <= ToDate)
                        .ToList();
                }
                else
                {
                    documentInvoice = _DbContext.DocumentInvoice.Where(e => e.DateInReality > e.DateIn && e.Status == 2)
                        .ToList();
                }


                var documentInvoiceDtos = _mapper.Map<List<DocumentInvoiceDto>>(documentInvoice);
                return documentInvoiceDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response InsertDocumentInvoice(DocumentInvoiceDto documentInvoiceDto)
        {
            try
            {
                var documentInvoice = _mapper.Map<DocumentInvoice>(documentInvoiceDto);
                _DbContext.DocumentInvoice.Add(documentInvoice);

                for (int i = 0; i < documentInvoiceDto.DocumentAndIndividual.Count; i++)
                {
                    if (documentInvoiceDto.DocumentAndIndividual[i].idIndividual is not null)
                    {
                        for (int j = 0; j < documentInvoiceDto.DocumentAndIndividual[i].idIndividual.Count; j++)
                        {
                            var documentInvoiceDetail = new DocumentInvoiceDetail()
                            {
                                Id = Guid.NewGuid(),
                                IdDocument = documentInvoiceDto.DocumentAndIndividual[i].idDocument,
                                IdIndividual = documentInvoiceDto.DocumentAndIndividual[i].idIndividual[j],
                                Status = 0,
                                CreateBy = documentInvoiceDto.CreateBy,
                                CreateDate = DateTime.Now,
                                IdDocumentInvoice = documentInvoiceDto.Id,
                                DateIn = documentInvoiceDto.DateIn,
                                DateOut = documentInvoiceDto.DateOut,
                                DateInReality = documentInvoiceDto.DateInReality,
                                IsCompleted = false
                            };
                            _DbContext.DocumentInvoiceDetail.Add(documentInvoiceDetail);

                            var individualSample = _DbContext.IndividualSample.FirstOrDefault(e =>
                                e.Id == documentInvoiceDto.DocumentAndIndividual[i].idIndividual[j]);

                            if (individualSample != null)
                            {
                                individualSample.Status = 0;
                                _DbContext.IndividualSample.Update(individualSample);
                            }
                        }
                    }
                }

                _DbContext.SaveChanges();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
            }
        }

        public Response EditNoteContentDocumentInvoiceDetailById(Guid DocumentInvoiceDetailById, String NoteContent)
        {
            try
            {
                var documentInvoiceDetail = _DbContext.DocumentInvoiceDetail.Find(DocumentInvoiceDetailById);

                if (documentInvoiceDetail is null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công, có thể đã bị xóa !"
                    };
                }

                documentInvoiceDetail.Note = NoteContent;

                _DbContext.DocumentInvoiceDetail.Update(documentInvoiceDetail);
                _DbContext.SaveChanges();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
            }
        }


        public Response UpdateDocumentInvoice(DocumentInvoiceDto documentInvoiceDto)
        {
            try
            {
                var documentInvoice = _DbContext.DocumentInvoice.FirstOrDefault(e => e.Id == documentInvoiceDto.Id);

                if (documentInvoice is null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                }

                if (documentInvoice.DateOut >= documentInvoiceDto.DateIn)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Hạn trả sách không thể bé hơn ngày mượn !"
                    };
                }

                // define some col with data concrete
                documentInvoice.UserId = documentInvoiceDto.UserId;
                documentInvoice.DateOut = documentInvoiceDto.DateOut;
                documentInvoice.DateIn = documentInvoiceDto.DateIn;
                documentInvoice.DateInReality = documentInvoiceDto.DateInReality.HasValue
                    ? documentInvoiceDto.DateInReality
                    : documentInvoice.DateInReality;
                documentInvoice.Status = documentInvoiceDto.Status.HasValue
                    ? documentInvoiceDto.Status
                    : documentInvoice.Status;
                documentInvoice.Note = String.IsNullOrEmpty(documentInvoiceDto.Note)
                    ? documentInvoice.Note
                    : documentInvoiceDto.Note;

                _DbContext.DocumentInvoice.Update(documentInvoice);
                _DbContext.SaveChanges();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
            }
        }

        public List<CustomApiSearchDocumentInvoice> ListDocumentInvoice(string name)
        {
            try
            {
                var user = _DbContext.User.Where(e => e.Id != Guid.Empty
                                                      && e.IsDeleted == false
                                                      && e.IsLocked == false
                                                      && e.IsActive == true
                                                      && e.Fullname.ToLower().Trim().Contains(name.ToLower().Trim()))
                    .ToList();

                var documentInvoice = new List<CustomApiSearchDocumentInvoice>();
                for (int i = 0; i < user.Count; i++)
                {
                    var documentInvoiceItem = new CustomApiSearchDocumentInvoice();
                    var documents =
                        _DbContext.DocumentInvoice.Where(e => e.UserId == user[i].Id).ToList();

                    if (documents.Count > 0)
                    {
                        documentInvoiceItem.documentInvoices = documents;
                        documentInvoiceItem.NameUser = user[i].Fullname;
                        documentInvoiceItem.IdUser = user[i].Id.ToString();
                        documentInvoiceItem.Email = user[i].Email;

                        documentInvoice.Add(documentInvoiceItem);
                    }
                }

                return documentInvoice;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<DocumentInvoiceDto> GetDocumentInvoiceByStatus(int status)
        {
            try
            {
                var documentInvoices = _DbContext.DocumentInvoice
                    .Where(e => e.Status == status)
                    .ToList();
                var documentInvoiceDtos = _mapper.Map<List<DocumentInvoiceDto>>(documentInvoices);
                return documentInvoiceDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<DocumentInvoiceDetailDto> GetDocumentInvoiceDetailByIdDocumentIncoice(Guid id)
        {
            try
            {
                var documentInvoiceDetails = _DbContext.DocumentInvoiceDetail
                    .Where(e => e.IdDocumentInvoice == id)
                    .ToList();
                var documentInvoiceDtos = _mapper.Map<List<DocumentInvoiceDetailDto>>(documentInvoiceDetails);
                return documentInvoiceDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response ChangeStatusCompleteInvoice(Guid id)
        {
            try
            {
                try
                {
                    var documentInvoice =
                        _DbContext.DocumentInvoice.FirstOrDefault(x => x.Id == id);

                    if (documentInvoice != null)
                    {
                        documentInvoice.IsCompleted = true;
                        _DbContext.DocumentInvoice.Update(documentInvoice);
                        _DbContext.SaveChanges();

                        return new Response()
                        {
                            Success = true,
                            Fail = false,
                            Message = "Thay đổi thành công !"
                        };
                    }

                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy kết quả !"
                    };
                }
                catch (Exception)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Thay đổi không thành công !"
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion

        #region DocumentInvoice Ver2

        public async Task<Response> ExtendPeriodOfInvoice(List<Guid> idsDocumentInvoiceDetail, string extendDay)
        {
            var documentInvoiceDetail =
                await _DbContext.DocumentInvoiceDetail.Where(e =>
                    idsDocumentInvoiceDetail.Contains(e.Id)).ToListAsync();

            if (documentInvoiceDetail.Exists(e => e.IsCompleted == true))
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Đã có sách mất hoặc đã trả không thể gia hạn !"
                };
            }

            if (documentInvoiceDetail.Count == 0)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu !"
                };
            }

            var dateOut =
                DateTime.ParseExact(extendDay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            foreach (var item in documentInvoiceDetail)
            {
                item.DateOut = dateOut;
                _DbContext.DocumentInvoiceDetail.Update(item);
            }

            await _DbContext.SaveChangesAsync();

            return new Response()
            {
                Success = true,
                Fail = false,
                Message = "Thay đổi thành công !"
            };
        }

        public async Task<Response> ChangeStatusDocumentInvoiceVer2(List<Guid> idsDocumentInvoiceDetail, int status)
        {
            var documentInvoices = await _DbContext.DocumentInvoice
                .Where(e => e.IsCompleted == false)
                .ToListAsync();
            var documentInvoicesDetails = await _DbContext.DocumentInvoiceDetail.ToListAsync();
            var individualSample = await _DbContext.IndividualSample
                .Where(e => e.IsDeleted == false)
                .ToListAsync();

            var documentInvoiceDetailByListId =
                documentInvoicesDetails
                    .Where(e => idsDocumentInvoiceDetail
                        .Contains(e.Id))
                    .ToList();

            if (documentInvoiceDetailByListId.Count == 0)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Không tìm thấy dữ liệu !"
                };
            }

            if (documentInvoiceDetailByListId.Exists(e => e.IsCompleted == true))
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Đã có sách mất hoặc đã trả không thể thao tác !"
                };
            }

            const int statusReturnBook = 1;
            const int statusAnnounceLostBook = 3;
            foreach (var item in documentInvoiceDetailByListId)
            {
                item.IsCompleted = true;
                item.DateInReality = status == statusReturnBook ? DateTime.Now : null;
                _DbContext.DocumentInvoiceDetail.Update(item);

                var tempIndividualSample =
                    individualSample
                        .FirstOrDefault(e => e.Id == item.IdIndividual);
                if (tempIndividualSample is null) continue;

                switch (status)
                {
                    case statusReturnBook:
                        tempIndividualSample.Status = 1;
                        break;
                    case statusAnnounceLostBook:
                        tempIndividualSample.Status = 3;
                        tempIndividualSample.IsLostedPhysicalVersion = true;
                        break;
                }

                _DbContext.IndividualSample.Update(tempIndividualSample);
            }

            var listIdDocumentInvoice =
                documentInvoiceDetailByListId
                    .Select(item => item.IdDocumentInvoice)
                    .Distinct()
                    .ToList();

            const int outOfExpireBookStatus = 2;
            const int lostBookStatus = 4;
            foreach (var item in listIdDocumentInvoice)
            {
                var tempDocumentInvoice = documentInvoices
                    .FirstOrDefault(e => e.Id == item);
                var tempDocumentInvoiceDetails = documentInvoicesDetails
                    .Where(e => e.IdDocumentInvoice == item)
                    .ToList();
                var tempIndividualSample = individualSample
                    .Where(e => tempDocumentInvoiceDetails
                        .Select(e => e.IdIndividual)
                        .Contains(e.Id)).ToList();

                if (tempDocumentInvoiceDetails
                    .Exists(e => e.IsCompleted == false))
                {
                    continue;
                }

                if (tempDocumentInvoice is null)
                {
                    continue;
                }

                var checkOutOfExpire = tempDocumentInvoiceDetails
                    .Exists(e => e.DateInReality > e.DateOut);
                var checkLostBook = tempIndividualSample
                    .Exists(e => e.IsLostedPhysicalVersion == true);

                tempDocumentInvoice.Status = statusReturnBook;

                if (checkOutOfExpire)
                {
                    tempDocumentInvoice.Status = outOfExpireBookStatus;
                }

                if (checkLostBook)
                {
                    tempDocumentInvoice.Status = lostBookStatus;
                }

                tempDocumentInvoice.IsCompleted = true;
                tempDocumentInvoice.DateInReality = DateTime.Now;
                _DbContext.DocumentInvoice.Update(tempDocumentInvoice);
            }

            await _DbContext.SaveChangesAsync();

            return new Response()
            {
                Success = true,
                Fail = false,
                Message = "Thay đổi thành công !"
            };
        }

        public DocumentInvoiceDetailDto GetDocumentInvoiceDetailById(Guid Id)
        {
            try
            {
                DocumentInvoiceDetail result = new DocumentInvoiceDetail();
                result = _DbContext.DocumentInvoiceDetail.Where(e => e.Id == Id).FirstOrDefault();

                DocumentInvoiceDetailDto documentInvoiceDetailDto = new DocumentInvoiceDetailDto();
                if (result != null)
                {
                    documentInvoiceDetailDto = _mapper.Map<DocumentInvoiceDetailDto>(result);
                }

                return documentInvoiceDetailDto;
            }
            catch (Exception)
            {
                throw;
            }
        }



        #endregion
    }
}