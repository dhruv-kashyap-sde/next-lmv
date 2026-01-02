import DarkVeil from "@/components/DarkVeil";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const layout = ({ children }) => {
  return (
    <>
      <div className="w-full h-screen absolute top-0 left-0 z-[-1]">
        <DarkVeil hueShift={199} />
      </div>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default layout;
