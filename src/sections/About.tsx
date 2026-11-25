import { useContent } from "../lib/use-content";

export function About() {
  const { navigation, profile } = useContent();
  const aboutItem = navigation.find((item) => item.id === "about");

  if (!aboutItem) return null;

  return (
    <section
      id={aboutItem.id}
      aria-labelledby="about-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="about-title" className="text-2xl font-semibold text-fg">
        {aboutItem.label}
      </h2>
      {profile.summary.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-prose text-lg text-fg">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
