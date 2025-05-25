"use client";
import GoogleButton from "@/shared/components/google-button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};
/**
 * Signup component.
 *
 * This component displays a form to register a new user account.
 *
 * @returns A JSX element representing the signup form.
 */
const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {};

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1] ">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Signup
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Signup
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg ">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to Eshop
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{"  "}
            <Link href={"/login"} className="text-blue-500">
              Login
            </Link>
          </p>

          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm ">
            <div className="flex-1 border-t border-gray-300 " />
            <span className="px-3"> or Signup with Email</span>
            <div className="flex-1 border-t border-gray-300 " />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-gray-700 mb-1 block">Name</label>
            <input
              type="text"
              placeholder="John doe"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("name", {
                required: "Name is required",
              })}
            />

            <label className="text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="support@gmail.com"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}

            <label className="text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...register("password", {
                  required: "password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 "
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className=" w-full text-lg mt-4 cursor-pointer bg-black text-white py-2 rounded-lg "
            >
              Signup
            </button>

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
