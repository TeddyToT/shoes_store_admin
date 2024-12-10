"use client";
import { useState, useContext, useEffect, useCallback } from "react";
// import { Package } from "@/types/package";
import axios from "axios";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";

const OrderOverViewTable = () => {
  const { orders }: any = useContext(Contexts);
  // console.log(orders);





  

  const itemsPerPage = 8; // Số mục mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
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


    return orders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, orders]);



  return (
    <div className=" relative rounded-sm border border-stroke bg-white px-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[175px] px-4 py-4 font-medium text-black dark:text-white xl:pl-6">
                Khách hàng
              </th>
              <th className="flex min-w-[450px] justify-center px-4 py-4 font-medium text-black dark:text-white">
                Sản phẩm
              </th>

              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Thanh toán
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>

            </tr>
          </thead>
          <tbody>
            {getPaginatedData().reverse().map((orderItem, key) => (
              <tr
              className={key % 2 != 0 ? "bg-gray-50 dark:bg-gray-800" : ""}
              key={orderItem.invoiceId}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <h5 className="font-medium text-black dark:text-white">
                    {orderItem.userId.name?orderItem.userId.name:"Không tên"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="text-black dark:text-white">
                    {orderItem.items.map((item) => (
                      
                      <div className="flex flex-row justify-between border-b-2 py-2" key={item.productId}>
                        {item.productId == null? (
                          <div className="flex flex-row items-center gap-2 basis-3/4">
                          <div className="flex flex-col">
                          <p className="text-ellipsis">Product đã bị xóa</p>
                          {/* <p className="capitalize">Size: {item.size}</p> */}
                          </div>
                        </div> ):(<div className="flex flex-row items-center gap-2 basis-3/4">
                          {item.productId.mainImage && (
                            <Image
                              src={item.productId.mainImage}
                              alt={item.productId.name}
                              width={60}
                              height={60}
                            />
                          )}
                          <div className="flex flex-col">
                          <p className="text-ellipsis">{item.productId.name}</p>
                          <p className="capitalize">Size: {item.size}</p>
                          </div>
                        </div> )}
                         
                        <div className="flex flex-col items-start gap-2">
                          
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {(item.quantity * (item.productId.price-(item.productId.price*item.productId.discount/100))).toLocaleString("vi-VN")} </p>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                  <p className="text-right mt-3 font-black text-base ">Total: {orderItem.total} </p>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="capitalize text-center">
                    {orderItem.paymentMethod?orderItem.paymentMethod:"Test"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`capitalize inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium ${
                      orderItem.deliveryStatus === "success"
                        ? " text-success"
                        : orderItem.deliveryStatus === "fail"
                          ? " text-danger"
                          : orderItem.deliveryStatus === "shipping"
                            ? " text-[#259AE6]"
                            : orderItem.deliveryStatus === "doing"
                              ? " text-[#10B981]"
                              : orderItem.deliveryStatus === "confirmed"
                                ? " text-[#313D4A]"
                                : orderItem.deliveryStatus === "pending"
                                  ? " text-warning"
                                  : " text-danger"
                    }`}
                  >
                    {orderItem.state}
                  </p>
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

export default OrderOverViewTable;
