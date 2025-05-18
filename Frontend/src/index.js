import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "moment/locale/vi";
import App from "./App";
import { store } from "./package/client/app/store";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import lang_vn from "antd/es/locale/vi_VN";

import "antd/dist/antd.min.css";
import "./index.css";
import "./package/admin/asset/styles/main.css";
import "./package/admin/asset/styles/responsive.css";
// let lang = lang_vn;
// switch (localStorage.getItem("lang"))
// {
//   case "lang_en":
//     lang = lang_en;
//     break;
//   case "lang_vn":
//     lang = lang_vn;
//     break;
//   case "lang_cn":
//     lang = lang_cn;
//     break;
//   case "lang_jp":
//     lang = lang_jp;
//     break;
//   case "lang_kr":
//     lang = lang_kr;
//     break;

//   default:
//     break;
// }
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={lang_vn}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
