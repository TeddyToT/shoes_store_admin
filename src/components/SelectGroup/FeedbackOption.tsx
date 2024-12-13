import React, { useState } from "react";

interface FeedbackOptionProps {
  onStatusChange: (status: string) => void;
  value: string; // Giá trị ban đầu của trạng thái
}

const FeedbackOption: React.FC<FeedbackOptionProps> = ({
  onStatusChange,
  value,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value || ""); // Lưu giá trị đã chọn
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // Vô hiệu hóa sau khi chọn

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setIsDisabled(true); // Vô hiệu hóa dropdown
    onStatusChange(newValue); // Gọi callback để xử lý giá trị ở component cha
  };

  const handleReset = () => {
    setSelectedValue(""); // Reset giá trị
    setIsDisabled(false); // Bật lại dropdown
  };

  return (
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Chỉnh sửa trạng thái góp ý
      </label>
      <div className="relative">
        <select
          value={selectedValue}
          onChange={handleSelectChange}
          disabled={isDisabled} // Vô hiệu hóa khi đã chọn
          className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:focus:border-primary"
        >
          <option value="" disabled>
            Chọn trạng thái góp ý
          </option>
          <option value="0">Chờ xử lý</option>
          <option value="1">Đã ghi nhận</option>

        </select>
      </div>
      {isDisabled && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FeedbackOption;