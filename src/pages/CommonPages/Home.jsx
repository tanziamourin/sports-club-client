import React from "react";
import Banner from "./Banner";
import LocationSection from "./LocationSection";

import Promotions from "./Promotions";

import ClubSection from "./ClubSection";

const Home = () => {
  return (
    <div >
      <Banner></Banner>
    <ClubSection></ClubSection>
      {/* <AboutClub></AboutClub> */}
      <LocationSection></LocationSection>
      <Promotions></Promotions>
    </div>
  );
};

export default Home;
