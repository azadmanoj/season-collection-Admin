"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal/Modal";

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
  const [isPublished, setIsPublished] = useState(true);
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
  // Modal state
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
    console.log("Fetching products...");
    fetch("https://season-collection-backend.onrender.com/api/jewelry")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);

        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        const uniqueStatuses = [
          ...new Set(data.map((product) => product.status)),
        ];

        const priceRanges = ["0-50", "51-100", "101-200", "201-500", "500+"];

        setCategories(uniqueCategories);
        setStatuses(uniqueStatuses);
        setPriceRanges(priceRanges);

        // setSelectedCategory(uniqueCategories[2]);
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

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file change (used for image upload)
  const handleAddImage = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      fieldName: string,
      value: string | ArrayBuffer | null | undefined,
    ) => void,
  ) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setFieldValue("image", result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting new product:", formData);

    try {
      // Make a POST request with axios
      const response = await axios.post(
        "https://season-collection-backend.onrender.com/api/jewelry",
        formData,
      );

      toast.success("Product Added Successfully ");
      console.log("Product submitted successfully:", response.data);

      setTimeout(() => {
        window.location.reload();
      }, 4000);

      // Reset form and close modal
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

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://season-collection-backend.onrender.com/api/jewelry/${id}`,
      );
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      toast.success("Product Deleted Successfully ");
      console.log(`Product with id ${id} deleted successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (error) {
      console.error("Error deleting product:", error);
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
                      width={300}
                      height={300}
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                )}
              </div>
              {/* Other fields */}
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
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white">
                  Category
                </label>
                <input
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
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2 text-black"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center text-white">
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
                  Published
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-1/2 rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded bg-gray-500 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          filterProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col rounded-lg border p-4 shadow-lg transition-shadow duration-200 ease-in-out hover:shadow-xl"
            >
              {/* Product Image */}
              <div className=" mb-4 h-48 w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>

              {/* Product Information */}
              <h3 className="mb-2 text-xl font-semibold text-black">
                {product.title}
              </h3>
              <p className="mb-2 text-gray-600">{product.description}</p>
              <p className="mb-2 font-semibold text-black">${product.price}</p>
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500">Status: {product.status}</p>

              <div className="mt-4 flex justify-between">
                <button className=" text-gray-500  hover:text-red-600">
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
                  onClick={() => handleRemoveItem(product._id, product.title)}
                  className="  text-gray-500  hover:text-red-600"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isConfirmModalOpen && (
        <Modal
          title={modalProps.title}
          message={modalProps.message}
          actionLabel={modalProps.actionLabel}
          actionHandler={modalProps.actionHandler}
          onClose={() => setIsConfirmModalOpen(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductsPage;
