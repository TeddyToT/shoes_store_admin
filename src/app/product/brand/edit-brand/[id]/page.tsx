"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Contexts } from "@/app/Contexts";
import axios from "axios";
const EditBrand = ({ params }: { params: { id: string } }) => {
    const { id } = params;

  const {fetchManufacturers}:any = useContext(Contexts)
  const [brandName, setBrandName] = useState("");
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`http://localhost/be-shopbangiay/api/manufacturer.php?manufacturerId=` + id)
      .then((res) => {
        setBrandName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!brandName) {
    
      toast.warning("Yêu cầu nhập tên hãng", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }

    fetch(`http://localhost/be-shopbangiay/api/manufacturer.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            manufacturerId: id,
          name: brandName,

        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success == false)
          {
            toast.error("Sửa tên hãng thất bại", {
              position: "top-right",
              autoClose: 2000,
            });
          }
          else
          {
            console.log(data);
            fetchManufacturers()
            toast.success("Sửa tên hãng thành công", {
              position: "top-right",
              autoClose: 2000, 

            });
            router.push("/product/brand"); 
          }

    })
        .catch((err) => {
          console.error(err);
          toast.error("Sửa tên hãng thất bại", {
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
    { name: "Sửa hãng giày" }
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
                  placeholder="Enter category name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
              onClick={handleSubmit}
               className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Sửa thông tin hãng
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditBrand;
