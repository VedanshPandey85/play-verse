import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleBookNow = (eventId) => {
    console.log(eventId);
    navigate(`/event/${eventId}`); // Navigate with eventId
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="border p-4 rounded-lg shadow-lg bg-gray-100"
          >
            <h3 className="text-xl font-medium">{event.name}</h3>
            <p>{event.description}</p>
            <Button
              onClick={() => handleBookNow(event._id)} // Passing eventId correctly
              className="mt-2 bg-blue-500 text-white"
            >
              Book Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
