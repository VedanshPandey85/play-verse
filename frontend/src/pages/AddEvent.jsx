import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Select, Option } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Verify admin authorization
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized! Please log in as an admin.");
          navigate("/login");
          return;
        }

        // Send a verification request to the backend
        const response = await axios.get(
          "http://localhost:5000/api/events/login",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.isAdmin) {
          alert("Access denied! You are not authorized to create events.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authorization error:", error);
        alert("Session expired or unauthorized access.");
        navigate("/login");
      }
    };

    verifyAdmin();
  }, [navigate]);

  // Submit handler for form data
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in as an admin.");
        navigate("/login");
        return;
      }

      await axios.post("http://localhost:5000/api/events", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Event Created Successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Create a New Event
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Event Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter Event Name"
            {...register("name", { required: "Event name is required" })}
            className="w-full mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Enter Event Description"
            {...register("description", {
              required: "Event description is required",
            })}
            className="w-full mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Event Date
          </label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "Event date is required" })}
            className="w-full mt-2"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Slot Selection */}
        <div>
          <label htmlFor="slot" className="block text-sm font-medium">
            Event Slot (2-Hour Intervals)
          </label>
          <Controller
            name="slot"
            control={control}
            rules={{ required: "Please select a slot" }}
            render={({ field }) => (
              <Select {...field} className="w-full mt-2">
                {[
                  /* Slots omitted for brevity */
                ].map((slot, index) => (
                  <Option key={index} value={slot}>
                    {slot}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.slot && (
            <p className="text-red-500 text-xs mt-1">{errors.slot.message}</p>
          )}
        </div>

        {/* Participants Limit */}
        <div>
          <label
            htmlFor="participantsLimit"
            className="block text-sm font-medium"
          >
            Participants Limit
          </label>
          <Input
            id="participantsLimit"
            type="number"
            placeholder="Enter Limit"
            {...register("participantsLimit", {
              required: "Participants limit is required",
            })}
            className="w-full mt-2"
          />
          {errors.participantsLimit && (
            <p className="text-red-500 text-xs mt-1">
              {errors.participantsLimit.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Event Price (in ₹)
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Enter Event Price"
            {...register("price", { required: "Event price is required" })}
            className="w-full mt-2"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          Create Event
        </Button>
      </form>
    </div>
  );
};

export default AddEvent;
