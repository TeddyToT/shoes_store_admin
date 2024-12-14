"use client";
import { useState, useContext, useEffect, useCallback } from "react";
// import { Package } from "@/types/package";
import axios from "axios";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

const OrderTable = ({ filterStatus, setFilterStatus }: any) => {
  const { orders, fetchOrders }: any = useContext(Contexts);
  // console.log(orders);

  const [reversedOrders, setReversedOrders] = useState([]);

  useEffect(() => {
    if (orders.length > 0) {
      setReversedOrders([...orders].reverse());
    }
  }, [orders]);

  const [searchInput, setSearchInput] = useState("");
  const [searchOrders, setSearchOrders] = useState([]);

  useEffect(() => {
    let filtered = reversedOrders;

    if (filterStatus !== "all") {
      filtered = reversedOrders.filter((order) => order.state === filterStatus);
    }

    const searchQuery = searchInput.trim().toLowerCase();
    const temp = filtered;
    setSearchOrders(temp);
  }, [searchInput, filterStatus, orders, reversedOrders]);

  const itemsPerPage = 8; // Số mục mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(searchOrders.length / itemsPerPage);
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  const handlePageInputChange = (e) => {
    const inputValue = parseInt(e.target.value, 10);

    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= totalPages) {
      setCurrentPage(inputValue);
    }
  };

  const getPaginatedData = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return searchOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, searchOrders]);

  const handleDeleteOrder = (orderId: string) => {
    axios
      .delete(`http://localhost/be-shopbangiay/api/invoice.php`, {
        data: { invoiceId: orderId.toString() },
      })
      .then((res) => {
        if (res.data.success == false) {
          toast.error("Xóa đơn hàng thất bại", {
            position: "top-right",
            autoClose: 2000,
          });
          fetchOrders();
        } else {
          toast.success("Xóa đơn hàng thành công", {
            position: "top-right",
            autoClose: 2000,
          });
          fetchOrders();
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        toast.error("Đã xảy ra lỗi khi xóa đơn hàng", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };
  

  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(" ");
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year} ${time}`;
  };
  return (
    <div className=" relative overflow-hidden rounded-md border border-gray-400  bg-white pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-1/4 px-4 py-4 font-medium text-black dark:text-white xl:pl-6">
                Khách hàng
              </th>
              <th className="w-1/2 px-4 py-4 text-center font-medium text-black dark:text-white">
                Sản phẩm
              </th>
              <th className="w-1/12 px-4 py-4 text-center font-medium text-black dark:text-white">
                Thời gian đặt
              </th>
              <th className="w-1/12 px-4 py-4 font-medium text-black dark:text-white">
                Thanh toán
              </th>
              <th className="w-1/12 px-4 py-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((orderItem, key) => (
              <tr
                className={key % 2 != 0 ? "bg-gray-50 dark:bg-gray-800" : ""}
                key={orderItem._id}
              >
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <h5 className="font-medium text-black dark:text-white">
                    {orderItem.name ? orderItem.name : "Không tên"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="text-black dark:text-white">
                    {orderItem.items.map((item) => (
                      <div
                        className="flex flex-row justify-between border-b-2 py-2"
                        key={item.productId}
                      >
                        {item.productId == null ? (
                          <div className="flex basis-3/4 flex-row items-center gap-2">
                            <div className="flex flex-col">
                              <p className="text-ellipsis">Product đã bị xóa</p>
                              {/* <p className="capitalize">Size: {item.size}</p> */}
                            </div>
                          </div>
                        ) : (
                          <div className="flex basis-3/4 flex-row items-center gap-2">
                            {item.productId.mainImage && (
                              <Image
                                src={item.productId.mainImage}
                                alt={item.productId.name}
                                width={60}
                                height={60}
                              />
                            )}
                            <div className="flex flex-col">
                              <p className="text-ellipsis">
                                {item.productId.name}
                              </p>
                              <p className="capitalize">Size: {item.size}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex w-1/3 flex-col items-start gap-2 ">
                          <div className="flex w-full flex-row justify-between">
                            <p>Số lượng:</p>
                            <p>{item.quantity}</p>
                          </div>
                          <div className="flex w-full flex-row justify-between">
                            <p>Giá:</p>
                            <p>
                              {(
                                item.quantity *
                                (item.productId.price -
                                  (item.productId.price *
                                    item.productId.discount) /
                                    100)
                              ).toLocaleString("vi-VN")}
                              đ
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex w-1/3 justify-between place-self-end break-words">
                    <p className="mt-3 ml-3 text-base font-semibold">Tổng:</p>
                    <p className="mt-3 overflow-hidden break-words text-base font-semibold">
                      {Number(orderItem.totalPrice).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-center capitalize">
                    {orderItem.orderDate
                      ? formatDateTime(orderItem.orderDate)
                      : "Test"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-center capitalize">
                    {orderItem.paymentMethod ? orderItem.paymentMethod : "Test"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 font-medium  capitalize ${
                      orderItem.state === "Done"
                        ? " text-success"
                        : orderItem.state === "Cancel"
                          ? " text-danger"
                          : orderItem.state === "Shipping"
                            ? " text-zinc-500"
                            : orderItem.state === "Doing"
                              ? " text-blue-500"
                              : orderItem.state === "Confirming"
                                ? " text-orange-500"
                                : orderItem.state === "Pending"
                                  ? " text-warning"
                                  : " text-danger"
                    }`}
                  >
                    {orderItem.state === "Done"
                        ? " Hoàn thành"
                        : orderItem.state === "Cancel"
                          ? " Đã hủy"
                          : orderItem.state === "Shipping"
                            ? " Đang vận chuyển"
                            : orderItem.state === "Doing"
                              ? " text-blue-500"
                              : orderItem.state === "Confirming"
                                ? " Xác nhận"
                                : orderItem.state === "Pending"
                                  ? " Đang chờ xử lý"
                                  : " Chưa có"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <Link
                      href={`/order/management/edit-order/${orderItem.invoiceId}`}
                      className="hover:text-primary"
                    >
                      <ModeEditIcon />
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn xóa đơn hàng này không?",
                          )
                        ) {
                          handleDeleteOrder(orderItem.invoiceId);
                        }
                      }}
                      className="hover:text-primary"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pf-3 flex justify-start pr-4 pt-8 md:justify-center lg:justify-center xl:justify-center ">
        <button
          className="hover:cursor-pointer hover:font-medium hover:text-sky-500"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="m-3">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => handlePageInputChange(e)}
            min="1"
            max={totalPages}
            className=" w-16 rounded border text-center"
          />
          <span className="ml-1">of {totalPages} </span>
        </div>
        <button
          className="hover:cursor-pointer hover:font-medium hover:text-sky-500"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        {/* Thêm ô nhập số trang */}
      </div>
    </div>
  );
};

export default OrderTable;
