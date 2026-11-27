import { cn } from "../lib/cn";
import { useContent } from "../lib/use-content";

export function Skills() {
  const { navigation, skills } = useContent();
  const skillsItem = navigation.find((item) => item.id === "skills");

  if (!skillsItem) return null;

  const hasOddGroups = skills.length % 2 === 1;

  return (
    <section
      id={skillsItem.id}
      aria-labelledby="skills-title"
      className="section-offset py-10"
    >
      <h2 id="skills-title" className="text-2xl font-semibold text-fg">
        {skillsItem.label}
      </h2>
      <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((skill, index) => {
          const headingId = `skills-group-${index}`;
          const isLast = index === skills.length - 1;
          return (
            <div
              key={skill.group}
              data-reveal-item
              className={cn(
                "min-w-0 rounded-2xl border border-line bg-surface-raised p-6 shadow-sm",
                hasOddGroups && isLast && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <h3 id={headingId} className="text-xl font-semibold text-fg">
                {skill.group}
              </h3>
              <ul aria-labelledby={headingId} className="mt-4 flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-accent-600 bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800 [overflow-wrap:anywhere]"
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
