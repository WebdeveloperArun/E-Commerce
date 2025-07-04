import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";


const cashFree = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {

  const cashFree = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/connect-razorpay`,
        {sellerId}
      );
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.data.redirect_url;
    },
    onError: (error) => {
      console.log("Cannot connect to razorpay", error.message);
    },
  });

  const onSubmit = () => {
    cashFree.mutate();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Connect Razorpay
        </h3>
        <button
          disabled={cashFree.isPending}
          type="submit"
          className=" w-full text-lg cursor-pointer bg-blue-600 text-white py-2 mt-4 rounded-lg "
        >
          {cashFree.isPending ? "Connecting..." : "Connect CashFree"}
        </button>
      </form>
    </div>
  );
};

export default cashFree;
