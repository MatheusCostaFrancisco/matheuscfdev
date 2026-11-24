import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SkipLink } from "./components/SkipLink";
import { navigation } from "./content";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Products } from "./sections/Products";
import { Skills } from "./sections/Skills";

function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"
      >
        <Hero />
        <About />
        <Experience />
        <Products />
        <Skills />
        {navigation
          .filter((item) =>
              !["about", "experience", "products", "skills", "contact"].includes(item.id))
          .map((item) => (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-title`}
              className="scroll-mt-20 py-10"
            >
              <h2
                id={`${item.id}-title`}
                className="text-2xl font-semibold text-fg"
              >
                {item.label}
              </h2>
            </section>
          ))}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
