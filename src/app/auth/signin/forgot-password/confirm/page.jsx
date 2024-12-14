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
const Confirm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {fetchUserDetail, shop} = useContext(Contexts)
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };



  const handleClick = (event) => {
    event.preventDefault();

    if (!password) {
        toast.warning('Chưa nhập mật khẩu mới', {
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
      if (!code) {
        toast.warning('Chưa nhập mã xác nhận', {
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
  
      if (!email) {
        toast.warning('Chưa nhập email', {
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
      if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        toast.warning('Email không hợp lệ', {
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
  
      if (password.length < 6) {
        toast.warning('Yêu cầu mật khẩu hơn 6 kí tự', {
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
    
    axios.post('http://localhost/be-shopbangiay/api/ConfirmCode.php', {
        newPassword: password,
        email: email,
        code: code,
    }
  )
      .then((res) => {
        console.log(res);
        if (res.data.success === false) {
          localStorage.clear();
          toast.error('Lấy lại mật khẩu thất bại, xem lại email hoặc mã xác nhận', {
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

          toast.success('Lấy lại mật khẩu thành công, mời đăng nhập', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            });
            router.push("/");
          
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
                Xác nhận mã
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      type="text"
                      placeholder="Nhập email tài khoản"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mã xác nhận
                  </label>
                  <div className="relative">
                    <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                      type="text"
                      placeholder="Nhập mã xác nhận"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu mới
                  </label>

                  <div className=" relative flex w-full items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
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
                    Đổi mật khẩu
                  </button>
                </div>

                <div className=" w-full text-end">
                  <p>
                    Hay{" "}
                    <Link href="/" className="text-primary">
                      Đăng nhập ngay
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

export default Confirm;
