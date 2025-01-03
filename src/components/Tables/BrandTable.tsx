"use client";
import { useState, useContext } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import axios from "axios";
import { toast } from "react-toastify";
import { Contexts } from "@/app/Contexts";
import Link from "next/link";


const BrandTable = () => {
   
  const{manufacturers, fetchManufacturers}: any = useContext(Contexts)
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(manufacturers.length / itemsPerPage);
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0); 
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0); 
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
    return manufacturers.slice(startIndex, startIndex + itemsPerPage);
  };
  const handleDeleteCategory = (manufacturerId: string) => {
    axios
      .delete("http://localhost/be-shopbangiay/api/manufacturer.php",{
        data: {manufacturerId: manufacturerId}
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Xóa hãng thành công", {
            position: "top-right",
            autoClose: 2000
          })
          fetchManufacturers();
        } else {
          toast.error("Xóa hãng thất bại", {
            position: "top-right",
            autoClose: 2000
          })
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("Đã xảy ra lỗi khi xóa hãng", {
          position: "top-right",
          autoClose: 2000
        })
      });
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className=" inset-0 flex justify-start">
    <div className=" sm:block py-5 px-4 w-full">
      <form action="#" method="POST">
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <SearchOutlinedIcon />
          </button>
          <input
            type="text"
            placeholder="Tìm tên hãng..."
            className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-11/12"
          />
        </div>
      </form>
    </div>
  </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-bold text-black dark:text-white xl:pl-11">
                Tên hãng
              </th>
              <th className="px-4 py-4 font-bold text-black dark:text-white">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((brand:any, key) => (
              <tr key={brand.manufacturerId}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white capitalize">
                    {brand.name}
                  </h5>
                  
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <Link 
                    href={`/product/brand/edit-brand/${brand.manufacturerId}`}
                    className="hover:text-primary">

                     <ModeEditIcon/>
                    </Link>
                    <button 
                    onClick={() => {
                      if (window.confirm("Bạn có chắc chắn muốn xóa brand này không?")) {
                        if (window.confirm("Xóa hãng giày sẽ xóa tất cả các giày trong hãng. Bạn có chắc muốn xóa không?")){
                          handleDeleteCategory(brand.manufacturerId);
                        }
                        
                      }
                    }}
                    className="hover:text-primary">
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
      </div>
    </div>
  );
};

export default BrandTable;
