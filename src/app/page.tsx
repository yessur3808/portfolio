import Footer from "@/src/components/layout/Footer";
import Experience from "@/src/components/sections/Experience";
import ProfileOverview from "@/src/components/sections/ProfileOverview";

const Page = () => {
  return (
    <>
      <main>
        <ProfileOverview />
        <Experience />
      </main>
      <Footer />
    </>
  );
};

export default Page;
