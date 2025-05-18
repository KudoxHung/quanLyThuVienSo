import { useEffect } from "react";
import { useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Space,
  Spin,
} from "antd";

function _ModalSelectBooks({
  BooksLoading,
  books,
  isModalOpen,
  setIsModalOpen,
  setListDocumentId,
  ListDocumentId,
}) {
  const [listSelect, setListSelect] = useState([]);
  const [data, setData] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);

  const searchItems = (e) => {
    if (books.length > 0 && e !== "") {
      setData(
        books.filter((book) => {
          return book?.document?.docName
            .toLowerCase()
            .includes(e.toLowerCase());
        }),
      );
    } else if (books.length > 0 && e === "") {
      setData(books);
    }
  };
  useEffect(() => {
    setData(books);
  }, [books]);
  useEffect(() => {
    if (ListDocumentId) {
      setListSelect(ListDocumentId);
    }
  }, [ListDocumentId]);

  return (
    <div className="ModalSelectBooks">
      <Modal
        title="Chọn sách"
        width={1000}
        visible={isModalOpen}
        footer={[
          <Button type="link">Tổng: {books.length} bản</Button>,
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setListDocumentId(listSelect);
              setIsModalOpen(false);
            }}
          >
            Xác nhận
          </Button>,
        ]}
        onCancel={() => setIsModalOpen(false)}
      >
        <Spin spinning={BooksLoading}>
          <Space direction="horizontal" style={{ width: "100%" }}>
            <Checkbox
              checked={indeterminate}
              onChange={(e) => {
                setIndeterminate(!indeterminate);
                if (e.target.checked) {
                  setListSelect(
                    books.map((book) => {
                      return book.document.id;
                    }),
                  );
                } else {
                  setListSelect([]);
                }
              }}
            >
              Chọn tất cả
            </Checkbox>
            <Input
              placeholder="Tìm kiếm"
              onChange={(e) => {
                searchItems(e.target.value);
              }}
            />
          </Space>
          <Divider />
          <Row gutter={[14, 14]} style={{ height: 400, overflowY: "auto" }}>
            {data?.map((book) => (
              <Col lg={6} md={6} sm={2}>
                <Card key={book.document.id}>
                  <Checkbox
                    checked={listSelect.includes(book.document.id)}
                    value={book.document.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setListSelect([...listSelect, e.target.value]);
                      } else {
                        setListSelect(
                          listSelect.filter((item) => item !== e.target.value),
                        );
                      }
                    }}
                  >
                    {book.document.docName}
                  </Checkbox>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </Modal>
    </div>
  );
}
export const ModalSelectBooks = WithErrorBoundaryCustom(_ModalSelectBooks);
