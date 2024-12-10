import { useState } from "react";

interface SizeItem {
  size: number;
  stock: number;
}

interface AddSizeInputProps {
  onAdd: (sizeItem: SizeItem) => void;
}

const AddSizeInput: React.FC<AddSizeInputProps> = ({ onAdd }) => {
  const [size, setSize] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  const handleAddClick = () => {
    if (size && stock) {
      onAdd({ size: Number(size), stock: Number(stock) });
      setSize("");
      setStock("");
    }
  };

  return (
    <div className="flex flex-row gap-3 pt-3">
      <input
        type="number"
        value={size}
        placeholder="Nhập size giày"
        onChange={(e) => setSize(Number(e.target.value) || "")}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      <input
        type="number"
        value={stock}
        placeholder="Nhập tồn kho"
        onChange={(e) => setStock(Number(e.target.value) || "")}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      <button
        onClick={handleAddClick}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
      >
        Thêm
      </button>
    </div>
  );
};

export default AddSizeInput;
