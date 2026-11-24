import { navigation, skills } from "../content";

const skillsItem = navigation.find((item) => item.id === "skills");

export function Skills() {
  if (!skillsItem) return null;

  return (
    <section
      id={skillsItem.id}
      aria-labelledby="skills-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="skills-title" className="text-2xl font-semibold text-fg">
        {skillsItem.label}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {skills.map((skill, index) => {
          const headingId = `skills-group-${index}`;
          return (
            <div
              key={skill.group}
              className="min-w-0 rounded-2xl border border-line bg-surface-raised p-6 shadow-sm"
            >
              <h3 id={headingId} className="text-xl font-semibold text-fg">
                {skill.group}
              </h3>
              <ul aria-labelledby={headingId} className="mt-4 flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800 [overflow-wrap:anywhere]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
