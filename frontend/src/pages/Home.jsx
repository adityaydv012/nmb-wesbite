import HeroSection from "../components/home/HeroSection";
import CuratedCollections from "../components/home/CuratedCollections";
import Navbar from "../components/layout/Navbar";
import SignatureSweet from "../components/home/SignatureSweet";
import HeritageSection from "../components/home/HeritageSection";
import OutletsSection from "../components/home/OutletsSection";
import Footer from "../components/layout/Footer";
import MobileTopNavigation from "../components/common/MobileTopNavigation";

function Home() {
  return (
    <>
    <Navbar/>
    <MobileTopNavigation/>
      <HeroSection />
      
      <CuratedCollections />
      <SignatureSweet/>
      <HeritageSection/>
      <OutletsSection/>
      <Footer/>
    </>
  );
}

export default Home;