"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";
import { useState, useCallback, useContext, useEffect } from "react";
import Image from "next/image";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import OrderStatusOption from "@/components/SelectGroup/OrderStatusOption";
import { Contexts } from "@/app/Contexts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

// import { usePathname } from "next/navigation";
const EditOrder = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);

  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const [total, setTotal] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");


  const [deliveryStatus, setDeliveryStatus] = useState<string>("");
  const [currentDeliveryStatus, setCurrentDeliveryStatus] = useState<string>("");

    
   
  const { fetchOrders }: any = useContext(Contexts);
  const router = useRouter();
  function convertDateFormat(date: string): string {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }
  function convertToDate(date: string): Date {
    const [day, month, year] = date.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(" ");
    const [year, month, day] = date.split("-");
  
    return `${day}/${month}/${year} ${time}`;
  };
  

  

  useEffect(() => {
    axios
      .get(`http://localhost/be-shopbangiay/api/invoice.php?invoiceId=` + id)
      .then((res) => {
        setUser(res.data.user);
        setName(res.data.name);
        setPhone(res.data.phone)
        setItems(res.data.items);
        setVoucher(res.data.voucher);
        setTotal(res.data.totalPrice);
        setPaymentStatus(res.data.paymentStatus);
        setPaymentMethod(res.data.paymentMethod);
        setDeliveryStatus(res.data.deliveryStatus);
        setCurrentDeliveryStatus(res.data.state);
        setAddress(res.data.address);
        setNote(res.data.note);
        setCreatedAt(res.data.orderDate);



      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const getUser = (userID) => {
      fetch(`http://localhost:8081/v1/api/user/users/${userID}`)
        .then((res) => res.json())
        .then((data) => {
          setUserDetails((prevState) => ({
            ...prevState,
            [userID]: data, 
          }));
        })
        .catch((err) => {
          // console.error(err);
          setUserDetails((prevState) => ({
            ...prevState,
            [userID]: { error: "Failed to fetch user" }, // Lưu trạng thái lỗi
          }));
        });
    };
  
    const userID = user;
    if (userID) {
      getUser(userID); 
    }
  }, [user]);
  

  const handleEditSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost/be-shopbangiay/api/invoice.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceId: id,
        state: deliveryStatus,
        address: address,
        note: note
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          console.log(data);

          if (data.success == false)
          {
            toast.error("Sửa trạng thái đơn hàng không thành công", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          else {
            fetchOrders()
          toast.success("Sửa trạng thái đơn hàng thành công", {
            position: "top-right",
            autoClose: 2000, 

          });
          router.push("/order/management");
          }
  })
      .catch((err) => {
        console.error(err);

      });
  };




 

  const handleStatusChange = (selectedStatus: string) => {
    setDeliveryStatus(selectedStatus);
    setIsEditVisible(true);
    console.log("Status đã chọn:", selectedStatus); // Xử lý giá trị tại đây
  };
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb
          items={[
            { name: "Dashboard", href: "/" },
            { name: "Đơn hàng", href: "/order/management" },
            { name: "Sửa đơn hàng" },
          ]}
        />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Thông tin đơn hàng
                </h3>
              </div>
              <div className="p-7">
                <div>
                  <div className="mb-4 text-black dark:text-white">

                      {items.map((item) => (
                        <div
                          className="flex flex-row justify-between border-b-2 py-2"
                          key={item._id}
                        >
                          <div className="flex flex-col">
                          <div className="flex basis-3/4 flex-row items-center gap-2">
                            {item.productId.mainImage && (
                              <Image
                                src={item.productId.mainImage}
                                alt={item.productId.name}
                                width={60}
                                height={60}
                              />
                            )}
                            
                            <p className="text-ellipsis">{item.productId.name}</p>
                            
                          </div>
                          
                          </div>
                          <div className="flex flex-col items-start gap-2 text-sm basis-1/6 ">
                            <div className="flex flex-row justify-between w-full">
                            <p className="capitalize">Size: </p>
                            <p className="capitalize">{item.size}</p>
                              </div>
                              <div className="flex flex-row justify-between w-full">
                            <p className="capitalize">Số lượng: </p>
                            <p className="capitalize">{item.quantity}</p>
                              </div>
                              {item.productId.discount != 0?(
                                <div className="flex flex-col justify-between w-full gap-2">
                                  <div className="flex flex-row justify-between w-full">
                                <p className="capitalize">Giảm giá: </p>
                                <p className="capitalize">{item.productId.discount}%</p>
                                  </div>
                                <div className="flex flex-row justify-between w-full">
                                <p className="capitalize">Giá: </p>
                                <p className="">{Number((item.productId.price-(item.productId.price*item.productId.discount/100))*item.quantity).toLocaleString("vi-VN")}đ</p>
                                  </div>
                                
                                  </div>):(<div className="flex flex-row justify-between w-full">
                                
                                <p className="capitalize">Giá: </p>
                                <p className="">{Number(item.quantity * item.productId.price).toLocaleString("vi-VN")}đ</p>
                                  </div>)}
                              
        
                          </div>
                        </div>
                      ))}

                  </div>

                  
                  <div className="mb-5.5 flex w-full flex-row justify-between "> 
                    <label className=" flex font-semibold text-black dark:text-white w-1/2 ">
                      Tổng
                    </label>
                    <div className="flex w-1/2 place-items-center justify-end ">
                      
                        <p className="text-gray-500 font-black dark:text-white">
                          {Number(total).toLocaleString("vi-VN")}đ
                        </p>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className=" mb-4.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                Thông tin người nhận
                </h3>
              </div>
            
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Tên người nhận
                      </label>
                      <div
                        className="relative flex w-full flex-row
                      gap-2 rounded border border-stroke bg-gray py-3 pl-2.5 pr-4.5  focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4  dark:focus:border-primary"
                      >
                        {/* <PermIdentityOutlinedIcon /> */}

                        <p className="text-black dark:text-white">
                        {name?name:"Incognito"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Số điện thoại
                      </label>
                      <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {phone?phone:"No Phone"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Địa chỉ
                    </label>
                    <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {address?address:"No Address"}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Thời gian đặt
                    </label>
                    <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {createdAt?formatDateTime(createdAt):"No Time"}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Ghi chú
                    </label>
                    <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {note?note:"No note"}
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="mb-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Trạng thái đơn hàng
                </h3>
              </div>
            
              <div className="p-7">
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Phương thức thanh toán
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {paymentMethod}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className=" mb-3 block text-sm font-medium text-black dark:text-white">
                      Trạng thái đơn hàng hiện tại
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    
                    {currentDeliveryStatus === "Done"
                        ? " Hoàn thành"
                        : currentDeliveryStatus === "Cancel"
                          ? " Đã hủy"
                          : currentDeliveryStatus === "Shipping"
                            ? " Đang vận chuyển"
                            : currentDeliveryStatus === "Doing"
                              ? " text-blue-500"
                              : currentDeliveryStatus === "Confirming"
                                ? " Xác nhận"
                                : currentDeliveryStatus === "Pending"
                                  ? " Đang chờ xử lý"
                                  : " Chưa có"}
                    </p>
                  </div>
                  <div className="mb-4.5">
                <OrderStatusOption value={deliveryStatus} onStatusChange={handleStatusChange} />
              </div>
              {isEditVisible && (
                  <button
                    className="mt-4 rounded w-full bg-primary px-6 py-2 text-white hover:brightness-125"
                    onClick={handleEditSubmit}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditOrder;
