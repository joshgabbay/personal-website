// Plain home page. The old immersive version is kept in src/components/ImmersiveHome.tsx.
// Experience, education and awards come from Josh's LinkedIn
// (experience re-read from the live profile 2026-11-16), in his own wording.
import { MEET_URL } from "./meet/booking";

export default function Home() {
  return (
    <main>
      <h1>Josh Gabbay</h1>

      <p>
        I study Economics and Accounting at UC Santa Barbara. I like building
        things.
      </p>
      <p>Calabasas, California.</p>

      <h2>Contact</h2>
      <ul>
        <li>
          <a href={MEET_URL}>Book a meeting</a>
        </li>
        <li>
          <a href="mailto:joshgabbay@ucsb.edu">joshgabbay@ucsb.edu</a>
        </li>
        <li>
          <a href="https://linkedin.com/in/joshgabbay">LinkedIn</a>
        </li>
      </ul>

      <h2>Projects</h2>
      <ul>
        <li>
          <a href="https://subleaseiv.com">Sublease IV</a>
        </li>
        <li>
          <a href="https://ortegaeats.com">OrtegaEats</a>
        </li>
      </ul>

      <h2>Experience</h2>
      <ul>
        <li>
          Accounting Intern,{" "}
          <a href="https://www.boring-stuff.com/">Boring Stuff</a> (Jul 2026
          to present)
        </li>
        <li>
          Intern, <a href="https://www.itsgoodstory.com/">Good Story Studios</a>{" "}
          (Jul 2026 to present)
        </li>
        <li>
          Co-Founder, <a href="https://lexir.ai/">Lexir</a> (Aug 2026 to
          present)
        </li>
        <li>
          Founder, <a href="https://calabasasguards.com">Calabasas Guards</a>{" "}
          (Jun 2025 to Sep 2026)
        </li>
        <li>
          Intern, <a href="https://www.majorproperties.com/">Major Properties</a>{" "}
          (Jun 2026 to Jul 2026)
        </li>
        <li>
          Co-Founder, <a href="https://ortegaeats.com">Ortega Eats</a> (Apr
          2026 to May 2026)
        </li>
        <li>
          Lifeguard, <a href="https://www.cityofcalabasas.com/">City of Calabasas</a>{" "}
          (May 2024 to Sep 2025)
        </li>
        <li>
          Sales Representative,{" "}
          <a href="https://www.abercrombie.com/">Abercrombie &amp; Fitch</a>{" "}
          (Mar 2024 to May 2025)
        </li>
        <li>
          Research Assistant, <a href="https://thrivehealthiv.com/">Thrive Health</a>{" "}
          (Jul 2023 to Jan 2025)
        </li>
      </ul>

      <h2>Education</h2>
      <ul>
        <li>
          UC Santa Barbara, BA in Economics and Accounting (Sep 2025 to Jun
          2029)
        </li>
        <li>Calabasas High School (Aug 2022 to Jun 2025)</li>
        <li>Milken Community School (Aug 2021 to Jun 2022)</li>
      </ul>

      <h2>Publications</h2>
      <ul>
        <li>
          <a href="https://drive.google.com/file/d/1YUI7OBbuigQidlAqLsOqlCDEYjUCHe9X/view?usp=sharing">
            Life with Tepezza
          </a>{" "}
          (Apr 2025)
        </li>
      </ul>

      <h2>Honors</h2>
      <ul>
        <li>Valedictorian, Calabasas High School (Jun 2025)</li>
        <li>CIF Male Student Athlete of the Year (May 2025)</li>
        <li>California State Seal of Civic Engagement (May 2025)</li>
        <li>Citizens of the Year Award, City of Calabasas (Nov 2023)</li>
      </ul>
    </main>
  );
}
