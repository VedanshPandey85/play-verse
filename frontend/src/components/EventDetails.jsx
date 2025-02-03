import React, { useState, useEffect } from "react";
import PaymentSuccessModal from "./PaymentSuccessModal";

const EventDetails = () => {
  const eventId = window.location.pathname.split("/").pop();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/events/${eventId}`
        );
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        setEvent(data);
        // console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // Fetch participants data
  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/successful-payments`
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();
      setParticipants(data.successfulPayments);
      // console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const handlePayment = async () => {
    if (!name || !phone) {
      alert("Name and phone number are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone }),
        }
      );

      if (!response.ok) throw new Error("Booking failed");

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: event.price * 100,
        currency: "INR",
        name: event.name,
        description: "Event Booking",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const confirmResponse = await fetch(
              `http://localhost:5000/api/events/${eventId}/confirm`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  participantName: name,
                  participantPhone: phone,
                }),
              }
            );

            if (!confirmResponse.ok)
              throw new Error("Payment confirmation failed");

            // Set payment details and show success modal
            setPaymentDetails({
              participantName: name,
              participantPhone: phone,
              paymentId: response.razorpay_payment_id,
            });
            setShowSuccessModal(true);

            // Refresh participants list
            fetchParticipants();
          } catch (error) {
            alert("Payment confirmation failed");
          }
        },
        // prefill: { name, contact: phone },
        // theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment initialization failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Single Image */}
        {event.venueImage && (
          <div className="mb-6 md:mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={event.venueImage}
              alt="Venue"
              className="w-full h-48 sm:h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Event Details Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.name}
            </h1>

            {/* Event Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{event.sportsName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{event.slot}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">
                Important Instructions
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Have everything clean & mandatory normal shoes are not allowed
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Maintain decorum as per your sportmanship
                </li>
              </ul>
            </div>

            {/* Payment Form */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Total and Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <span className="text-sm text-gray-600">TOTAL</span>
                <div className="text-2xl font-bold text-gray-900">
                  INR {event.price}.00
                </div>
              </div>
              <button
                onClick={handlePayment}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium ${
                  event.participants.length === event.participantsLimit
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                disabled={event.participants.length === event.participantsLimit}
              >
                {event.participants.length === event.participantsLimit
                  ? "No Slots Left"
                  : "Book Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        {participants.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map((participant, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {participant.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {participant.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        paymentDetails={paymentDetails}
        event={event}
      />
    </div>
  );
};

export default EventDetails;
