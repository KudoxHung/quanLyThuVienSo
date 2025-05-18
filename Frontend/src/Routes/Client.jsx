import React, { Fragment, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Footer } from "../package/client/components/common/footer";
import { Headers } from "../package/client/components/common/headers";
import { PrivateRoutes, PublicRoutes } from "../package/client/routes";
import Loading from "../package/client/utils/loading";
import { Button, Result } from "antd";
// import { LoginLayout, RegisterLayout } from "../package/client/features/auth";
// import {
//   CategoryPageEspecially,
//   CategoryPageLayout,
// } from "../package/client/features/categoryPage";
// import { ContactPagelayout } from "../package/client/features/contactPage";
// import { DetailPageLayout } from "../package/client/features/detailPage";
// import { HomePageLayout } from "../package/client/features/homePage";
// import { IntroductionPageLayout } from "../package/client/features/introductionPage";
// import { ProfileUsersLayout } from "../package/client/features/profileUsers";
// import { SearchPageLayout } from "../package/client/features/seachPage";
// import { ViewOnlineFlipBook } from "../package/client/features/viewOnlineFlipbooks";
// import { ViewOnlineProductLayout } from "../package/client/features/viewOnlineProduct";
//lazy loading all components
const CategorySoundType = React.lazy(() =>
  import("../package/client/features/VideoElearningSound").then((module) => ({
    default: module.CategorySoundType
  }))
);
const CategoryVes = React.lazy(() =>
  import("../package/client/features/VideoElearningSound").then((module) => ({
    default: module.CategoryVes
  }))
);
const CategoryVideoType = React.lazy(() =>
  import("../package/client/features/VideoElearningSound").then((module) => ({
    default: module.CategoryVideoType
  }))
);
const VideoElearningSound = React.lazy(() =>
  import("../package/client/features/VideoElearningSound").then((module) => ({
    default: module.VideoElearningSound
  }))
);
const HomePageLayout = React.lazy(() =>
  import("../package/client/features/homePage").then((module) => ({
    default: module.HomePageLayout
  }))
);
const CategoryPageLayout = React.lazy(() =>
  import("../package/client/features/categoryPage").then((module) => ({
    default: module.CategoryPageLayout
  }))
);
const CategoryPageLayoutConnect = React.lazy(() =>
  import("../package/client/features/categoryPageConnect").then((module) => ({
    default: module.CategoryPageLayoutConnect
  }))
);
const CategoryPageEspecially = React.lazy(() =>
  import("../package/client/features/categoryPage").then((module) => ({
    default: module.CategoryPageEspecially
  }))
);
const CategoryPageEspeciallyConnect = React.lazy(() =>
  import("../package/client/features/categoryPageConnect").then((module) => ({
    default: module.CategoryPageEspeciallyConnect
  }))
);
const DetailPageLayout = React.lazy(() =>
  import("../package/client/features/detailPage").then((module) => ({
    default: module.DetailPageLayout
  }))
);
const DetailPageLayoutConnect = React.lazy(() =>
  import("../package/client/features/detailPageConnect").then((module) => ({
    default: module.DetailPageLayoutConnect
  }))
);
const IntroductionPageLayout = React.lazy(() =>
  import("../package/client/features/introductionPage").then((module) => ({
    default: module.IntroductionPageLayout
  }))
);
const ProfileUsersLayout = React.lazy(() =>
  import("../package/client/features/profileUsers").then((module) => ({
    default: module.ProfileUsersLayout
  }))
);
const SearchPageLayout = React.lazy(() =>
  import("../package/client/features/seachPage").then((module) => ({
    default: module.SearchPageLayout
  }))
);
const ViewOnlineFlipBook = React.lazy(() =>
  import("../package/client/features/viewOnlineFlipbooks").then((module) => ({
    default: module.ViewOnlineFlipBook
  }))
);
const ViewOnlineFlipBookConnect = React.lazy(() =>
  import("../package/client/features/viewOnlineFlipbooksConnect").then((module) => ({
    default: module.ViewOnlineFlipBookConnect
  }))
);
const ViewOnlineProductLayout = React.lazy(() =>
  import("../package/client/features/viewOnlineProduct").then((module) => ({
    default: module.ViewOnlineProductLayout
  }))
);
const ViewOnlineProductLayoutConnect = React.lazy(() =>
  import("../package/client/features/viewOnlineProductConnect").then((module) => ({
    default: module.ViewOnlineProductLayoutConnect
  }))
);
const ContactPagelayout = React.lazy(() =>
  import("../package/client/features/contactPage").then((module) => ({
    default: module.ContactPagelayout
  }))
);
const LoginLayout = React.lazy(() =>
  import("../package/client/features/auth").then((module) => ({
    default: module.LoginLayout
  }))
);
const RegisterLayout = React.lazy(() =>
  import("../package/client/features/auth").then((module) => ({
    default: module.RegisterLayout
  }))
);
const styleLoading = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

export function Client() {
  const navigate = useNavigate();
  const path = useLocation();
  return (
    <Fragment>
      <Suspense
        fallback={
          <div style={styleLoading}>
            <Loading />
          </div>
        }
      >
        {path.pathname.includes("/view-online") ? (
          <Routes>
            <Route path="/view-online/:id" element={<PrivateRoutes />}>
              <Route index element={<ViewOnlineProductLayout />} />
            </Route>
            <Route path="/view-online-connect/:id" element={<PrivateRoutes />}>
              <Route index element={<ViewOnlineProductLayoutConnect />} />
            </Route>
            <Route path="/view-online-flip-books/:id" element={<PrivateRoutes />}>
              <Route index element={<ViewOnlineFlipBook />} />
            </Route>
            <Route path="/view-online-flip-books-connect/:id" element={<PrivateRoutes />}>
              <Route index element={<ViewOnlineFlipBookConnect />} />
            </Route>
            <Route path="/view-online/video-elearning-sound/:id" element={<VideoElearningSound />} />
          </Routes>
        ) : (
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
              }}
            >
              <Headers />
              <div style={{ flexGrow: 1 }}>
                <Routes>
                  <Route index element={<HomePageLayout />} />
                  <Route path="/search-page/:value" element={<SearchPageLayout />} />
                  <Route path="/detail-page/:id" element={<DetailPageLayout />} />
                  <Route path="/detail-page-connect/:id" element={<DetailPageLayoutConnect />} />

                  <Route path="login" element={<PublicRoutes />}>
                    <Route path="/login" element={<LoginLayout />} />
                  </Route>
                  <Route path="Register" element={<PublicRoutes />}>
                    <Route path="/Register" element={<RegisterLayout />} />
                  </Route>
                  <Route path="/categoryVes" element={<CategoryVes />} />
                  <Route path="/video" element={<CategoryVideoType />} />
                  <Route path="/sach-noi" element={<CategorySoundType />} />
                  <Route path="/category-page/:id" element={<CategoryPageLayout />} />
                  <Route path="/category-page-connect/:id" element={<CategoryPageLayoutConnect />} />
                  <Route
                    path="/category-page-especially-connect/:category"
                    element={<CategoryPageEspeciallyConnect />}
                  ></Route>
                  <Route path="/category-page-especially/:category" element={<CategoryPageEspecially />}></Route>

                  <Route path="lien-he" element={<ContactPagelayout />}></Route>
                  <Route path="gioi-thieu" element={<IntroductionPageLayout />}></Route>

                  <Route path="/profile-user/:id" element={<PrivateRoutes />}>
                    <Route path="/profile-user/:id" element={<ProfileUsersLayout />} />
                  </Route>
                  <Route
                    path="*"
                    element={
                      <Result
                        status="404"
                        title="404"
                        subTitle="Xin lỗi, trang bạn đã truy cập không tồn tại."
                        style={{ height: "90vh" }}
                        extra={
                          <Button
                            type="primary"
                            onClick={(e) => {
                              navigate("/");
                            }}
                          >
                            Trang chủ
                          </Button>
                        }
                      />
                    }
                  />
                </Routes>
              </div>
              <div style={{ flexGrow: 0 }}>
                <Footer />
              </div>
            </div>
          </Fragment>
        )}
      </Suspense>
    </Fragment>
  );
}
