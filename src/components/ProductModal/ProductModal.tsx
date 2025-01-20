import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

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
  // Initialize form data when in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        id: product?.id,
        title: product?.title,
        images: product?.images || [], // Assuming product.images is an array
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

  const handleAddImages = async (
    e: ChangeEvent<HTMLInputElement>,
    callback: (fieldName: string, value: string[]) => void,
  ) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(async (file) => {
        try {
          // Compression options to ensure images are below 100KB
          const options = {
            maxSizeMB: 0.02, // Max size of the image in MB (100KB)
            maxWidthOrHeight: 800, // Resize image to a max width or height of 800px
            useWebWorker: true, // Use Web Worker for better performance
            fileType: "image/jpeg", // Convert to JPEG format for better compression
            quality: 0.9, // Set the quality of the image (optional, lower to reduce size further)
          };

          // Compress the image
          const compressedFile = await imageCompression(file, options);

          // Convert the compressed image to base64
          const reader = new FileReader();
          return new Promise<string>((resolve) => {
            reader.onloadend = () => {
              if (reader.result) {
                const base64String = reader.result as string;
                resolve(base64String);
              }
            };
            reader.readAsDataURL(compressedFile);
          });
        } catch (error) {
          console.error("Image compression error:", error);
          return "";
        }
      });

      const imageData = await Promise.all(newImages);

      // Ensure formData?.images is not undefined, default to an empty array
      callback("images", [
        ...(formData?.images || []),
        ...imageData.filter(Boolean),
      ]);
    }
  };
  const handleRemoveImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((image: string, i: number) => i !== index), // Explicitly typing the filter parameters
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsEditMode(true);
  };

  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 sm:mt-22">
      <div className="mx-4 mt-16 h-[550px] w-full overflow-y-auto rounded-lg bg-[#1a222c] p-6 shadow-xl sm:mx-0 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:h-[800px] xl:mt-0 xl:max-w-2xl">
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
              Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleAddImages(e, (fieldName: any, value: any) =>
                  setFormData((prev: any) => ({ ...prev, [fieldName]: value })),
                )
              }
              className="w-full rounded border p-2 text-black"
            />
            {formData?.images && formData?.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {formData.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative max-h-[150px] overflow-hidden rounded-md border"
                  >
                    <Image
                      src={image}
                      alt={`Product Preview ${index + 1}`}
                      width={200}
                      height={150}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white p-1 text-sm text-black"
                    >
                      X
                    </button>
                  </div>
                ))}
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
              Stock
            </label>
            <input
              type="text"
              name="stock"
              value={formData?.stock}
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
              className="w-full rounded bg-blue-500 px-4 py-2 text-white sm:w-auto"
            >
              {mode === "edit" ? "Update Product" : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (redirectTo) router.push(redirectTo);
              }}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white sm:w-auto"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
