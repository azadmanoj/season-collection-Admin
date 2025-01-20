"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

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

  useEffect(() => {
    fetch("https://season-collection-backend.onrender.com/api/orders")
      .then((response) => response.json())
      .then((data: Order[]) => {
        setOrders(data);
      })
      .catch((error) => {
        toast.error("SC:FAILED_TO_GET_ORDERS!");
      });
  }, []);

  // Update order or UTR status on the server
  const updateStatus = (
    orderId: string,
    statusType: "orderStatus" | "utrStatus",
    newStatus: string,
  ) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, [statusType]: newStatus } : order,
    );
    setOrders(updatedOrders);

    fetch(
      `https://season-collection-backend.onrender.com/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [statusType]: newStatus,
        }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        toast.success(`${statusType} updated successfully`);
      })
      .catch((error) => {
        toast.error(`Error updating ${statusType}: ${error.message}`);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <table className="min-w-full border border-gray-300 bg-white">
        <thead className="underline">
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
            <tr key={order.orderId} className="text-center hover:bg-gray-100">
              <td className="border-b px-4 py-2">{order.orderId}</td>
              <td className="border-b px-4 py-2">
                {new Date(order.orderTime).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-2">{order.customerName}</td>
              <td className="border-b px-4 py-2">{order.paymentMethod}</td>
              <td className="border-b px-4 py-2">{order.totalAmount}</td>
              <td className="border-b px-4 py-2">{order.utrNumber}</td>
              <td className="border-b px-4 py-2">
                <select
                  value={order.utrStatus}
                  onChange={(e) =>
                    updateStatus(order.orderId, "utrStatus", e.target.value)
                  }
                  className="rounded border border-gray-300 p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </td>
              <td className="border-b px-4 py-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(order.orderId, "orderStatus", e.target.value)
                  }
                  className="rounded border border-gray-300 p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </td>
              <td className="border-b px-4 py-2">{order.items.length}</td>
            </tr>
          ))}
        </tbody>
        <ToastContainer />
      </table>
    </div>
  );
};

export default Orders;
