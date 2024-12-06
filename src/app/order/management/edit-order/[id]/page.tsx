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
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [deliveryStatus, setDeliveryStatus] = useState<string>("");
  const [currentDeliveryStatus, setCurrentDeliveryStatus] = useState<string>("");

    
    const calculateSubtotal = (items) => {
        return items.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0); // 
    };
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

  useEffect(() => {
    axios
      .get(`http://localhost:8081/v1/api/user/orders/` + id)
      .then((res) => {
        setUser(res.data.user);
        setName(res.data.name);
        setPhone(res.data.phone)
        setItems(res.data.items);
        setVoucher(res.data.voucher);
        setTotal(res.data.total);
        setPaymentStatus(res.data.paymentStatus);
        setPaymentMethod(res.data.paymentMethod);
        setDeliveryStatus(res.data.deliveryStatus);
        setCurrentDeliveryStatus(res.data.deliveryStatus);
        setAddress(res.data.address);
        setNote(res.data.note);
        setCreatedAt(res.data.createdAt);
        setUpdatedAt(res.data.updatedAt);


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
    fetch(`http://localhost:8081/v1/api/user/orders/changeStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deliveryStatus: deliveryStatus,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          console.log(data);

          if (data.success == false)
          {
            toast.error("Edit delivery status failed, the route was not right", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          else {
            fetchOrders()
          toast.success("Edit delivery status sucessfully", {
            position: "top-right",
            autoClose: 2000,  // Đảm bảo toast tự động đóng sau 2 giây
            onClose: () => {
              router.push("/order/management"); // Chuyển hướng khi toast đóng
            }
          });
          }
  })
      .catch((err) => {
        console.error(err);

      });
  };




  //   console.log(discountValue);

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
            { name: "Discount", href: "/discount" },
            { name: "Edit Order" },
          ]}
        />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Order Information
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
                            {item.product.image && (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={60}
                                height={60}
                              />
                            )}
                            
                            <p className="text-ellipsis">{item.product.name}</p>
                            
                          </div>
                          <p className="text-ellipsis italic max-w-150">Note: {item.note}</p>
                          </div>
                          <div className="flex flex-col items-start gap-2 text-sm basis-1/6 ">
                            <div className="flex flex-row justify-between w-full">
                            <p className="capitalize">Size: </p>
                            <p className="capitalize">{item.size}</p>
                              </div>
                              <div className="flex flex-row justify-between w-full">
                            <p className="capitalize">Quantity: </p>
                            <p className="capitalize">{item.quantity}</p>
                              </div>
                              <div className="flex flex-row justify-between w-full">
                            <p className="capitalize">Price: </p>
                            <p className="capitalize">{item.quantity * item.price}</p>
                              </div>
        
                          </div>
                        </div>
                      ))}

                  </div>

                  <div className="mb-5.5 flex w-full flex-row justify-between "> 
                    <label className=" flex font-medium text-black dark:text-white w-1/2 ">
                      Subtotal
                    </label>
                    <div className="flex w-1/2 place-items-center justify-end ">
                      
                        <p className="text-gray-500 dark:text-white">
                          {calculateSubtotal(items)}
                        </p>  
                    </div>
                  </div>
                  <div className="mb-2.5 flex w-full flex-row justify-between "> 
                    <label className=" flex font-medium text-black dark:text-white w-1/2 ">
                      Voucher
                    </label>
                    <div className="flex w-1/2 place-items-center justify-end ">
                      {voucher.length == 0 ? (
                        <div className="text-gray-500 dark:text-white">
                          No vouchers used  
                        </div>
                      ) : (
                        <div className="w-full ">
                          {voucher.map((voucher) => (
                            <div key={voucher._id} className=" flex justify-end gap-2 flex-row w-full mb-2">
                              <h4 className=" flex  font-medium text-black dark:text-white uppercase">
                                {voucher.name}:
                              </h4>
                              {voucher.type == "trade"?(
                                <p className="flex dark:text-white">{voucher.value}%</p>
                              ):(
                                <p className="flex dark:text-white">{voucher.value}</p>
                              )}
                              
                              
                            </div>
                            
                          ))}
                        </div>
                      )}
                      
                    </div>
                  </div>
                  <div className="mb-5.5 flex w-full flex-row justify-between "> 
                    <label className=" flex font-black text-black dark:text-white w-1/2 ">
                      Final Price
                    </label>
                    <div className="flex w-1/2 place-items-center justify-end ">
                      
                        <p className="text-gray-500 font-black dark:text-white">
                          {total}
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
                Receiver Infomation
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
                        Name
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
                        Phone Number
                      </label>
                      <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {phone?phone:"No Phone"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address
                    </label>
                    <p className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {address?address:"No Address"}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Note
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
                  Order Status
                </h3>
              </div>
            
              <div className="p-7">
                  <div className="mb-5.5 w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Current Payment Status
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {paymentMethod} - {paymentStatus}
                    </p>
                  </div>
                  <div className="mb-5.5 w-full">
                    <label className=" mb-3 block text-sm font-medium text-black dark:text-white">
                      Current Delivery Status
                    </label>
                    <p className="capitalize w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {currentDeliveryStatus === "success"
                        ? "Success"
                        : currentDeliveryStatus === "fail"
                          ? "fail"
                          : currentDeliveryStatus === "shipping"
                            ? "shipping"
                            : currentDeliveryStatus === "doing"
                              ? "doing"
                              : currentDeliveryStatus === "confirmed"
                                ? "confirmed"
                                : currentDeliveryStatus === "pending"
                                  ? "pending"
                                   : currentDeliveryStatus === "systemCancel"
                                   ?"system Cancel"
                                    : " customer Cancel"}
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
