using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Common.Models;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class BookRepository : IBookRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors

        public BookRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }

        #endregion

        #region GET DATA FROM TABLE BOOK

        public int GetAllNumberBook()
        {
            try
            {
                int number = 0;
                List<DocumentType> documentTypes = _DbContext.DocumentType.Where(e =>
                    e.IsDeleted == false && e.Status == 1).ToList();

                for (int i = 0; i < documentTypes.Count; i++)
                {
                    List<Document> books = _DbContext.Document
                        .Where(e => e.IsDeleted == false && e.IsApproved == true
                                                         && e.DocumentTypeId == documentTypes[i].Id).ToList();

                    number += books.Count;
                }

                return number;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<ListBookNew> getBookByCategory(int pageNumber, int pageSize, Guid IdDocumentType)
        {
            try
            {
                List<ListBookNew> bookNewsList = new List<ListBookNew>();
                List<Document> documents = new List<Document>();

                int count = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                           && e.DocumentTypeId == IdDocumentType
                                                           && e.IsDeleted == false
                                                           && e.IsApproved == true)
                    .Count();

                if (pageNumber == 0 && pageSize == 0)
                {
                    documents = _DbContext.Document.Where(e =>
                            e.DocumentTypeId == IdDocumentType
                            && e.IsDeleted == false
                            && e.IsApproved == true)
                        .OrderBy(e => e.Sort).ToList();
                }
                else
                {
                    if (pageNumber == 0)
                    {
                        pageNumber = 1;
                    }

                    documents = _DbContext.Document.Where(e =>
                            e.DocumentTypeId == IdDocumentType
                            && e.IsDeleted == false
                            && e.IsApproved == true)
                        .OrderBy(e => e.Sort)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                for (int i = 0; i < documents.Count; i++)
                {
                    ListBookNew bookNews = new ListBookNew();

                    //get category by one book
                    DocumentType documentType = _DbContext.DocumentType
                        .Where(e => e.Id == documents[i].DocumentTypeId).FirstOrDefault();
                    bookNews.NameCategory = documentType.DocTypeName;
                    bookNews.IdCategory = documentType.Id;

                    bookNews.Document = documents[i];
                    // get list avatar by one book
                    var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[i].ID).ToList();

                    bookNews.listAvatar = documentAvatar;
                    bookNews.total = count;
                    bookNewsList.Add(bookNews);
                }

                return bookNewsList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public ListBookNew getBookById(Guid Id)
        {
            try
            {
                ListBookNew bookNews = new ListBookNew();
                var document = _DbContext.Document.Where(e => e.ID == Id
                                                              && e.IsDeleted == false
                                                              && e.IsApproved == true)
                    .OrderByDescending(e => e.NumberView).ToList();
                for (int i = 0; i < document.Count; i++)
                {
                    DocumentType documentType = _DbContext.DocumentType
                        .Where(e => e.Id == document[i].DocumentTypeId).FirstOrDefault();
                    bookNews.NameCategory = documentType.DocTypeName;
                    bookNews.IdCategory = documentType.Id;

                    bookNews.Document = document[i];
                    // get list avatar by one book
                    var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == document[i].ID).ToList();
                    bookNews.listAvatar = documentAvatar;
                }

                return bookNews;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<ListBookNew> getBookByNumberView(int pageNumber, int pageSize)
        {
            try
            {
                List<ListBookNew> bookNewsList = new List<ListBookNew>();
                List<Document> documents = new List<Document>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    List<DocumentType> documentTypes = _DbContext.DocumentType
                        .Where(e => e.Status == 1 && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e =>
                                e.IsDeleted == false
                                && e.IsApproved == true
                                && e.DocumentTypeId == documentTypes[i].Id)
                            .OrderByDescending(e => e.NumberView).ToList();

                        for (int j = 0; j < documents.Count; j++)
                        {
                            ListBookNew bookNews = new ListBookNew();

                            //get category by one book
                            DocumentType documentType = _DbContext.DocumentType
                                .Where(e => e.Id == documents[j].DocumentTypeId).FirstOrDefault();
                            bookNews.NameCategory = documentType.DocTypeName;
                            bookNews.IdCategory = documentType.Id;

                            bookNews.Document = documents[j];
                            // get list avatar by one book
                            var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            bookNews.listAvatar = documentAvatar;
                            bookNewsList.Add(bookNews);
                        }
                    }

                    return bookNewsList;
                }
                else
                {
                    List<DocumentType> documentTypes = _DbContext.DocumentType
                        .Where(e => e.Status == 1 && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e =>
                                e.IsDeleted == false
                                && e.IsApproved == true
                                && e.DocumentTypeId == documentTypes[i].Id)
                            .OrderByDescending(e => e.NumberView)
                            .ToList();

                        for (int j = 0; j < documents.Count; j++)
                        {
                            ListBookNew bookNews = new ListBookNew();

                            //get category by one book
                            DocumentType documentType = _DbContext.DocumentType
                                .Where(e => e.Id == documents[j].DocumentTypeId).FirstOrDefault();
                            bookNews.NameCategory = documentType.DocTypeName;
                            bookNews.IdCategory = documentType.Id;

                            bookNews.Document = documents[j];
                            // get list avatar by one book
                            var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            bookNews.listAvatar = documentAvatar;
                            bookNewsList.Add(bookNews);
                        }
                    }

                    if (pageNumber == 0)
                    {
                        pageNumber = 1;
                    }

                    bookNewsList = bookNewsList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

                    return bookNewsList;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<ListBookNew> getBookNews(int pageNumber, int pageSize)
        {
            try
            {
                List<ListBookNew> bookNewsList = new List<ListBookNew>();
                List<Document> documents = new List<Document>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    List<DocumentType> documentTypes = _DbContext.DocumentType
                        .Where(e => e.Status == 1 && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e =>
                                e.IsDeleted == false
                                && e.IsApproved == true
                                && e.DocumentTypeId == documentTypes[i].Id)
                            .OrderByDescending(e => e.CreatedDate).ToList();

                        for (int j = 0; j < documents.Count; j++)
                        {
                            ListBookNew bookNews = new ListBookNew();

                            //get category by one book
                            DocumentType documentType = _DbContext.DocumentType
                                .Where(e => e.Id == documents[j].DocumentTypeId).FirstOrDefault();
                            bookNews.NameCategory = documentType.DocTypeName;
                            bookNews.IdCategory = documentType.Id;

                            bookNews.Document = documents[j];
                            // get list avatar by one book
                            var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            bookNews.listAvatar = documentAvatar;
                            bookNewsList.Add(bookNews);
                        }
                    }

                    return bookNewsList;
                }
                else
                {
                    List<DocumentType> documentTypes = _DbContext.DocumentType
                        .Where(e => e.Status == 1 && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e =>
                                e.IsDeleted == false
                                && e.IsApproved == true
                                && e.DocumentTypeId == documentTypes[i].Id)
                            .OrderByDescending(e => e.CreatedDate)
                            .ToList();

                        for (int j = 0; j < documents.Count; j++)
                        {
                            ListBookNew bookNews = new ListBookNew();

                            //get category by one book
                            DocumentType documentType = _DbContext.DocumentType
                                .Where(e => e.Id == documents[j].DocumentTypeId).FirstOrDefault();
                            bookNews.NameCategory = documentType.DocTypeName;
                            bookNews.IdCategory = documentType.Id;

                            bookNews.Document = documents[j];
                            // get list avatar by one book
                            var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            bookNews.listAvatar = documentAvatar;
                            bookNewsList.Add(bookNews);
                        }
                    }

                    bookNewsList = bookNewsList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

                    return bookNewsList;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<DocumentType> GetDocumentTypes()
        {
            try
            {
                List<DocumentType> documentTypes = new List<DocumentType>();
                documentTypes = _DbContext.DocumentType
                    .Where(e => e.IsDeleted == false && e.Status == 1 && e.ParentId == null)
                    .OrderByDescending(e => e.CreatedDate).ToList();
                return documentTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<ListBookNew> SearchBook(string values, int pageNumber, int pageSize)
        {
            try
            {
                List<ListBookNew> bookNewsList = new List<ListBookNew>();
                List<Document> documents = new List<Document>();

                int count = 0;

                documents = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                           && e.IsDeleted == false
                                                           && e.IsApproved == true
                                                           && e.DocName.ToLower().Contains(values.ToLower().Trim()))
                    .OrderByDescending(e => e.NumberView)
                    .ToList();

                if (documents != null) count = documents.Count();

                if (documents.Count == 0)
                {
                    documents = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                               && e.IsDeleted == false
                                                               && e.IsApproved == true
                                                               && e.Author.ToLower().Contains(values.ToLower().Trim()))
                        .OrderByDescending(e => e.NumberView)
                        .ToList();

                    count = documents.Count();

                    if (documents.Count == 0)
                    {
                        documents = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                                   && e.IsDeleted == false
                                                                   && e.IsApproved == true
                                                                   && e.Publisher.ToLower()
                                                                       .Contains(values.ToLower().Trim()))
                            .OrderByDescending(e => e.NumberView)
                            .ToList();

                        count = documents.Count();
                    }
                }

                documents = documents.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

                for (int i = 0; i < documents.Count; i++)
                {
                    ListBookNew bookNews = new ListBookNew();

                    DocumentType documentType = _DbContext.DocumentType
                        .Where(e => e.Id == documents[i].DocumentTypeId).FirstOrDefault();
                    bookNews.NameCategory = documentType.DocTypeName;
                    bookNews.IdCategory = documentType.Id;

                    bookNews.Document = documents[i];
                    // get list avatar by one book
                    var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[i].ID).ToList();

                    bookNews.listAvatar = documentAvatar;
                    bookNews.total = count;
                    bookNewsList.Add(bookNews);
                }

                return bookNewsList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiDocumentAndIndividual GetBookAndIndividualManyParam(
            IndividualByDocumentDto individualByDocumentDto)
        {
            try
            {

                CustomApiDocumentAndIndividual customApiDocumentAndIndividual = new CustomApiDocumentAndIndividual();

                Document documents = _DbContext.Document
                    .Where(e => e.IsDeleted == false && e.ID == individualByDocumentDto.id).FirstOrDefault();

                int totalInvidual = _DbContext.IndividualSample
                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();

                if (documents != null)
                {
                    customApiDocumentAndIndividual.document = documents;
                    customApiDocumentAndIndividual.totalCount = totalInvidual;

                    List<IndividualSample> individualSample = _DbContext.IndividualSample
                        .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                        .OrderByDescending(e => e.CreatedDate)
                        .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                        .Take(individualByDocumentDto.results).ToList();

                    if (individualByDocumentDto.sortField != null)
                    {
                        if (individualByDocumentDto.sortOrder == "ascend")
                        {
                            if (individualByDocumentDto.sortField == "barcode")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderBy((order) => order.Barcode)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "numIndividual")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).ToList();
                                /*.Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results).Take(individualByDocumentDto.results).ToList();*/

                                individualSample = InsertionSortAscend(individualSample);

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "stockId")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderBy((order) => order.StockId)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "createdDate")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderBy((order) => order.CreatedDate)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                        }
                        else
                        {
                            if (individualByDocumentDto.sortField == "barcode")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderByDescending((order) => order.Barcode)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "numIndividual")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).ToList();
                                /*.Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results).Take(individualByDocumentDto.results).ToList();*/

                                individualSample = InsertionSortDes(individualSample);

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "stockId")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderByDescending((order) => order.StockId)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                            else if (individualByDocumentDto.sortField == "createdDate")
                            {
                                individualSample = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID)
                                    .OrderByDescending((order) => order.CreatedDate)
                                    .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                                    .Take(individualByDocumentDto.results).ToList();

                                int individualSampleCount = _DbContext.IndividualSample
                                    .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).Count();
                                customApiDocumentAndIndividual.totalCount = individualSampleCount;
                            }
                        }
                    }

                    if (individualByDocumentDto.barcode != null)
                    {
                        individualSample = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.Barcode == individualByDocumentDto.barcode[0])
                            .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                            .Take(individualByDocumentDto.results).ToList();

                        int individualSampleCount = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.Barcode == individualByDocumentDto.barcode[0]).Count();
                        customApiDocumentAndIndividual.totalCount = individualSampleCount;
                    }
                    else if (individualByDocumentDto.isLostedPhysicalVersion != null)
                    {
                        individualSample = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID && e.IsLostedPhysicalVersion ==
                                individualByDocumentDto.isLostedPhysicalVersion[0])
                            .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                            .Take(individualByDocumentDto.results).ToList();

                        int individualSampleCount = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.IsLostedPhysicalVersion ==
                                                             individualByDocumentDto.isLostedPhysicalVersion[0])
                            .Count();

                        customApiDocumentAndIndividual.totalCount = individualSampleCount;
                    }
                    else if (individualByDocumentDto.stockId != null)
                    {
                        individualSample = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.StockId == individualByDocumentDto.stockId[0])
                            .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                            .Take(individualByDocumentDto.results).ToList();

                        int individualSampleCount = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.StockId == individualByDocumentDto.stockId[0]).Count();
                        customApiDocumentAndIndividual.totalCount = individualSampleCount;
                    }
                    else if (individualByDocumentDto.numIndividual != null)
                    {
                        individualSample = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.NumIndividual.ToLower().Contains(individualByDocumentDto
                                                                 .numIndividual[0].ToLower()))
                            .Skip((individualByDocumentDto.page - 1) * individualByDocumentDto.results)
                            .Take(individualByDocumentDto.results).ToList();

                        int individualSampleCount = _DbContext.IndividualSample
                            .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID
                                                             && e.NumIndividual.ToLower().Contains(individualByDocumentDto
                                                                 .numIndividual[0].ToLower())).Count();
                        customApiDocumentAndIndividual.totalCount = individualSampleCount;
                    }

                    customApiDocumentAndIndividual.individuals = individualSample;
                }

                return customApiDocumentAndIndividual;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return null;
                throw;
            }
        }

        public List<SpineBookModel> GetSpineBookByMultipleDocumentType()
        {
            var spineBookModels = new List<SpineBookModel>();
            var documentTypes = _DbContext.DocumentType.Where(e => e.Status == 1
                                                                   && e.IsDeleted == false).ToList();

            var documents = _DbContext.Document.Where(e =>
                e.IsDeleted == false).ToList();

            for (int i = 0; i < documentTypes.Count; i++)
            {
                var item = documents.Where(e => e.DocumentTypeId == documentTypes[i].Id).ToList();

                for (int j = 0; j < item.Count; j++)
                {
                    spineBookModels.Add(new SpineBookModel()
                    {
                        ID = item[j].ID,
                        DocName = item[j].DocName,
                        CreatedDate = item[j].CreatedDate
                    });
                }
            }

            spineBookModels.Sort((ps1, ps2) =>
                DateTime.Compare((DateTime)ps2.CreatedDate, (DateTime)ps1.CreatedDate));

            return spineBookModels;
        }

        //sort ascend list individual
        public List<IndividualSample> InsertionSortAscend(List<IndividualSample> individualSamples)
        {
            var idCategory = new Guid(individualSamples[0].NumIndividual.Split('/')[1]);

            // get sign code from table category sign
            CategorySign categorySign = _DbContext.CategorySign
                .Where(e => e.Id == idCategory).FirstOrDefault();

            for (int i = 0; i < individualSamples.Count(); i++)
            {
                var item = individualSamples[i].NumIndividual;
                var currentIndex = i;

                while (currentIndex > 0 &&
                       int.Parse(item.Split('/')[0].Substring(categorySign.SignCode.Length)) <
                       int.Parse(individualSamples[currentIndex - 1].NumIndividual.Split('/')[0]
                           .Substring(categorySign.SignCode.Length)))
                {
                    individualSamples[currentIndex].NumIndividual = individualSamples[currentIndex - 1].NumIndividual;
                    currentIndex--;
                }

                individualSamples[currentIndex].NumIndividual = item;
            }

            return individualSamples;
        }

        //sort des list individual
        public List<IndividualSample> InsertionSortDes(List<IndividualSample> individualSamples)
        {
            Guid idCategory = new Guid(individualSamples[0].NumIndividual.Split('/')[1]);

            // get sign code from table category sign
            CategorySign categorySign = _DbContext.CategorySign
                .Where(e => e.Id == idCategory).FirstOrDefault();

            for (int i = 0; i < individualSamples.Count(); i++)
            {
                var item = individualSamples[i].NumIndividual;
                var currentIndex = i;

                while (currentIndex > 0 &&
                       int.Parse(item.Split('/')[0].Substring(categorySign.SignCode.Length)) >
                       int.Parse(individualSamples[currentIndex - 1].NumIndividual.Split('/')[0]
                           .Substring(categorySign.SignCode.Length)))
                {
                    individualSamples[currentIndex].NumIndividual = individualSamples[currentIndex - 1].NumIndividual;
                    currentIndex--;
                }

                individualSamples[currentIndex].NumIndividual = item;
            }

            return individualSamples;
        }

        #endregion

        #region CRUD TABLE DOCUMENT AND ADMIN SITE

        public List<ListBookNew> getListBookImportBooks(int pageNumber, int pageSize, int DocumentType, string searchDocName = null)
        {
            try
            {
                // Lấy danh sách ID loại tài liệu
                var documentTypeIds = _DbContext.DocumentType
                    .Where(e => e.Status == DocumentType && e.IsDeleted == false)
                    .Select(e => e.Id)
                    .ToList();

                // Truy vấn tài liệu với phân trang và lọc
                var documentsQuery = _DbContext.Document
                    .AsNoTracking() // Tăng hiệu suất bằng cách bỏ theo dõi
                    .Where(e => documentTypeIds.Contains(e.DocumentTypeId) && e.IsDeleted == false)
                    .OrderByDescending(e => e.CreatedDate).ToList();

                if (!string.IsNullOrEmpty(searchDocName))
                {
                    documentsQuery = documentsQuery.Where(e => e.DocName.ToUpper().Trim().Contains(searchDocName.ToUpper().Trim())).ToList();
                }

                // Áp dụng phân trang trong truy vấn
                var pagedDocuments = documentsQuery
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList(); // Lấy dữ liệu phân trang từ cơ sở dữ liệu

                // Lấy thông tin tài liệu và ảnh đại diện
                var bookNewsList = pagedDocuments
                    .Select(document => new ListBookNew
                    {
                        IdCategory = document.DocumentTypeId,
                        NameCategory = _DbContext.DocumentType
                            .Where(dt => dt.Id == document.DocumentTypeId && dt.Status == DocumentType && !dt.IsDeleted)
                            .Select(dt => dt.DocTypeName)
                            .FirstOrDefault(),
                        Document = document,
                        listAvatar = _DbContext.DocumentAvatar
                            .Where(avatar => avatar.IdDocument == document.ID)
                            .ToList(),
                        total = documentsQuery.Count(),
                    })
                    .ToList();

                return bookNewsList;
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu cần
                throw;
            }
        }

        public List<ListBookNew> GetBookExistIndividualCode(int pageNumber, int pageSize, int DocumentType)
        {
            try
            {
                var datas = (from dt in _DbContext.DocumentType
                             join d in _DbContext.Document on dt.Id equals d.DocumentTypeId
                             //join da in _DbContext.DocumentAvatar on d.ID equals da.IdDocument
                             where dt.Status == DocumentType && dt.IsDeleted == false && d.IsDeleted == false
                                   && (from ismp in _DbContext.IndividualSample
                                       where ismp.IsDeleted == false
                                       select ismp.IdDocument).Contains(d.ID)
                             orderby d.CreatedDate descending
                             select new ListBookNew()
                             { Document = d }).ToList();

                if (pageNumber != 0 && pageSize != 0)
                {
                    if (pageNumber < 0)
                    {
                        pageNumber = 1;
                    }

                    datas = datas.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                return datas;
            }
            catch (Exception e)
            {
                throw;
            }
        }
        public List<DocumentDto> getAllBook(int pageNumber, int pageSize)
        {
            try
            {
                List<Document> documents = null;
                if (pageNumber == 0 && pageSize == 0)
                {
                    documents = _DbContext.Document.
                    Where(e => e.IsDeleted == false)
                    .ToList();
                }
                else
                {
                    documents = _DbContext.Document.
                    Where(e => e.IsDeleted == false)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }
                List<DocumentDto> documentDtos = new List<DocumentDto>();
                documentDtos = _mapper.Map<List<DocumentDto>>(documents);
                return documentDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<ListBookNew> getBookAdminSite(SortAndSearchListDocument sortAndSearchListDocument)
        {
            try
            {
                int countRecord = 0;

                var bookNewsList = (from dt in _DbContext.DocumentType
                                    join d in _DbContext.Document on dt.Id equals d.DocumentTypeId
                                    join da in _DbContext.DocumentAvatar on d.ID equals da.IdDocument into documentAvatars
                                    from da in documentAvatars.DefaultIfEmpty()
                                    where dt.IsDeleted == false && dt.Status == sortAndSearchListDocument.DocumentType
                                                                && d.IsDeleted == false
                                    select new ListBookNew
                                    {
                                        IdCategory = dt.Id,
                                        NameCategory = dt.DocTypeName,
                                        Document = d,
                                        listAvatar = new List<DocumentAvatar> { da }
                                    }).ToList();

                bookNewsList.Sort((ps1, ps2) =>
                    DateTime.Compare((DateTime)ps2.Document.CreatedDate, (DateTime)ps1.Document.CreatedDate));
                countRecord = bookNewsList.Count();

                if (sortAndSearchListDocument.DocName != null)
                {
                    bookNewsList = bookNewsList.Where(a => a.Document.DocName.ToLower()
                        .Contains(sortAndSearchListDocument.DocName[0].ToLower())).ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Sort != null)
                {
                    bookNewsList = bookNewsList.Where(a => a.Document.Sort == sortAndSearchListDocument.Sort[0])
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Language != null && sortAndSearchListDocument.Language.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.Language.Contains(a.Document.Language))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Publisher != null && sortAndSearchListDocument.Publisher.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.Publisher.Contains(a.Document.Publisher))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.PublishYear != null && sortAndSearchListDocument.PublishYear.Count > 0)
                {
                    var publishYears = sortAndSearchListDocument.PublishYear.Select(y => int.Parse(y)).ToList();
                    bookNewsList = bookNewsList
                        .Where(a => a.Document.PublishYear != null && publishYears.Contains(a.Document.PublishYear.Value.Year))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Author != null && sortAndSearchListDocument.Author.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => a.Document.Author != null &&
                                    sortAndSearchListDocument.Author.Any(author => a.Document.Author.ToLower()
                                    .Contains(author.ToLower())))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Description != null && sortAndSearchListDocument.Description.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => a.Document.Description != null &&
                                    sortAndSearchListDocument.Description.Any(description => a.Document.Description.ToLower()
                                    .Contains(description.ToLower())))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.Price != null && sortAndSearchListDocument.Price.Count > 0)
                {
                    var prices = sortAndSearchListDocument.Price
                     .Where(p => p is long)
                     .Select(p => (long)p)
                     .ToList();


                    bookNewsList = bookNewsList
                        .Where(a => a.Document.Price != null && prices.Contains(a.Document.Price.Value))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.IsHavePhysicalVersion != null && sortAndSearchListDocument.IsHavePhysicalVersion.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.IsHavePhysicalVersion.Contains(a.Document.IsHavePhysicalVersion))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }


                //if (sortAndSearchListDocument.nameCategory != null)
                //{
                //    for (int i = 0; i < sortAndSearchListDocument.nameCategory.Count; i++)
                //    {
                //        bookNewsList = bookNewsList
                //            .Where(a => a.IdCategory == sortAndSearchListDocument.nameCategory[i]).ToList();
                //    }

                //    countRecord = bookNewsList.Count();
                //}

                if (sortAndSearchListDocument.nameCategory != null && sortAndSearchListDocument.nameCategory.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.nameCategory.Contains(a.IdCategory))
                        .ToList();

                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.idCategorySign_V1 != null && sortAndSearchListDocument.idCategorySign_V1.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.idCategorySign_V1.Contains(a.Document.IdCategorySign_V1))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.idCategoryParent != null && sortAndSearchListDocument.idCategoryParent.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.idCategoryParent.Contains(a.Document.IdCategoryParent))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }

                if (sortAndSearchListDocument.isApproved != null && sortAndSearchListDocument.isApproved.Count > 0)
                {
                    bookNewsList = bookNewsList
                        .Where(a => sortAndSearchListDocument.isApproved.Contains(a.Document.IsApproved))
                        .ToList();
                    countRecord = bookNewsList.Count();
                }


                if (sortAndSearchListDocument.sortOrder == "ascend")
                {
                    if (sortAndSearchListDocument.sortField == "numberView")
                    {
                        bookNewsList = bookNewsList.OrderBy(e => e.Document.NumberView).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "numberLike")
                    {
                        bookNewsList = bookNewsList.OrderBy(e => e.Document.NumberLike).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "numberUnlike")
                    {
                        bookNewsList = bookNewsList.OrderBy(e => e.Document.NumberUnlike).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "createdDate")
                    {
                        bookNewsList = bookNewsList.OrderBy(e => e.Document.CreatedDate).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "Sort")
                    {
                        bookNewsList = bookNewsList.OrderBy(e => e.Document.Sort).ToList();
                    }
                }
                else
                {
                    if (sortAndSearchListDocument.sortField == "numberView")
                    {
                        bookNewsList = bookNewsList.OrderByDescending(e => e.Document.NumberView).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "numberLike")
                    {
                        bookNewsList = bookNewsList.OrderByDescending(e => e.Document.NumberLike).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "numberUnlike")
                    {
                        bookNewsList = bookNewsList.OrderByDescending(e => e.Document.NumberUnlike).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "createdDate")
                    {
                        bookNewsList = bookNewsList.OrderByDescending(e => e.Document.CreatedDate).ToList();
                    }

                    if (sortAndSearchListDocument.sortField == "Sort")
                    {
                        bookNewsList = bookNewsList.OrderByDescending(e => e.Document.Sort).ToList();
                    }
                }

                if (sortAndSearchListDocument.page != 0 && sortAndSearchListDocument.results != 0)
                {
                    if (sortAndSearchListDocument.page < 0)
                    {
                        sortAndSearchListDocument.page = 1;
                    }

                    bookNewsList = bookNewsList
                        .Skip((sortAndSearchListDocument.page - 1) * sortAndSearchListDocument.results)
                        .Take(sortAndSearchListDocument.results).ToList();
                }

                if (bookNewsList.Count != 0)
                {
                    bookNewsList[0].total = countRecord;
                }

                return bookNewsList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public ListBookNew getBookByIdAdminSite(Guid Id)
        {
            try
            {
                Document documents = new Document();
                DocumentType documentTypes = new DocumentType();
                List<DocumentAvatar> documentAvatars = new List<DocumentAvatar>();
                ListBookNew listBookNew = new ListBookNew();

                documents = _DbContext.Document.Where(e => e.ID == Id
                                                           && e.IsDeleted == false).FirstOrDefault();


                documentTypes = _DbContext.DocumentType.Where(e =>
                    e.IsDeleted == false
                    && e.Id == documents.DocumentTypeId).FirstOrDefault();

                documentAvatars = _DbContext.DocumentAvatar.Where(e =>
                    e.IdDocument == documents.ID).ToList();

                listBookNew.IdCategory = documentTypes.Id;
                listBookNew.NameCategory = documentTypes.DocTypeName;
                listBookNew.Document = documents;
                listBookNew.listAvatar = documentAvatars;

                return listBookNew;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<ListBookNew> getDocumentInvoiceDetailById(int pageNumber, int pageSize, int DocumentType)
        {
            try
            {
                var documents = new List<Document>();
                var documentTypes = new List<DocumentType>();
                var bookNewsList = new List<ListBookNew>();
                var documentAvatars = new List<DocumentAvatar>();

                if (pageNumber == 0 || pageSize == 0)
                {
                    documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
                                                                       && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e => e.DocumentTypeId == documentTypes[i].Id &&
                                                                   e.IsDeleted == false)
                            .OrderByDescending(e => e.CreatedDate).ToList();

                        for (int j = 0; j < documents.Count; j++)
                        {
                            var listBookNew = new ListBookNew();
                            documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            listBookNew.IdCategory = documentTypes[i].Id;
                            listBookNew.NameCategory = documentTypes[i].DocTypeName;
                            listBookNew.Document = documents[j];
                            listBookNew.listAvatar = documentAvatars;

                            bookNewsList.Add(listBookNew);
                        }
                    }

                    bookNewsList.Sort((ps1, ps2) =>
                        DateTime.Compare((DateTime)ps2.Document.CreatedDate, (DateTime)ps1.Document.CreatedDate));

                    return bookNewsList;
                }
                else
                {
                    documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
                                                                       && e.IsDeleted == false).ToList();
                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        documents = _DbContext.Document.Where(e => e.DocumentTypeId == documentTypes[i].Id
                                                                   && e.IsDeleted == false).ToList();


                        for (int j = 0; j < documents.Count; j++)
                        {
                            ListBookNew listBookNew = new ListBookNew();
                            documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            listBookNew.IdCategory = documentTypes[i].Id;
                            listBookNew.NameCategory = documentTypes[i].DocTypeName;
                            listBookNew.Document = documents[j];
                            listBookNew.listAvatar = documentAvatars;

                            bookNewsList.Add(listBookNew);
                        }
                    }

                    return bookNewsList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<ListBookNew> getBookAdminSite(int pageNumber, int pageSize, int DocumentType, string ListIdDocument = "")
        {
            try
            {
                List<string> documentIdList = null;
                // Kiểm tra nếu chuỗi ListIdDocument không rỗng
                if (!string.IsNullOrEmpty(ListIdDocument))
                {
                    // Tách chuỗi thành mảng các id dựa trên dấu phẩy
                    string[] documentIds = ListIdDocument.Split(',');

                    // Chuyển đổi mảng này sang danh sách
                    documentIdList = documentIds.ToList();
                }

                var documents = new List<Document>();
                var documentTypes = new List<DocumentType>();
                var bookNewsList = new List<ListBookNew>();
                var documentAvatars = new List<DocumentAvatar>();

                if (pageNumber == 0 || pageSize == 0)
                {
                    documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
                                                                       && e.IsDeleted == false).ToList();

                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        // Lọc các document dựa trên documentIdList nếu có
                        if (documentIdList != null && documentIdList.Count > 0)
                        {
                            documents = _DbContext.Document
                                .Where(e => e.DocumentTypeId == documentTypes[i].Id &&
                                            e.IsDeleted == false &&
                                            documentIdList.Contains(e.ID.ToString())) // Điều kiện lọc theo documentIdList
                                .OrderByDescending(e => e.CreatedDate).ToList();
                        }
                        else
                        {
                            documents = _DbContext.Document
                                .Where(e => e.DocumentTypeId == documentTypes[i].Id &&
                                            e.IsDeleted == false)
                                .OrderByDescending(e => e.CreatedDate).ToList();
                        }

                        for (int j = 0; j < documents.Count; j++)
                        {
                            var listBookNew = new ListBookNew();
                            documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            listBookNew.IdCategory = documentTypes[i].Id;
                            listBookNew.NameCategory = documentTypes[i].DocTypeName;
                            listBookNew.Document = documents[j];
                            listBookNew.listAvatar = documentAvatars;

                            bookNewsList.Add(listBookNew);
                        }
                    }

                    bookNewsList.Sort((ps1, ps2) =>
                        DateTime.Compare((DateTime)ps2.Document.CreatedDate, (DateTime)ps1.Document.CreatedDate));

                    return bookNewsList;
                }
                else
                {
                    documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
                                                                       && e.IsDeleted == false).ToList();
                    for (int i = 0; i < documentTypes.Count; i++)
                    {
                        // Lọc các document dựa trên documentIdList nếu có
                        if (documentIdList != null && documentIdList.Count > 0)
                        {
                            documents = _DbContext.Document
                                .Where(e => e.DocumentTypeId == documentTypes[i].Id &&
                                            e.IsDeleted == false &&
                                            documentIdList.Contains(e.ID.ToString())) // Điều kiện lọc theo documentIdList
                                .ToList();
                        }
                        else
                        {
                            documents = _DbContext.Document
                                .Where(e => e.DocumentTypeId == documentTypes[i].Id &&
                                            e.IsDeleted == false)
                                .ToList();
                        }

                        for (int j = 0; j < documents.Count; j++)
                        {
                            var listBookNew = new ListBookNew();
                            documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
                                .ToList();

                            listBookNew.IdCategory = documentTypes[i].Id;
                            listBookNew.NameCategory = documentTypes[i].DocTypeName;
                            listBookNew.Document = documents[j];
                            listBookNew.listAvatar = documentAvatars;

                            bookNewsList.Add(listBookNew);
                        }
                    }

                    return bookNewsList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                Console.WriteLine(ex.Message);
                return new List<ListBookNew>(); // Giá trị trả về giả định khi có lỗi
            }
        }

        //public List<ListBookNew> getBookAdminSite(int pageNumber, int pageSize, int DocumentType, string ListIdDocument="")
        //{
        //    try
        //    {
        //        List<string> documentIdList = null;
        //        // Kiểm tra nếu chuỗi ListIdDocument không rỗng
        //        if (!string.IsNullOrEmpty(ListIdDocument))
        //        {
        //            // Tách chuỗi thành mảng các id dựa trên dấu phẩy
        //            string[] documentIds = ListIdDocument.Split(',');

        //            // Nếu bạn muốn chuyển đổi mảng này sang danh sách, bạn có thể làm như sau:
        //            documentIdList= documentIds.ToList();
        //        }

        //        var documents = new List<Document>();
        //        var documentTypes = new List<DocumentType>();
        //        var bookNewsList = new List<ListBookNew>();
        //        var documentAvatars = new List<DocumentAvatar>();

        //        if (pageNumber == 0 || pageSize == 0)
        //        {
        //            documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
        //                                                               && e.IsDeleted == false).ToList();

        //            for (int i = 0; i < documentTypes.Count; i++)
        //            {
        //                documents = _DbContext.Document.Where(e => e.DocumentTypeId == documentTypes[i].Id &&
        //                                                           e.IsDeleted == false)
        //                    .OrderByDescending(e => e.CreatedDate).ToList();

        //                for (int j = 0; j < documents.Count; j++)
        //                {
        //                    var listBookNew = new ListBookNew();
        //                    documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
        //                        .ToList();

        //                    listBookNew.IdCategory = documentTypes[i].Id;
        //                    listBookNew.NameCategory = documentTypes[i].DocTypeName;
        //                    listBookNew.Document = documents[j];
        //                    listBookNew.listAvatar = documentAvatars;

        //                    bookNewsList.Add(listBookNew);
        //                }
        //            }

        //            bookNewsList.Sort((ps1, ps2) =>
        //                DateTime.Compare((DateTime)ps2.Document.CreatedDate, (DateTime)ps1.Document.CreatedDate));

        //            return bookNewsList;
        //        }
        //        else
        //        {
        //            documentTypes = _DbContext.DocumentType.Where(e => e.Status == DocumentType
        //                                                               && e.IsDeleted == false).ToList();
        //            for (int i = 0; i < documentTypes.Count; i++)
        //            {
        //                documents = _DbContext.Document.Where(e => e.DocumentTypeId == documentTypes[i].Id
        //                                                           && e.IsDeleted == false).ToList();


        //                for (int j = 0; j < documents.Count; j++)
        //                {
        //                    ListBookNew listBookNew = new ListBookNew();
        //                    documentAvatars = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[j].ID)
        //                        .ToList();

        //                    listBookNew.IdCategory = documentTypes[i].Id;
        //                    listBookNew.NameCategory = documentTypes[i].DocTypeName;
        //                    listBookNew.Document = documents[j];
        //                    listBookNew.listAvatar = documentAvatars;

        //                    bookNewsList.Add(listBookNew);
        //                }
        //            }

        //            return bookNewsList.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        public Response InsertDocument(DocumentDto documentDto)
        {
            try
            {
                if (!string.IsNullOrEmpty(documentDto.MagazineNumber))
                {
                    bool isExistMagazineNumber = _DbContext.Document.ToList().Where(e => e.MagazineNumber != null).Any(e => e.MagazineNumber.Trim().ToString().Equals(documentDto.MagazineNumber.Trim().ToString()));

                    if (isExistMagazineNumber)
                    {
                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Số báo này đã tồn tại trong hệ thống !"
                        };
                    }
                }

                var document = _mapper.Map<Document>(documentDto);

                _DbContext.Document.Add(document);
                _DbContext.SaveChanges();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
            }
            catch (Exception ex)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !" + ex.InnerException.Message
                };
            }
        }

        public Response InsertDocumentByExcel(List<DocumentDto> documentDtos, List<DocumentAvatarDto> documentAvatars,
            List<IndividualSampleDto> individualSampleDtos)
        {
            using var context = _DbContext;
            using var transaction = context.Database.BeginTransaction();

            try
            {
                var document = documentDtos
                    .Select(a => _mapper.Map<Document>(a))
                    .ToList();

                _DbContext.Document.AddRange(document);
                context.SaveChanges();

                var documentAvatar = documentAvatars
                    .Select(a => _mapper.Map<DocumentAvatar>(a))
                    .ToList();

                _DbContext.DocumentAvatar.AddRange(documentAvatar);
                context.SaveChanges();

                var individual = individualSampleDtos
                    .Select(a => _mapper.Map<IndividualSample>(a))
                    .ToList();

                _DbContext.IndividualSample.AddRange(individual);
                context.SaveChanges();

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

        public Response InsertDocumentAvatar(DocumentAvatarDto documentAvatarDto)
        {
            Response response = new Response();
            try
            {
                DocumentAvatar documentAvatarEntity = new DocumentAvatar();
                documentAvatarEntity = _mapper.Map<DocumentAvatar>(documentAvatarDto);

                _DbContext.DocumentAvatar.Add(documentAvatarEntity);
                _DbContext.SaveChanges();

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

        public Response UpdateDocument(DocumentDto documentDto)
        {
            var response = new Response();
            try
            {
                var document = new Document();
                document = _DbContext.Document.FirstOrDefault(e => e.ID == documentDto.ID);
                var listIndividualSample = new List<IndividualSample>();
                listIndividualSample = _DbContext.IndividualSample.Where(i => i.IdDocument == documentDto.ID).ToList();

                if (listIndividualSample.Count > 0)
                {
                    foreach (var individualSample in listIndividualSample)
                    {
                        // Cập nhật giá tiền cho từng IndividualSample
                        individualSample.Price = documentDto.Price;
                    }

                    // Lưu các thay đổi vào cơ sở dữ liệu
                    _DbContext.SaveChanges();
                }

                if (document != null)
                {

                    if (!string.IsNullOrEmpty(documentDto.MagazineNumber))
                    {
                        bool isExistMagazineNumber = _DbContext.Document.ToList().Where(e => e.MagazineNumber != null).Any(e => e.MagazineNumber.Trim().ToString().Equals(documentDto.MagazineNumber.Trim().ToString()) && e.ID != documentDto.ID);

                        if (isExistMagazineNumber)
                        {
                            return new Response()
                            {
                                Success = false,
                                Fail = true,
                                Message = "Số báo này đã tồn tại trong hệ thống !"
                            };
                        }
                        document.MagazineNumber = documentDto.MagazineNumber;
                    }


                    //change data from db
                    document.DocName = String.IsNullOrEmpty(documentDto.DocName)
                        ? document.DocName
                        : documentDto.DocName;
                    document.DocumentTypeId = documentDto.DocumentTypeId == Guid.Empty
                        ? document.DocumentTypeId
                        : documentDto.DocumentTypeId;
                    document.OriginalFileName = String.IsNullOrEmpty(documentDto.OriginalFileName)
                        ? document.OriginalFileName
                        : documentDto.OriginalFileName;
                    document.FileName = String.IsNullOrEmpty(documentDto.FileName)
                        ? document.FileName
                        : documentDto.FileName;
                    document.FileNameExtention = String.IsNullOrEmpty(documentDto.FileNameExtention)
                        ? document.FileNameExtention
                        : documentDto.FileNameExtention;
                    document.FilePath = String.IsNullOrEmpty(documentDto.FilePath)
                        ? document.FilePath
                        : documentDto.FilePath;
                    document.Language = String.IsNullOrEmpty(documentDto.Language)
                        ? document.Language
                        : documentDto.Language;
                    document.Publisher = String.IsNullOrEmpty(documentDto.Publisher)
                        ? document.Publisher
                        : documentDto.Publisher;
                    document.PublishYear = documentDto.PublishYear;
                    document.NumberView =
                        documentDto.NumberView.HasValue ? documentDto.NumberView : document.NumberView;
                    document.NumberLike =
                        documentDto.NumberLike.HasValue ? documentDto.NumberLike : document.NumberLike;
                    document.NumberUnlike = documentDto.NumberUnlike.HasValue
                        ? documentDto.NumberUnlike
                        : document.NumberUnlike;
                    document.ModifiedDate = DateTime.Now;
                    document.ModifiedBy =
                        documentDto.ModifiedBy.HasValue ? documentDto.ModifiedBy : document.ModifiedBy;
                    document.IsApproved =
                        documentDto.IsApproved.HasValue ? documentDto.IsApproved : document.IsApproved;
                    document.ApprovedBy =
                        documentDto.ApprovedBy.HasValue ? documentDto.ApprovedBy : document.ApprovedBy;
                    document.IsHavePhysicalVersion = documentDto.IsHavePhysicalVersion.HasValue
                        ? documentDto.IsHavePhysicalVersion
                        : document.IsHavePhysicalVersion;
                    document.Author = documentDto.Author;
                    document.Status = documentDto.Status.HasValue ? documentDto.Status : document.Status;
                    document.CreatedBy = documentDto.CreatedBy.HasValue ? documentDto.CreatedBy : document.CreatedBy;
                    document.CreatedDate =
                        documentDto.CreatedDate.HasValue ? documentDto.CreatedDate : document.CreatedDate;
                    document.Price = documentDto.Price;
                    document.Description = documentDto.Description;
                    document.IdCategorySign_V1 = documentDto.IdCategorySign_V1.HasValue
                        ? documentDto.IdCategorySign_V1
                        : document.IdCategorySign_V1;
                    document.Sort = documentDto.Sort.HasValue ? documentDto.Sort : document.Sort;
                    document.EncryptDocumentName = documentDto.EncryptDocumentName;
                    document.PublishPlace = documentDto.PublishPlace;
                    document.Supply = documentDto.Supply;
                    document.IdCategoryParent = documentDto.IdCategoryParent;
                    document.IdCategoryColor = documentDto.IdCategoryColor;
                    if (documentDto.IdCategoryColor != null)
                    {
                        document.IdCategoryColor = documentDto.IdCategoryColor;
                    }


                    _DbContext.Document.Update(document);
                    _DbContext.SaveChanges();





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
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception ex)
            {
                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật không thành công !" + ex.Message
                };
                return response;
            }
        }

        public Response UpdateDocumentAvartar(DocumentAvatarDto documentAvatarDto)
        {
            Response response = new Response();
            try
            {
                DocumentAvatar documentAvatar = new DocumentAvatar();
                documentAvatar = _DbContext.DocumentAvatar.Where(e => e.Id == documentAvatarDto.Id).FirstOrDefault();

                if (documentAvatar != null)
                {
                    //change data from db
                    documentAvatar.Path = String.IsNullOrEmpty(documentAvatarDto.Path)
                        ? documentAvatar.Path
                        : documentAvatarDto.Path;
                    documentAvatar.NameFileAvatar = String.IsNullOrEmpty(documentAvatarDto.NameFileAvatar)
                        ? documentAvatar.NameFileAvatar
                        : documentAvatarDto.NameFileAvatar;
                    documentAvatar.FileNameExtention = String.IsNullOrEmpty(documentAvatarDto.FileNameExtention)
                        ? documentAvatar.FileNameExtention
                        : documentAvatarDto.FileNameExtention;
                    documentAvatar.SizeImage = String.IsNullOrEmpty(documentAvatarDto.SizeImage)
                        ? documentAvatar.SizeImage
                        : documentAvatarDto.SizeImage;

                    documentAvatar.Status = documentAvatarDto.Status.HasValue
                        ? documentAvatarDto.Status
                        : documentAvatar.Status;
                    documentAvatar.CreateBy = documentAvatarDto.CreateBy.HasValue
                        ? documentAvatarDto.CreateBy
                        : documentAvatar.CreateBy;
                    documentAvatar.CreateDate = documentAvatarDto.CreateDate.HasValue
                        ? documentAvatarDto.CreateDate
                        : documentAvatar.CreateDate;
                    documentAvatar.IdDocument = documentAvatarDto.IdDocument;


                    _DbContext.DocumentAvatar.Update(documentAvatar);
                    _DbContext.SaveChanges();

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
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
                return response;
            }
        }

        public Response Approved(Guid Id, bool IsApproved, Guid Approved)
        {
            Response response = new Response();
            try
            {
                Document document = _DbContext.Document.Where(x => x.ID == Id).FirstOrDefault();

                if (document != null)
                {
                    document.IsApproved = IsApproved;
                    document.ApprovedBy = Approved;
                    _DbContext.Document.Update(document);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Kích hoạt thành công !"
                    };
                    return response;
                }
                else
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy kết quả !"
                    };

                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Kích hoạt không thành công !"
                };
                return response;
            }
        }

        public CustomApiDocumentAndIndividual customApiDocumentAndIndividuals(Guid Id)
        {
            try
            {
                Document documents = new Document();
                CustomApiDocumentAndIndividual customApiDocumentAndIndividual = new CustomApiDocumentAndIndividual();

                documents = _DbContext.Document.Where(e => e.IsDeleted == false && e.ID == Id && e.IsApproved == true)
                    .FirstOrDefault();
                if (documents != null)
                {
                    customApiDocumentAndIndividual.document = documents;
                    List<IndividualSample> individualSample = _DbContext.IndividualSample
                        .Where(e => e.IsDeleted == false && e.IdDocument == documents.ID).ToList();
                    customApiDocumentAndIndividual.individuals = individualSample;
                }

                return customApiDocumentAndIndividual;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiDocumentAndIndividual customApiDocumentAndIndividualsNotBorrow(Guid Id)
        {
            try
            {
                CustomApiDocumentAndIndividual customApiDocumentAndIndividual = new CustomApiDocumentAndIndividual();
                Document documents = new Document();
                List<IndividualSample> individualSamples = _DbContext.IndividualSample.Where(e =>
                    e.IdDocument == Id &&
                    e.IsDeleted == false && e.Status == 1 && e.IsLostedPhysicalVersion == false).ToList();

                if (individualSamples.Count > 0)
                {
                    documents = _DbContext.Document.Where(e => e.IsDeleted == false && e.ID == Id).FirstOrDefault();
                    if (documents != null)
                    {
                        customApiDocumentAndIndividual.document = documents;
                        customApiDocumentAndIndividual.individuals = individualSamples;
                    }
                }

                return customApiDocumentAndIndividual;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response DeleteDocument(Guid Id)
        {
            try
            {
                var document = _DbContext.Document.Where(x => x.ID == Id).FirstOrDefault();

                if (document != null)
                {
                    var individualSample = _DbContext.IndividualSample
                        .Where(e => e.IdDocument == document.ID && e.IsDeleted == false).FirstOrDefault();

                    if (individualSample != null)
                    {
                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Cuốn sách này đã có mã cá biệt không thể xóa"
                        };
                    }

                    document.IsDeleted = true;
                    _DbContext.Document.Update(document);
                    _DbContext.SaveChanges();

                    return new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
                    };
                }
                else
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
                    Message = "Xóa không thành công !"
                };
            }
        }
        public Response DeleteDocumentInList(Guid Id)
        {
            using (var transaction = _DbContext.Database.BeginTransaction())
            {
                try
                {
                    var document = _DbContext.Document.Where(x => x.ID == Id).FirstOrDefault();

                    if (document != null)
                    {


                        // deleted individual sample by IdDocument before delete document
                        var ListindividualSample = _DbContext.IndividualSample
                        .Where(e => e.IdDocument == document.ID && e.IsDeleted == false).ToList();


                        bool exists = _DbContext.DocumentInvoiceDetail.Any(e => e.IdDocument == document.ID);
                        if (exists)
                        {
                            return new Response()
                            {
                                Success = false,
                                Fail = true,
                                Message = "Cuốn sách (" + document.DocName + ") đã phát sinh phiếu mượn không thể xóa"
                            };
                        }
                        // hidden each individual sample
                        if (ListindividualSample.Count != 0)
                        {
                            foreach (var item in ListindividualSample)
                            {
                                item.IsDeleted = true;
                                _DbContext.IndividualSample.Update(item);
                            }
                        }
                        document.IsDeleted = true;
                        document.ModifiedDate = DateTime.Now;

                        _DbContext.Document.Update(document);
                        _DbContext.SaveChanges();

                        transaction.Commit();

                        return new Response()
                        {
                            Success = true,
                            Fail = false,
                            Message = "Xóa thành công !"
                        };
                    }
                    else
                        return new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Không tìm thấy kết quả !"
                        };
                }
                catch (Exception)
                {
                    transaction.Rollback();

                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Xóa không thành công !"
                    };
                }
            }
        }

        public List<ListBookNew> getBookByCategoryAdminSite(int pageNumber, int pageSize, Guid IdDocumentType)
        {
            try
            {
                List<ListBookNew> bookNewsList = new List<ListBookNew>();
                List<Document> documents = new List<Document>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    documents = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                               && e.DocumentTypeId == IdDocumentType
                                                               && e.IsDeleted == false)
                        .OrderByDescending(e => e.CreatedDate).ToList();
                }
                else
                {
                    documents = _DbContext.Document.Where(e => e.ID != Guid.Empty
                                                               && e.DocumentTypeId == IdDocumentType
                                                               && e.IsDeleted == false)
                        .OrderByDescending(e => e.CreatedDate)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                for (int i = 0; i < documents.Count; i++)
                {
                    ListBookNew bookNews = new ListBookNew();

                    //get category by one book
                    DocumentType documentType = _DbContext.DocumentType
                        .Where(e => e.Id == documents[i].DocumentTypeId).FirstOrDefault();
                    bookNews.NameCategory = documentType.DocTypeName;
                    bookNews.IdCategory = documentType.Id;

                    bookNews.Document = documents[i];
                    // get list avatar by one book
                    var documentAvatar = _DbContext.DocumentAvatar.Where(e => e.IdDocument == documents[i].ID).ToList();

                    bookNews.listAvatar = documentAvatar;
                    bookNewsList.Add(bookNews);
                }

                return bookNewsList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public CustomApiListDocumentByStock ListDocumentByBarcode(string barcode)
        {
            try
            {
                CustomApiListDocumentByStock customApiListDocumentByStock = new CustomApiListDocumentByStock();
                IndividualSample individualSample = _DbContext.IndividualSample.Where(e => e.Barcode == barcode
                    && e.IsDeleted == false && e.IsLostedPhysicalVersion == false
                    && e.Status == 1).FirstOrDefault();

                if (individualSample != null)
                {
                    Document document = _DbContext.Document
                        .Where(e => e.ID == individualSample.IdDocument && e.IsDeleted == false).FirstOrDefault();

                    if (document != null)
                    {
                        customApiListDocumentByStock.IdDocument = document.ID;
                        customApiListDocumentByStock.NameDocument = document.DocName;
                    }

                    return customApiListDocumentByStock;
                }
                else
                {
                    return customApiListDocumentByStock;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<SuggestSearch> SuggestSearchBook(string values)
        {
            try
            {
                List<SuggestSearch> suggestSearches = new List<SuggestSearch>();

                List<Document> documents = _DbContext.Document.AsNoTracking().Where(e => e.IsDeleted == false
                        && e.IsApproved == true
                        && e.DocName.ToLower().Contains(values.ToLower().Trim()))
                    .ToList();

                for (int i = 0; i < documents.Count; i++)
                {
                    SuggestSearch suggestSearch = new SuggestSearch();

                    suggestSearch.IdDocument = documents[i].ID;
                    suggestSearch.NameDocument = documents[i].DocName;

                    suggestSearches.Add(suggestSearch);
                }

                return suggestSearches;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion
    }
}