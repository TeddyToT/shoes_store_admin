import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import BrandTable from "@/components/Tables/BrandTable";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";


const ProductCategory = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hãng giày" />

      <Link
              href="/product/brand/add-brand"
              className="mb-3 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-center font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
            >
              Thêm hãng
            </Link>
      <div className="flex flex-col gap-10">
        
        <BrandTable />    
      </div>
    </DefaultLayout>
  );
};

export default ProductCategory;
