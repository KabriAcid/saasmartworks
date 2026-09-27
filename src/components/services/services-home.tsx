import { BriefcaseIcon, ComputerDesktopIcon, PrinterIcon } from '@heroicons/react/24/outline';

const categories = [
  { name: 'Management Consultancy', Icon: BriefcaseIcon },
  { name: 'Digital Services', Icon: ComputerDesktopIcon },
  { name: 'Printing, Branding & Creative Design', Icon: PrinterIcon },
];

export default function ServicesHome() {
  return (
    <main className="shell">
      <p className="eyebrow">SA’A SMART WORKS · Maiduguri</p>
      <h1>Professional support.<br />Practical solutions.</h1>
      <p>Consultancy, digital services, printing and creative design for individuals and organizations.</p>
      <section className="grid" aria-label="Service categories">
        {categories.map(({ name, Icon }) => (
          <article className="card" key={name}>
            <Icon width={28} height={28} aria-hidden="true" />
            <h2>{name}</h2>
          </article>
        ))}
      </section>
      <p className="note">Website under development. Online inquiries are not open yet.</p>
    </main>
  );
}
