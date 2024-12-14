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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const router = useRouter();
  const {fetchUserDetail, shop} = useContext(Contexts)

  const handleClick = (event) => {
    event.preventDefault();

    if(!email){
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

    
    axios.post('http://localhost/be-shopbangiay/api/ForgetPassword.php', {
      email: email,
    }
  )
      .then((res) => {
        console.log(res);
        if (res.data.success === false) {
          toast.error('Email chưa được đăng kí', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            });
        } else {

          toast.success('Xác nhận yêu cầu lấy lại mật khẩu thành công. Xin hãy kiểm tra mail gửi về', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",

            });
            router.push("/auth/signin/forgot-password/confirm");
          
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
                Quên mật khẩu
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tên tài khoản
                  </label>
                  <div className="relative">
                    <input
                    value={email}
                    onChange={(e) => setUserName(e.target.value)}
                      type="text"
                      placeholder="Nhập email tài khoản"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                  </div>
                </div>


                <div className="mb-5">
                  <button
                  onClick={handleClick}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Lấy lại mật khẩu
                  </button>
                </div>

                <div className=" w-full text-end">
                  <p>
                    Hoặc{" "}
                    <Link href="/auth/signin" className="text-primary">
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

export default ForgotPassword;
