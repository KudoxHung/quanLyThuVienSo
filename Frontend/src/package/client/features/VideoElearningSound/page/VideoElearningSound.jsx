import { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { GroupVesApis } from "../../../../admin/api/GroupVesApis";
import { VESApis } from "../../../../admin/api/VESApis";
import {
  DownloadOutlined,
  FundOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Card, Col, Menu, Row, Space, Typography } from "antd";
import Linkify from "linkify-react";

function _VideoElearningSound() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const title = location?.state?.title;
  const [dataGroup, setDataGroup] = useState([]);
  const [loadingDataGroup, setLoadingDataGroup] = useState(true);
  const [dataVes, setDataVes] = useState([]);
  const [idGroupVesSelected, setIdGroupVesSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const playerMp3Ref = useRef(null);
  useEffect(() => {
    if (params?.id === undefined) return;
    (async () => {
      try {
        const res = await GroupVesApis.GetAllGroupVesByIdcategoryVes(
          0,
          0,
          params?.id,
        );
        const resVes = await VESApis.GetAllVESByIdGroup(
          res[params.pageIndex || 0]?.id,
        );
        setDataGroup(res);
        setDataVes(resVes);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingDataGroup(false);
        setLoading(false);
      }
    })();
  }, [params.id]);
  useEffect(() => {
    if (idGroupVesSelected === 0) return;
    (async () => {
      setLoading(true);
      try {
        const res = await VESApis.GetAllVESByIdGroup(idGroupVesSelected);
        setDataVes(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [idGroupVesSelected]);
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return (
    <div className="VideoElearningSound">
      <div
        style={{
          background: "black",
          width: "100%",
          height: "50px",
          padding: "0px 12px",
        }}
      >
        <Space
          size={"large"}
          align={"center"}
          style={{ width: "100%", height: "100%" }}
        >
          <LeftOutlined
            style={{
              fontSize: 24,
              color: "white",
              cursor: "pointer",
              borderRight: "1px solid gray",
              paddingRight: 10,
            }}
            onClick={() => navigate(-1)}
          />
          <Typography.Text strong style={{ color: "white", fontSize: 24 }}>
            {title}
          </Typography.Text>
        </Space>
      </div>
      <Row gutter={12}>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          {dataVes?.map((item) => (
            <Card
              key={item?.id}
              loading={loading}
              bordered={true}
              className={"mb-24"}
            >
              {item?.mediaPath && (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <ReactPlayer
                    url={item?.mediaPath}
                    width="100%"
                    height="100%"
                    controls={true}
                    style={{ position: "absolute", top: 0, left: 0 }}
                    playing={false}
                    loop={true}
                    volume={0.5}
                    muted={false}
                    progressInterval={1000}
                  />
                </div>
              )}
              {item?.mediaType === 1 && (
                <Fragment>
                  <Typography.Title
                    level={5}
                    style={{
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const url = `${apiUrl}/api/VES/GetFile?fileNameId=${item?.id}.${item?.fileNameExtention}`;
                      return window.open(url, "_blank");
                    }}
                  >
                    <DownloadOutlined /> Xem online
                  </Typography.Title>
                </Fragment>
              )}
              {item?.mediaType === 3 && (
                <div>
                  <ReactPlayer
                    ref={playerMp3Ref}
                    url={`${apiUrl}/api/VES/GetFile?fileNameId=${item?.id}.${item?.fileNameExtention}`}
                    width="100%"
                    height="100px"
                    controls={true}
                    onSeek={(newTime) =>
                      console.log("Tua đến thời gian", newTime)
                    }
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload", // Remove download option
                        },
                      },
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: 24,
                }}
              >
                <Typography.Title level={3}>
                  {item?.mediaTitle}
                </Typography.Title>
                <Typography.Text>
                  <Linkify
                    options={{
                      attributes: {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                    }}
                  >
                    {item?.mediaDescription}
                  </Linkify>
                </Typography.Text>
              </div>
            </Card>
          ))}
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            bordered={true}
            className="criclebox h-full"
            loading={loadingDataGroup}
            title={"Môn học"}
          >
            <Menu mode={"inline"} defaultSelectedKeys={["0"]}>
              {dataGroup?.map((item, index) => (
                <Menu.Item
                  icon={<FundOutlined />}
                  key={index}
                  onClick={() => {
                    setIdGroupVesSelected(item?.id);
                  }}
                >
                  <Typography.Text strong>
                    {index + 1}.{item?.groupName}
                  </Typography.Text>
                </Menu.Item>
              ))}
            </Menu>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const VideoElearningSound =
  WithErrorBoundaryCustom(_VideoElearningSound);
