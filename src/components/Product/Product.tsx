"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal/Modal";
import SwitcherFour from "../Switchers/SwitcherFour";
import SwitcherThree from "../Switchers/SwitcherThree";

// Define the Product interface
interface Product {
  _id: string;
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
  collection: string;
  stock: number;
  status: string;
  published: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
    actionLabel: "",
    actionHandler: () => {},
    redirectTo: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: 0,
    description: "",
    category: "",
    status: "",
    published: true,
  });

  useEffect(() => {
    fetch("https://season-collection-backend.onrender.com/api/jewelry")
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
        setCategories([...new Set(data.map((product) => product.category))]);
        setStatuses([...new Set(data.map((product) => product.status))]);
        setPriceRanges(["0-50", "51-100", "101-200", "201-500", "500+"]);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const filterProducts = useMemo(() => {
    let filteredProducts = products;
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory,
      );
    }
    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= min && (max ? product.price <= max : true),
      );
    }
    if (selectedStatus) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === selectedStatus,
      );
    }
    if (isPublished) {
      filteredProducts = filteredProducts.filter(
        (product) => product.published,
      );
    }
    return filteredProducts;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedPrice,
    selectedStatus,
    isPublished,
  ]);
  console.log("🚀 ~ filterProducts ~ filterProducts:", filterProducts);

  const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (
    e: ChangeEvent<HTMLInputElement>,
    callback: (fieldName: string, value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          callback("image", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://season-collection-backend.onrender.com/api/jewelry",
        formData,
      );
      toast.success("Product Added Successfully");
      setTimeout(() => window.location.reload(), 4000);
      setFormData({
        title: "",
        image: "",
        price: 0,
        description: "",
        category: "",
        status: "",
        published: true,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleRemoveItem = (id: any, title: string) => {
    setModalProps({
      title: "Delete Item",
      message: `Are you sure you want to delete "${title}" product?`,
      actionLabel: "Yes, Remove",
      actionHandler: () => handleDelete(id),
      redirectTo: "/cart",
    });
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://season-collection-backend.onrender.com/api/jewelry/${id}`,
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      toast.success("Product Deleted Successfully");
      setTimeout(() => window.location.reload(), 4000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const togglePublishedStatus = async (
    productId: string,
    currentStatus: boolean,
  ) => {
    console.log("🚀 ~ ProductsPage ~ currentStatus:", currentStatus);
    console.log("🚀 ~ ProductsPage ~ productId:", productId);
    try {
      // Create the updated product data with the toggled 'published' status
      const updatedProduct = {
        published: !currentStatus, // If it's true, set it to false; if it's false, set it to true
      };

      // Make the PUT request to update the product's published status
      const response = await axios.put(
        `https://season-collection-backend.onrender.com/api/jewelry/${productId}`,
        updatedProduct,
      );

      // If the request is successful, update the local state
      if (response.status === 200) {
        toast.success("Product status updated successfully");

        // Optimistically update the local state without re-fetching all products
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, published: !currentStatus } // Toggle the 'published' status in local state
              : product,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Product Page</h1>

      {/* Filter Section */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded border p-2 shadow-md"
        />
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="rounded border p-2 shadow-md"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedPrice(e.target.value)}
          value={selectedPrice}
          className="rounded border p-2 shadow-md"
        >
          <option value="">Select Price</option>
          {priceRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedStatus(e.target.value)}
          value={selectedStatus}
          className="rounded border p-2 shadow-md"
        >
          <option value="">Select Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
            className="mr-2"
          />
          <span>Show Published Products</span>
        </label>
      </div>

      {/* Add Product Button */}
      <div className="mb-5 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-center font-semibold text-black hover:bg-opacity-90 lg:px-8 xl:px-10">
        <button onClick={() => setIsModalOpen(true)}>Add Product</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-lg bg-[#1a222c] p-6 shadow-xl sm:w-96">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Add New Product
            </h2>
            <form>
              {/* Input fields for product form */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleAddImage(e, (fieldName, value) =>
                      setFormData((prev) => ({ ...prev, [fieldName]: value })),
                    )
                  }
                  className="w-full rounded border p-2 text-black"
                />
                {formData.image && (
                  <div className="relative mt-4 max-h-[300px] overflow-hidden rounded-md border">
                    <Image
                      src={formData.image as string}
                      alt="Product Preview"
                      width={500}
                      height={300}
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      published: !prev.published,
                    }))
                  }
                  className="mr-2"
                />
                <label className="text-sm text-white">Published</label>
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Published
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="flex items-center px-6 py-4 text-sm text-gray-800">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="mr-3 rounded"
                  />
                  {product.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {product.status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <SwitcherThree
                      enabled={product.published}
                      setEnabled={() =>
                        togglePublishedStatus(product.id, product.published)
                      }
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <button
                    onClick={() => handleRemoveItem(product._id, product.title)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.7535 2.47502H10.7535V1.47502C10.7535 1.24551 10.608 1.03751 10.4265 0.99751C10.2595 0.95751 10.0725 1.04351 9.9295 1.21051L9.4265 2.21251C9.3475 2.34751 9.2305 2.42751 9.0915 2.42751H7.7535C7.6155 2.42751 7.4985 2.34751 7.4295 2.21251L6.9265 1.21051C6.7835 1.04351 6.5955 0.95751 6.4285 0.99751C6.247 1.03751 6.1015 1.24551 6.1015 1.47502V2.47502H3.3535C3.1595 2.47502 2.9945 2.62802 3.0055 2.82702C3.0335 3.19802 3.3115 3.41902 3.5865 3.41902H14.9215C15.2015 3.41902 15.4785 3.19602 15.5155 2.82702C15.5265 2.62802 15.3615 2.47502 15.1675 2.47502H13.7535Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
