"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useContext, useEffect } from "react";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const Banners = () => {
  const [images, setImages] = useState<Array<File | string>>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { fetchBanners, banners }: any = useContext(Contexts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (banners && banners.length > 0) {
      const bannerLinks = banners.map((banner: any) => banner.link);
      setImages(bannerLinks);
      setImagePreviews(bannerLinks);
    }
  }, [banners]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const uploadedFiles = Array.from(files);

      if (images.length + uploadedFiles.length > 20) {
        toast.warning("Chỉ upload được tối đa 20 ảnh", {
          position: "top-right",
          autoClose: 1500,
        });
        return;
      }

      const previewUrls = uploadedFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...uploadedFiles]);
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    }
  };

  const handleRemoveImage = async (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const bannerId = banners[index]?.bannerId;
    if (bannerId) {
      try {
        await axios.delete("http://localhost/be-shopbangiay/api/banner.php", {
          data: { bannerId },
        });
        toast.success("Xóa banner thành công", {
          position: "top-right",
          autoClose: 1500,
        });
        fetchBanners();
        router.refresh();
      } catch (error) {
        toast.error("Xóa banner thất bại", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = new FormData();

    if (!images || images.length === 0) {
      toast.warning("Yêu cầu thêm ảnh cho banners", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    setIsLoading(true);

    images.forEach((image, index) => {
      form.append(`shopImage[${index}]`, image);
    });

    axios
      .post(`http://localhost/be-shopbangiay/api/banner.php`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (!res.data.success) {
          toast.error("Thay đổi banners không thành công", {
            position: "top-right",
            autoClose: 1500,
          });
          return;
        }
        toast.success("Thay đổi banners thành công", {
          position: "top-right",
          autoClose: 2000,

        });
        fetchBanners();
        router.refresh();
      })
      .catch((err) => {
        console.log("Error:", err.response ? err.response.data : err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Dashboard", href: "/" },
          { name: "Banners" },
        ]}
      />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {isLoading && <LoadingSpinner />}

          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block font-medium text-black dark:text-white">
                  Ảnh cho banners (Yêu cầu file ảnh nhỏ hơn 10mb)
                </label>

                <div className="relative mt-2 flex items-center justify-center">
                  <input
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  />

                  <button className="w-1/2 rounded-lg bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 focus:outline-none">
                    Thêm ảnh
                  </button>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="my-10 grid grid-cols-2 gap-10 w-2/3 place-self-center place-items-center">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="group relative flex flex-row w-fit ">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={300}
                        height={300}
                        className="h-36 w-54 rounded-lg border border-stroke object-cover"
                      />
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
                Thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Banners;
