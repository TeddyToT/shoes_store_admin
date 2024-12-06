"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectCategoryOption from "@/components/SelectGroup/SelectOption";
import { useState, useRef, useContext, useEffect } from "react";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
interface PriceItem {
  size: string;
  price: number;
}

const AddProduct = () => {

  const [productName, setProductName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [type, setType] = useState<PriceItem[]>([]);
  const [des, setDes] = useState("");
  const [discount, setDiscount] = useState(0);
  const {fetchProducts}:any = useContext(Contexts)
  const router = useRouter();

  const handlePriceChange = (size: string, event: any) => {
    const newPrice = event.target.value;
  
    setType((prevTypes) => 
      prevTypes.map((item) =>
        item.size === size ? { ...item, price: Number(newPrice) } : item
      )
    );
    
  };
  console.log(type);

  const addSize = (size: string) => {
    setType((prevTypes) => {
      // Check if the size already exists
      const sizeIndex = prevTypes.findIndex(item => item.size === size);
      
      if (sizeIndex !== -1) {
        // If the size exists, remove it
        return prevTypes.filter(item => item.size !== size);
      } else {
        // If the size doesn't exist, add it with a default price
        return [...prevTypes, { size, price: 0 }];
      }
    });
  };

  const handleCategoryChange = (selectedType: string) => {
    setCategoryName(selectedType);
    console.log("Type đã chọn:", selectedType); // Xử lý giá trị tại đây
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // let reader = new FileReader();
    const file = event.target.files?.[0] || null;

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
      setImage(file);
    }
  };

  console.log(categoryName);
  console.log(des);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData();
  
    // Kiểm tra các giá trị
    if (!productName) {
      toast.warning("Please enter product name", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!categoryName) {
    
      toast.warning("Please select category type", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!des) {
      toast.warning("Please enter product description", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (discount > 100 || discount < 0) {
      toast.warning("Please enter discount value from 0 - 100", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!image) {
      toast.warning("Please add image for product", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (type.length === 0) {
      
      toast.warning("Requires types for products", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
  
    form.append("name", productName);
    form.append("type", JSON.stringify(type));
    form.append("description", des);
    form.append("categoryId", categoryName);
    form.append("discount", discount.toString());
    if (image) {
      form.append("image", image);
    }
  
    axios
      .post("http://localhost:8081/v1/api/user/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success == false)
        {
          toast.error("Add product fail", {
            position: "top-right",
            autoClose: 1500
          })
          return;
        }
        else{
          fetchProducts();
          toast.success("Add product sucessfully", {
            position: "top-right",
            autoClose: 2000
          })
          router.push("/product/overview")
        }
        
        console.log('Response:', res.data);
      })
      .catch((err) => {
        toast.error("Add product fail", {
          position: "top-right",
          autoClose: 1500
        })
        console.log("Error:", err.response ? err.response.data : err.message);
      })
      
  };
  
 
  
  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Dashboard", href: "/" },
          { name: "Product Overview", href: "/product/overview" },
          { name: "Add Product" },
        ]}
      />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <SelectCategoryOption value={categoryName} onCategoryChange={handleCategoryChange} />
              {categoryName ? (
                <div className="flex flex-col">
                  <div className="mb-4.5 flex flex-row gap-4">
                    <button className="rounded px-3 py-1 font-medium text-black shadow-card shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" 
                    type="button" onClick={() => addSize("S")}>
                      Add Size S
                    </button>
                    <button className="rounded px-3 py-1 font-medium text-black shadow-card shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" 
                    type="button" onClick={() => addSize("M")}>
                      Add Size M
                    </button>
                    <button className="rounded px-3 py-1 font-medium text-black shadow-card shadow-gray-400 hover:bg-slate-700 hover:text-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" 
                    type="button" onClick={() => addSize("L")}>
                      Add Size L
                    </button>
                  </div>
                  {type ? (
                    type.map((item) => (
                      <div className="mb-4.5" key={item.size}>
                        <label className="capitalize mb-3 block text-sm font-medium text-black dark:text-white">
                          Enter Price for size {item.size}
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.size, e)}
                          placeholder="Enter price"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : (
                <div></div>
              )}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Product Description
                </label>
                <input
                  type="text"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  placeholder="Enter product description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Product Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter product discount (Default value is 0)"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Attach Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>
              {imagePreview && (
                <div className="mt-4">
                  {imagePreview && (
                    <div className="mt-4">
                      <Image
                        width={128}
                        height={128}
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg border border-stroke object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
              <button
              onClick={handleSubmit}
              
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddProduct;
