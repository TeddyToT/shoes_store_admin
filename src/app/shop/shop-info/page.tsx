"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useRef, useContext, useEffect } from "react";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const ShopInfo = () => {
  const [shopName, setshopName] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");

  const [hotline, setHotline] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);

  const [images, setImages] = useState<Array<File | string>>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { fetchShop, shop }: any = useContext(Contexts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const allImages = [shop.logo, shop.logodark];
    setshopName(shop.name);
    setAbout(shop.about);
    setAddress(shop.address);
    setEmail(shop.email);
    setPhone(shop.phone);
    setHotline(shop.hotline);
    setImagePreviews(allImages);
    setImages(allImages);
  }, [shop]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    if (!files) return;
  
    const uploadedFiles = Array.from(files);
  
    
    const validFiles = uploadedFiles.filter((file) => {
      const isNormalLogo = file.name.includes("logo");
      const isDarkLogo = file.name.includes("dark");
  
      if (
        isNormalLogo &&
        images.some((img) => typeof img === "string" && img.includes("logo"))
      ) {
        toast.warning('Chỉ được 1 file ảnh "logo bình thường".', {
          position: "top-right",
          autoClose: 1500,
        });
        return false;
      }
  
      if (
        isDarkLogo &&
        images.some((img) => typeof img === "string" && img.includes("dark"))
      ) {
        toast.warning('Chỉ được 1 file ảnh "logo dark".', {
          position: "top-right",
          autoClose: 1500,
        });
        return false;
      }
  
      return true;
    });
  
    
    if (images.length + validFiles.length > 2) {
      toast.warning("You can upload up to 2 images only.", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
  
 
    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
  
    // Update state
    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previewUrls]);
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

    if (!shopName) {
      toast.warning("Yêu cầu điền tên cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!about) {
      toast.warning("Yêu cầu điền mô tả cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!address) {
      toast.warning("Yêu cầu điền địa chỉ cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!email) {
      toast.warning("Yêu cầu điền email cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!hotline) {
      toast.warning("Yêu cầu điền hotline cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!phone) {
      toast.warning("Yêu cầu điền phone cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    if (!images) {
      toast.warning("Yêu cầu thêm logo cho cửa hàng", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    setIsLoading(true);

    form.append("name", shopName);
    form.append("about", about);
    form.append("address", address);
    form.append("email", email);
    form.append("hotline", hotline.toString());
    form.append("phone", phone.toString());
    images.forEach((image, index) => {
      form.append(`shopImage[${index}]`, image);
    });

    axios
      .post(`http://localhost/be-shopbangiay/api/shop.php`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success == false) {
          toast.error("Sửa cửa hàng không thành công", {
            position: "top-right",
            autoClose: 1500,
          });
          return;
        }
        toast.success("Sửa cửa hàng thành công", {
          position: "top-right",
          autoClose: 2000,
        });
        fetchShop();
        setIsLoading(false);
        router.refresh();
      })
      .catch((err) => {
        console.log("Error:", err.response ? err.response.data : err.message);
      });
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        items={[{ name: "Dashboard", href: "/" }, { name: "Cửa hàng" }]}
      />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {isLoading && <LoadingSpinner />}

          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Tên cửa hàng
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setshopName(e.target.value)}
                  placeholder="Nhập tên cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Mô tả cửa hàng
                </label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Nhập mô tả cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Địa chỉ cửa hàng
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Email cửa hàng
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block font-semibold text-black dark:text-white">
                  Số điện thoại cửa hàng
                </label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block font-semibold text-black dark:text-white">
                  Hotline cửa hàng
                </label>
                <input
                  type="number"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  placeholder="Nhập hotline cửa hàng"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block font-medium text-black dark:text-white">
                  Thêm ảnh  (
                  {images.length < 2 ? '2 ảnh - 1 ảnh "logo" và 1 ảnh "dark' : "Đã đủ 2 ảnh"})
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
                    Thêm ảnh Logo
                  </button>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="my-10 grid w-1/2 grid-cols-2 gap-2 place-self-center ">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative flex w-fit  flex-row"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={128}
                        height={128}
                        className="h-32 w-32 rounded-lg border border-stroke bg-slate-400 object-cover"
                      />
                      {(typeof images[index] === "string" &&
                        images[index]?.toLowerCase().includes("logo")) ||
                      (images[index] instanceof File &&
                        images[index]?.name.toLowerCase().includes("logo")) ? (
                        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-2 py-1 text-xs text-white">
                          Logo
                        </span>
                      ) : null}


                      {(typeof images[index] === "string" &&
                        images[index]?.toLowerCase().includes("dark")) ||
                      (images[index] instanceof File &&
                        images[index]?.name.toLowerCase().includes("dark")) ? (
                        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-2 py-1 text-xs text-white">
                          Dark Logo
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
                className="flex w-full justify-center rounded bg-primary p-3 font-semibold text-gray hover:bg-opacity-90"
              >
                Sửa thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ShopInfo;
