"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
// import router from "next/router";
import { useRouter } from "next/navigation";
import { Contexts } from "@/app/Contexts";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
const AddBrand = () => {

  const {fetchManufacturers}:any = useContext(Contexts)
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!brandName) {
    
      toast.warning("Hãy nhập tên hãng", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    setIsLoading(true);

    fetch("http://localhost/be-shopbangiay/api/manufacturer.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: brandName
      }),
    })
      .then((res) => res.json())
      .then((data) => {

          console.log(data);
          if (data.name)
          {
            toast.success("Thêm hãng thành công", {
              position: "top-right",
              autoClose: 2000,
            });
            fetchManufacturers()
            router.push("/product/brand"); 
          }
          else{
            toast.error("Thêm hãng thất bại", {
              position: "top-right",
              autoClose: 2000,
              
            });
            setIsLoading(false);
          }

          
  })
      .catch((err) => {
        console.error(err);
        toast.error("Thêm hãng thất bại", {
          position: "top-right",
          autoClose: 2000,
        });
      });

      
  };

  return (
    <DefaultLayout>
      <Breadcrumb
  items={[
    { name: "Dashboard", href: "/" },
    { name: "Hãng giày", href: "/product/brand" },
    { name: "Thêm hãng giày" }
  ]}
/>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Tên hãng
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Nhập tên hãng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
              onClick={handleSubmit}
               className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddBrand;
