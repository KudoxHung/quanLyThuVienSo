import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { CategoryVesApis } from "../../../../admin/api/CategoryVesApis";
import empty from "../../../asset/Files/empty.jpeg";
import { Card, Col, Empty, Pagination, Row, Spin, Typography } from "antd";

function _CategoryVes() {
  const navigate = useNavigate();
  const [Category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({
    pageSize: 10,
    pageNumber: 1,
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryVesApis.GetAllCategoryVesByELecture(
          page.pageSize,
          page.pageNumber,
        );
        setCategory(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  function handlePageChange(pageNumber, pageSize) {
    setPage({ pageNumber, pageSize });
  }

  return (
    <div className="CategoryVes Container">
      <Spin spinning={loading}>
        {Category?.length === 0 ? (
          <Empty
            style={{ marginTop: 24 }}
            imageStyle={{
              height: "auto",
              width: "100%",
            }}
            image={empty}
            description={
              <Typography.Title level={4} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </Typography.Title>
            }
          />
        ) : (
          <Row gutter={[24, 24]} style={{ padding: "24px 0px" }}>
            {Category?.map((item) => (
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card
                  hoverable={true}
                  key={item?.id}
                  bordered={true}
                  className="criclebox h-full"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/view-online/video-elearning-sound/${item.id}`, {
                      state: {
                        title: item?.categoryVesName,
                      },
                    })
                  }
                >
                  <Card.Meta
                    title={
                      <Typography.Title
                        level={4}
                        style={{ textAlign: "center" }}
                      >
                        {item?.categoryVesName}
                      </Typography.Title>
                    }
                  />
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Pagination
                style={{ textAlign: "center" }}
                defaultCurrent={1}
                showLessItems
                pageSize={10}
                showQuickJumpers
                showSizeChanger
                onChange={handlePageChange}
              />
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
}

export const CategoryVes = WithErrorBoundaryCustom(_CategoryVes);
