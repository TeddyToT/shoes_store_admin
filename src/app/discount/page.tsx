"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import DiscountTable from "@/components/Tables/DiscountTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

const TablesPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const toggleStatus = (status:string) => {
    setFilterStatus((prevStatus) => (prevStatus === status ? "all" : status));
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Discount" />
      <div className="flex flex-row w-full justify-between ">
        <Link 
          href="/discount/add-discount"
          className=" m-2 flex items-center justify-center rounded-full 
          bg-cyan-950 hover:bg-sky-500 dark:hover:bg-slate-200 dark:hover:text-black hover:bg-gư
          px-5 py-3 text-center 
          font-normal text-white lg:px-4 xl:px-6"
        >
          Add Discount
        </Link>
        <div className="flex items-center  gap-3 rounded-md bg-whiter p-2 dark:bg-inherit ">
          <button 
          onClick={() => toggleStatus("pending")}
          className=" text-warning rounded  px-3 py-1 font-medium  shadow-card 
          shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card 
          dark:bg-cyan-950 dark:text-warning dark:hover:bg-[#3d50e0] dark:hover:text-white">
            Pending
          </button>
          <button 
           onClick={() => toggleStatus("available")}
          className=" text-success rounded  px-3 py-1 font-medium  shadow-card 
          shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card 
          dark:bg-cyan-950 dark:text-success  dark:hover:bg-[#3d50e0] dark:hover:text-white">            
          Available
          </button>
          <button 
          onClick={() => toggleStatus("expired")}
          className=" text-danger rounded  px-3 py-1 font-medium  shadow-card 
          shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card 
          dark:bg-cyan-950 dark:text-danger dark:hover:bg-[#3d50e0] dark:hover:text-white">            
          Expired
          </button>
          
        </div>
      </div>
      <div className="flex flex-col gap-10">
      <DiscountTable filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
