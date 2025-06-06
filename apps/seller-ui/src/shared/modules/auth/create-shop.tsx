import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { shopCategories } from "apps/seller-ui/src/utils/categories";

type formData = {
  name: string;
  category: string;
  bio: string;
  address: string;
  opening_hours: string;
  website: string;
  sellerId: string;
};

const CreateShop = ({
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
  } = useForm<formData>();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = (data: formData) => {
    const shopData = { ...data, sellerId };
    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Setup new shop
        </h3>
        <label className="text-gray-700 mb-1 block">Name *</label>
        <input
          type="text"
          placeholder="shop name"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("name", {
            required: "Name is required",
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}

        <label className="text-gray-700 mb-1 block">
          Bio (Max 100 words) *
        </label>
        <input
          type="text"
          placeholder="shop bio"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("bio", {
            required: "Shop bio is required",
            validate: (value) =>
              countWords(value) <= 100 || "Bio should be less than 100 words",
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}

        <label className="text-gray-700 mb-1 block">Address *</label>
        <input
          type="text"
          placeholder="shop location"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("address", {
            required: "Shop address is required",
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Opening Hours *</label>
        <input
          type="text"
          placeholder="e.g., Mon-Fri 9AM - 6PM"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("opening_hours", {
            required: "Opening hours are required",
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Website</label>
        <input
          type="url"
          placeholder="https://example.com"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("website", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
              message: "Please enter a valid URL",
            },
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}

        <label className="text-gray-700 mb-1 block">Website</label>
        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register("category", { required: "Category is required" })}
        >
          <option value="">Select Category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        <button
          type="submit"
          className=" w-full text-lg cursor-pointer bg-blue-600 text-white py-2 mt-4 rounded-lg "
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
