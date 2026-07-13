import { Footer } from "../layout/Footer.jsx";
import { Contact } from "./Contact.jsx";
import { Hero } from "./Hero.jsx";
import { ServicesGrid } from "./ServicesGrid.jsx";
import { WhyChooseUs } from "./WhyChooseUs.jsx";

export function Home({ search, setSearch, services, openService, loadServices, loading }) {
  return (
    <div className="min-h-0">
      <Hero search={search} setSearch={setSearch} loadServices={loadServices} loading={loading} />
      <ServicesGrid services={services} openService={openService} />
      <WhyChooseUs />
      <Contact />
      <Footer services={services} onServiceClick={openService} />
    </div>
  );
}
