import Image from "next/image";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ProblemStatement from "./components/ProblemStatement";
import Solution from "./components/Solution";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
    <NavBar />
    <HeroSection />
    <ProblemStatement />
    <Solution />
    <Benefits />
    <Footer />
    </>
  );
}
