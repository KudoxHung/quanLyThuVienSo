using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class SchoolYearRepository : ISchoolYearRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors
        public SchoolYearRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }
        #endregion

        #region CRUD TABLE SCHOOLYEAR
        public async Task<Response> DeleteSchoolYear(Guid Id)
        {
            Response response = new Response();
            try
            {
                SchoolYear schoolYear = _DbContext.SchoolYear.Where(x => x.Id == Id).FirstOrDefault();

                if (schoolYear != null)
                {
                    _DbContext.SchoolYear.Remove(schoolYear);
                    await _DbContext.SaveChangesAsync();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
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
                    Message = "Xóa không thành công !"
                };
                return response;
            }
        }
        public List<SchoolYearDto> getSchoolYear(int pageNumber, int pageSize)
        {
            try
            {
                List<SchoolYear> schoolYears = new List<SchoolYear>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    schoolYears = _DbContext.SchoolYear.
                    Where(e => e.Id != Guid.Empty)
                    .OrderByDescending(e => e.CreatedDate)
                    .ToList();
                }
                else
                {
                    schoolYears = _DbContext.SchoolYear.
                    Where(e => e.Id != Guid.Empty )
                    .OrderByDescending(e => e.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<SchoolYearDto> schoolYearsLst = new List<SchoolYearDto>();
                schoolYearsLst = _mapper.Map<List<SchoolYearDto>>(schoolYears);
                return schoolYearsLst;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<SchoolYearDto> getSchoolYearActive(int pageNumber, int pageSize)
        {
            try
            {
                List<SchoolYear> schoolYears = new List<SchoolYear>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    schoolYears = _DbContext.SchoolYear.
                    Where(e => e.Id != Guid.Empty && e.IsActived == true)
                    .OrderByDescending(e => e.CreatedDate)
                    .ToList();
                }
                else
                {
                    schoolYears = _DbContext.SchoolYear.
                    Where(e => e.Id != Guid.Empty && e.IsActived == true)
                    .OrderByDescending(e => e.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<SchoolYearDto> schoolYearsLst = new List<SchoolYearDto>();
                schoolYearsLst = _mapper.Map<List<SchoolYearDto>>(schoolYears);
                return schoolYearsLst;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<SchoolGradeDto> getSchoolGrade(int pageNumber, int pageSize)
        {
            try
            {
                List<SchoolGrade> schoolGrade = new List<SchoolGrade>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    schoolGrade = _DbContext.SchoolGrade.
                    Where(e => e.Id != Guid.Empty)
                    .OrderBy(e => e.STT)
                    .ToList();
                }
                else
                {
                    schoolGrade = _DbContext.SchoolGrade.
                    Where(e => e.Id != Guid.Empty)
                    .OrderBy(e => e.STT)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<SchoolGradeDto> schoolYearsLst = new List<SchoolGradeDto>();
                schoolYearsLst = _mapper.Map<List<SchoolGradeDto>>(schoolGrade);
                return schoolYearsLst;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<SchoolDto> getSchool(int pageNumber, int pageSize)
        {
            try
            {
                List<School> schoolGrade = new List<School>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    schoolGrade = _DbContext.School.
                    Where(e => e.Id != Guid.Empty)
                    .OrderBy(e => e.Name)
                    .ToList();
                }
                else
                {
                    schoolGrade = _DbContext.School.
                    Where(e => e.Id != Guid.Empty)
                    .OrderBy(e => e.Name)
                    .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<SchoolDto> schoolYearsLst = new List<SchoolDto>();
                schoolYearsLst = _mapper.Map<List<SchoolDto>>(schoolGrade);
                return schoolYearsLst;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<SchoolDto> getSchoolByGrade(int pageNumber, int pageSize, List<Guid> gradeId)
        {
            try
            {
                List<School> schoolGrade = new List<School>();
                if (pageNumber == 0 && pageSize == 0)
                {
                    schoolGrade = _DbContext.School.
                    Where(e => e.Id != Guid.Empty && gradeId.Contains(e.GradeId))
                    .OrderBy(e => e.Name)
                    .ToList();
                }
                else
                {
                    if (gradeId != null && gradeId.Count > 0)
                    {
                        schoolGrade = _DbContext.School.
                   Where(e => e.Id != Guid.Empty && gradeId.Contains(e.GradeId))
                   .OrderBy(e => e.Name)
                   .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                    }
                    else
                    {
                        schoolGrade = _DbContext.School.
                   Where(e => e.Id != Guid.Empty)
                   .OrderBy(e => e.Name)
                   .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                    }

                }

                List<SchoolDto> schoolYearsLst = new List<SchoolDto>();
                schoolYearsLst = _mapper.Map<List<SchoolDto>>(schoolGrade);
                return schoolYearsLst;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //, 
        public SchoolYearDto getSchoolYear(Guid Id)
        {
            try
            {
                SchoolYear schoolYear = _DbContext.SchoolYear.
                Where(e => e.Id == Id).FirstOrDefault();

                SchoolYearDto schoolYearDto = new SchoolYearDto();
                schoolYearDto = _mapper.Map<SchoolYearDto>(schoolYear);
                return schoolYearDto;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public SchoolYearDto getSchoolYear()
        {
            try
            {
                SchoolYear schoolYear = _DbContext.SchoolYear.
                Where(e => e.IsActived == true)
                .OrderByDescending(e => e.CreatedDate)
                .FirstOrDefault();

                SchoolYearDto schoolYearDto = new SchoolYearDto();
                schoolYearDto = _mapper.Map<SchoolYearDto>(schoolYear);
                return schoolYearDto;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public Response ActiveYear(Guid Id, bool IsActive)
        {
            Response response = new Response();
            try
            {
                SchoolYear schoolYear = _DbContext.SchoolYear.Where(x => x.Id == Id).FirstOrDefault();

                if (schoolYear != null)
                {
                    schoolYear.IsActived = IsActive;
                    _DbContext.SchoolYear.Update(schoolYear);
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
        public async Task<Response> InsertSchoolYear(SchoolYearDto schoolYearDto)
        {
            Response response = new Response();
            try
            {
                SchoolYear schoolYear = new SchoolYear();
                schoolYear = _mapper.Map<SchoolYear>(schoolYearDto);

                _DbContext.SchoolYear.Add(schoolYear);
                await _DbContext.SaveChangesAsync();

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
        public async Task<Response> UpdateSchoolYear(SchoolYearDto schoolYearDto)
        {
            Response response = new Response();
            try
            {
                SchoolYear schoolYear = new SchoolYear();
                schoolYear = _DbContext.SchoolYear.Where(e => e.Id == schoolYearDto.Id).FirstOrDefault();

                if (schoolYear != null)
                {
                    schoolYear.StartSemesterI = schoolYearDto.StartSemesterI.HasValue ? schoolYearDto.StartSemesterI : schoolYear.StartSemesterI;
                    schoolYear.StartSemesterII = schoolYearDto.StartSemesterII.HasValue ? schoolYearDto.StartSemesterII : schoolYear.StartSemesterII;
                    schoolYear.EndAllSemester = schoolYearDto.EndAllSemester.HasValue ? schoolYearDto.EndAllSemester : schoolYear.EndAllSemester;
                    schoolYear.IsActived = schoolYearDto.IsActived.HasValue ? schoolYearDto.IsActived : schoolYear.IsActived;
                    schoolYear.Status = schoolYearDto.Status.HasValue ? schoolYearDto.Status : schoolYear.Status;
                    schoolYear.CreatedBy = schoolYearDto.CreatedBy.HasValue ? schoolYearDto.CreatedBy : schoolYear.CreatedBy;
                    schoolYear.CreatedDate = schoolYearDto.CreatedDate.HasValue ? schoolYearDto.CreatedDate : schoolYear.CreatedDate;
                    schoolYear.FromYear = schoolYear.StartSemesterI;
                    schoolYear.ToYear = schoolYear.EndAllSemester;

                    _DbContext.SchoolYear.Update(schoolYear);
                    await _DbContext.SaveChangesAsync();

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

        #endregion

        #region Báo cáo sách theo trường 

        public List<ReportDocumentTotalDto> getReportSchool(FilterDto filterDto)
        {
            List<ReportDocumentTotalDto> reportSchoolDtos = new List<ReportDocumentTotalDto>();

            var schoolDocumentQueryable = _DbContext.SchoolDocuments.AsQueryable();
    
            var schoolQueryable = _DbContext.School.AsQueryable();
            var schoolyear = new SchoolYear();
            // Xử lý filter theo năm học , tìm kiếm theo CreateDate
            if (filterDto.YearId != Guid.Empty)
            {
                schoolyear = _DbContext.SchoolYear.Where(x => x.IsActived == true).FirstOrDefault(e => e.Id == filterDto.YearId);
                //schoolDocumentQueryable = schoolDocumentQueryable.Where(e => e.CreatedDate >= schoolyear.FromYear.Value && e.CreatedDate <= schoolyear.ToYear.Value);
            }
            // Xử lý filter theo Cấp học 
            if (filterDto?.GradeId.Count() > 0)
            {
                schoolDocumentQueryable = schoolDocumentQueryable.Where(e => filterDto.GradeId.Contains(e.School.GradeId));
                schoolQueryable = schoolQueryable.Where(e => filterDto.GradeId.Contains(e.GradeId));
            }
            // Xử lý filter theo Trường học 
            if (filterDto?.SchoolId.Count() > 0)
            {
                schoolDocumentQueryable = schoolDocumentQueryable.Where(e => filterDto.SchoolId.Contains(e.SchoolId));
                schoolQueryable = schoolQueryable.Where(e => filterDto.SchoolId.Contains(e.Id));
            }

            var _Schools = schoolQueryable.Where(e => e.Id != Guid.Empty).OrderBy(e => e.Name).Select(e => new SchoolDto()
            {
                Id = e.Id,
                Name = e.Name,
                Code = e.Code,
                GradeId = e.GradeId,
                Grade = new SchoolGradeDto()
                {
                    Id = e.Grade.Id,
                    Name = e.Grade.Name,
                    Code = e.Grade.Code,
                }

            }).ToList();
            
            var schoolDocumentQueryable2 = from document in schoolDocumentQueryable
                                           join individual in _DbContext.SchoolDocumentIndividual
                                           on document.Id equals individual.DocumentId
                                          
                                           select new
                                           {
                                               document.SchoolId,          // Chọn SchoolId từ bảng SchoolDocuments
                                               individual.DocTypeName     // Chọn DocTypeName từ bảng SchoolDocumentIndividual
                                               ,individual.CreatedDate
                                           };
            List<DigitalLibary.Data.Entity.SchoolReceiptDetail> listIdIndi = _DbContext.SchoolReceiptDetail.Where(x => x.ReceiptType ==1 && x.Status == 1).ToList();
            if (filterDto.YearId!=Guid.Empty)
            {
                //schoolDocumentQueryable2=schoolDocumentQueryable2.Where(x => x.CreatedDate >= schoolyear.FromYear.Value && x.CreatedDate <= schoolyear.ToYear.Value);
                //listIdIndi = listIdIndi.Where(x => x.CreateDateIndi >= schoolyear.FromYear.Value && x.CreateDateIndi <= schoolyear.ToYear.Value).ToList();
                schoolDocumentQueryable2=schoolDocumentQueryable2.Where(x => x.CreatedDate <= schoolyear.ToYear.Value);
                listIdIndi = listIdIndi.Where(x => x.CreateDateIndi <= schoolyear.ToYear.Value).ToList();
            }
            else
            {
                var firstSchoolYear = _DbContext.SchoolYear.Where(x => x.IsActived == true)
                       .OrderBy(sy => sy.CreatedDate)
                       .FirstOrDefault();

                var lastSchoolYear = _DbContext.SchoolYear.Where(x => x.IsActived == true)
                                        .OrderByDescending(sy => sy.CreatedDate)
                                        .FirstOrDefault();

                //schoolDocumentQueryable2=schoolDocumentQueryable2.Where(x => x.CreatedDate >= firstSchoolYear.FromYear.Value && x.CreatedDate <= lastSchoolYear.ToYear.Value);
                //listIdIndi = listIdIndi.Where(x => x.CreateDateIndi >= firstSchoolYear.FromYear.Value && x.CreateDateIndi <= lastSchoolYear.ToYear.Value).ToList();schoolDocumentQueryable2=schoolDocumentQueryable2.Where(x => x.CreatedDate >= firstSchoolYear.FromYear.Value && x.CreatedDate <= lastSchoolYear.ToYear.Value);
                schoolDocumentQueryable2=schoolDocumentQueryable2.Where(x => x.CreatedDate <= lastSchoolYear.ToYear.Value);
                listIdIndi = listIdIndi.Where(x => x.CreateDateIndi <= lastSchoolYear.ToYear.Value).ToList();
            }
          

            foreach (var schoolItem in _Schools)
            {
                try
                {
                    ReportDocumentTotalDto reportSchoolDto = new()
                    {
                        Key = schoolItem.Id,
                        School = schoolItem,
                        Name = schoolItem.Name,
                    };
                    if (schoolDocumentQueryable2.Any())
                    {
                        reportSchoolDto.SachGiaoKhoa = schoolDocumentQueryable2.Where(a => a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() == "sách giáo khoa").Count()+
                             listIdIndi.Where(a => a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() == "sách giáo khoa").Count();
                        reportSchoolDto.SachThieuNhi = schoolDocumentQueryable2.Where(a => a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() == "sách thiếu nhi").Count()+
                            listIdIndi.Where(a => a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() == "sách thiếu nhi").Count();
                        reportSchoolDto.SachNghiemVu = schoolDocumentQueryable2.Where(a => a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() == "sách nghiệp vụ").Count()+
                            listIdIndi.Where(a => a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() == "sách nghiệp vụ").Count();
                        reportSchoolDto.SachThamKhao = schoolDocumentQueryable2.Where(a => a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() == "sách tham khảo").Count()+
                            listIdIndi.Where(a => a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() == "sách tham khảo").Count();
                        reportSchoolDto.SachKhac = schoolDocumentQueryable2.Where(a => a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() != "sách tham khảo"
                                                              && a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() != "sách nghiệp vụ"
                                                              && a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() != "sách thiếu nhi"
                                                              && a.SchoolId == schoolItem.Id && a.DocTypeName.ToLower() != "sách giáo khoa").Count()+
                                                   listIdIndi.Where(a => a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() != "sách tham khảo"
                                                              && a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() != "sách nghiệp vụ"
                                                              && a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() != "sách thiếu nhi"
                                                              && a.IdSchool == schoolItem.Id && a.DocTypeName.ToLower() != "sách giáo khoa").Count();
                    }
                    reportSchoolDtos.Add(reportSchoolDto);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }

            }

            return reportSchoolDtos;
        }




        public List<ReportDocumentDetailDto> getReportSchoolDetail(FilterDto filterDto)
        {
            List<ReportDocumentDetailDto> reportDetailDtos = new List<ReportDocumentDetailDto>();

            var schoolDocumentQueryable = _DbContext.SchoolDocuments
                .Include(d => d.School) // Nạp thông tin về trường
                .Join(
                    _DbContext.SchoolDocumentIndividual, // Bảng cần join
                    doc => doc.Id,                       // Khóa chính từ SchoolDocuments
                    individual => individual.DocumentId,      // Khóa đối ứng từ SchoolDocumentIndividual
                    (doc, individual) => new
                    {
                        SchoolDocument = doc,
                        SchoolDocumentIndividual = individual
                    }
                )
                .AsQueryable();

         
            var schoolAuditDetailQueryable = _DbContext.SchoolAuditDetail
                .Include(a => a.School) // Nạp thông tin về trường
                .AsQueryable();
            var schoolQueryable = _DbContext.School.AsQueryable();// lấy theo trường học nào
            var schoolyear = new SchoolYear();

            // Xử lý filter theo năm học , tìm kiếm theo CreateDate
            if (filterDto.YearId != Guid.Empty)
            {
                schoolyear = _DbContext.SchoolYear.Where(x => x.IsActived == true).FirstOrDefault(e => e.Id == filterDto.YearId);
            }
            // Xử lý filter theo Cấp học 
            if (filterDto?.GradeId.Count() > 0)
            {
                schoolAuditDetailQueryable = schoolAuditDetailQueryable.Where(e => filterDto.GradeId.Contains(e.School.GradeId));
                schoolDocumentQueryable = schoolDocumentQueryable.Where(e => filterDto.GradeId.Contains(e.SchoolDocument.School.GradeId));
                schoolQueryable = schoolQueryable.Where(e => filterDto.GradeId.Contains(e.GradeId));
            }
            // Xử lý filter theo Trường học 
            if (filterDto?.SchoolId.Count() > 0)
            {
                schoolAuditDetailQueryable = schoolAuditDetailQueryable.Where(e => filterDto.SchoolId.Contains(e.School.Id));
                schoolDocumentQueryable = schoolDocumentQueryable.Where(e => filterDto.SchoolId.Contains(e.SchoolDocument.School.Id));
                schoolQueryable = schoolQueryable.Where(e => filterDto.SchoolId.Contains(e.Id));
            }

            

            var _Schools = schoolQueryable.Where(e => e.Id != Guid.Empty).OrderBy(e => e.Name).Select(e => new SchoolDto()
            {
                Id = e.Id,
                Name = e.Name,
                GradeId = e.GradeId,
                Grade = new SchoolGradeDto()
                {
                    Id = e.Grade.Id,
                    Name = e.Grade.Name,
                    Code = e.Grade.Code,
                }
            }).ToList();

            foreach (var schoolItem in _Schools)
            {
                try
                {
                    ReportDocumentDetailDto reportDetailDto = new ReportDocumentDetailDto()
                    {
                        School = schoolItem
                    };

                    reportDetailDto.School=schoolItem;
                    reportDetailDto.Key = schoolItem.Id;
                    reportDetailDto.Name = schoolItem.Name;

                    if (filterDto.YearId == Guid.Empty)
                    {
                        var firstSchoolYear = _DbContext.SchoolYear.Where(x => x.IsActived == true)
                       .OrderBy(sy => sy.CreatedDate)
                       .FirstOrDefault();

                        var lastSchoolYear = _DbContext.SchoolYear.Where(x => x.IsActived == true)
                                                .OrderByDescending(sy => sy.CreatedDate)
                                                .FirstOrDefault();
                        var XuatSachNamNgoai = _DbContext.SchoolReceiptDetail.Where(srd => srd.IdSchool == schoolItem.Id && srd.ReceiptType == 1 && srd.Status == 1&& srd.CreateDate >= firstSchoolYear.FromYear.Value && srd.CreateDate <lastSchoolYear.FromYear.Value).Count();
                        var XuatSachNamNay = _DbContext.SchoolReceiptDetail.Where(srd => srd.IdSchool == schoolItem.Id && srd.ReceiptType == 1 && srd.Status == 1&& srd.CreateDate >= firstSchoolYear.FromYear.Value && srd.CreateDate <=lastSchoolYear.ToYear.Value).Count();
                        List<DigitalLibary.Data.Entity.SchoolReceiptDetail> listIdIndi = _DbContext.SchoolReceiptDetail.Where(x => x.ReceiptType ==1 && x.Status == 1).ToList();
                        

                        #region XuatSachTrongNam
                        reportDetailDto.XuatSach = XuatSachNamNay;
                        #endregion

                        #region DauNam,CuoiNam

                        var query = _DbContext.SchoolDocumentIndividual.AsQueryable();
                        var totalBookStartYear = 0;
                        if (lastSchoolYear.FromYear.HasValue)
                        {
                            query = query.Where(s =>s.SchoolId == schoolItem.Id && s.CreatedDate < lastSchoolYear.FromYear.Value);
                            totalBookStartYear = query.Count();

                            listIdIndi = listIdIndi.Where(x => x.IdSchool==schoolItem.Id && x.CreateDateIndi < lastSchoolYear.FromYear.Value).ToList();
                            
                        }
                        reportDetailDto.DauNam=totalBookStartYear + listIdIndi.Count() - XuatSachNamNgoai;
                        listIdIndi = _DbContext.SchoolReceiptDetail.Where(x => x.ReceiptType ==1 && x.Status == 1).ToList();

                        query =_DbContext.SchoolDocumentIndividual.AsQueryable();
                        if (lastSchoolYear.ToYear.HasValue)
                        {
                            query = query.Where(s => s.SchoolId == schoolItem.Id && s.CreatedDate <= lastSchoolYear.ToYear.Value);
                            listIdIndi = listIdIndi.Where(x => x.IdSchool==schoolItem.Id && x.CreateDateIndi <= lastSchoolYear.ToYear.Value).ToList();
                        }
                        //var totalBookEndYear = query.Count() - XuatSachNamNay;
                        var totalBookEndYear = query.Count() ;
                        reportDetailDto.CuoiNam=totalBookEndYear + listIdIndi.Count() - XuatSachNamNay;

                        #endregion

                        #region LacHau,RachNat,Mat

                        if (schoolAuditDetailQueryable.Count() > 0)
                        {
                            reportDetailDto.RachNat = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= firstSchoolYear.FromYear.Value && a.CreatedDate <= lastSchoolYear.ToYear.Value && a.SchoolId == schoolItem.Id && a.StatusName.ToLower().Contains("rách nát")).Count();
                            reportDetailDto.LacHau = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= firstSchoolYear.FromYear.Value && a.CreatedDate <= lastSchoolYear.ToYear.Value && a.SchoolId == schoolItem.Id && a.StatusName.ToLower().Contains("lạc hậu")).Count();
                            reportDetailDto.Mat = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= firstSchoolYear.FromYear.Value && a.CreatedDate <= lastSchoolYear.ToYear.Value && a.SchoolId == schoolItem.Id && (a.WasLost == true || a.IsLostedPhysicalVersion == true)).Count();
                        }
                        #endregion
                        reportDetailDtos.Add(reportDetailDto);
                    }
                    else
                    {
                        DateTime? preFromYear = new DateTime(schoolyear.FromYear.Value.Year - 1, 8, 1);
                        DateTime? preToYear = new DateTime(schoolyear.FromYear.Value.Year, 7, 31);
                        var XuatSachNamNgoai = _DbContext.SchoolReceiptDetail.Where(srd => srd.IdSchool == schoolItem.Id && srd.ReceiptType == 1 && srd.Status == 1&& srd.CreateDate >= preFromYear.Value && srd.CreateDate < schoolyear.FromYear.Value).Count();
                        var XuatSachNamNay = _DbContext.SchoolReceiptDetail.Where(srd => srd.IdSchool == schoolItem.Id && srd.ReceiptType == 1 && srd.Status == 1 && srd.CreateDate >= schoolyear.FromYear.Value && srd.CreateDate <= schoolyear.ToYear.Value).Count();
                        List<DigitalLibary.Data.Entity.SchoolReceiptDetail> listIdIndi = _DbContext.SchoolReceiptDetail.Where(x => x.ReceiptType ==1 && x.Status == 1).ToList();


                        #region XuatSachTrongNam
                        reportDetailDto.XuatSach = XuatSachNamNay;
                        #endregion

                        #region DauNam,CuoiNam

                        var query = _DbContext.SchoolDocumentIndividual.AsQueryable();
                        var totalBookStartYear = 0;
                        if (schoolyear.FromYear.HasValue)
                        {
                            query = query.Where(s => s.SchoolId == schoolItem.Id && s.CreatedDate < schoolyear.FromYear.Value);
                            //totalBookStartYear = query.Count() - XuatSachNamNgoai;
                            totalBookStartYear = query.Count() ;

                            listIdIndi = listIdIndi.Where(x => x.IdSchool == schoolItem.Id && x.CreateDateIndi < schoolyear.FromYear.Value).ToList();
                        }
                        reportDetailDto.DauNam=totalBookStartYear + listIdIndi.Count() - XuatSachNamNgoai;
                        listIdIndi = _DbContext.SchoolReceiptDetail.Where(x => x.ReceiptType == 1 && x.Status == 1).ToList();

                        query =_DbContext.SchoolDocumentIndividual.AsQueryable();
                        if (schoolyear.ToYear.HasValue)
                        {
                            query = query.Where(s => s.SchoolId == schoolItem.Id && s.CreatedDate <= schoolyear.ToYear.Value);

                            listIdIndi = listIdIndi.Where(x => x.IdSchool == schoolItem.Id && x.CreateDateIndi <= schoolyear.ToYear.Value).ToList();
                        }
                        //var totalBookEndYear = query.Count() - XuatSachNamNay;
                        var totalBookEndYear = query.Count() ;
                        reportDetailDto.CuoiNam=totalBookEndYear + listIdIndi.Count() - XuatSachNamNay;

                        #endregion

                        #region LacHau,RachNat,Mat

                        if (schoolAuditDetailQueryable.Count() > 0)
                        {
                            reportDetailDto.RachNat = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= schoolyear.FromYear.Value && a.CreatedDate <= schoolyear.ToYear.Value && a.SchoolId == schoolItem.Id && a.StatusName.ToLower().Contains("rách nát")).Count();
                            reportDetailDto.LacHau = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= schoolyear.FromYear.Value && a.CreatedDate <= schoolyear.ToYear.Value && a.SchoolId == schoolItem.Id && a.StatusName.ToLower().Contains("lạc hậu")).Count();
                            reportDetailDto.Mat = schoolAuditDetailQueryable.Where(a => a.CreatedDate >= schoolyear.FromYear.Value && a.CreatedDate <= schoolyear.ToYear.Value && a.SchoolId == schoolItem.Id && (a.WasLost == true || a.IsLostedPhysicalVersion == true)).Count();
                        }
                        #endregion
                        reportDetailDtos.Add(reportDetailDto);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
            }

            return reportDetailDtos;
        }

        #endregion
    }
}
