"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FeedbackTable from "@/components/Tables/FeedbackTable";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState } from "react";



const FeedBacks = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const toggleStatus = (status: string) => {
    setFilterStatus((prevStatus) => (prevStatus === status ? "all" : status));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý đơn góp ý" />
      <div className="flex items-center justify-end gap-5 rounded-md p-2 mb-4 dark:bg-meta-4">
        <button
          onClick={() => toggleStatus("0")}
          className=" rounded px-3  py-1 font-medium text-warning  shadow-card 
        shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card 
        dark:bg-cyan-950 dark:text-warning dark:hover:bg-[#3d50e0] dark:hover:text-white"
        >
          Đợi xử lý
        </button>
        <button
          onClick={() => toggleStatus("1")}
          className=" rounded px-3  py-1 font-medium text-success  shadow-card 
        shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card 
        dark:bg-cyan-950  dark:hover:bg-[#3d50e0] dark:hover:text-white"
        >
          Đã ghi nhận
        </button>
        

      </div>
      <div className="flex flex-col gap-10">
        
        <FeedbackTable
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        />
      </div>
    </DefaultLayout>
  );
};

export default FeedBacks;
