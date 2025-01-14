import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductModal = ({
  mode,
  product,
  onClose,
  onSubmit,
  redirectTo,
  formData,
  setFormData,
  setIsEditMode,
}: any) => {
  console.log("🚀 ~ onClose:", onClose)
  console.log("🚀 ~ mode:", mode)
  console.log("🚀 ~ product:", product)
  // Initialize form data when in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        id: product?.id,
        title: product?.title,
        image: product?.image,
        price: product?.price,
        description: product?.description,
        category: product?.category,
        status: product?.status,
        published: product?.published,
      });
    }
  }, [mode, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: Function,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      callback("image", imageUrl);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsEditMode(true);
  };
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-lg bg-[#1a222c] p-6 shadow-xl sm:w-96">
        <h2 className="mb-4 text-xl font-semibold text-white">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData?.title}
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
                handleAddImage(e, (fieldName: any, value: any) =>
                  setFormData((prev: any) => ({ ...prev, [fieldName]: value })),
                )
              }
              className="w-full rounded border p-2 text-black"
            />
            {formData?.image && (
              <div className="relative mt-4 max-h-[300px] overflow-hidden rounded-md border">
                <Image
                  src={formData?.image}
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
              value={formData?.price}
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
              value={formData?.description}
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
              value={formData?.category}
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
              value={formData?.status}
              onChange={handleInputChange}
              className="w-full rounded border p-2 text-black"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData?.published}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  published: !prev.published,
                }))
              }
              className="mr-2"
            />
            <label className="text-sm text-white">Published</label>
          </div>
          <div className="mb-4 flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white"
            >
              {mode === "edit" ? "Update Product" : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (redirectTo) router.push(redirectTo);
              }}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white"
            >
              close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
