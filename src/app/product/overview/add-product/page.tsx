"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectCategoryOption from "@/components/SelectGroup/SelectOption";
import SelectBrandOption from "@/components/SelectGroup/BrandOptions";
import { useState, useRef, useContext, useEffect } from "react";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import LoadingSpinner from "@/components/Loading/LoadingSpinner";
interface SizeItem {
  size: number | "";
  quantity: number | "";
}

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // const [type, setType] = useState<SizeItem[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  
  const [des, setDes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice]  = useState(0);
  const { fetchProducts }: any = useContext(Contexts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  

  const handleAddRow = (event) => {
    event.preventDefault();
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const handleInputChange = (index: number, field: "size" | "quantity", value: string) => {
    setSizes((prevSizes) =>
      prevSizes.map((item, idx) =>
        idx === index ? { ...item, [field]: value === "" ? "" : Number(value) } : item
      )
    );
  };
  

  const handleSizeChange = (index, field, value) => {
    setSizes((prevSizes) =>
      prevSizes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };
  const handleRemoveSize = (index) => {
    setSizes((prevSizes) => prevSizes.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (selectedType) => {
    setCategoryName(selectedType);

  };
  const handleBrandChange = (selectedType) => {
    setBrandName(selectedType);

  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const uploadedFiles = Array.from(files);

      const hasMainImage = images.some((image) => image.name.includes("main"));

      const validFiles = uploadedFiles.filter((file) => {
        if (file.name.includes("main") && hasMainImage) {
          toast.warning('Chỉ được 1 file ảnh "main".', {
            position: "top-right",
            autoClose: 1500,
          });
          return false;
        }
        return true;
      });

      if (images.length + validFiles.length > 4) {
        toast.warning("You can upload up to 4 images only.", {
          position: "top-right",
          autoClose: 1500,
        });
        return;
      }

      const previewUrls = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    }
  };

  const handleRemoveImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    URL.revokeObjectURL(imagePreviews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  console.log("Category đã chọn:", categoryName);
  console.log("Size: ",sizes);
  console.log("Brand đã chọn:", brandName);
  console.log("name",productName);
  console.log("des",des);
  console.log("img",images);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData();

    if (!productName) {
      toast.warning("Yêu cầu nhập tên sản phẩm", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!categoryName) {
      toast.warning("Yêu cầu chọn thể loại sản phẩm", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!des) {
      toast.warning("Yêu cầu nhập mô tả sản phẩm", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (discount > 100 || discount < 0) {
      toast.warning("Yêu càu nhập giảm từ từ 0 - 100", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!images) {
      toast.warning("Yêu cầu thêm ảnh cho sản phẩm", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (sizes.length === 0) {
      toast.warning("Yêu cầu thêm size sản phẩm", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
  
    const hasInvalidSize = sizes.some(
      (item) => item.size === "" || item.quantity === ""
    );
    if (hasInvalidSize) {
      toast.warning("Yêu cầu nhập đầy đủ thông tin về size và số lượng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    setIsLoading(true);


    form.append("name", productName);
    form.append("price", price.toString())
    form.append("type", JSON.stringify(sizes));
    form.append("description", des);
    form.append("categoryId", categoryName);
    form.append("manufacturerId", brandName);
    form.append("discount", discount.toString());
    images.forEach((image, index) => {
      form.append(`productImage[${index}]`, image);
    });

    axios
      .post("http://localhost/be-shopbangiay/api/product.php", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success == false) {
          toast.error("Thêm sản phẩm thất bại, kiểm tra lại", {
            position: "top-right",
            autoClose: 1500,
          });
          setIsLoading(false);
          return;
        } else {
          fetchProducts();
          toast.success("Thêm sản phẩm thành công", {
            position: "top-right",
            autoClose: 2000,
          });
          setIsLoading(false);
          router.push("/product/overview");
        }

        console.log("Response:", res.data);
      })
      .catch((err) => {
        toast.error("Thêm sản phẩm thất bại, kiểm tra lại", {
          position: "top-right",
          autoClose: 1500,
        });
        setIsLoading(false);
        console.log("Error:", err.response ? err.response.data : err.message);
      });
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Dashboard", href: "/" },
          { name: "Tông quan sản phẩm", href: "/product/overview" },
          { name: "Thêm sản phẩm" },
        ]}
      />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {isLoading && <LoadingSpinner />}
        
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block  font-medium text-black dark:text-white">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
      <div className="mb-3 flex flex-row items-center gap-3">
        <label className="block font-medium text-black dark:text-white">
          Size giày
        </label>
        <button
          onClick={handleAddRow}
          className="flex justify-center rounded bg-primary p-2 font-medium text-gray hover:bg-opacity-90"
        >
          Thêm size giày mới
        </button>
      </div>

      {sizes.map((item, index) => (
  <div key={index} className="flex flex-row gap-3 pt-3 items-center">
    <input
      type="text"
      value={item.size}
      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
      placeholder="Nhập size giày"
      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    />
    <input
      type="text"
      value={item.quantity}
      onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
      placeholder="Nhập tồn kho"
      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    />
    <p
      onClick={() => handleRemoveSize(index)}
      className="hover:cursor-pointer px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
    >
      Xóa
    </p>
  </div>
))}


    </div>
              <SelectCategoryOption
                value={categoryName}
                onCategoryChange={handleCategoryChange}
              />
              <SelectBrandOption
                value={brandName}
                onBrandChange={handleBrandChange}
              />
              <div className="mb-4.5">
                <label className="mb-3 block  font-medium text-black dark:text-white">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="blockfont-medium mb-3 text-black dark:text-white">
                  Giá sản phẩm (VNĐ)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá sản phẩm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="blockfont-medium mb-3 text-black dark:text-white">
                Giảm giá sản phẩm (%)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Nhập giảm giá sản phẩm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block font-medium text-black dark:text-white">
                  Ảnh sản phẩm (
                  {images.length < 4 ? '4 ảnh - 1 ảnh "main"' : "Đã đủ 4 ảnh"})
                </label>

                <div className="relative mt-2 flex items-center justify-center">
                  <input
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  />

                  <button className=" w-1/2 rounded-lg bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 focus:outline-none">
                    Thêm ảnh
                  </button>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="my-10 grid grid-cols-2 gap-2 w-1/2 place-self-center ">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="group relative flex flex-row  w-fit">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={128}
                        height={128}
                        className="h-32 w-32 rounded-lg border border-stroke object-cover"
                      />
                      {(typeof images[index] === "string" &&
                        images[index]?.includes("main")) ||
                      (images[index] instanceof File &&
                        images[index]?.name.includes("main")) ? (
                        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-2 py-1 text-xs text-white">
                          Main
                        </span>
                      ) : null}

                      <button
                        type="button"
                        onClick={(e) => handleRemoveImage(e, index)}
                        className="absolute rounded-full bg-black bg-opacity-50 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddProduct;
