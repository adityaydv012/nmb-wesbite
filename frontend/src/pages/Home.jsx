import HeroSection from "../components/home/HeroSection";
import CuratedCollections from "../components/home/CuratedCollections";
import Navbar from "../components/layout/Navbar";
import SignatureSweet from "../components/home/SignatureSweet";
import HeritageSection from "../components/home/HeritageSection";
import OutletsSection from "../components/home/OutletsSection";
import Footer from "../components/layout/Footer";
import MobileTopNavigation from "../components/common/MobileTopNavigation";
import NmbAchievement from "../components/home/NmbAchievement";

function Home() {
  return (
    <>
    <Navbar/>
    <MobileTopNavigation/>
      <HeroSection />
       <SignatureSweet/>
      <CuratedCollections />
     
      <NmbAchievement/>
      <HeritageSection/>
      <OutletsSection/>
      <Footer/>
    </>
  );
}

export default Home;