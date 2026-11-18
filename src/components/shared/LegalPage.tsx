import { PageHeader } from "./PageHeader";

type LegalPageProps = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={intro} />
      <article className="container-page max-w-3xl space-y-8 py-12">
        {sections.map((section, i) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">
              {i + 1}. {section.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </article>
    </>
  );
}
