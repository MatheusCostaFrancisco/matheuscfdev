import { lazy, Suspense, useEffect, type ComponentType } from "react";
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
import { Testimonials } from "./sections/Testimonials";
import { Teasers } from "./sections/Teasers";
import { Skills } from "./sections/Skills";

const Journey = lazy(() =>
  import("./sections/Journey").then((m) => ({ default: m.Journey })),
);
const Books = lazy(() =>
  import("./sections/Books").then((m) => ({ default: m.Books })),
);

function HashFocus() {
  useEffect(() => {
    scrollToHash(window.location.hash);
  }, []);
  return null;
}

function PageFallback() {
  return <div aria-hidden="true" className="min-h-[100dvh]" />;
}

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
  journey: Journey,
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
    <div className="flex min-h-[100dvh] flex-col overflow-x-clip">
      <SkipLink />
      <Header page={page} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 section-offset px-4 py-10 sm:px-6"
      >
        <Suspense fallback={<PageFallback />}>
          <Content />
          {page !== "home" && <HashFocus />}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
