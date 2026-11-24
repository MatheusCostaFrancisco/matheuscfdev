import { navigation, products } from "../content";
import { cn } from "../lib/cn";

const productsItem = navigation.find((item) => item.id === "products");

const cardClass = cn(
  "flex flex-col rounded-2xl border border-line bg-surface-raised p-6 shadow-sm",
  "motion-safe:transition-shadow motion-safe:duration-200",
  "hover:border-line-strong hover:shadow-md focus-within:border-accent-600 focus-within:shadow-md",
);

const linkClass = cn(
  "inline-flex min-h-11 items-center rounded-2xl text-base font-medium text-accent-700 underline underline-offset-4",
  "[overflow-wrap:anywhere] motion-safe:transition-colors hover:text-accent-800 active:text-accent-900",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600",
);

export function Products() {
  if (!productsItem) return null;

  return (
    <section
      id={productsItem.id}
      aria-labelledby="products-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="products-title" className="text-2xl font-semibold text-fg">
        {productsItem.label}
      </h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <li key={product.name} className="flex">
            <article className={cn(cardClass, "w-full min-w-0")}>
              <h3 className="text-xl font-semibold text-fg">{product.name}</h3>
              <p className="mt-3 text-base text-fg">{product.description}</p>
              <ul
                aria-label={`${product.name} stack`}
                className="mt-4 flex flex-wrap gap-2"
              >
                {product.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-2xl bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-base">
                {product.url ? (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <span className="sr-only">{product.name} website: </span>
                    {new URL(product.url).host}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span lang="pt-BR" className="inline-block rounded-2xl bg-surface-sunken px-3 py-1 text-sm font-medium text-fg">
                    {product.urlPending}
                  </span>
                )}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
