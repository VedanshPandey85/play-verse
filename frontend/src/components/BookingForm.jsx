import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input, Button } from "@material-tailwind/react";

const BookingForm = ({ eventId, participantsLimit, participants }) => {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (participants >= participantsLimit) {
      alert("This event is fully booked. Please try another event.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const { name, phone } = data;

      // Call API to initiate Razorpay order
      const response = await axios.post(
        `http://localhost:5000/events/${eventId}/book`,
        {
          name,
          phone,
        }
      );

      const { orderId, amount } = response.data;

      // Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use environment variable
        amount, // Amount from API response (in paise)
        currency: "INR",
        order_id: orderId,
        handler: async function (response) {
          await axios.post(`http://localhost:5000/events/${eventId}/confirm`, {
            paymentId: response.razorpay_payment_id,
          });
          alert("Payment Successful! Your booking is confirmed.");
        },
        prefill: {
          name,
          email: "", // Optional: add email if needed
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            className="w-full mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
            error={!!errors.phone}
            className="w-full mt-1"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white"
          disabled={paymentProcessing}
        >
          {paymentProcessing ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
