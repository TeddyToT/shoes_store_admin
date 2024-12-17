"use client";

import React, { useState,useContext } from "react";
import { Contexts } from "@/app/Contexts";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
const SignIn: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {fetchUserDetail, shop} = useContext(Contexts)
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleClick = (event) => {
    event.preventDefault();

    if (!userName){
      toast.warn('Vui lòng nhập tên đăng nhập', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        });
      return
    }
    if (!password){
      toast.warn('Vui lòng nhập mật khẩu', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        });
      return
    }
    
    axios.post('http://localhost/be-shopbangiay/api/SignIn.php', {
      username: userName,
      password: password
    }
  )
      .then((res) => {
        console.log(res);
        if (res.data.success === false) {
          localStorage.clear();
          toast.error('Sai tên đăng nhập hoặc mật khẩu', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            });
        } else {
          if (res.data.role === "Customer")
            {
              toast.error('Khách hàng không thể đăng nhập vào trang quản lý', {
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

          toast.success('Đăng nhập thành công', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            onClose: ()=> {
              localStorage.setItem('userId', res.data.userId)
              fetchUserDetail()
              router.push("/overview");
            }
            });
          
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={shop.logodark} //dark
                  alt="Logo"
                  width={400}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={shop.logo}
                  alt="Logo"
                  width={400}
                  height={32}
                />
              </Link>

              <span className="mt-15 inline-block"></span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-xl font-bold text-black dark:text-white sm:text-title-lg">
                Đăng nhập
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tên tài khoản
                  </label>
                  <div className="relative">
                    <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu
                  </label>
                  {/* <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    
                    {password && (
                   <div className="absolute right-4"
                   onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </div>
                  )}

                    
                  </div> */}
                  <div className=" relative flex w-full items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  {password && (
                    <div
                      className="absolute right-4 cursor-pointer "
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </div>
                  )}
                </div>
                </div>

                <div className="mb-5">
                  <button
                  onClick={handleClick}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Đăng nhập
                  </button>
                </div>

                <div className=" w-full text-end">
                  <p>
                    Quên mật khẩu?{" "}
                    <Link href="/auth/signin/forgot-password" className="text-primary">
                      Lấy lại mật khẩu
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
