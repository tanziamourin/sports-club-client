import React from "react";
import Banner from "./Banner";
import LocationSection from "./LocationSection";

import Promotions from "./Promotions";
import AboutClub from "./AboutClub";

const Home = () => {
  return (
    <div>
      <Banner></Banner>

      <AboutClub></AboutClub>
      <LocationSection></LocationSection>
      <Promotions></Promotions>
    </div>
  );
};

export default Home;
