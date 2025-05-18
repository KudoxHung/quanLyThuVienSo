import { useCallback, useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
} from "antd";
import debounce from "lodash/debounce";

function _ModalSelectBooksNew({
  booksLoading,
  books,
  isModalOpen,
  setIsModalOpen,
  setListDocumentId,
  ListDocumentId,
  onPageChange,
  currentPage,
  pageSize,
  totalBooks,
}) {
  const [listSelect, setListSelect] = useState([]);
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce(async (term, page, size) => {
      await handlePagination(page, size, term);
    }, 500),
    [],
  );

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    await debouncedSearch(value, currentPage, pageSize);
  };

  const handlePagination = async (page, size, searchDocName = null) => {
    try {
      setSelectAll(false); // Reset "Chọn tất cả" khi chuyển trang
      await onPageChange(page, size, searchDocName);
    } catch (error) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Có lỗi khi lấy dữ liệu sách",
      );
    }
  };

  useEffect(() => {
    setData(books);
  }, [books]);

  useEffect(() => {
    setListSelect(ListDocumentId || []);
  }, [ListDocumentId]);

  const handleSelectAll = (checked) => {
    if (checked) {
      // Chỉ chọn các sách của trang hiện tại
      const currentPageBooks = books.map((book) => ({
        id: book.document.id,
        docName: book.document.docName,
        idStock: book.idStock,
      }));
      setListSelect([...listSelect, ...currentPageBooks]);
    } else {
      // Bỏ chọn tất cả các sách của trang hiện tại
      const currentPageIds = books.map((book) => book.document.id);
      setListSelect(
        listSelect.filter((item) => !currentPageIds.includes(item.id)),
      );
    }
    setSelectAll(checked);
  };

  return (
    <div className="ModalSelectBooks">
      <Modal
        title="Chọn sách"
        width={1000}
        visible={isModalOpen}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalBooks}
              onChange={(page, size) => {
                handlePagination(page, size, searchTerm);
              }}
              showSizeChanger
              pageSizeOptions={[6, 12, 24, 48]}
            />
            <div>
              <Button type="link">Tổng: {totalBooks} bản</Button>
              <Button key="back" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  console.log(listSelect);

                  setListDocumentId(listSelect);
                  setIsModalOpen(false);
                }}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        }
        onCancel={() => setIsModalOpen(false)}
      >
        <Spin spinning={booksLoading}>
          <Space direction="horizontal" style={{ width: "100%" }}>
            <Checkbox
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Chọn tất cả
            </Checkbox>
            <Input
              placeholder="Tìm kiếm"
              onChange={handleSearch}
              value={searchTerm}
            />
          </Space>
          <Divider />
          <Row gutter={[14, 14]} style={{ height: 400, overflowY: "auto" }}>
            {data?.map((book) => (
              <Col lg={6} md={6} sm={2} key={book.document.id}>
                <Card>
                  <Checkbox
                    checked={listSelect.some(
                      (item) => item.id === book.document.id,
                    )}
                    value={book.document.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setListSelect([
                          ...listSelect,
                          {
                            id: book.document.id,
                            docName: book.document.docName,
                            idStock: book.idStock,
                          },
                        ]);
                      } else {
                        setListSelect(
                          listSelect.filter(
                            (item) => item.id !== book.document.id,
                          ),
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

export const ModalSelectBooksNew =
  WithErrorBoundaryCustom(_ModalSelectBooksNew);
