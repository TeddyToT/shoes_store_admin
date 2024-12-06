import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";



import CategoryChart from "@/components/Dashboard/CategoryChart";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";



const Revenue = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Revenue" />

      <div className="flex flex-col gap-10">
      <CategoryChart/>
      </div>
    </DefaultLayout>
  );
};

export default Revenue;
