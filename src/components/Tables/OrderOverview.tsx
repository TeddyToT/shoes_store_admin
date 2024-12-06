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
  const [searchInput, setSearchInput] = useState("");
  const [searchOrders, setSearchOrders] = useState([]);

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < orders.length; i++) {
      const searchQuery = searchInput.trim().toLowerCase();
      const productName = orders[i]._id.toLowerCase();
      const isMatch = productName.includes(searchQuery);
      if (isMatch) temp.push(orders[i]);
    }
    setSearchOrders(temp);
  }, [orders, searchInput]);

  

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
  
    // Sắp xếp các đơn hàng theo trường `createdAt` giảm dần
    const sortedOrders = [...searchOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Trả về dữ liệu phân trang
    return sortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, searchOrders]);

  const [userNames, setUserNames] = useState({});

  // Fetch user names asynchronously using useEffect
  useEffect(() => {
    // Helper function to fetch the user name
    const getUser = (userID) => {
      fetch(`http://localhost:8081/v1/api/user/users/${userID}`)
        .then((res) => res.json())
        .then((data) => {
          setUserNames((prevState) => ({
            ...prevState,
            [userID]: data.name, // Update the user name for this userID
          }));
        })
        .catch((err) => {
          // console.error(err);
          setUserNames((prevState) => ({
            ...prevState,
            [userID]: "Failed to fetch user", // Show error if the API call fails
          }));
        });
    };

    // Iterate over user IDs and fetch the user names
    const userIDs = getPaginatedData().map((orderItem) => orderItem.user);
    userIDs.forEach(getUser); // Fetch user for each ID
  }, [getPaginatedData]);



  return (
    <div className=" relative rounded-sm border border-stroke bg-white px-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* <div className=" inset-0 flex justify-start">
        <div className=" w-full px-4 py-5 sm:block">
          <form action="#" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <SearchOutlinedIcon />
              </button>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-11/12"
              />
            </div>
          </form>
        </div>
      </div> */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[175px] px-4 py-4 font-medium text-black dark:text-white xl:pl-6">
                User
              </th>
              <th className="flex min-w-[450px] justify-center px-4 py-4 font-medium text-black dark:text-white">
                Items
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Voucher Used
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Payment
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>

            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((orderItem, key) => (
              <tr
              className={key % 2 != 0 ? "bg-gray-50 dark:bg-gray-800" : ""}
              key={orderItem._id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <h5 className="font-medium text-black dark:text-white">
                    {userNames[orderItem.user] || "Guest"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="text-black dark:text-white">
                    {orderItem.items.map((item) => (
                      
                      <div className="flex flex-row justify-between border-b-2 py-2" key={item._id}>
                        {item.product == null? (
                          <div className="flex flex-row items-center gap-2 basis-3/4">
                          {/* {item.product.image && (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={60}
                              height={60}
                            />
                          )} */}
                          <div className="flex flex-col">
                          <p className="text-ellipsis">Product đã bị xóa</p>
                          {/* <p className="capitalize">Size: {item.size}</p> */}
                          </div>
                        </div> ):(<div className="flex flex-row items-center gap-2 basis-3/4">
                          {item.product.image && (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={60}
                              height={60}
                            />
                          )}
                          <div className="flex flex-col">
                          <p className="text-ellipsis">{item.product.name}</p>
                          <p className="capitalize">Size: {item.size}</p>
                          </div>
                        </div> )}
                         
                        <div className="flex flex-col items-start gap-2">
                          
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {item.quantity * item.price} </p>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                  <p className="text-right mt-3 font-black text-base ">Total: {orderItem.total} </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                {orderItem.voucher.length > 0 ? (
                  orderItem.voucher.map((voucher) => (
                    <p key={voucher._id} className="uppercase text-center my-3">
                      {voucher.name || "Loading..."}
                    </p>
                  ))
                ) : (
                  <p>No voucher used</p>
                )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="capitalize">
                    {orderItem.paymentMethod}: {orderItem.paymentStatus}
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
                    {orderItem.deliveryStatus}
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
