"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";
import { useState, useCallback, useContext, useEffect } from "react";
import Image from "next/image";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FeedbackOption from "@/components/SelectGroup/FeedbackOption";
import { Contexts } from "@/app/Contexts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
// import { usePathname } from "next/navigation";
const EditFeedback = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);

  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isHandle, setIsHandle] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");



  const [currentIsHandle, setCurrentIsHandle] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
   
  const { fetchFeedbacks }: any = useContext(Contexts);
  const router = useRouter();

  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(" ");
    const [year, month, day] = date.split("-");
  
    return `${day}/${month}/${year} ${time}`;
  };
  

  

  useEffect(() => {
    axios
      .get(`http://localhost/be-shopbangiay/api/feedback.php?feedbackId=` + id)
      .then((res) => {
        setUser(res.data.userId);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setContent(res.data.content);
        setIsHandle(res.data.isHandle);
        setCurrentIsHandle(res.data.isHandle)
        setAddress(res.data.address);
        setCreatedAt(res.data.createdAt);



      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);


  

  const handleEditSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios.put(`http://localhost/be-shopbangiay/api/feedback.php`, {
        feedbackId: id,
        isHandle: isHandle,

    })
      .then((res) => {
          console.log(res.data);

          if (res.data.success == false)
          {
            toast.error("Sửa trạng thái góp ý không thành công", {
              position: "top-right",
              autoClose: 5000,
            });
            setIsLoading(false);
          }
          else {
            fetchFeedbacks()
          toast.success("Sửa trạng thái góp ý thành công", {
            position: "top-right",
            autoClose: 2000, 
          });
          setIsLoading(false);
          router.push("/feedbacks");
          }
  })
      .catch((err) => {
        console.error(err);

      });
  };




  //   console.log(discountValue);

  const handleStatusChange = (selectedStatus: string) => {
    setIsHandle(selectedStatus);
    setIsEditVisible(true);
    console.log("Status đã chọn:", selectedStatus); // Xử lý giá trị tại đây
  };
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb
          items={[
            { name: "Dashboard", href: "/" },
            { name: "Quản lý đơn góp ý", href: "/feedbacks" },
            { name: "Xử lý đơn góp ý" },
          ]}
        />
        <div className="">
        {isLoading && <LoadingSpinner />}
            <div className="mb-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Thông tin góp ý
                </h3>
              </div>
            
              <div className="p-7">
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Người gửi
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {name}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Thời gian gửi
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {formatDateTime(createdAt)}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {email}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Số điện thoại
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {phone}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Địa chỉ
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {address}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      Nội dung góp ý
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {content}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className=" mb-3 block font-medium text-black dark:text-white">
                      Trạng thái xử lý
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {currentIsHandle === "1"
                        ? " Đã ghi nhận"
                        : " Đợi xử lý"}
                    </p>
                  </div>
                  <div className="mb-4.5">
                  {currentIsHandle === "0"?(<FeedbackOption value={isHandle} onStatusChange={handleStatusChange} />)
                  :(
                    <div>
                        </div>
                  )}
                
              </div>
              
              {isEditVisible && (
                  <button
                    className="mt-4 rounded w-full bg-primary px-6 py-2 text-white hover:brightness-125"
                    onClick={handleEditSubmit}
                  >
                    Cập nhật
                  </button>
                )}
              </div>
            </div>
          
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditFeedback;
