import { useEffect, type ComponentType } from "react";
import type { Page } from "./lib/routes";
import { scrollToHash } from "./lib/scroll-to-hash";
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
import { Roadmap } from "./sections/Roadmap";
import { Skills } from "./sections/Skills";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Products />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}

const pageContent: Record<Page, ComponentType> = {
  home: Home,
  roadmap: Roadmap,
  books: Books,
};

type AppProps = {
  page: Page;
};

function App({ page }: AppProps) {
  useEffect(() => {
    scrollToHash(window.location.hash);
  }, []);

  const Content = pageContent[page];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 scroll-mt-20 px-4 py-10 sm:px-6"
      >
        <Content />
      </main>
      <Footer />
    </div>
  );
}

export default App;
