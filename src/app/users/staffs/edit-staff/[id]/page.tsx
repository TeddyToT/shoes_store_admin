"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { Contexts } from "@/app/Contexts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";


const EditStaff = ({ params }: { params: { id: string } }) => {
    const { id } = params;


  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState(0);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevState) => !prevState);
  };

  const [image, setImage] = useState<File | string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { fetchUsers, userDetail }: any = useContext(Contexts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  function convertDateFormat(date: string): string {
    const [day, month, year] = date.split("/");
    return `${year}/${month}/${day}`;
  }
  const handleDateChange = useCallback((date: string) => {
    setBirthDate(date);
    console.log("Ngày start đã chọn:", convertDateFormat(date)); 
  }, []);

  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const uploadedFile = files[0];

      const previewUrl = URL.createObjectURL(uploadedFile);

      setImage(uploadedFile);
      setImagePreview(previewUrl);
      
    }
    console.log("image", image);
  };




  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("image", image);
    event.preventDefault();
    event.stopPropagation();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);
    
  };
  console.log("image xóa:", image);
  useEffect(() => {
    axios
      .get(`http://localhost/be-shopbangiay/api/user.php?userId=` + id)
      .then((res) => {
        setName(res.data.name);
        setBirthDate(res.data.birthday);
        setPhone(res.data.phone);
        setAddress(res.data.address);
        setImage(res.data.avatar);
        setImagePreview(res.data.avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();


    if (!email) {
      toast.warning("Chưa nhập email", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,)
    ) {
      toast.warning("Email không hợp lệ", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!name) {
        toast.warning("Chưa nhập họ tên", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      if (!address) {
        toast.warning("Chưa nhập địa chỉ", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      if (!phone) {
        toast.warning("Chưa nhập số điện thoại", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      const regexPhone = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}$/;

      if (!regexPhone.test(phone)) {
        toast.warning("Nhập sai định dạng số", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return;
    }
      const form = new FormData()
      form.append("userId", id)
      form.append("email", email)
      form.append("name", name)
      form.append("role", "Staff")
      form.append("phone", phone.toString())
      form.append("birthday", convertDateFormat(birthDate))
      form.append("address", address)
      if (image instanceof File) {
        form.append("avatar", image);
      }
      setIsLoading(true)
    axios
      .put("http://localhost/be-shopbangiay/api/user.php", form,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.data.success == false) {
          toast.error("Sửa tài khoản nhân viên thất bại", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false)
        } else {
          toast.success("Sửa tài khoản nhân viên thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false)
          fetchUsers()
          console.log("res", res.data);
          router.push("/users/staffs");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <DefaultLayout>
       <Breadcrumb
  items={[
    { name: "Dashboard", href: "/" },
    { name: "Nhân viên", href: "/users/staffs" },
    { name: "Sửa nhân viên" }
  ]}
/>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {isLoading && <LoadingSpinner />}

          <form action="#">
            <div className="p-6.5">
           

              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Số điện thoại
                </label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              
                <DatePicker title="Ngày sinh" value={birthDate} onDateChange={handleDateChange}/>
              
              <div className="mb-4.5">
                <label className="mb-3 block  font-semibold text-black dark:text-white">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block font-semibold text-black dark:text-white">
                 Sửa avatar
                </label>

                <div className="relative mt-2 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  />

                  <button className="w-1/2 rounded-lg bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 focus:outline-none">
                    Sửa ảnh avatar
                  </button>
                </div>
              </div>

              {imagePreview && (
                <div className="my-10 flex justify-center">
                  <div className="group relative flex w-fit flex-row">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-lg border border-stroke object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute rounded-full bg-black bg-opacity-50 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-semibold text-gray hover:bg-opacity-90"
              >
                Sửa nhân viên
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditStaff;
