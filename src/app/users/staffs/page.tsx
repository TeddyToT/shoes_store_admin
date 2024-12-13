"use client";
import { useState, useContext, useEffect } from "react";

import Image from "next/image";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Contexts } from "@/app/Contexts";
import Link from "next/link";

const Staffs = () => {
  const{users, userDetail}: any = useContext(Contexts);
  const [searchInput, setSearchInput] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  useEffect(() => {
    const filteredUsers = users.filter((user) => user.role === "Staff");
    let temp = [];
    for (let i = 0; i < filteredUsers.length; i++) {
      const searchQuery = searchInput.trim().toLowerCase();
      let userName = "";
      if (filteredUsers[i].name) {
        userName = filteredUsers[i].name.toLowerCase();
      } else {
        filteredUsers[i].name = "Chưa đặt tên";
      }
  
      const isMatch = userName.includes(searchQuery);
      if (isMatch) temp.push(filteredUsers[i]);
    }
    setSearchUsers(temp);
  }, [searchInput, users]);
  

  const itemsPerPage = 6; 
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = Math.ceil(searchUsers.length / itemsPerPage);
  
    const handleNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
        window.scrollTo(0, 0); 
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
  
    const getPaginatedData = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return searchUsers.slice(startIndex, startIndex + itemsPerPage);
    };
    function convertDMYFormat(date: string): string {
      const [year, month, day] = date.split("/");
      return `${day}/${month}/${year}`;
    }
  // console.log(users);
  return (
    <DefaultLayout>

    
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Nhân viên
        </h4>
      </div>
      {userDetail?(userDetail.role == "Admin"?(<Link
              href="/users/staffs/add-staff"
              className="mb-3 ml-5 inline-flex items-center justify-center rounded-full bg-black dark:text-black dark:bg-gray-300 dark:hover:bg-slate-600 dark:hover:text-white px-5 py-3 text-center font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
            >
              Thêm Nhân viên
            </Link>):(
              <div>
                </div>
            )):(<div>
                </div>)}
      
      <div className=" inset-0 flex justify-start">
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
      </div>
      <div className="grid  border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center ">
          <p className="font-bold ">Họ tên</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-bold">Email</p>
        </div>
        <div className="col-span-3 flex items-center">
          <p className="font-bold">Địa chỉ</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-bold">Số điện thoại </p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-bold">Ngày sinh </p>
        </div>
      </div>

      {getPaginatedData().map((user:any, key) => (
        <div
          className="grid grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5"
          key={user.userId}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                width={50}
                height={50}
                style={{
                  width: "50",
                  height: "50",
                }}
                src={user.avatar}
                  
                  alt="avatar"
                />
              </div>
              <p className="text-sm text-black dark:text-white break-words w-11/12">
              {user.name?user.name:"Chưa đặt tên"}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white break-words w-11/12">
          {user.email?user.email:'Chưa nhập mail'}
            </p>
          </div>
          <div className="col-span-3 flex items-center">
            <p className="text-sm text-black dark:text-white break-words w-11/12">
              {user.address?user.address:"Chưa có địa chỉ"}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white break-words w-11/12">
          {user.phone?user.phone:"Chưa nhập số điện thoại"}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white break-words w-11/12">
          {user.birthday?convertDMYFormat(user.birthday):"Chưa nhập ngày sinh"}
            </p>
          </div>
       
        </div>
      ))}
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
      </div>
    </div>
    </DefaultLayout>
  );
};

export default Staffs;
