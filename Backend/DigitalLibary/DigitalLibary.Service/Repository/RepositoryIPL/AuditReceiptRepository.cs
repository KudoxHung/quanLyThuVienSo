using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Queries;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class AuditReceiptRepository : IAuditReceiptRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        #endregion

        #region Constructors

        public AuditReceiptRepository(DataContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        #endregion

        #region METHOD

        private string GetSortableString(string str)
        {
            int slashIndex = str.IndexOf('/');
            string charsBeforeNumber = str.Substring(0, slashIndex);
            string numbersBeforeSlash = str.Substring(slashIndex + 1).Split('/')[0];

            return charsBeforeNumber + numbersBeforeSlash;
        }

        #endregion

        #region CRUD TABLE AuditReceipt

        public Response DeleteAuditReceipt(Guid idAuditReceipt)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                #region AuditorList

                var auditorList = _dbContext.AuditorList.Where(e => e.IdAuditReceipt == idAuditReceipt).ToList();

                _dbContext.AuditorList.RemoveRange(auditorList);
                context.SaveChanges();

                #endregion

                #region AuditBookList

                var auditBookList = _dbContext.AuditBookList.Where(e => e.IdAuditReceipt == idAuditReceipt).ToList();

                _dbContext.AuditBookList.RemoveRange(auditBookList);
                context.SaveChanges();

                #endregion

                #region AuditReceipt

                var auditReceipt = _dbContext.AuditReceipt.Find(idAuditReceipt);
                if (auditReceipt == null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu kiểm cần xóa !"
                    };
                }

                _dbContext.AuditReceipt.Remove(auditReceipt);
                context.SaveChanges();

                #endregion

                transaction.Commit();
                return new Response() { Success = true, Fail = false, Message = "Xóa thành công !" };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public Response DeleteAuditReceiptByList(List<Guid> IdAuditReceipt)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {


                var auditReceiptByListId = _dbContext.AuditReceipt.Where(e => IdAuditReceipt.Contains(e.Id));

                if (auditReceiptByListId.Any(e => e.Status == 1))
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này đã thanh lý không thể xóa !"
                    };
                }

                

                #region IndividualSample
                var result = (from ar in _dbContext.AuditReceipt
                             join abl in _dbContext.AuditBookList
                             on ar.Id equals abl.IdAuditReceipt
                             where IdAuditReceipt.Contains(ar.Id)
                             select new
                             {
                                 IdIndividualSample = abl.IdIndividualSample,
                                 AuditReceiptId = ar.Id
                             }).ToList();
                Console.WriteLine(result.Count());

                foreach (var item in result)
                {
                    var individualSample = _dbContext.IndividualSample.Where(x => x.Id== item.IdIndividualSample).FirstOrDefault();
                
                    if (individualSample!=null)
                    {
                        bool check = true;

                        var tmp = _dbContext.AuditBookList
                            .Where(x => x.IdIndividualSample == item.IdIndividualSample)
                            .OrderByDescending(x => x.CreatedDate) // Sắp xếp theo CreatedDate giảm dần
                            .FirstOrDefault(); // Lấy dòng đầu tiên (gần nhất)
                        if (tmp != null && tmp.IdAuditReceipt != item.AuditReceiptId)
                        {
                            check =false;

                        }
                        if (check)
                        {
                            if (individualSample.CheckUpdateIsLostedPhysicalVersion != 1)
                            {
                                individualSample.IsLostedPhysicalVersion= false;
                            }

                            //Cập nhật lại cột statusindividual cho bảng ReceiptDetail
                            var receiptDetailsToUpdate = _dbContext.ReceiptDetail
                            .Where(x => x.IdIndividualSample == individualSample.Id)
                            .ToList();

                            // Cập nhật giá trị cho cột StatusIndividual
                            foreach (var receiptDetail in receiptDetailsToUpdate)
                            {
                                receiptDetail.StatusIndividual = "Còn nguyên vẹn"; // Gán giá trị mới cho StatusIndividual
                            }

                            // Lưu thay đổi vào cơ sở dữ liệu
                            _dbContext.SaveChanges();
                        }
                    }
                }
                _dbContext.SaveChanges();
                #endregion

                #region AuditorList

                var listOfIds = String.Join(',', IdAuditReceipt.Select(id => $"'{id}'").ToList());
                var sql = $@"DELETE AuditorList WHERE IdAuditReceipt in ({listOfIds})";

                _dbContext.Database.ExecuteSqlRaw(sql);
                context.SaveChanges();

                #endregion

                #region AuditBookList

                sql = $@"DELETE AuditBookList WHERE IdAuditReceipt in ({listOfIds})";

                _dbContext.Database.ExecuteSqlRaw(sql);
                context.SaveChanges();

                #endregion

                #region AuditReceipt

                var auditReceipts = _dbContext.AuditReceipt.Where(ar => IdAuditReceipt.Contains(ar.Id)).ToList();
                if (!auditReceipts.Any())
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu kiểm cần xóa !"
                    };
                }

                _dbContext.AuditReceipt.RemoveRange(auditReceipts);
                context.SaveChanges();

                #endregion

              


                transaction.Commit();
                return new Response() { Success = true, Fail = false, Message = "Xóa thành công !" };
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public IEnumerable<AuditReceiptDto> GetAllAuditReceipt(int pageNumber, int pageSize, string ReportCreateDate,
            string ReportToDate)
        {
            var auditReceipts = _dbContext.AuditReceipt.OrderByDescending(e => e.CreatedDate).ToList();

            if (ReportCreateDate != null || ReportToDate != null)
            {
                var reportCreateDate = ReportCreateDate != null
                    ? DateTime.ParseExact(ReportCreateDate, "dd/MM/yyyy", CultureInfo.InvariantCulture).AddHours(23)
                    : (DateTime?)null;
                var reportToDate = ReportToDate != null
                    ? DateTime.ParseExact(ReportToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture).AddHours(23)
                    : (DateTime?)null;

                auditReceipts = _dbContext.AuditReceipt
                    .Where(e => (reportCreateDate == null || e.ReportCreateDate >= reportCreateDate) &&
                                (reportToDate == null || e.ReportToDate <= reportToDate))
                    .OrderByDescending(e => e.CreatedDate)
                    .ToList();
            }

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                auditReceipts = auditReceipts.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            var result = new List<AuditReceiptDto>();
            result = _mapper.Map<List<AuditReceiptDto>>(auditReceipts);

            return result;
        }

        public DataOfOneIdAuditReceipt GetAuditReceiptById(Guid idAuditReceipt)
        {
            var dataOfOneIdAuditReceipt = new DataOfOneIdAuditReceipt();

            var auditBookData = _dbContext.DataDocumentAndAuditBookListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditBookListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            if (auditBookData.Any())
            {
                dataOfOneIdAuditReceipt.Datas = auditBookData;
            }

            var auditorData = _dbContext.AuditorListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditorListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            if (auditorData.Any())
            {
                dataOfOneIdAuditReceipt.DataAuditor = auditorData;
            }

            var getAuditReceiptById = _dbContext.AuditReceipt.Find(idAuditReceipt);
            dataOfOneIdAuditReceipt.IdAuditReceipt = idAuditReceipt;
            dataOfOneIdAuditReceipt.ReportCreateDate = getAuditReceiptById.ReportCreateDate;
            dataOfOneIdAuditReceipt.ReportToDate = getAuditReceiptById.ReportCreateDate;
            dataOfOneIdAuditReceipt.Note = getAuditReceiptById.Note;
            dataOfOneIdAuditReceipt.IdAuditMethod = getAuditReceiptById.IdAuditMethod;

            return dataOfOneIdAuditReceipt;
        }

        public GroupDataOfOneIdAuditReceipt GetAuditReceiptByIdForLiquid(Guid idAuditReceipt)
        {
            var dataOfOneIdAuditReceipt = new GroupDataOfOneIdAuditReceipt();

            var auditBookData = _dbContext.DataDocumentAndAuditBookListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditBookListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            if (auditBookData.Any())
            {
                var groupAuditBookData = auditBookData
                    .GroupBy(g => g.IdBook)
                    .Select(g => new AuditBookListByIdDocument()
                    {
                        DocumentId = g.Key,
                        BookName = g.FirstOrDefault()?.BookName,
                        TypeBook = g.FirstOrDefault()?.TypeBook,
                        IdTypeBook = g.FirstOrDefault()?.IdTypeBook,
                        Price = g.FirstOrDefault(e => e.IsLiquidation is not null)?.Price,
                        Author = g.FirstOrDefault()?.Author,
                        Note = g.FirstOrDefault()?.Note,
                        IdStatusBook = g.FirstOrDefault()?.IdStatusBook,
                        Data = g.Select(x => new DataDocumentAndAuditBookListByIdAuditReceipt
                        {
                            IdBook = x.IdBook,
                            BookName = x.BookName,
                            Price = x.Price,
                            Author = x.Author,
                            NumIndividual = x.NumIndividual,
                            IdIndividual = x.IdIndividual,
                            WasLost = x.WasLost,
                            Redundant = x.Redundant,
                            IsLiquidation = x.IsLiquidation,
                            IdStatusBook = x.IdStatusBook,
                            NameStatusBook = x.NameStatusBook,
                            Note = x.Note
                        }).ToList()
                    })
                    .ToList();

                dataOfOneIdAuditReceipt.Data = groupAuditBookData;
            }

            var auditorData = _dbContext.AuditorListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditorListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            if (auditorData.Any())
            {
                dataOfOneIdAuditReceipt.DataAuditor = auditorData;
            }

            var getAuditReceiptById = _dbContext.AuditReceipt.Find(idAuditReceipt);

            dataOfOneIdAuditReceipt.IdAuditReceipt = idAuditReceipt;
            dataOfOneIdAuditReceipt.Status = getAuditReceiptById.Status;
            dataOfOneIdAuditReceipt.AuditNumber = getAuditReceiptById.AuditNumber;
            dataOfOneIdAuditReceipt.CreatedDate = getAuditReceiptById.CreatedDate;
            dataOfOneIdAuditReceipt.ReportCreateDate = getAuditReceiptById.ReportCreateDate;
            dataOfOneIdAuditReceipt.ReportToDate = getAuditReceiptById.ReportCreateDate;
            dataOfOneIdAuditReceipt.IdAuditMethod = getAuditReceiptById.IdAuditMethod;

            return dataOfOneIdAuditReceipt;
        }

        public Response InsertAuditReceipt(AuditReceiptDto auditReceiptDto)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                #region AuditReceipt

                // Map the auditReceiptDto object to an AuditReceipt object using the mapper
                var auditReceipt = _mapper.Map<AuditReceipt>(auditReceiptDto);

                // Set the CreatedDate and Status properties of the AuditReceipt object to the current date and a default value (0), respectively
                auditReceipt.CreatedDate = DateTime.Now;
                auditReceipt.Status = 0;

                // Generate a new Guid for the Id property of the AuditReceipt object
                auditReceipt.Id = Guid.NewGuid();
                auditReceipt.TotalBook = _dbContext.Document.Count(e => e.IsDeleted == false);

                // Retrieve the maximum AuditNumber value from the AuditReceipt table in the database, sorted in descending order
                var maxAuditNumber = _dbContext.AuditReceipt
                    .OrderByDescending(e => e.CreatedDate)
                    .Select(e => e.AuditNumber)
                    .FirstOrDefault();

                // If a maximum AuditNumber value was found, parse it to extract the numeric part (after the "pkk" prefix) and increment it by 1
                // Otherwise, set the currentNumber to 0
                var currentNumber = maxAuditNumber != null ? int.Parse(maxAuditNumber.Substring(3)) : 0;

                // Set the AuditNumber property of the AuditReceipt object to the incremented value with the "pkk" prefix
                auditReceipt.AuditNumber = $"PKK{currentNumber + 1}";

                _dbContext.AuditReceipt.Add(auditReceipt);
                context.SaveChanges();

                #endregion

                #region AuditorList

                // Use the mapper and LINQ's Select method to map the list of AuditorModels in the auditReceiptDto object to a list of AuditorList objects,
                // setting the CreatedDate, Status, and Id properties of each object to the current date, a default value (0), and a new Guid, respectively
                var auditorList = auditReceiptDto.AuditorModels
                    .Select(a => _mapper.Map<AuditorList>(a))
                    .Select(a =>
                    {
                        a.CreatedDate = DateTime.Now;
                        a.Id = Guid.NewGuid();
                        a.IdAuditReceipt = auditReceipt.Id;
                        a.IdUser = null;
                        return a;
                    })
                    .ToList();

                // Add the list of AuditorList objects to the AuditorList table in the database
                _dbContext.AuditorList.AddRange(auditorList);
                context.SaveChanges();

                #endregion

                #region AuditBookList

                // Use LINQ's Select method to map the list of AuditBookListPayloads to a list of AuditBookList objects using the mapper,
                // and set the CreatedDate, Status, and Id properties of each object to the current date, a default value (0), and a new Guid, respectively
                var auditBookList = auditReceiptDto.AuditBookListPayloads
                    .Select(a => _mapper.Map<AuditBookList>(a))
                    .Select(a =>
                    {
                        a.CreatedDate = DateTime.Now;
                        a.Status = 0;
                        a.Id = Guid.NewGuid();
                        a.IdAuditReceipt = auditReceipt.Id;
                        return a;
                    })
                    .ToList();

                // Add the list of AuditBookList objects to the AuditBookList table in the database
                _dbContext.AuditBookList.AddRange(auditBookList);
                context.SaveChanges();

                #endregion

                #region Individual

                var listIdIndividual = auditBookList.Where(e => e.WasLost == true).Select(e => e.IdIndividualSample)
                    .ToList();
                if (listIdIndividual.Any())
                {
                    var listOfIds = String.Join(',', listIdIndividual.Select(id => $"'{id}'").ToList());
                    var sql = $@"UPDATE IndividualSample SET IsLostedPhysicalVersion = 1 WHERE Id in ({listOfIds})";

                    _dbContext.Database.ExecuteSqlRaw(sql);
                    context.SaveChanges();
                }

                #endregion

                transaction.Commit();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public Response UpdateAuditReceipt(Guid idAuditReceipt, AuditReceiptDto auditReceiptDto)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                var auditReceiptByListId = _dbContext.AuditReceipt.FirstOrDefault(e => e.Id == idAuditReceipt);

                if (auditReceiptByListId?.Status == 1)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Phiếu này đã thanh lý không thể chỉnh sửa !"
                    };
                }

                #region AuditReceipt

                var auditReceipt = _dbContext.AuditReceipt.Find(idAuditReceipt);
                if (auditReceipt == null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy phiếu kiểm cần cập nhật !"
                    };
                }

                auditReceipt.ReportToDate = auditReceiptDto.ReportToDate;
                auditReceipt.ReportCreateDate = auditReceiptDto.ReportCreateDate;
                auditReceipt.Note = auditReceiptDto.Note;
                auditReceipt.IdAuditMethod = auditReceiptDto.IdAuditMethod;

                _dbContext.AuditReceipt.Update(auditReceipt);
                context.SaveChanges();

                #endregion

                #region AuditorList

                //delete table AuditorList before insert new row
                var auditorList = _dbContext.AuditorList.Where(e => e.IdAuditReceipt == idAuditReceipt).ToList();
                _dbContext.AuditorList.RemoveRange(auditorList);
                context.SaveChanges();

                // Use the mapper and LINQ's Select method to map the list of AuditorModels in the auditReceiptDto object to a list of AuditorList objects,
                // setting the CreatedDate, Status, and Id properties of each object to the current date, a default value (0), and a new Guid, respectively
                auditorList = auditReceiptDto.AuditorModels
                    .Select(a => _mapper.Map<AuditorList>(a))
                    .Select(a =>
                    {
                        a.CreatedDate = DateTime.Now;
                        a.Id = Guid.NewGuid();
                        a.IdAuditReceipt = auditReceipt.Id;
                        a.IdUser = null;
                        return a;
                    })
                    .ToList();

                // Add the list of AuditorList objects to the AuditorList table in the database
                _dbContext.AuditorList.AddRange(auditorList);
                context.SaveChanges();

                #endregion

                #region AuditBookList

                //delete table AuditBookList before insert new row
                var auditBookList = _dbContext.AuditBookList.Where(e => e.IdAuditReceipt == idAuditReceipt).ToList();
                _dbContext.AuditBookList.RemoveRange(auditBookList);
                context.SaveChanges();

                // Use LINQ's Select method to map the list of AuditBookListPayloads to a list of AuditBookList objects using the mapper,
                // and set the CreatedDate, Status, and Id properties of each object to the current date, a default value (0), and a new Guid, respectively
                auditBookList = auditReceiptDto.AuditBookListPayloads
                    .Select(a => _mapper.Map<AuditBookList>(a))
                    .Select(a =>
                    {
                        a.CreatedDate = DateTime.Now;
                        a.Status = 0;
                        a.Id = Guid.NewGuid();
                        a.IdAuditReceipt = auditReceipt.Id;
                        return a;
                    })
                    .ToList();

                // Add the list of AuditBookList objects to the AuditBookList table in the database
                _dbContext.AuditBookList.AddRange(auditBookList);
                context.SaveChanges();

                #endregion

                #region Individual

                // [Hùng] khi kiểm kê sửa lại tình trạng của cuốn sách thì cập nhhaajt lại trong bảng
                // Individual lấy ra những cuốn mất, và sửa lại thành mất bản vật lí

                var listIdIndividual = auditReceiptDto.AuditBookListPayloads.Where(e => e.WasLost == true)
                    .Select(e => e.IdIndividualSample).ToList();
                if (listIdIndividual.Any())
                {
                    var listOfIds = String.Join(',', listIdIndividual.Select(id => $"'{id}'").ToList());
                    var sql = $@"UPDATE IndividualSample SET IsLostedPhysicalVersion = 1 WHERE Id in ({listOfIds})";

                    _dbContext.Database.ExecuteSqlRaw(sql);
                    context.SaveChanges();
                }

                // [Hùng] khi kiểm kê sửa lại tình trạng của cuốn sách thì cập nhhaajt lại trong bảng
                // Individual lấy ra những cuốn còn, và sửa lại thành còn bản vật lí
                listIdIndividual = auditReceiptDto.AuditBookListPayloads.Where(e => e.WasLost == false)
                    .Select(e => e.IdIndividualSample).ToList();
                if (listIdIndividual.Any())
                {
                    var listOfIds = String.Join(',', listIdIndividual.Select(id => $"'{id}'").ToList());
                    var sql = $@"UPDATE IndividualSample SET IsLostedPhysicalVersion = 0 WHERE Id in ({listOfIds})";

                    _dbContext.Database.ExecuteSqlRaw(sql);
                    context.SaveChanges();
                }

                #endregion

                transaction.Commit();
                return new Response() { Success = true, Fail = false, Message = "Cập nhật thành công !" };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public CustomApiAuditReceipt GetDataBookByBarcode(string barcode)
        {
            var customApiAuditReceipt = new CustomApiAuditReceipt();

            var individualSample = _dbContext.IndividualSample.FirstOrDefault(e => e.Barcode == barcode
                && e.IsDeleted == false &&
                e.IsLostedPhysicalVersion == false
                && e.Status == 1);
            if (individualSample is null) return customApiAuditReceipt;

            var document = _dbContext.Document
                .FirstOrDefault(e => e.ID == individualSample.IdDocument && e.IsDeleted == false);
            if (document is null) return customApiAuditReceipt;

            var documentType =
                _dbContext.DocumentType.FirstOrDefault(e => e.IsDeleted == false && e.Id == document.DocumentTypeId);
            if (documentType is null) return customApiAuditReceipt;

            return new CustomApiAuditReceipt
            {
                IdBook = document.ID,
                BookName = document.DocName,
                Price = individualSample.Price ?? document.Price ?? 0,
                IdTypeBook = document.DocumentTypeId,
                TypeBook = documentType.DocTypeName,
                NumIndividual = individualSample.NumIndividual,
                IdIndividual = individualSample.Id
            };
        }

        public Tuple<string, string> GetUnitAndTypeOfUser(Guid IdUser)
        {
            var user = _dbContext.User.Find(IdUser);
            if (user is null) return new Tuple<string, string>("", "");

            var unit = _dbContext.Unit.Where(e => e.Id == user.UnitId).Select(e => e.UnitName).FirstOrDefault();
            if (unit is null) return new Tuple<string, string>("", "");

            var type = _dbContext.UserType.Where(e => e.Id == user.UserTypeId).Select(e => e.TypeName).FirstOrDefault();
            if (type is null) return new Tuple<string, string>("", "");

            return new Tuple<string, string>(unit.ToString(), type.ToString());
        }
         public bool CheckDocumentInvoice(List<LiquidationBook> liquidationBooks)
        {
            List<Guid> listIdIndi = liquidationBooks.SelectMany(x => x.IdIndividual ).ToList();
            var tmp=_dbContext.DocumentInvoiceDetail.Where(x => listIdIndi.Contains(x.IdIndividual) && x.IsCompleted == false).ToList();
            return tmp.Count > 0;
        }
        public Response LiquidationAuditReceiptByListId(List<LiquidationBook> liquidationBooks)
        {
            using var context = _dbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                #region AuditBookList

                var updateCommands = new List<string>();

                foreach (var item in liquidationBooks)
                {
                    updateCommands.AddRange(item.IdIndividual.Select(subItem =>
                        $@"UPDATE AuditBookList SET IsLiquidation = 1, Note = N'{item.Note}', Price = '{item.Price}' WHERE IdIndividualSample = '{subItem}' and IdAuditReceipt = '{item.IdAuditReceipt}'"));
                }

                var updateBatchCommand = string.Join(";", updateCommands);
                _dbContext.Database.ExecuteSqlRaw(updateBatchCommand);
                _dbContext.SaveChanges();

                #endregion

                #region IndividualSample

                var idIndividualList = liquidationBooks
                    .SelectMany(item => item.IdIndividual)
                    .ToList();

                var listOfIdsIndividual =
                    _dbContext.IndividualSample.Where(e => idIndividualList.Contains(e.Id)).ToList();

                var liquidatedIndividual = _mapper.Map<List<LiquidatedIndividualSample>>(listOfIdsIndividual);
                liquidatedIndividual.ForEach(e => e.CreatedDate = DateTime.Now);
                _dbContext.LiquidatedIndividualSample.AddRange(liquidatedIndividual);

                context.SaveChanges();

                foreach (var entity in listOfIdsIndividual)
                {
                    entity.IsDeleted = true;
                }

                context.SaveChanges();

                #endregion

                #region AuditReceipt

                if (idIndividualList.Any())
                {
                    var auditReceipt =
                        _dbContext.AuditReceipt.FirstOrDefault(e => e.Id == liquidationBooks[0].IdAuditReceipt);

                    auditReceipt!.Status = 1;
                    context.SaveChanges();
                }

                #endregion

                transaction.Commit();
                return new Response() { Success = true, Fail = false, Message = "Thanh lý thành công !" };
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        }

        public List<CustomApiAuditReceipt> ConfirmLostBook(int pageNumber, int pageSize, List<Guid> IdIndividual)
        {
            var listIndividualInvoicing = (from a in _dbContext.DocumentInvoice
                join b in _dbContext.DocumentInvoiceDetail on a.Id equals b.IdDocumentInvoice
                where a.Status == 0
                select b.IdIndividual).ToList();

            var bookData = (from d in _dbContext.Document
                join i in _dbContext.IndividualSample on d.ID equals i.IdDocument
                join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                where d.IsDeleted == false && i.IsDeleted == false && !IdIndividual.Contains(i.Id)
                      && !listIndividualInvoicing.Contains(i.Id)
                select new CustomApiAuditReceipt
                {
                    IdBook = d.ID,
                    BookName = d.DocName,
                    Price = i.Price??d.Price,
                    IdTypeBook = d.DocumentTypeId,
                    TypeBook = dt.DocTypeName,
                    NumIndividual = i.NumIndividual,
                    IdIndividual = i.Id,
                    Author = d.Author
                }).ToList();

            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                bookData = bookData.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            return bookData;
        }

        public ReportAuditReceipt ReportAuditReceipt(Guid idAuditReceipt)
        {
            var auditReceipt = _dbContext.AuditReceipt.Find(idAuditReceipt);
            if (auditReceipt is null) return new ReportAuditReceipt();

            var auditorData = _dbContext.AuditorListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditorListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            var auditBookData = _dbContext.DataDocumentAndAuditBookListByIdAuditReceipt
                .FromSqlRaw(UtilsSqlQueries.AuditBookListByIdAuditReceipt, idAuditReceipt)
                .ToList();

            var groupAuditBookData = new List<ReportAuditReceiptDetail>();
            if (auditBookData.Any())
            {
                groupAuditBookData = auditBookData
                    .GroupBy(g => g.IdTypeBook)
                    .Select(g => new ReportAuditReceiptDetail()
                    {
                        DocumentTypeId = g.Key,
                        DocumentTypeName = g.FirstOrDefault()?.TypeBook,
                        Datas = g.Select(x => new DataDocumentAndAuditBookListByIdAuditReceipt
                        {
                            IdBook = x.IdBook,
                            BookName = x.BookName,
                            Price = x.Price,
                            Author = x.Author,
                            NumIndividual = x.NumIndividual,
                            IdIndividual = x.IdIndividual,
                            WasLost = x.WasLost,
                            Redundant = x.Redundant,
                            IsLiquidation = x.IsLiquidation,
                            IdStatusBook = x.IdStatusBook,
                            NameStatusBook = x.NameStatusBook,
                            Note = x.Note
                        }).ToList()
                    })
                    .ToList();
            }

            var documentTypeAndQuantities = _dbContext.DocumentTypeAndQuantity
                .FromSqlRaw(UtilsSqlQueries.DocumentTypeAndQuantity, idAuditReceipt)
                .ToList();

            var statusBookAndQuantities = _dbContext.StatusBook
                .Select(e => new ResultOfStatusBook
                {
                    Quantity = _dbContext.AuditBookList
                        .Count(d => d.IdStatusBook == e.Id),
                    StatusBook = e.NameStatusBook
                })
                .ToList();

            return new ReportAuditReceipt()
            {
                IdAuditReceipt = idAuditReceipt,
                ReportCreateDate = auditReceipt.ReportCreateDate,
                ReportToDate = auditReceipt.ReportCreateDate,
                Note = auditReceipt.Note,
                IdAuditMethod = auditReceipt.IdAuditMethod,
                DataAuditor = auditorData,
                DataQuantityDocument = new ResultOfAuditReceipt()
                {
                    TotalBookInLibrary = auditReceipt.TotalBook,
                    Datas = documentTypeAndQuantities
                },
                ResultOfStatusBooks = statusBookAndQuantities,
                ResultReportAuditReceiptDetail = groupAuditBookData
            };
        }

        public AuditTraditionalDocument PrintListDataDocument(Guid IdDocumentType, int sortByCondition)
        {
            var result = _dbContext.GetDynamicResult("exec [dbo].[Sp_GetAllDataOfBookByDocumentType] @IdDocumentType",
                new SqlParameter("@IdDocumentType", IdDocumentType));

            var listDataBook = result
                .Select(str1 => (DataBook)JsonConvert.DeserializeObject<DataBook>(JsonConvert.SerializeObject(str1)))
                .ToList();

            var temp = listDataBook
                .GroupBy(g => g.Id)
                .Select(g => new DataBookByDocumentType()
                {
                    DocumentTypeName = g.FirstOrDefault()?.DocTypeName,
                    DataOfBook = sortByCondition switch
                    {
                        0 => g.Select(x => new DataBook
                        {
                            DocName = x.DocName,
                            NumIndividual = x.NumIndividual,
                            Author = x.Author,
                            WasLost = x.WasLost,
                            Redundant = x.Redundant,
                            IsLiquidation = x.IsLiquidation,
                            NameStatusBook = x.NameStatusBook,
                            SignCode = x.SignCode,
                            EncryptDocumentName = x.EncryptDocumentName,
                            Publisher = x.Publisher,
                            PublishYear = x.PublishYear
                        }).OrderBy(x => x.NumIndividual).ToList(),
                        1 => g.Select(x => new DataBook
                        {
                            DocName = x.DocName,
                            NumIndividual = x.NumIndividual,
                            Author = x.Author,
                            WasLost = x.WasLost,
                            Redundant = x.Redundant,
                            IsLiquidation = x.IsLiquidation,
                            NameStatusBook = x.NameStatusBook,
                            SignCode = x.SignCode,
                            EncryptDocumentName = x.EncryptDocumentName,
                            Publisher = x.Publisher,
                            PublishYear = x.PublishYear
                        }).OrderBy(e => e.SignCode).ToList(),
                        _ => g.Select(x => new DataBook
                        {
                            DocName = x.DocName,
                            NumIndividual = x.NumIndividual,
                            Author = x.Author,
                            WasLost = x.WasLost,
                            Redundant = x.Redundant,
                            IsLiquidation = x.IsLiquidation,
                            NameStatusBook = x.NameStatusBook,
                            SignCode = x.SignCode,
                            EncryptDocumentName = x.EncryptDocumentName,
                            Publisher = x.Publisher,
                            PublishYear = x.PublishYear
                        }).OrderBy(e => e.EncryptDocumentName).ToList()
                    }
                }).ToList();

            return new AuditTraditionalDocument
            {
                dataBookByDocumentTypes = temp
            };
        }

        public long CountAllNumberOfBook()
        {
            var bookData = (from d in _dbContext.Document
                join i in _dbContext.IndividualSample on d.ID equals i.IdDocument
                join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                where d.IsDeleted == false && i.IsDeleted == false
                                           && dt.IsDeleted == false && dt.Status == 1
                select i).Count();

            return bookData;
        }

        public List<CustomApiAuditReceipt> GetListBookToAuditReceipt(string filter, Guid idDocumentType, int pageNumber,
            int pageSize)
        {
            var bookData = (from d in _dbContext.Document
                join i in _dbContext.IndividualSample on d.ID equals i.IdDocument
                join dt in _dbContext.DocumentType on d.DocumentTypeId equals dt.Id
                where d.IsDeleted == false && i.IsDeleted == false
                                           && dt.IsDeleted == false && dt.Status == 1
                            select new CustomApiAuditReceipt
                            {
                                IdBook = d.ID,
                                BookName = d.DocName,
                                Price = i.Price ?? d.Price ?? 0,
                                IdTypeBook = d.DocumentTypeId,
                                TypeBook = dt.DocTypeName,
                                NumIndividual = i.NumIndividual,
                                IdIndividual = i.Id,
                                Author = d.Author,
                                IsLostedPhysicalVersion = i.IsLostedPhysicalVersion,

                                // Hùng bổ sung
                                WasLost = (from abl in _dbContext.AuditBookList
                                           where abl.IdIndividualSample == i.Id
                                           orderby abl.CreatedDate descending
                                           select abl.WasLost).FirstOrDefault()
                                               ?? i.IsLostedPhysicalVersion
                                               ?? false
                            }).ToList();

            List<Guid> list = _dbContext.DocumentInvoiceDetail
                .Where(x => x.IsCompleted == false)
                .Select(x => x.IdIndividual)
                .ToList();

            if (list.Count > 0)
            {
                bookData = bookData
                    .Where(book => !list.Contains(book.IdIndividual.Value))
                    .ToList();
            }

            if (idDocumentType != Guid.Empty)
            {
                bookData = bookData.Where(e => e.IdTypeBook == idDocumentType).ToList();
            }

            if (filter is not null)
            {
                var tempFilter = Regex.Replace(filter, @"\s+", " ").Trim().ToLower();
                bookData = bookData.Where(e => (e.BookName ?? "").ToLower().Contains(tempFilter)
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

            var sortedList = bookData.OrderBy(e => GetSortableString(e.NumIndividual)).ToList();

            return sortedList;
        }

        public IEnumerable<AuditReceiptAndAuditorList> AuditReceiptAndAuditorLists(List<Guid> idsIndividual)
        {
            var idAuditReceipt = _dbContext.AuditBookList.Where(e => idsIndividual.Contains(e.IdIndividualSample))
                .Select(e => e.IdAuditReceipt).ToList();

            var lstAuditReceipt = _dbContext.AuditReceipt.Where(e => idAuditReceipt.Contains(e.Id)).ToList();

            var dataAuditReceiptAndAuditor = lstAuditReceipt.Select(e => new AuditReceiptAndAuditorList()
            {
                auditReceipt = e,
                auditorLists = _dbContext.AuditorList.Where(a => a.IdAuditReceipt == e.Id)
            }).ToList();

            return dataAuditReceiptAndAuditor;
        }

        #endregion
    }
}