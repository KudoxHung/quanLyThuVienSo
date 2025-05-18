import { lazy, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useCheckUnitPrefix } from "../hooks/useCheckUnitPrefix";
import { PrintSpineAll } from "../package/admin/components/printSpine/PrintSpiceAll";
import { AlbumBookIndexesTwin } from "../package/admin/features/AlbumBookIndexesTwin";
import { AuditBookLayout, EditAuditBookLayout, NewAuditBookLayout } from "../package/admin/features/auditBook";
//import { CategorySignParentLayout, NewCategorySignParentLayout } from "../package/admin/features/categorySignParent";
import { CategoryVideoElearningSound } from "../package/admin/features/CategoryVideoElearningSound";
import { DocumentDigitalConnectApprove } from "../package/admin/features/documentDigitalConnect/page/DocumentDigitalConnectApprove";
import { GroupVideoElearningSound } from "../package/admin/features/GroupVideoElearningSound";
import { MagazineRegister } from "../package/admin/features/magazineRegister/page/MagazineRegister";
import { EditBookEntryTicket } from "../package/admin/features/manageBookEntryTicket/components/EditBookEntryTicket";
// Import VoucherExport
import { EditVoucherExport } from "../package/admin/features/manageVoucherExport/components/EditVoucherExport";
import { PrintAllBookNape } from "../package/admin/features/specialRegistrationBooks";
import { NewStatusBook, StatusBook } from "../package/admin/features/StatusBook";
import { EditStatusBook } from "../package/admin/features/StatusBook/components/EditStatusBook";
import { VideoElearningSound } from "../package/admin/features/VideoElearningSound";
import { PrivateRoutes, PublicRoutes } from "../package/admin/routes";
import Loading from "../package/client/utils/loading";
import { Button, Result } from "antd";
// import {
//   Main,
//   PrintLibraryCard,
//   PrintSpine,
// } from "../package/admin/components";
const Main = lazy(() =>
  import("../package/admin/components").then((module) => ({
    default: module.Main
  }))
);
const PrintLibraryCard = lazy(() =>
  import("../package/admin/components").then((module) => ({
    default: module.PrintLibraryCard
  }))
);
const PrintSpine = lazy(() =>
  import("../package/admin/components").then((module) => ({
    default: module.PrintSpine
  }))
);
// import { LoginAdminLayout } from "../package/admin/features/auth";
const LoginAdminLayout = lazy(() =>
  import("../package/admin/features/auth").then((module) => ({
    default: module.LoginAdminLayout
  }))
);
// import { BookAttemptLayout } from "../package/admin/features/bookAttempt";
const BookAttemptLayout = lazy(() =>
  import("../package/admin/features/bookAttempt/page/BookAttemptLayout").then((module) => ({
    default: module.BookAttemptLayout
  }))
);
// import {
//   EditBooksManage,
//   NewBooksManege,
// } from "../package/admin/features/booksManage/components";
const EditBooksManage = lazy(() =>
  import("../package/admin/features/booksManage/components").then((module) => ({
    default: module.EditBooksManage
  }))
);
const NewBooksManege = lazy(() =>
  import("../package/admin/features/booksManage/components").then((module) => ({
    default: module.NewBooksManege
  }))
);
// import { BooksManageLayout } from "../package/admin/features/booksManage/page/BooksManageLayout";
const BooksManageLayout = lazy(() =>
  import("../package/admin/features/booksManage/page/BooksManageLayout").then((module) => ({
    default: module.BooksManageLayout
  }))
);
// import { BookStatisticsByType } from "../package/admin/features/bookStatisticsByType";
const BookStatisticsByType = lazy(() =>
  import("../package/admin/features/bookStatisticsByType").then((module) => ({
    default: module.BookStatisticsByType
  }))
);
// import { BookTotal } from "../package/admin/features/BookTotal";
const BookTotal = lazy(() =>
  import("../package/admin/features/bookTotal").then((module) => ({
    default: module.BookTotal
  }))
);
// import { BookStatusTotal } from "../package/admin/features/BookStatusTotal";
const BookStatusTotal = lazy(() =>
  import("../package/admin/features/BookStatusTotal").then((module) => ({
    default: module.BookStatusTotal
  }))
);
// import { CategoryBooksManageLayout } from "../package/admin/features/categoryBooksManage";
const CategoryBooksManageLayout = lazy(() =>
  import("../package/admin/features/categoryBooksManage").then((module) => ({
    default: module.CategoryBooksManageLayout
  }))
);
// import { NewCategorybooks } from "../package/admin/features/categoryBooksManage/components";
const NewCategoryBooks = lazy(() =>
  import("../package/admin/features/categoryBooksManage/components/newCategoryBooks/NewCategorybooks").then(
    (module) => ({
      default: module.NewCategoryBooks
    })
  )
);
// import { EditCategoryBooks } from "../package/admin/features/categoryBooksManage/components/editCategoryBooks/EditCategoryBooks";
const EditCategoryBooks = lazy(() =>
  import("../package/admin/features/categoryBooksManage/components/editCategoryBooks/EditCategoryBooks").then(
    (module) => ({
      default: module.EditCategoryBooks
    })
  )
);
// import { BooksByCategoryLayout } from "../package/admin/features/categoryBooksManage/page/BooksByCategoryLayout";
const BooksByCategoryLayout = lazy(() =>
  import("../package/admin/features/categoryBooksManage/page/BooksByCategoryLayout").then((module) => ({
    default: module.BooksByCategoryLayout
  }))
);
// import {
//   CategoryMagazineManage,
//   MagazineByCategoryLayout,
// } from "../package/admin/features/categoryManagizeManage";
const CategoryMagazineManage = lazy(() =>
  import("../package/admin/features/categoryManagizeManage").then((module) => ({
    default: module.CategoryMagazineManage
  }))
);
const MagazineByCategoryLayout = lazy(() =>
  import("../package/admin/features/categoryManagizeManage").then((module) => ({
    default: module.MagazineByCategoryLayout
  }))
);
// import { NewCategoryMagazine } from "../package/admin/features/categoryManagizeManage/components";
const NewCategoryMagazine = lazy(() =>
  import("../package/admin/features/categoryManagizeManage/components").then((module) => ({
    default: module.NewCategoryMagazine
  }))
);
// import { EditCategoryMagazine } from "../package/admin/features/categoryManagizeManage/components/editCategoryMagazine/EditCategoryMagazine";
const EditCategoryMagazine = lazy(() =>
  import("../package/admin/features/categoryManagizeManage/components/editCategoryMagazine/EditCategoryMagazine").then(
    (module) => ({
      default: module.EditCategoryMagazine
    })
  )
);
// import { CategoryPublishersLayout } from "../package/admin/features/categoryPublishers";
const CategoryPublishersLayout = lazy(() =>
  import("../package/admin/features/categoryPublishers").then((module) => ({
    default: module.CategoryPublishersLayout
  }))
);
// import { EditPublishers } from "../package/admin/features/categoryPublishers/components";
const EditPublishers = lazy(() =>
  import("../package/admin/features/categoryPublishers/components").then((module) => ({
    default: module.EditPublishers
  }))
);
// import NewPublisher from "../package/admin/features/categoryPublishers/components/newPublishers/NewPublisher";
const NewPublisher = lazy(
  () => import("../package/admin/features/categoryPublishers/components/newPublishers/NewPublisher")
);

// import { EditCategorySign } from "../package/admin/features/categorySign/components";
const EditCategorySign = lazy(() =>
  import("../package/admin/features/categorySign/components").then((module) => ({
    default: module.EditCategorySign
  }))
);
// import NewCategorySign from "../package/admin/features/categorySign/components/newCategorySign/NewCategorySign";
const NewCategorySign = lazy(
  () => import("../package/admin/features/categorySign/components/newCategorySign/NewCategorySign")
);
// import { CategorySignLayout } from "../package/admin/features/categorySign/page/CategorySignLayout";
const CategorySignLayout = lazy(() =>
  import("../package/admin/features/categorySign/page/CategorySignLayout").then((module) => ({
    default: module.CategorySignLayout
  }))
);
// import { CategorySuppliersLayout } from "../package/admin/features/categorySuppliers";
const CategorySuppliersLayout = lazy(() =>
  import("../package/admin/features/categorySuppliers").then((module) => ({
    default: module.CategorySuppliersLayout
  }))
);
const EditSuppliers = lazy(() =>
  import("../package/admin/features/categorySuppliers/components").then((module) => ({
    default: module.EditSuppliers
  }))
);
const NewSuppliers = lazy(() =>
  import("../package/admin/features/categorySuppliers/components").then((module) => ({
    default: module.NewSuppliers
  }))
);
const CategotyUnitsLayout = lazy(() =>
  import("../package/admin/features/categoryUnits").then((module) => ({
    default: module.CategotyUnitsLayout
  }))
);
const EditCategoryUnit = lazy(() =>
  import("../package/admin/features/categoryUnits/components").then((module) => ({
    default: module.EditCategoryUnit
  }))
);
const NewCategoryUnit = lazy(() =>
  import("../package/admin/features/categoryUnits/components").then((module) => ({
    default: module.NewCategoryUnit
  }))
);
// import { DashBoardLayout } from "../package/admin/features/dashboard";
const DashBoardLayout = lazy(() =>
  import("../package/admin/features/dashboard").then((module) => ({
    default: module.DashBoardLayout
  }))
);
// import { DashBoardReport } from "../package/admin/features/dashboard";
const DashBoardReport = lazy(() =>
  import("../package/admin/features/dashboardReport").then((module) => ({
    default: module.DashBoardReport
  }))
);
// import { GiveBooksBackLayout } from "../package/admin/features/giveBooksBack";
const GiveBooksBackLayout = lazy(() =>
  import("../package/admin/features/giveBooksBack").then((module) => ({
    default: module.GiveBooksBackLayout
  }))
);
// import { HolidayScheduleLayout } from "../package/admin/features/holidaySchedule";
const HolidayScheduleLayout = lazy(() =>
  import("../package/admin/features/holidaySchedule").then((module) => ({
    default: module.HolidayScheduleLayout
  }))
);
const EditHolidaySchedule = lazy(() =>
  import("../package/admin/features/holidaySchedule/components").then((module) => ({
    default: module.EditHolidaySchedule
  }))
);
const NewHolidaySchedule = lazy(() =>
  import("../package/admin/features/holidaySchedule/components").then((module) => ({
    default: module.NewHolidaySchedule
  }))
);
// import { ImportBooks } from "../package/admin/features/ImportBooks";
const ImportBooks = lazy(() =>
  import("../package/admin/features/ImportBooks").then((module) => ({
    default: module.ImportBooks
  }))
);
// import { ExportBooks } from "../package/admin/features/ExportBooks";
const ExportBooks = lazy(() =>
  import("../package/admin/features/ExportBooks").then((module) => ({
    default: module.ExportBooks
  }))
);
// import { ImportMagazine } from "../package/admin/features/lmportMagazine";
const ImportMagazine = lazy(() =>
  import("../package/admin/features/lmportMagazine").then((module) => ({
    default: module.ImportMagazine
  }))
);
// import { LoanSlipLayout } from "../package/admin/features/loanSlip";
const LoanSlipLayout = lazy(() =>
  import("../package/admin/features/loanSlip").then((module) => ({
    default: module.LoanSlipLayout
  }))
);
// import { MagazineManage } from "../package/admin/features/magazieManage";
const MagazineManage = lazy(() =>
  import("../package/admin/features/magazieManage").then((module) => ({
    default: module.MagazineManage
  }))
);
const EditMagazineManage = lazy(() =>
  import("../package/admin/features/magazieManage/components").then((module) => ({
    default: module.EditMagazineManage
  }))
);
const NewMagazineManage = lazy(() =>
  import("../package/admin/features/magazieManage/components").then((module) => ({
    default: module.NewMagazineManage
  }))
);
// import { ManageBookEntryTicket } from "../package/admin/features/manageBookEntryTicket";
const ManageBookEntryTicket = lazy(() =>
  import("../package/admin/features/manageBookEntryTicket").then((module) => ({
    default: module.ManageBookEntryTicket
  }))
);
// import { ManageBookEntryTicket } from "../package/admin/features/manageVoucherExport";
const ManageVoucherExport = lazy(() =>
  import("../package/admin/features/manageVoucherExport").then((module) => ({
    default: module.ManageBookEntryTicket
  }))
);
// import { ManageMagazineEntryTicket } from "../package/admin/features/manageMagazineEntryTicket";
const ManageMagazineEntryTicket = lazy(() =>
  import("../package/admin/features/manageMagazineEntryTicket").then((module) => ({
    default: module.ManageMagazineEntryTicket
  }))
);
const ManageUsersLayout = lazy(() =>
  import("../package/admin/features/manageUsers").then((module) => ({
    default: module.ManageUsersLayout
  }))
);
const ManageUserDecentralization = lazy(() =>
  import("../package/admin/features/manageUsers").then((module) => ({
    default: module.ManageUserDecentralization
  }))
);
const EditUser = lazy(() =>
  import("../package/admin/features/manageUsers/components").then((module) => ({
    default: module.EditUser
  }))
);
const NewUser = lazy(() =>
  import("../package/admin/features/manageUsers/components").then((module) => ({
    default: module.NewUser
  }))
);
// import { OverdueBorrowedBooks } from "../package/admin/features/overdueBorrowedBooks";
const OverdueBorrowedBooks = lazy(() =>
  import("../package/admin/features/overdueBorrowedBooks").then((module) => ({
    default: module.OverdueBorrowedBooks
  }))
);
// import { EditSchoolYearInfo } from "../package/admin/features/schoolYearInfo/components";
const EditSchoolYearInfo = lazy(() =>
  import("../package/admin/features/schoolYearInfo/components").then((module) => ({
    default: module.EditSchoolYearInfo
  }))
);
// import { SchoolYearInfoLayout } from "../package/admin/features/schoolYearInfo/page/SchoolYearInfoLayout";
const SchoolYearInfoLayout = lazy(() =>
  import("../package/admin/features/schoolYearInfo/page/SchoolYearInfoLayout").then((module) => ({
    default: module.SchoolYearInfoLayout
  }))
);
const SpecialRegistrationBooksLayout = lazy(() =>
  import("../package/admin/features/specialRegistrationBooks").then((module) => ({
    default: module.SpecialRegistrationBooksLayout
  }))
);
const SpecialRegistrationChildBooksLayout = lazy(() =>
  import("../package/admin/features/specialRegistrationBooks").then((module) => ({
    default: module.SpecialRegistrationChildBooksLayout
  }))
);

const EditSpecialRegistrationBooks = lazy(() =>
  import("../package/admin/features/specialRegistrationBooks/components").then((module) => ({
    default: module.EditSpecialRegistrationBooks
  }))
);
const NewSpecialRegistrationBooks = lazy(() =>
  import("../package/admin/features/specialRegistrationBooks/components").then((module) => ({
    default: module.NewSpecialRegistrationBooks
  }))
);
// import { StatisticsBorrowedUsers } from "../package/admin/features/statisticsBorrowedUsers";
const StatisticsBorrowedUsers = lazy(() =>
  import("../package/admin/features/statisticsBorrowedUsers").then((module) => ({
    default: module.StatisticsBorrowedUsers
  }))
);
const BooksInStockLayout = lazy(() =>
  import("../package/admin/features/symbolPriceRating").then((module) => ({
    default: module.BooksInStockLayout
  }))
);
const SymbolChildPriceRatingLayout = lazy(() =>
  import("../package/admin/features/symbolPriceRating").then((module) => ({
    default: module.SymbolChildPriceRatingLayout
  }))
);
const SymbolPriceRating = lazy(() =>
  import("../package/admin/features/symbolPriceRating").then((module) => ({
    default: module.SymbolPriceRating
  }))
);

const EditSymbolPriceRating = lazy(() =>
  import("../package/admin/features/symbolPriceRating/components").then((module) => ({
    default: module.EditSymbolPriceRating
  }))
);
const NewChildSymbolPriceRating = lazy(() =>
  import("../package/admin/features/symbolPriceRating/components").then((module) => ({
    default: module.NewChildSymbolPriceRating
  }))
);
const NewSymbolPriceRating = lazy(() =>
  import("../package/admin/features/symbolPriceRating/components").then((module) => ({
    default: module.NewSymbolPriceRating
  }))
);

// import { CategorySignParentLayout } from "../package/admin/features/categorySignParent";
const CategorySignParentLayout = lazy(() =>
  import("../package/admin/features/categorySignParent").then((module) => ({
    default: module.CategorySignParentLayout
  }))
);
// import { EditCategorySignParent } from "../package/admin/features/categorySign_V1/components/components";
const EditCategorySignParent = lazy(() =>
  import("../package/admin/features/categorySignParent/components").then((module) => ({
    default: module.EditCategorySignParent
  }))
);
// import NewCategorySignParentLayout from "../package/admin/features/categorySign_V1/components/components/newCategorySign_v1/NewCategorySignV1";
const NewCategorySignParentLayout = lazy(
  () => import("../package/admin/features/categorySignParent/components/newCategorySignParent/newCategorySignParent")
);
// import { CategorySignLayoutV1 } from "../package/admin/features/categorySign_V1";
const CategorySignLayoutV1 = lazy(() =>
  import("../package/admin/features/categorySign_V1").then((module) => ({
    default: module.CategorySignLayoutV1
  }))
);
// import { EditCategorySignV1 } from "../package/admin/features/categorySign_V1/components/components";
const EditCategorySignV1 = lazy(() =>
  import("../package/admin/features/categorySign_V1/components/components").then((module) => ({
    default: module.EditCategorySignV1
  }))
);
// import NewCategorySignV1 from "../package/admin/features/categorySign_V1/components/components/newCategorySign_v1/NewCategorySignV1";
const NewCategorySignV1 = lazy(
  () => import("../package/admin/features/categorySign_V1/components/components/newCategorySign_v1/NewCategorySignV1")
);
const SetUpContactPageReaders = lazy(() =>
  import("../package/admin/features/setUpContactPageReaders/page/SetUpContactPageReaders").then((module) => ({
    default: module.SetUpContactPageReaders
  }))
);
const SetUpYourReaderSPageReferrals = lazy(() =>
  import("../package/admin/features/setUpYourReader'sPageReferrals/page/SetUpYourReader'sPageReferrals").then(
    (module) => ({
      default: module.SetUpYourReaderSPageReferrals
    })
  )
);
const ExportReport = lazy(() =>
  import("../package/admin/features/exportReport").then((module) => ({
    default: module.ExportReport
  }))
);
const ExportReportDetail = lazy(() =>
  import("../package/admin/features/exportReport").then((module) => ({
    default: module.ExportReportDetail
  }))
);
const StatisticsOfLateLoanList = lazy(() =>
  import("../package/admin/features/statisticsOfLateLoanList").then((module) => ({
    default: module.StatisticsOfLateLoanList
  }))
);
const ListStatisticsBySpecialCode = lazy(() =>
  import("../package/admin/features/listStatisticsBySpecialCode").then((module) => ({
    default: module.ListStatisticsBySpecialCode
  }))
);
const SetThePageImageYouRead = lazy(() =>
  import("../package/admin/features/setThePageImageYouRead/page/SetThePageImageYouRead").then((module) => ({
    default: module.SetThePageImageYouRead
  }))
);
const SetThePageColorYouRead = lazy(() =>
  import("../package/admin/features/setThePageColorYouRead/page/SetThePageColorYouRead").then((module) => ({
    default: module.SetThePageColorYouRead
  }))
);
const NewImage = lazy(() =>
  import("../package/admin/features/setThePageImageYouRead/components/NewImage").then((module) => ({
    default: module.NewImage
  }))
);
const EditImage = lazy(() =>
  import("../package/admin/features/setThePageImageYouRead/components/EditImage").then((module) => ({
    default: module.EditImage
  }))
);
const DocumentDigital = lazy(() =>
  import("../package/admin/features/documentDigital").then((module) => ({
    default: module.DocumentDigital
  }))
);
const EditDocumentDigital = lazy(() =>
  import("../package/admin/features/documentDigital/components").then((module) => ({
    default: module.EditDocumentDigital
  }))
);
const NewDocumentDigital = lazy(() =>
  import("../package/admin/features/documentDigital/components").then((module) => ({
    default: module.NewDocumentDigital
  }))
);
const DocumentDigitalConnect = lazy(() =>
  import("../package/admin/features/documentDigitalConnect").then((module) => ({
    default: module.DocumentDigitalConnect
  }))
);
const EditDocumentDigitalConnect = lazy(() =>
  import("../package/admin/features/documentDigitalConnect/components").then((module) => ({
    default: module.EditDocumentDigitalConnect
  }))
);
const NewDocumentDigitalConnect = lazy(() =>
  import("../package/admin/features/documentDigitalConnect/components").then((module) => ({
    default: module.NewDocumentDigitalConnect
  }))
);
const CategoryDocumentDigitalLayout = lazy(() =>
  import("../package/admin/features/categoryDocumentDigital").then((module) => ({
    default: module.CategoryDocumentDigitalLayout
  }))
);
const CategoryDocumentDigitalLayoutConnect = lazy(() =>
  import("../package/admin/features/categoryDocumentDigitalConnect").then((module) => ({
    default: module.CategoryDocumentDigitalLayoutConnect
  }))
);
const EditCategoryDocumentDigital = lazy(() =>
  import("../package/admin/features/categoryDocumentDigital/components").then((module) => ({
    default: module.EditCategoryDocumentDigital
  }))
);
const EditCategoryDocumentDigitalConnect = lazy(() =>
  import("../package/admin/features/categoryDocumentDigitalConnect/components").then((module) => ({
    default: module.EditCategoryDocumentDigitalConnect
  }))
);
const NewCategoryDocumentDigital = lazy(() =>
  import("../package/admin/features/categoryDocumentDigital/components").then((module) => ({
    default: module.NewCategoryDocumentDigital
  }))
);
const NewCategoryDocumentDigitalConnect = lazy(() =>
  import("../package/admin/features/categoryDocumentDigitalConnect/components").then((module) => ({
    default: module.NewCategoryDocumentDigitalConnect
  }))
);
const DocumentDigitalByCategoryLayout = lazy(() =>
  import("../package/admin/features/categoryDocumentDigital/page/DocumentDigitalByCategoryLayout").then((module) => ({
    default: module.DocumentDigitalByCategoryLayout
  }))
);
const DocumentDigitalByCategoryLayoutConnect = lazy(() =>
  import("../package/admin/features/categoryDocumentDigitalConnect/page/DocumentDigitalByCategoryLayoutConnect").then(
    (module) => ({
      default: module.DocumentDigitalByCategoryLayoutConnect
    })
  )
);

const ChangeBulkUnitForUser = lazy(() =>
  import("../package/admin/features/ChangeBulkUnitForUser").then((module) => ({
    default: module.ChangeBulkUnitForUser
  }))
);
const AlbumBookIndexes = lazy(() =>
  import("../package/admin/features/AlbumBookIndexes").then((module) => ({
    default: module.AlbumBookIndexes
  }))
);
const BookRegistry = lazy(() =>
  import("../package/admin/features/BookRegistry").then((module) => ({
    default: module.BookRegistry
  }))
);
const CategoryColor = lazy(() =>
  import("../package/admin/features/CategoryColor").then((module) => ({
    default: module.CategoryColor
  }))
);
const EditCategoryColor = lazy(() =>
  import("../package/admin/features/CategoryColor").then((module) => ({
    default: module.EditCategoryColor
  }))
);
const NewCategoryColor = lazy(() =>
  import("../package/admin/features/CategoryColor").then((module) => ({
    default: module.NewCategoryColor
  }))
);

const styleLoading = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "100"
};
//lazy loading all components
export function Admin() {
  const navigate = useNavigate();
  const path = useLocation();
  const isPGD = useCheckUnitPrefix();

  return (
    <Suspense
      fallback={
        <div style={styleLoading}>
          <Loading />
        </div>
      }
    >
      {path.pathname.includes("/cp") ? (
        <Routes>
          <Route path="cp" element={<PublicRoutes />}>
            <Route path="/cp" element={<LoginAdminLayout />} />
          </Route>
        </Routes>
      ) : path.pathname.includes("/Print") ? (
        <Routes>
          <Route path="/Print" element={<PrivateRoutes />}>
            <Route path="/Print/PrintLibraryCard" element={<PrintLibraryCard />} />
            <Route path="/Print/PrintSpine/:idDocument&:typeSpine" element={<PrintSpine />} />
            <Route path="/Print/PrintSpineAll/:idDocument&:typeSpine" element={<PrintSpineAll />} />
          </Route>

          <Route
            path="/Print-authorized-403"
            element={
              <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không được phép truy cập trang này."
                extra={
                  <Button
                    type="primary"
                    onClick={(e) => {
                      navigate("/cp");
                    }}
                  >
                    Đăng nhập
                  </Button>
                }
              />
            }
          />
        </Routes>
      ) : (
        <Main>
          <Route path="/admin" element={<PrivateRoutes />}>
            <Route index path="/admin/dashboard" element={<DashBoardLayout />} />
            {isPGD ? <Route index path="/admin/dashboardReport" element={<DashBoardReport />} /> : null}
            <Route path="/admin/tai-khoan" element={<ManageUsersLayout />} />
            <Route path="/admin/tai-khoan/edit/:id" element={<EditUser />} />
            <Route path="/admin/tai-khoan/newUser" element={<NewUser />} />
            <Route path="/admin/tai-khoan/phan-quyen/:id" element={<ManageUserDecentralization />} />
            {/* CategoryPublishers  */}
            <Route path="/admin/nha-xuat-ban" element={<CategoryPublishersLayout />} />
            <Route path="/admin/nha-xuat-ban/edit/:id" element={<EditPublishers />} />
            <Route path="/admin/nha-xuat-ban/newPublisher" element={<NewPublisher />} />
            {/* CategorySuppliers  */}
            <Route path="/admin/nha-cung-cap" element={<CategorySuppliersLayout />} />
            <Route path="/admin/nha-cung-cap/edit/:id" element={<EditSuppliers />} />
            <Route path="/admin/nha-cung-cap/new" element={<NewSuppliers />} />
            {/* CategorySign */}
            <Route path="/admin/ma-ca-biet" element={<CategorySignLayout />} />
            <Route path="/admin/ma-ca-biet/edit/:id" element={<EditCategorySign />} />
            <Route path="/admin/ma-ca-biet/new" element={<NewCategorySign />} />
            {/*CategorySignParentLayout*/}
            <Route path="/admin/danh-muc-ky-hieu-phan-loai-cha" element={<CategorySignParentLayout />} />
            <Route path="/admin/danh-muc-ky-hieu-phan-loai-cha/edit/:id" element={<EditCategorySignParent />} />
            <Route path="/admin/danh-muc-ky-hieu-phan-loai-cha/new" element={<NewCategorySignParentLayout />} />
            {/* CategorySign_v1 */}
            <Route path="/admin/ky-hieu" element={<CategorySignLayoutV1 />} />
            <Route path="/admin/ky-hieu/edit/:id" element={<EditCategorySignV1 />} />
            <Route path="/admin/ky-hieu/new" element={<NewCategorySignV1 />} />
            {/* category units */}
            <Route path="/admin/don-vi" element={<CategotyUnitsLayout />} />
            <Route path="/admin/don-vi/edit/:id" element={<EditCategoryUnit />} />
            <Route path="/admin/don-vi/new" element={<NewCategoryUnit />} />
            {/* indivisual sample */}
            <Route path="/admin/Dang-Ky-Ca-Biet-Tung-Bo-Sach" element={<SpecialRegistrationBooksLayout />} />
            <Route
              path="/admin/Dang-Ky-Ca-Biet-Tung-Bo-Sach/children/:id"
              element={<SpecialRegistrationChildBooksLayout />}
            />
            <Route
              path="/admin/Dang-Ky-Ca-Biet-Tung-Bo-Sach/children/edit/:id"
              element={<EditSpecialRegistrationBooks />}
            />
            <Route
              path="/admin/Dang-Ky-Ca-Biet-Tung-Bo-Sach/children/new/:id"
              element={<NewSpecialRegistrationBooks />}
            />
            <Route path="/admin/in-gay-sach-nhieu-loai-sach" element={<PrintAllBookNape />} />
            {/* school year info */}
            <Route path="/admin/nam-hoc" element={<SchoolYearInfoLayout />} />
            <Route path="/admin/nam-hoc/edit/:id" element={<EditSchoolYearInfo />} />
            {/* Symbol Price Rating */}
            <Route path="/admin/kho-luu-tru" element={<SymbolPriceRating />} />
            <Route path="/admin/kho-luu-tru/edit/:id" element={<EditSymbolPriceRating />} />
            <Route path="/admin/kho-luu-tru/newChild/:id" element={<NewChildSymbolPriceRating />} />
            <Route path="/admin/kho-luu-tru/newAdd" element={<NewSymbolPriceRating />} />
            <Route path="/admin/kho-luu-tru/children/:id" element={<SymbolChildPriceRatingLayout />} />
            <Route path="/admin/kho-luu-tru/books-in-stock/:id" element={<BooksInStockLayout />} />
            {/* Holiday schedule */}
            <Route path="/admin/lich-nghi-le" element={<HolidayScheduleLayout />} />
            <Route path="/admin/lich-nghi-le/edit/:id" element={<EditHolidaySchedule />} />
            <Route path="/admin/lich-nghi-le/new" element={<NewHolidaySchedule />} />
            {/* category Magazine manage */}
            <Route path="/admin/danh-muc-bao" element={<MagazineManage />} />
            <Route path="/admin/danh-muc-bao/new" element={<NewMagazineManage />} />
            <Route path="/admin/danh-muc-bao/edit/:id" element={<EditMagazineManage />} />
            {/* category books magazine */}
            <Route path="/admin/danh-muc-bao-tap-chi" element={<CategoryMagazineManage />} />
            <Route path="/admin/danh-muc-bao-tap-chi/edit/:id" element={<EditCategoryMagazine />} />
            <Route path="/admin/danh-muc-bao-tap-chi/children/:id" element={<MagazineByCategoryLayout />} />
            <Route path="/admin/danh-muc-bao-tap-chi/new" element={<NewCategoryMagazine />} />
            {/* category document document */}
            <Route path="/admin/khai-bao-tai-lieu" element={<DocumentDigital />} />
            <Route path="/admin/khai-bao-tai-lieu/edit/:id" element={<EditDocumentDigital />} />
            <Route path="/admin/khai-bao-tai-lieu-dung-chung/edit/:id" element={<EditDocumentDigitalConnect />} />
            <Route path="/admin/khai-bao-tai-lieu/new" element={<NewDocumentDigital />} />
            {/* category document digital */}
            {/* Document Digital Connect */}
            <Route path="/admin/khai-bao-tai-lieu-dung-chung" element={<DocumentDigitalConnect />} />
            <Route path="/admin/duyet-tai-lieu-dung-chung" element={<DocumentDigitalConnectApprove />} />
            <Route
              path="/admin/khai-bao-tai-lieu-tai-lieu-so-dung-chung/edit/:id"
              element={<EditDocumentDigitalConnect />}
            />
            <Route path="/admin/khai-bao-tai-lieu-dung-chung/new" element={<NewDocumentDigitalConnect />} />
            <Route path="/admin/danh-muc-tai-lieu-so-dung-chung" element={<CategoryDocumentDigitalLayoutConnect />} />
            <Route path="/admin/danh-muc-tai-lieu-so-dung-chung/new" element={<NewCategoryDocumentDigitalConnect />} />
            <Route
              path="/admin/danh-muc-tai-lieu-so-dung-chung/children/:id"
              element={<DocumentDigitalByCategoryLayoutConnect />}
            />
            <Route
              path="/admin/danh-muc-tai-lieu-so-dung-chung/edit/:id"
              element={<EditCategoryDocumentDigitalConnect />}
            />
            {/* Document Digital Connect */}
            <Route path="/admin/danh-muc-tai-lieu-so" element={<CategoryDocumentDigitalLayout />} />
            <Route path="/admin/danh-muc-tai-lieu-so/edit/:id" element={<EditCategoryDocumentDigital />} />
            <Route path="/admin/danh-muc-tai-lieu-so/new" element={<NewCategoryDocumentDigital />} />
            <Route path="/admin/danh-muc-tai-lieu-so/children/:id" element={<DocumentDigitalByCategoryLayout />} />
            {/* loan slip magazine*/}
            <Route path="/admin/nhap-bao-tap-chi" element={<ImportMagazine />} />
            {/* category books manage */}
            <Route path="/admin/danh-muc-sach" element={<CategoryBooksManageLayout />} />
            <Route path="/admin/danh-muc-sach/edit/:id" element={<EditCategoryBooks />} />
            <Route path="/admin/danh-muc-sach/children/:id" element={<BooksByCategoryLayout />} />
            <Route path="/admin/danh-muc-sach/new" element={<NewCategoryBooks />} />
            {/* manageBookEntryTicket */}
            <Route path="/admin/quan-ly-phieu-bao-tap-chi" element={<ManageMagazineEntryTicket />} />
            {/* books manage  */}
            <Route path="/admin/khai-bao-sach" element={<BooksManageLayout />} />
            <Route path="/admin/khai-bao-sach/edit/:id" element={<EditBooksManage />} />
            <Route path="/admin/khai-bao-sach/new" element={<NewBooksManege />} />
            {/* loan slip */}
            <Route path="/admin/lap-phieu-muon" element={<LoanSlipLayout />} />
            {/* Give books back */}
            <Route path="/admin/tra-sach" element={<GiveBooksBackLayout />} />
            {/* Book attempt */}
            <Route path="/admin/hoi-co-sach" element={<BookAttemptLayout />} />
            {/* overdueBorrowedBooks */}
            <Route path="/admin/muon-qua-han" element={<OverdueBorrowedBooks />} />
            {/* statisticsBorrowedUsers */}
            <Route path="/admin/thong-ke-muon" element={<StatisticsBorrowedUsers />} />
            {/* bookStatisticsByType */}
            <Route path="/admin/thong-ke-sach-theo-loai" element={<BookStatisticsByType />} />
            {/* BookTotal */}
            {isPGD ? <Route path="/admin/thong-ke-sach" element={<BookTotal />} /> : null}
            {/* BookStatusTotal */}
            {isPGD ? <Route path="/admin/thong-ke-tinh-trang-sach" element={<BookStatusTotal />} /> : null}
            {/* import books */}
            <Route path="/admin/nhap-sach" element={<ImportBooks />} />
            {/* export books */}
            <Route path="/admin/xuat-sach" element={<ExportBooks />} />
            {/* manageBookEntryTicket */}
            <Route path="/admin/phieu-nhap" element={<ManageBookEntryTicket />} />
            <Route path="/admin/phieu-nhap/edit/:id" element={<EditBookEntryTicket />} />
            {/*manageVoucherExport*/}
            <Route path="/admin/phieu-xuat" element={<ManageVoucherExport />} />
            <Route path="/admin/phieu-xuat/edit/:id" element={<EditVoucherExport />} />
            {/* Set up contact page readers */}
            <Route path="/admin/lien-he" element={<SetUpContactPageReaders />} />
            {/* Set up page referrals you read */}
            <Route path="/admin/gioi-thieu" element={<SetUpYourReaderSPageReferrals />} />
            {/* Set the page color you read */}
            <Route path="/admin/mau-sac" element={<SetThePageColorYouRead />} />
            {/* Set the page image you read */}
            <Route path="/admin/hinh-anh" element={<SetThePageImageYouRead />} />
            <Route path="/admin/hinh-anh/new" element={<NewImage />} />
            <Route path="/admin/hinh-anh/edit/:id" element={<EditImage />} />
            {/* Export report */}
            <Route path="/admin/xuat-bao-cao" element={<ExportReport />} />
            <Route
              path="/admin/xuat-bao-cao-chi-tiet/:IdUnit&:IdUser&:fromDate&:toDate"
              element={<ExportReportDetail />}
            />
            {/* Statistics of late loan list */}
            <Route path="/admin/thong-ke-muon-qua-han-theo-loai-nguoi-dung" element={<StatisticsOfLateLoanList />} />
            <Route path="/admin/thong-ke-sach-theo-ma-ca-biet" element={<ListStatisticsBySpecialCode />}></Route>
            <Route path="/admin/thong-ke-so-albums-muc-luc-sach" element={<AlbumBookIndexes />}></Route>
            <Route path="/admin/so-dang-ky" element={<BookRegistry />}></Route>
            <Route path="/admin/so-dang-ky-tong-quat" element={<AlbumBookIndexesTwin />}></Route>
            <Route path="/admin/so-dang-ky-bao-chi" element={<MagazineRegister />}></Route>
            {/*Category Color*/}
            <Route path="/admin/danh-muc-ma-mau/new" element={<NewCategoryColor />} />
            <Route path="/admin/danh-muc-tinh-trang-sach/new" element={<NewStatusBook />} />
            <Route path="/admin/danh-muc-tinh-trang-sach/edit/:id" element={<EditStatusBook />} />{" "}
            <Route path="/admin/danh-muc-ma-mau/edit/:id" element={<EditCategoryColor />} />
            <Route path="/admin/danh-muc-ma-mau" element={<CategoryColor />}></Route>
            <Route path="/admin/danh-muc-tinh-trang-sach" element={<StatusBook />}></Route>
            {/* Audit Books  */}
            <Route path="/admin/kiem-ke-sach" element={<AuditBookLayout />} />
            <Route path="/admin/kiem-ke-sach/new" element={<NewAuditBookLayout />} />
            <Route path="/admin/kiem-ke-sach/edit/:id" element={<EditAuditBookLayout />} />
            <Route path="/admin/chuyen-don-vi-hang-loat" element={<ChangeBulkUnitForUser />} />
            {/*CategoryVideoElearningSound*/}
            <Route path="/admin/danh-muc-bai-hoc-dien-tu" element={<CategoryVideoElearningSound />} />
            {/*GroupVideoElearningSound*/}
            <Route path="/admin/nhom-bai-hoc-dien-tu" element={<GroupVideoElearningSound />} />
            {/*VideoElearningSound*/}
            <Route path="/admin/noi-dung-bai-hoc-dien-tu" element={<VideoElearningSound />} />
          </Route>
          {/* 404 not found */}
          <Route
            path="*"
            element={
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                  <Button
                    type="primary"
                    onClick={(e) => {
                      navigate("/cp");
                    }}
                  >
                    Back Home
                  </Button>
                }
              />
            }
          />
          {/* 403  */}
          <Route
            path="admin/403"
            element={
              <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không có quyền truy cập, Vui lòng quay lại."
                extra={
                  <Button
                    type="primary"
                    onClick={(e) => {
                      navigate("/cp");
                    }}
                  >
                    Quay lại
                  </Button>
                }
              />
            }
          />
        </Main>
      )}
    </Suspense>
  );
}
