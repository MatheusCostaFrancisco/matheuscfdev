import { useEffect, type ComponentType } from "react";
import type { Page } from "./lib/routes";
import { focusHashTarget, scrollToHash } from "./lib/scroll-to-hash";
import { useReveal } from "./lib/use-reveal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SkipLink } from "./components/SkipLink";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Education } from "./sections/Education";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Products } from "./sections/Products";
import { Books } from "./sections/Books";
import { Journey } from "./sections/Journey";
import { Testimonials } from "./sections/Testimonials";
import { Teasers } from "./sections/Teasers";
import { Skills } from "./sections/Skills";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Testimonials />
      <Products />
      <Skills />
      <Education />
      <Teasers />
      <Contact />
    </>
  );
}

const pageContent: Record<Page, ComponentType> = {
  home: Home,
  roadmap: Journey,
  books: Books,
};

type AppProps = {
  page: Page;
};

function App({ page }: AppProps) {
  useReveal();

  useEffect(() => {
    scrollToHash(window.location.hash);

    const onHashChange = () => focusHashTarget(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const Content = pageContent[page];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SkipLink />
      <Header page={page} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 section-offset px-4 py-10 sm:px-6"
      >
        <Content />
      </main>
      <Footer />
    </div>
  );
}

export default App;
