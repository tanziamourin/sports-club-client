import React from 'react';
import Banner from './Banner';
import LocationSection from './LocationSection';
// import PromotionSection from './PromotionSection';
import About from './About';
import Promotions from './Promotions';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <About></About>
            <LocationSection></LocationSection>
            <Promotions></Promotions>
            {/* <PromotionSection></PromotionSection> */}
        </div>
    );
};

export default Home;