import React from "react";
import PlayerCount from "../components/PlayerCount";
import BookingForm from "../components/BookingForm";
import EventImages from "../components/EventImages";
import PhotoGrid from "../components/PhotoGrid";
import Testimonial21 from "../components/Testimonial21";

const Home = () => {
  return (
    <div className="p-6">
      {/* <EventImages /> */}
      <h2 className="text-4xl font-bold text-center mb-6">
        Welcome to PlayVerse
      </h2>
      <p className="text-center mb-4">
        Join us for exciting sports events every weekend!
      </p>
      <PhotoGrid />
      <Testimonial21 />

      {/* <PlayerCount /> */}
    </div>
  );
};

export default Home;
