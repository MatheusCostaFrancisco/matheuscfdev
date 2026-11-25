import { useContent } from "../lib/use-content";

export function Education() {
  const { certifications, education, languages, navigation, ui } = useContent();
  const educationItem = navigation.find((item) => item.id === "education");

  if (!educationItem) return null;

  return (
    <section
      id={educationItem.id}
      aria-labelledby="education-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="education-title" className="text-2xl font-semibold text-fg">
        {educationItem.label}
      </h2>
      <ul className="mt-8 space-y-6">
        {education.map((entry) => (
          <li key={`${entry.institution}-${entry.course}`} data-reveal-item className="min-w-0">
            <h3 className="text-xl font-semibold text-fg">{entry.course}</h3>
            <p className="mt-1 text-base font-medium text-accent-700">
              {entry.institution}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{entry.period}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-fg">
            {ui.education.certificationsHeading}
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-fg marker:text-accent-600">
            {certifications.map((certification) => (
              <li key={certification} className="break-words">
                {certification}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-fg">
            {ui.education.languagesHeading}
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-fg marker:text-accent-600">
            {languages.map((entry) => (
              <li key={entry.language}>
                {entry.language}: {entry.level}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
