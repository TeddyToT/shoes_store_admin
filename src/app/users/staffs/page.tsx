"use client";
import { useState, useContext, useEffect } from "react";

import Image from "next/image";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Contexts } from "@/app/Contexts";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from "axios";
import { toast } from "react-toastify";

const Staffs = () => {
  const { users, userDetail, fetchUsers }: any = useContext(Contexts);
  const [searchInput, setSearchInput] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  useEffect(() => {
    const filteredUsers = users.filter(
      (user) => user.role === "Staff" || user.role === "Admin",
    );
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

  const handleDeleteStaff = (id: string) => {
    console.log(id);
    if (userDetail.userId == id)
    {
      toast.warn("Không thể tự xóa Admin hiện tại", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    axios
      .delete(
        `http://localhost/be-shopbangiay/api/user.php`,{
          data: { userId: id.toString() }
        }
      )
      
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Xóa nhân viên thành công", {
            position: "top-right",
            autoClose: 2000,
          });
          fetchUsers();
        } else {
          console.log(response.data);
          toast.error("Xóa nhân viên thất bại", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("Đã xảy ra lỗi khi xóa nhân viên", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Nhân viên" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {userDetail ? (
          userDetail.role == "Admin" ? (
            <Link
              href="/users/staffs/add-staff"
              className="mb-3 ml-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-center font-normal text-white hover:bg-opacity-90 dark:bg-gray-300 dark:text-black dark:hover:bg-slate-600 dark:hover:text-white lg:px-4 xl:px-6"
            >
              Thêm Nhân viên
            </Link>
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}

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
                  placeholder="Tìm tên nhân viên..."
                  className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-11/12"
                />
              </div>
            </form>
          </div>
        </div>
        <div
          className={`grid border-t border-stroke px-4 py-4.5 dark:border-strokedark ${
            userDetail? userDetail.role == "Admin" ? " grid-cols-11" : " grid-cols-10" :" grid-cols-10"
          } md:px-6 2xl:px-7.5`}
        >
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
          
            
            <div className="col-span-1 flex items-center text-center">
            <p className="font-bold text-center">Quyền </p>
          </div>
        
          {userDetail && userDetail.role == "Admin"?(
            
            <div className="col-span-1 flex items-center text-center">
            <p className="font-bold text-center">Hành động </p>
          </div>
          ):(
<div>
  </div>
          )}
        </div>

        {getPaginatedData().map((user: any, key) => (
          <div
          className={`grid border-t border-stroke px-4 py-4.5 dark:border-strokedark ${
            userDetail? userDetail.role == "Admin" ? " grid-cols-11" : " grid-cols-10" :" grid-cols-10"
          } md:px-6 2xl:px-7.5`}
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
                <p className="w-11/12 break-words text-sm text-black dark:text-white">
                  {user.name ? user.name : "Chưa đặt tên"}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="w-11/12 break-words text-sm text-black dark:text-white">
                {user.email ? user.email : "Chưa nhập mail"}
              </p>
            </div>
            <div className="col-span-3 flex items-center">
              <p className="w-11/12 break-words text-sm text-black dark:text-white">
                {user.address ? user.address : "Chưa có địa chỉ"}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="w-11/12 break-words text-sm text-black dark:text-white">
                {user.phone ? user.phone : "Chưa nhập số điện thoại"}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="w-11/12 break-words text-sm text-black dark:text-white">
                {user.birthday
                  ? convertDMYFormat(user.birthday)
                  : "Chưa nhập ngày sinh"}
              </p>
            </div>

            <div className="col-span-1 flex items-center text-center">
            <p className="font-bold text-center">{user.role == "Admin"? "Admin": "Nhân viên"} </p>
          </div>


            {userDetail && userDetail.role == "Admin"?(
             <div className="col-span-1 flex items-center justify-center">
             <div className="flex items-center space-x-3.5">
               <Link
                 href={`/users/staffs/edit-staff/${user.userId}`}
                 className="hover:text-primary"
               >
                 <ModeEditIcon />
               </Link>
               <button
                 onClick={() => {
                   if (
                     window.confirm(
                       "Bạn có chắc chắn muốn xóa người dùng này không?",
                     )
                   ) {
                    handleDeleteStaff(user.userId);
                   }
                 }}
                 className="hover:text-red-500"
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
           </div>
          ):(
<div>
  </div>
          )}
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
