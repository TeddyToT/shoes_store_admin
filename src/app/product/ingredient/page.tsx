import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import IngredientTable from "@/components/Tables/IngredientTable";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";


const ProductCategory = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Category" />

      <Link
              href="#"
              className="mb-3 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-center font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
            >
              Add Ingredient
            </Link>
      <div className="flex flex-col gap-10">
        
        <IngredientTable />    
      </div>
    </DefaultLayout>
  );
};

export default ProductCategory;
