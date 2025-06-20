import { useMutation } from "@tanstack/react-query";
import {
  businessCategories,
  businessSubCategories,
  businessType,
} from "apps/seller-ui/src/utils/categories";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type formData = {
  pan: string;
  gst: string;
  account_number: string;
  ifsc: string;
  business_name: string;
  business_type: string;
  category: string;
  subcategory: string;
  sellerId: string;
};

const ConnectRazorpay = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<formData>();

  const selectedCategory = watch("category");
  const [subCategoryOptions, setSubCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (selectedCategory) {
      const categoryKey =
        selectedCategory.toUpperCase() as keyof typeof businessSubCategories;

      const subcats = businessSubCategories[categoryKey] || [];
      setSubCategoryOptions(subcats);
      setValue("subcategory", "");
    } else {
      setSubCategoryOptions([]);
    }
  }, [selectedCategory, setValue]);

  const connectRazorpay = useMutation({
    mutationFn: async (data: formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/connect-razorpay`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(1);
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      console.log("Cannot connect to razorpay", error);
    },
  });

  const onSubmit = (data: formData) => {
    const accountData = { ...data, sellerId };
    connectRazorpay.mutate(accountData);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Connect Razorpay
        </h3>
        <label className="text-gray-700 mb-1 block">PAN *</label>
        <input
          type="text"
          placeholder="Enter Pan number"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("pan", {
            required: "Pan is required",
          })}
        />
        {errors.pan && (
          <p className="text-red-500 text-sm">{String(errors.pan.message)}</p>
        )}

        <label className="text-gray-700 mb-1 block">GST *</label>
        <input
          type="text"
          placeholder="e.g., 1234567890"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("gst", {
            required: "GST is required",
          })}
        />
        {errors.gst && (
          <p className="text-red-500 text-sm">{String(errors.gst.message)}</p>
        )}

        <label className="text-gray-700 mb-1 block">Account number *</label>
        <input
          type="text"
          placeholder="Enter account number"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("account_number", {
            required: "Shop bio is required",
          })}
        />
        {errors.account_number && (
          <p className="text-red-500 text-sm">
            {String(errors.account_number.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">IFSC code *</label>
        <input
          type="text"
          placeholder="e.g., BKID12345678"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("ifsc", {
            required: "Shop address is required",
          })}
        />
        {errors.ifsc && (
          <p className="text-red-500 text-sm">{String(errors.ifsc.message)}</p>
        )}

        <label className="text-gray-700 mb-1 block">Business name *</label>
        <input
          type="text"
          placeholder="e.g., E-Shop, Pokestore"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("business_name", {
            required: "Opening hours are required",
          })}
        />
        {errors.business_name && (
          <p className="text-red-500 text-sm">
            {String(errors.business_name.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Business type *</label>
        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("business_type", {
            required: "Business Type is required",
          })}
        >
          <option value="">Select Business Type</option>
          {businessType.map((type, index) => (
            <option key={`${type.value}-${index}`} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.business_type && (
          <p className="text-red-500 text-sm">
            {String(errors.business_type.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Category *</label>
        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("category", { required: "Category is required" })}
        >
          <option value="">Select Category</option>
          {businessCategories.map((category, index) => (
            <option key={`${category.value}-${index}`} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Sub-Category *</label>
        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          disabled={!selectedCategory}
          {...register("subcategory", {
            required: "Subcategory is required",
          })}
        >
          <option value="">
            {subCategoryOptions.length
              ? "Select Subcategory"
              : "Select a category first"}
          </option>
          {subCategoryOptions.map((option, index) => (
            <option key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.subcategory && (
          <p className="text-red-500 text-sm">
            {String(errors.subcategory.message)}
          </p>
        )}

        <button
          disabled={connectRazorpay.isPending}
          type="submit"
          className=" w-full text-lg cursor-pointer bg-blue-600 text-white py-2 mt-4 rounded-lg "
        >
          {connectRazorpay.isPending ? "Connecting..." : "Connect"}
        </button>
      </form>
    </div>
  );
};

export default ConnectRazorpay;
