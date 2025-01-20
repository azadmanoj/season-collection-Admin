"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Order {
  orderId: string;
  orderTime: string;
  customerName: string;
  paymentMethod: string;
  totalAmount: number;
  utrNumber: string;
  utrStatus: string;
  orderStatus: string;
  items: [];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  console.log("🚀 ~ Orders ~ orders:", orders);

  useEffect(() => {
    fetch("https://season-collection-backend.onrender.com/api/orders")
      .then((response) => response.json())
      .then((data: Order[]) => {
        setOrders(data);
      })
      .catch((error) => {
        toast.error("SC:FAILED_TO_GET_ORDERS!");
      });
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-b px-4 py-2">Order ID</th>
            <th className="border-b px-4 py-2">Order Time</th>
            <th className="border-b px-4 py-2">Customer Name</th>
            <th className="border-b px-4 py-2">Payment Method</th>
            <th className="border-b px-4 py-2">Amount</th>
            <th className="border-b px-4 py-2">UTR Number</th>
            <th className="border-b px-4 py-2">UTR Status</th>
            <th className="border-b px-4 py-2">Order Status</th>
            <th className="border-b px-4 py-2">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-100">
              <td className="border-b px-4 py-2">{order.orderId}</td>
              <td className="border-b px-4 py-2">{order.orderTime}</td>
              <td className="border-b px-4 py-2">{order.customerName}</td>
              <td className="border-b px-4 py-2">{order.paymentMethod}</td>
              <td className="border-b px-4 py-2">{order.totalAmount}</td>
              <td className="border-b px-4 py-2">{order.utrNumber}</td>
              <td className="border-b px-4 py-2">{order.utrStatus}</td>
              <td className="border-b px-4 py-2">{order.orderStatus}</td>
              <td className="border-b px-4 py-2">{order.items.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
