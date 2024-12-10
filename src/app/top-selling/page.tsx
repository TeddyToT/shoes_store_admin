"use client";

import React, { useContext } from "react";
import { Contexts } from "../Contexts";
import ProductCard from "./ProductCard";
import ProductChart from "./ProductChart";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const ProductTracking = () => {
  const { orders, products } = useContext(Contexts);

  const productSales = orders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const product = item.productId;
        if (product) {
          const productId = product.productId;
          if (!acc[productId]) acc[productId] = { product, sales: 0 };
          acc[productId].sales += Number(item.quantity);
        }
      });
      return acc;
    },
    {} as Record<string, { product: any; sales: number }>
  );

  const productSalesToday = orders.reduce(
    (acc, order) => {
      const orderDate = new Date(order.orderDate.replace(" ", "T")).toLocaleDateString("en-GB");
      const todayDate = new Date().toLocaleDateString("en-GB");

      if (orderDate === todayDate) {
        order.items.forEach((item) => {
          const product = item.productId;
          if (product) {
            const productId = product.productId;
            if (!acc[productId]) acc[productId] = { product, sales: 0 };
            acc[productId].sales += Number(item.quantity);
          }
        });
      }
      return acc;
    },
    {} as Record<string, { product: any; sales: number }>
  );

  const allProductSalesToday = Object.values(productSalesToday);

  // Tìm số lượng bán cao nhất trong ngày hôm nay
  const maxSalesToday =
    allProductSalesToday.length > 0
      ? Math.max(...allProductSalesToday.map((item) => item.sales))
      : 0;

  // Lọc các sản phẩm có số lượng bán bằng `maxSalesToday`
  const topSellingProductsToday = allProductSalesToday.filter(
    (item) => item.sales === maxSalesToday
  );

  const topSellingProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const topSellingProducts10 = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const topDiscountedProducts = products
    .filter((product) => product !== null)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Tracking" />
      <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
        <div className="w-full">
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Best-Selling Products Today
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {topSellingProductsToday.map((item) => (
            <ProductCard
              key={item.productId}
              item={item.product}
              sales={item.sales}
              isTopSelling={true}
            />
          ))}
        </div>

        <div className="w-full">
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Best-Selling Products
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {topSellingProducts.map((item) => (
            <ProductCard
              key={item.productId}
              item={item.product}
              sales={item.sales}
            />
          ))}
        </div>

        <div className="w-full">
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Most Discounted Products
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {topDiscountedProducts.map((product) => (
            <ProductCard key={product._id} item={product} discount={true} />
          ))}
        </div>

        <ProductChart data={topSellingProducts10} />
      </div>
    </DefaultLayout>
  );
};

export default ProductTracking;
