import { cn } from "../lib/cn";
import { useContent } from "../lib/use-content";

const cardClass =
  "grid gap-x-8 gap-y-4 rounded-2xl border border-line bg-surface-raised p-6 shadow-sm";

const interactiveCardClass = cn(
  "motion-safe:transition-shadow motion-safe:duration-200",
  "hover:border-line-strong hover:shadow-md focus-within:border-accent-600 focus-within:shadow-md",
);

const linkClass = cn(
  "inline-flex min-h-11 items-center rounded-2xl text-base font-medium text-accent-700 underline underline-offset-4",
  "[overflow-wrap:anywhere] motion-safe:transition-colors hover:text-accent-800 active:text-accent-900",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600",
);

export function Products() {
  const { navigation, products, ui } = useContent();
  const productsItem = navigation.find((item) => item.id === "products");

  if (!productsItem) return null;

  return (
    <section
      id={productsItem.id}
      aria-labelledby="products-title"
      className="section-offset py-10"
    >
      <h2 id="products-title" className="text-2xl font-semibold text-fg">
        {productsItem.label}
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-6">
        {products.map((product) => {
          const hasDetails =
            product.bullets.length > 0 || product.stack.length > 0 || Boolean(product.url);
          return (
          <li key={product.name} data-reveal-item className="flex">
            <article
              className={cn(
                cardClass,
                "w-full min-w-0",
                hasDetails && "md:grid-cols-5",
                product.url && interactiveCardClass,
              )}
            >
              <div className={cn("min-w-0", hasDetails && "md:col-span-2")}>
              <h3 className="text-xl font-semibold text-fg">{product.name}</h3>
              {product.role ? (
                <p className="mt-1 text-sm font-medium text-accent-700">
                  {product.role}
                </p>
              ) : null}
              <p className="mt-3 text-base text-fg">{product.description}</p>
              </div>
              {hasDetails ? (
              <div className="min-w-0 space-y-4 md:col-span-3">
              {product.bullets.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-base text-fg marker:text-accent-600">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="break-words">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              {product.stack.length > 0 ? (
                <ul
                  aria-label={ui.products.stackLabel(product.name)}
                  className="flex flex-wrap gap-2"
                >
                  {product.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-2xl border border-accent-600 bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : null}
              {product.url ? (
                <p className="text-base">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <span className="sr-only">
                      {ui.products.websiteLabel(product.name)}:{" "}
                    </span>
                    {new URL(product.url).host}
                    <span className="sr-only"> {ui.opensInNewTab}</span>
                  </a>
                </p>
              ) : null}
              </div>
              ) : null}
            </article>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
