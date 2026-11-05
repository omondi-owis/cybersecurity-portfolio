import type { Metadata } from 'next';
import Link from 'next/link';
import { LabCard } from '@/components/Cards';
import { LabTopology } from '@/components/Diagrams';
import { labs } from '@/content/labs';

export const metadata: Metadata = {
  title: 'Security Lab',
  description:
    'Defensive security laboratory journal: Kali, Ubuntu Server, Wazuh SIEM. Every exercise documented with objective, method, evidence, findings, and mitigation.',
  alternates: { canonical: '/lab' },
};

export default function LabPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Security Lab</p>
        <p className="eyebrow">Laboratory journal</p>
        <h1>Controlled defensive validation.</h1>
        <p className="lede">
          Kali for authorized testing, Ubuntu Server as the defended target, Wazuh
          SIEM watching everything. Every entry follows the same structure —
          objective, environment, method, evidence, analysis, findings, mitigation,
          lessons — to preserve a reviewable technical record.
        </p>
      </div>

      <section aria-label="Lab environment">
        <div className="container">
          <LabTopology />
          <div className="note-box">
            <strong>Scope discipline:</strong> only lab-owned systems are ever
            tested, every exercise names its targets in writing, and all published
            evidence is sanitized. Hostnames, addresses and credentials never leave
            the lab.
          </div>
        </div>
      </section>

      <section className="section-alt" aria-label="Lab entries">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Journal</p>
            <h2 className="h2">All lab entries</h2>
          </div>
          <div className="card-grid">
            {labs.map((l) => (
              <LabCard key={l.slug} lab={l} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
