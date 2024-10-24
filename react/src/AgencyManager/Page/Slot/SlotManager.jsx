import { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { DeleteSlotActionAsync, GetSlotActionAsync, AddSlotActionAsync, UpdateSlotActionAsync } from "../../../Redux/ReducerAPI/SlotReducer";
import SlotModal from "../../Modal/SlotModal";

const SlotManager = () => {
  const { slotData } = useSelector((state) => state.SlotReducer);
  const dispatch = useDispatch();
  // const [searchText, setSearchText] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  // const searchInput = useRef(null);

  useEffect(() => {
    dispatch(GetSlotActionAsync());
  }, []);

  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };

  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText("");
  // };

  const handleUpdate = (slot) => {
    setEditingSlot(slot); // Lưu thông tin slot cần chỉnh sửa
    setIsModalVisible(true); // Hiển thị modal với dữ liệu của slot đang chỉnh sửa
  };

  const handleDelete = (id) => {
    dispatch(DeleteSlotActionAsync(id));
  };

  // Chỉ thêm mới slot, không xử lý cập nhật
  const handleAddSlot = (newSlot) => {
    dispatch(AddSlotActionAsync(newSlot)).then(() => {
      setIsModalVisible(false);
    });
  };

  // Chỉ cập nhật slot hiện tại
  const handleUpdateSlot = (updatedSlot) => {
    console.log("Updated slot:", updatedSlot);
    dispatch(UpdateSlotActionAsync(editingSlot.id, updatedSlot)).then(() => {
      dispatch(GetSlotActionAsync());
      setEditingSlot(null);
      setIsModalVisible(false);
    });
  };

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{ marginBottom: 8, display: "block" }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  // });

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "no",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Slot học",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: "20%",
      render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm A"),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: "20%",
      render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm A"),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)} // Sửa thông tin slot
          />
          <Popconfirm
            title="Xác nhận xóa slot này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h5 className="card-title">Danh Sách Slot Học</h5>
          <Button
            type="primary"
            onClick={() => { setIsModalVisible(true); setEditingSlot(null); }} // Hiển thị modal cho thêm mới
          >
            Thêm Slot
          </Button>
        </div>

        <div className="table-responsive">
          <Table
            bordered
            columns={columns}
            dataSource={slotData}
            rowKey="id"
          />
        </div>

        <SlotModal
          visible={isModalVisible}
          onCancel={() => { setIsModalVisible(false); setEditingSlot(null); }}
          onCreate={editingSlot ? handleUpdateSlot : handleAddSlot}
          initialValues={editingSlot}
        />
      </div>
    </div>
  );
};

export default SlotManager;
