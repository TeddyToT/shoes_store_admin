import React from "react";
import Image from "next/image";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const ProductCard = ({ item, sales, discount, isTopSelling }) => {
  return (
    <div className="flex items-center rounded-lg bg-white p-4 shadow relative dark:bg-gray-800">
      <div className="h-16 w-16 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={64}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-300">{item.name}</h3>
        {sales && <p className="text-lg text-gray-500 dark:text-gray-100">{sales} sold</p>}
        {discount && <p className="text-lg text-gray-500 dark:text-gray-100">{item.discount}%</p>}
      </div>
      {isTopSelling && (
        <div className="absolute transform flame-icon">
          <LocalFireDepartmentIcon fontSize="large" style={{ color: "orange", fontSize: 50 }} />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
