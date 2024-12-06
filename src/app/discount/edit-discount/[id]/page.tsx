"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePicker from "@/components/FormElements/DatePicker/DatePicker";
import { useState, useCallback, useContext, useEffect } from "react";
import VoucherTypeOption from "@/components/SelectGroup/VoucherTypeOption";
import { Contexts } from "@/app/Contexts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
const EditDiscount = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Trích xuất `name` từ URL

  const [discountCode, setDiscountCode] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [expiredtDate, setExpiredDate] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [discountValue, setDiscountValue] = useState(0);

  const { fetchVouchers }: any = useContext(Contexts);
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
      .get(`http://localhost:8081/v1/api/user/vouchers/` + id)
      .then((res) => {
        setDiscountCode(res.data.name);
        let sDate = new Date(res.data.startDay);
        const formattedSDate = `${String(sDate.getDate()).padStart(2, "0")}/${String(sDate.getMonth() + 1).padStart(2, "0")}/${sDate.getFullYear()}`;
        setStartDate(formattedSDate);

        let eDate = new Date(res.data.endDay);
        const formattedEDate = `${String(eDate.getDate()).padStart(2, "0")}/${String(eDate.getMonth() + 1).padStart(2, "0")}/${eDate.getFullYear()}`;
        setExpiredDate(formattedEDate);
        setType(res.data.type[0].toUpperCase() + res.data.type.slice(1));

        // console.log(res.data.phongBan)
        setDiscountValue(res.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!discountCode) {
    
      toast.warning("Please enter code name", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!startDate) {
      
      toast.warning("Please enter discount start day", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!expiredtDate) {
      
      toast.warning("Please enter discount expired day", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    const currentDate = new Date();
    if (convertToDate(expiredtDate) < currentDate || convertToDate(expiredtDate) < convertToDate(startDate) ) {
      
      toast.warning("Please enter expired day which is not smaller than start day", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!type) {
      toast.warning("Please choose discount type", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (!discountValue) {
      
      toast.warning("Please enter discount value", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    if (type=="Trade" && discountValue > 100) {
      toast.warning("Please enter discount value smaller than 100(%)", {
        position: "top-right",
        autoClose: 1500
      })
      return;
    }
    fetch(`http://localhost:8081/v1/api/user/vouchers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: discountCode,
        startDay: convertDateFormat(startDate),
        endDay: convertDateFormat(expiredtDate),
        type: type.toLowerCase(),
        value: discountValue
      }),
    })
      .then((res) => res.json())
      .then((data) => {

          console.log(data);
          fetchVouchers()
          toast.success("Edit Voucher successfully", {
            position: "top-right",
            autoClose: 2000,  // Đảm bảo toast tự động đóng sau 2 giây
            onClose: () => {
              router.push("/discount"); // Chuyển hướng khi toast đóng
            }
          });
  })
      .catch((err) => {
        console.error(err);
        toast.error("Edit Voucher failed", {
          position: "top-right",
          autoClose: 2000,
        });
      });
      
  };

  function removeSpaces(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, ""); // Remove spaces and special characters
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = removeSpaces(e.target.value);
    setDiscountCode(sanitizedValue);
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDiscountValue(value);
  };
  console.log(discountValue);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
    console.log("Ngày start đã chọn:", convertDateFormat(date)); // Xử lý giá trị tại đây
  }, []);

  const handleExpiredDateChange = useCallback((date: string) => {
    setExpiredDate(date);
    console.log("Ngày expired đã chọn:", date); // Xử lý giá trị tại đây
  }, []);

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
    console.log("Type đã chọn:", selectedType); // Xử lý giá trị tại đây
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Dashboard", href: "/" },
          { name: "Discount", href: "/discount" },
          { name: "Edit Discount" },
        ]}
      />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Discount Code
                </label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={handleInputChange}
                  placeholder="Enter discount code"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <DatePicker
                  title="Select Start Date"
                  value={startDate} // Truyền giá trị khởi tạo
                  onDateChange={handleStartDateChange}
                />
              </div>
              <div className="mb-4.5">
                <DatePicker
                  title="Select Expired Date"
                  value={expiredtDate} // Truyền giá trị khởi tạo
                  onDateChange={handleExpiredDateChange}
                />
              </div>

              <div className="mb-4.5">
                <VoucherTypeOption onVoucherChange={handleTypeChange} value={type} />
              </div>
              {type == "Trade" ? (
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Discount Value (%)
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={handleValueChange}
                    placeholder="Enter discount code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              ) : type == "Chain" ? (
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Discount Value (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={handleValueChange}
                    placeholder="Enter discount code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditDiscount;
