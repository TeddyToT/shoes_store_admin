import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import ProductTable from "@/components/Tables/ProductTable";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";



const ProductOverview = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Overview" />
      
      <Link
              href="/product/overview/add-product"
              className="mb-3 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-center font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
            >
              Add Product
            </Link>
      <div className="flex flex-col gap-10">
        
        <ProductTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductOverview;
