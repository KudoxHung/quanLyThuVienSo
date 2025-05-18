﻿using AutoMapper;
using DigitalLibary.Service.Dto;
using DigitalLibary.WebApi.Payload;

namespace DigitalLibary.Service.Common
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // INIT MAP DATA FROM MODEL TO DTO AND REVERSE
            CreateMap<SupplyDto, SupplyModel>().ReverseMap();
            CreateMap<RestDateDto, RestDayModel>().ReverseMap();
            CreateMap<RestDayModel, RestDateDto>().ReverseMap();
            CreateMap<SchoolYearDto, SchoolYearModel>().ReverseMap();
            CreateMap<ContactAndIntroductionDto, ContactAndIntroductionModel>().ReverseMap();
            CreateMap<DocumentStockDto, DocumentStockModel>().ReverseMap();
            CreateMap<IndividualSampleDto, IndividualSampleModel>().ReverseMap();
            CreateMap<DocumentDto, DocumentModel>().ReverseMap();
            CreateMap<CategorySignDto, CategorySignModel>().ReverseMap();
            CreateMap<UserDTO, UserModel>().ReverseMap().ForMember(x => x.AcitveUser, opt => opt.Ignore()).ForMember(x => x.ExpireDayUser, opt => opt.Ignore());
            CreateMap<UnitDto, UnitModel>().ReverseMap();
            CreateMap<SlideDto, SlideModel>().ReverseMap();
            CreateMap<DocumentTypeDto, DocumentTypeModel>().ReverseMap();
            CreateMap<DocumentInvoiceDto, DocumentInvoiceModel>().ReverseMap();
            CreateMap<ReceiptDto, ReceiptModel>().ReverseMap();
            CreateMap<CategorySign_V1Dto, CategorySign_V1Model>().ReverseMap();
            CreateMap<ParticipantsDto, ParticipantsModel>().ReverseMap();
            CreateMap<DocumentDto, DocumentAndIndividualSampleModel>().ReverseMap();
            CreateMap<AuditReceiptDto, AuditReceiptModel>().ReverseMap();
            CreateMap<AuditorListDto, AuditorListModel>().ReverseMap();
            CreateMap<AuditBookListDto, AuditBookListModel>().ReverseMap();
            CreateMap<SchoolGradeDto, SchoolGradeModel>().ReverseMap();
            CreateMap<SchoolDto, SchoolModel>().ReverseMap();
            CreateMap<SchoolDocumentsDto, SchoolDocumentsModel>().ReverseMap();
            CreateMap<ReportSchoolDto, ReportSchoolModel>().ReverseMap();
            CreateMap<ReportDocumentTotalDto, ReportDocumentTotalModel>().ReverseMap();
            CreateMap<ReportDocumentDetailDto, ReportDocumentDetailModel>().ReverseMap();
            CreateMap<SchoolAuditDetailDto, SchoolAuditDetailModel>().ReverseMap();
            //SchoolAuditDetail

            CreateMap<CategorySignParentsDto, CategorySignParentModel>().ReverseMap();
        }
    }
}
