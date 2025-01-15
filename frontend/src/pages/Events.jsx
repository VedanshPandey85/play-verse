import React from "react";
import EventImages from "../components/EventImages";
import BookingForm from "../components/BookingForm";
import EventList from "../components/EventList";

const Events = () => {
  return (
    <>
      <EventImages />
      <EventList />
    </>
    // <div className="flex flex-col min-h-screen">
    //   {/* Top Half: Event Images */}
    //   <div className="flex-grow">
    //     <EventImages />
    //   </div>

    //   {/* Bottom Half: Booking Form */}
    //   <div className="bg-gray-100">
    //     <BookingForm />
    //   </div>
    // </div>
  );
};

export default Events;
