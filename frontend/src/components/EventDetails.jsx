import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams(); // Fetch the eventId from URL params
  const [event, setEvent] = useState(null); // State to hold event details
  const [name, setName] = useState(""); // State to handle participant's name
  const [phone, setPhone] = useState(""); // State to handle participant's phone number

  useEffect(() => {
    // Fetch event details when the component is mounted
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEvent(response.data); // Update state with event details
        console.log(response.data); // Log event details for debugging
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    // Fetch event details only if eventId exists
    if (eventId) {
      fetchEventDetails();
    } else {
      alert("Event ID is missing");
    }
  }, [eventId]);

  // Handle payment logic
  const handlePayment = async () => {
    if (!name || !phone) {
      alert("Name and phone number are required");
      return;
    }

    try {
      // Request to backend to create Razorpay order
      const orderResponse = await axios.post(
        `http://localhost:5000/api/events/${eventId}/book`,
        {
          name: name, // Send participant's name
          phone: phone, // Send participant's phone number
        }
      );

      const order = orderResponse.data; // Retrieve order details
      console.log(order);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID from .env
        amount: event.price * 100, // Price in paise (multiply by 100)
        currency: "INR", // Currency code
        name: event.name, // Event name
        description: "Event Booking", // Description of the payment
        order_id: order.orderId, // Order ID from backend
        handler: async (response) => {
          try {
            const confirmResponse = await axios.post(
              `http://localhost:5000/api/events/${eventId}/confirm`,
              {
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id, // Add Razorpay order ID
                razorpaySignature: response.razorpay_signature, // Add Razorpay signature
                participantName: name,
                participantPhone: phone,
              }
            );
            console.log(confirmResponse); // Log the full response to check status
            alert("Payment successful and booking confirmed!");
          } catch (error) {
            console.error(
              "Error confirming payment:",
              error.response ? error.response.data : error
            );
            alert("Payment confirmation failed");
          }
        },
        prefill: {
          name: name,
          contact: phone,
        },
        theme: {
          color: "#3399cc", // Razorpay theme color
        },
      };

      const rzp = new window.Razorpay(options); // Use `window.Razorpay` to open the Razorpay checkout
      rzp.open(); // Open Razorpay payment modal
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {event ? (
        <>
          <h2 className="text-3xl font-semibold mb-4">{event.name}</h2>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <strong>Slot:</strong> {event.slot}
          </p>
          <div className="mt-6">
            <h3 className="text-2xl font-medium mb-4">Book Now</h3>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Price</label>
                <p>{event.price} INR</p>
              </div>
              <button
                type="button"
                onClick={handlePayment}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Pay Now
              </button>
            </form>
          </div>
          {/* Participants List */}
          {event.participants && event.participants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-medium mb-4">Participants</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {event.participants.map((participant, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {participant.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {participant.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};

export default EventDetails;
