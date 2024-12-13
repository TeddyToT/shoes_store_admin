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

const EditProduct = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [productName, setProductName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [images, setImages] = useState<Array<File | string>>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);

  const [des, setDes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const { fetchProducts }: any = useContext(Contexts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost/be-shopbangiay/api/product.php?productId=` + id)
      .then((res) => {
        const allImages = [res.data.mainImage, ...res.data.otherImages];
        setProductName(res.data.name);
        setCategoryName(res.data.categoryId.categoryId);
        setBrandName(res.data.manufacturerId.manufacturerId);
        setImagePreviews(allImages);
        setImages(allImages);
        setSizes(res.data.type);
        setDes(res.data.description);
        setDiscount(res.data.discount);
        setPrice(res.data.price);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleAddRow = (event) => {
    event.preventDefault();
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const handleSizeChange = (index, field, value) => {
    setSizes((prevSizes) =>
      prevSizes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
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
  
      const hasMainImage = images.some(
        (image) =>
          (typeof image === "string" && image.includes("main")) ||
          (image instanceof File && image.name.includes("main"))
      );
  
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

 
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData();

    
    if (!productName) {
      toast.warning("Please enter product name", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!categoryName) {
      toast.warning("Please select category type", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!des) {
      toast.warning("Please enter product description", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (discount > 100 || discount < 0) {
      toast.warning("Please enter discount value from 0 - 100", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!images) {
      toast.warning("Please add image for product", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (sizes.length === 0) {
      toast.warning("Please add at least one size", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
  
    const hasInvalidSize = sizes.some(
      (item) => item.size === "" || item.quantity === ""
    );
    if (hasInvalidSize) {
      toast.warning("Please fill out all size and quantity fields", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    setIsLoading(true);

    form.append("name", productName);
    form.append("productId", id);
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
      .post(`http://localhost/be-shopbangiay/api/UpdateProduct.php`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success == false) {
          toast.error("Không thành công", {
            position: "top-right",
            autoClose: 1500,
          });
          return;
        }
        toast.success("Sửa sản phẩm thành công", {
          position: "top-right",
          autoClose: 2000,

        });
        fetchProducts();
        router.push("/product/overview");
        
      })
      .catch((err) => {
        console.log("Error:", err.response ? err.response.data : err.message);
      });
    // .finally(() => {

    // });
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Dashboard", href: "/" },
          { name: "Tổng quan sản phẩm", href: "/product/overview" },
          { name: "Sửa sản phẩm" },
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
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 pt-3"
                  >
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                      placeholder="Nhập size giày"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handleSizeChange(index, "quantity", e.target.value)
                      }
                      placeholder="Nhập tồn kho"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <p
                      onClick={() => handleRemoveSize(index)}
                      className="rounded bg-red-500 px-3 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
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
                <label className="blockfont-medium mb-3 text-black dark:text-white">
                  Giá sản phẩm
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter product discount (Default value is 0)"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="blockfont-medium mb-3 text-black dark:text-white">
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
                <label className="mb-3 block font-medium text-black dark:text-white">
                  Attach Product Image (
                  {images.length < 4 ? "4 ảnh" : "Đã đủ 4 ảnh"})
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
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditProduct;
