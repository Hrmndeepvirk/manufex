import { projects } from "../data/siteContent";
import SectionHeading from "./SectionHeading";

export default function ProjectsSection() {
  return (
    <section className="manufacturing-section manufacturing-projects" id="projects">
      <div className="manufacturing-container">
        <SectionHeading
          eyebrow="Projects"
          title="Featured Industrial Work"
          description="A look at demo project types that show the range of manufacturing systems this website can present."
          align="center"
        />
        <div className="manufacturing-project-grid">
          {projects.map((project) => (
            <article className="manufacturing-project-card" key={project.title}>
              <img src={project.image} alt={`${project.title} facility`} loading="lazy" />
              <div className="manufacturing-project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <i className="pi pi-arrow-up-right" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
