"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal/Modal";
import ProductModal from "../ProductModal/ProductModal"; // Import the modal component

// Define the Product interface
interface Product {
  _id: string;
  id: string;
  title: string;
  images: [];
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
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    images: [],
    price: 0,
    description: "",
    category: "",
    status: "",
    published: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if it's edit mode
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
    actionLabel: "",
    actionHandler: () => {},
    redirectTo: "",
  });

  const [productModalProps, setProductModalProps] = useState({
    mode: "",
    product: {} as Product,
    onClose: () => {},
    onSubmit: () => {},
    redirectTo: "",
  });

  useEffect(() => {
    fetch("https://season-collection-backend.onrender.com/api/jewelry")
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
        setCategories([...new Set(data.map((product) => product.category))]);
        setStatuses([...new Set(data.map((product) => product.status))]);
        setPriceRanges(["0-50", "51-100", "101-200", "201-500", "500+"]);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
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

  const updateProductStatus = async (id: string, currentStatus: string) => {
    try {
      const updatedStatus =
        currentStatus === "Active" ? "Not Active" : "Active";

      // Prepare the data to send to the backend
      const formData = { status: updatedStatus };

      // Make the API call to update the product's status
      const response = await axios.put(
        `https://season-collection-backend.onrender.com/api/jewelry/${id}`,
        formData,
      );

      // Update the product's status in the state after successful API call
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, status: updatedStatus } : prod,
        ),
      );

      // Show a success toast
      toast.success("Product status updated successfully!");
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status.");
    }
  };

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

  const updatePublish = async (id: string, currentStatus: boolean) => {
    try {
      // Toggle the current published status (if true set to false, if false set to true)
      const updatedStatus = !currentStatus;

      // Prepare the data (assuming you need to send the updated 'published' status to the backend)
      const formData = { published: updatedStatus };

      // Make the API call to update the product's published status
      const response = await axios.put(
        `https://season-collection-backend.onrender.com/api/jewelry/${id}`,
        formData,
      );

      // Show success toast
      toast.success("Product updated successfully!");

      // Update the product's status in the state
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, published: updatedStatus } : prod,
        ),
      );
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product status.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Edit product
        const response = await axios.put(
          `https://season-collection-backend.onrender.com/api/jewelry/${formData.id}`,
          formData,
        );
        toast.success("Product updated successfully!");
      } else {
        // Add new product

        const response = await axios.post(
          "https://season-collection-backend.onrender.com/api/jewelry",
          formData,
        );
        toast.success("Product added successfully");
      }
      setTimeout(() => window.location.reload(), 3000);
      setFormData({
        id: "",
        title: "",
        images: [],
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

  // Open modal for adding a new product
  const handleAddProduct = () => {
    setFormData({
      id: "",
      title: "",
      images: [],
      price: 0,
      description: "",
      category: "",
      status: "",
      published: true,
    });
    setIsEditMode(false); // For adding a new product, set edit mode to false
    setIsModalOpen(true);
  };

  // Open modal for editing an existing product
  const openEditModal = (product: Product) => {
    setProductModalProps({
      mode: "edit",
      product,
      onClose: () => setIsModalOpen(false),
      onSubmit: handleSubmit, // Ensure handleSubmit is called when submitting
      redirectTo: "/product",
    });
    setIsEditMode(true); // Set edit mode to true
    setFormData(product); // Populate formData with the product details
    setIsModalOpen(true);
  };

  const handleRemoveItem = (id: any, title: string) => {
    setModalProps({
      title: "Delete Item",
      message: `Are you sure you want to delete "${title}" product?`,
      actionLabel: "Yes, Remove",
      actionHandler: () => handleDelete(id),
      redirectTo: "/product",
    });
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        "https://season-collection-backend.onrender.com/api/jewelry/${id}",
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      toast.success("Product Deleted Successfully");
      setIsConfirmModalOpen(false);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Products</h1>

      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          mode={productModalProps.mode}
          product={productModalProps.product}
          onClose={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
          onSubmit={handleSubmit}
          redirectTo={productModalProps.redirectTo}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {isEditMode && (
        <ProductModal
          mode={productModalProps.mode}
          product={productModalProps.product}
          onClose={() => {
            setIsEditMode(false);
            window.location.reload();
          }}
          onSubmit={handleSubmit}
          redirectTo={productModalProps.redirectTo}
          formData={formData}
          setFormData={setFormData}
          setIsEditMode={setIsEditMode}
        />
      )}

      {/* Add Product Button */}
      <div className="mb-5 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-center font-semibold text-black hover:bg-opacity-90 lg:px-8 xl:px-10">
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Product Table */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Category Filter */}
        <select
          className="w-full rounded-md border border-gray-300 p-2"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          className="w-full rounded-md border border-gray-300 p-2"
          onChange={(e) => setSelectedPrice(e.target.value)}
          value={selectedPrice}
        >
          <option value="">Select Price Range</option>
          {priceRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="w-full rounded-md border border-gray-300 p-2"
          onChange={(e) => setSelectedStatus(e.target.value)}
          value={selectedStatus}
        >
          <option value="">Select Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filterProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col space-y-4 rounded-lg border bg-white p-4 shadow-lg sm:flex-row sm:space-x-6 sm:space-y-0"
          >
            {/* Image and Product Name */}
            <div className="flex items-center space-x-4 sm:w-1/4">
              {/* Display images */}
              <div className="grid grid-cols-3 gap-2">
                {(Array.isArray(product.images)
                  ? product.images
                  : [product.images]
                ).map((image, index) => (
                  <div key={index} className="mb-2">
                    <Image
                      src={image}
                      alt={product.title}
                      width={64} // Adjust the width
                      height={64} // Adjust the height
                      className="rounded-lg object-cover shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {product.title}
            </span>

            {/* Description, Category, Price, Stock */}
            <div className="flex flex-col space-y-2 text-gray-800 sm:w-2/4">
              <div className="text-sm">{product.description}</div>
              <div className="text-sm">Category: {product.category}</div>
              <div className="text-sm font-bold">
                Price: ${product.price.toFixed(2)}
              </div>
              <div className="text-sm">Stock: {product.stock}</div>
            </div>

            {/* Status, Published */}
            <div className="flex items-center gap-2 text-sm text-gray-800 sm:w-1/4">
              {/* Checkbox for toggling status */}
              <input
                type="checkbox"
                checked={product.status === "Active"} // Convert the string status to boolean
                onChange={() => updateProductStatus(product.id, product.status)} // Use onChange instead of onClick for better accessibility
                className="form-checkbox h-5 w-5 text-blue-600"
              />

              {/* Status Label */}
              <div className="flex items-center">
                <span className="mr-1 font-semibold">Status:</span>{" "}
                {/* Bold label */}
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-800 sm:w-1/4">
              {/* Published Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={product.published}
                  onChange={() => updatePublish(product.id, product.published)} // Toggle the value
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>

              {/* Published Status Text */}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Published:</span>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs ${
                    product.published
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.published ? "True" : "False"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between space-x-10 sm:w-1/4">
              <button
                className="hover:text-primary"
                onClick={() => openEditModal(product)}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                    fill=""
                  />
                  <path
                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                    fill=""
                  />
                </svg>
              </button>
              <button
                className="hover:text-primary"
                onClick={() => handleRemoveItem(product._id, product.title)}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                    fill=""
                  />
                  <path
                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                    fill=""
                  />
                  <path
                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                    fill=""
                  />
                  <path
                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {isConfirmModalOpen && (
          <Modal
            isOpen={isConfirmModalOpen}
            closeModal={() => {
              setIsConfirmModalOpen(false);
              window.location.reload();
            }}
            title={modalProps.title}
            message={modalProps.message}
            actionLabel={modalProps.actionLabel}
            actionHandler={modalProps.actionHandler}
            redirectTo={modalProps.redirectTo}
          />
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductsPage;
