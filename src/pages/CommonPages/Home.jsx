import React from "react";
import Banner from "./Banner";
import LocationSection from "./LocationSection";

import Promotions from "./Promotions";

import ClubSection from "./ClubSection";
import UpcomingEvents from "../../components/UpcomingEvents";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <ClubSection></ClubSection>
      <UpcomingEvents></UpcomingEvents>
      <Promotions></Promotions>
      <LocationSection></LocationSection>
      
    </div>
  );
};

export default Home;
