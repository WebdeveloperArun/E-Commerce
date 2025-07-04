import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import {
  businessType,
  shopCategories,
} from "apps/seller-ui/src/utils/categories";

type FormData = {
  name: string;
  business_name: string;
  business_type: string;
  bio: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
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
  } = useForm<FormData>();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        {
          name: data.name,
          business_name: data.business_name,
          business_type: data.business_type,
          bio: data.bio,
          opening_hours: data.opening_hours,
          website: data.website,
          sellerId: data.sellerId,
          address: {
            street1: data.street1,
            street2: data.street2,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = (data: FormData) => {
    const shopData = { ...data, sellerId };
    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Setup new shop
        </h3>
        <div className="flex justify-evenly gap-4">
          <div>
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
              <p className="text-red-500 text-sm">
                {String(errors.name.message)}
              </p>
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
                  countWords(value) <= 100 ||
                  "Bio should be less than 100 words",
              })}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">
                {String(errors.bio.message)}
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

            <label className="text-gray-700 mb-1 block">Business Name *</label>
            <input
              type="text"
              placeholder="business name"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("business_name", {
                required: "business name is required",
              })}
            />
            {errors.business_name && (
              <p className="text-red-500 text-sm">
                {String(errors.business_name.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block">
              Businnes Categories *
            </label>
            <select
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("business_type", {
                required: "business type is required",
              })}
            >
              <option value="">Select Category</option>
              {businessType.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.business_type && (
              <p className="text-red-500 text-sm">
                {String(errors.business_type.message)}
              </p>
            )}
          </div>
          <div>
            <label className="text-gray-700 mb-1 block">Street 1 *</label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("street1", {
                required: "street address is required",
              })}
            />
            {errors.street1 && (
              <p className="text-red-500 text-sm">
                {String(errors.street1.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block">Street 2</label>
            <input
              type="text"
              placeholder="e.g., Apartment, Suite"
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("street2")}
            />
            {errors.street2 && (
              <p className="text-red-500 text-sm">
                {String(errors.street2.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block"> City *</label>
            <input
              type="text"
              placeholder="e.g., Mumbai"
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("city", {
                required: "City are required",
              })}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">
                {String(errors.city.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block">State *</label>
            <input
              type="text"
              placeholder="e.g., Maharashtra"
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("state", {
                required: "State is required",
              })}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">
                {String(errors.state.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block"> Postal Code *</label>
            <input
              type="text"
              placeholder="e.g., 123456"
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("postal_code", {
                required: "Postal code is required",
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: "Invalid postal code (6 digits required)",
                },
              })}
            />
            {errors.postal_code && (
              <p className="text-red-500 text-sm">
                {String(errors.postal_code.message)}
              </p>
            )}
          </div>
        </div>

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
