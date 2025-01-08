// components/FormModal.tsx
import React, { useState } from "react";
import Image from "next/image";

interface FormModalProps {
  title: string;
  message: string;
  actionLabel: string;
  actionHandler: () => void;
  onClose: () => void;
  formFields: {
    name: string;
    label: string;
    type: string;
    value: any;
    options?: string[]; // for select inputs
    required?: boolean;
    placeholder?: string;
    handleChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => void;
  }[];
  handleSubmit: () => void;
  categories?: string[];
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  message,
  actionLabel,
  actionHandler,
  onClose,
  formFields,
  handleSubmit,
  categories,
}) => {
  const renderInputField = (field: any) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full rounded border p-2 text-black"
          />
        );
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={field.value}
            onChange={field.handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full rounded border p-2 text-black"
          />
        );
      case "file":
        return (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => field.handleChange(e)}
            className="w-full rounded border p-2 text-black"
          />
        );
      case "select":
        return (
          <select
            name={field.name}
            value={field.value}
            onChange={field.handleChange}
            required={field.required}
            className="w-full rounded border p-2 text-black"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              name={field.name}
              checked={field.value}
              onChange={field.handleChange}
              className="mr-2"
            />
            {field.label}
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-lg bg-[#1a222c] p-6 shadow-xl sm:w-96">
        <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
        <p className="mb-4 text-white">{message}</p>

        {/* Form Fields */}
        <form>
          {formFields.map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-sm font-semibold text-white">
                {field.label}
              </label>
              {renderInputField(field)}
            </div>
          ))}

          {formFields.some((field) => field.type === "file" && field.value) && (
            <div className="relative mt-4 max-h-[300px] overflow-hidden rounded-md border">
              <Image
                src={
                  formFields.find((field) => field.type === "file")?.value || ""
                }
                alt="Product Preview"
                width={300}
                height={300}
                objectFit="cover"
                className="rounded"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-1/2 rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              {actionLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded bg-gray-500 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
