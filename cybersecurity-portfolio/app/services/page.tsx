import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cybersecurity Services: Wazuh, Linux & Log Automation",
  description: "Explore scoped Wazuh setup and tuning, Linux security reviews, network reviews, Python log automation and incident documentation from VYRA.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Cybersecurity Services | VYRA", description: "Defined security tasks, authorized access and practical deliverables. Explore Wazuh, Linux security and log automation support.", url: "/services", images: ["/og-image.svg"] },
  twitter: { card: "summary_large_image", title: "Cybersecurity Services | VYRA", description: "Scoped Wazuh, Linux security and log automation support.", images: ["/og-image.svg"] },
};

const services = [
  { title: "SIEM & Wazuh setup and tuning", scope: "For system owners bringing logs into Wazuh or investigating noisy alerts. Define log sources, review agent onboarding and validate a focused tuning change.", output: "Agreed deployment or review notes, telemetry checks and documented tuning recommendations.", href: "/services/siem-wazuh-setup-tuning", label: "Wazuh scope, deliverables and preparation" },
  { title: "Linux security configuration review", scope: "For owners who need a clearer view of Linux access, SSH, patching, firewall, logging and exposed-service settings.", output: "A scoped findings summary, prioritized remediation recommendations and repeatable verification steps.", href: "/services/linux-security-configuration-review", label: "Linux review scope and preparation" },
  { title: "Network security review", scope: "Review agreed network exposure, segmentation, DNS and firewall posture against the intended design. Targets and methods need explicit authorization.", output: "A review summary, documented limitations and prioritized next actions. This is not a penetration test.", href: "/contact", label: "Discuss a network review" },
  { title: "Python log automation", scope: "Focused utilities to parse, normalize, filter or report on security logs, starting with the actual format and a defined operational question.", output: "Maintainable code, usage notes and agreed sample-based checks.", href: "/contact", label: "Discuss a log automation task" },
  { title: "Incident triage support & documentation", scope: "Organize available evidence, record observations and build an incident timeline and handover.", output: "Clear incident notes that separate facts, assumptions and unanswered questions. No emergency or 24/7 response commitment.", href: "/contact", label: "Discuss triage documentation" },
];

export default function ServicesPage() {
  return <>
    <div className="container page-head">
      <p className="breadcrumb"><Link href="/">Home</Link> / Services</p>
      <p className="eyebrow">VYRA SERVICES</p>
      <h1>Cybersecurity services for monitoring, Linux security and log automation.</h1>
      <p className="lede">Choose support for a defined security task, with clear scope and practical documentation. VYRA works with system owners and authorized teams to review configurations, improve visibility and make findings easier to act on. Availability depends on fit, scope and written authorization.</p>
    </div>
    <section aria-labelledby="services-list"><div className="container">
      <h2 className="h2" id="services-list">Choose the task you need help with</h2>
      <div className="card-grid">{services.map(service => <article className="card reveal" key={service.title}>
        <p className="eyebrow">SCOPED SERVICE</p>
        <h3>{service.title}</h3><p>{service.scope}</p>
        <p><strong>Typical output:</strong> {service.output}</p>
        <Link href={service.href}>{service.label} →</Link>
      </article>)}</div>
    </div></section>
    <section className="section-alt" aria-labelledby="references-h"><div className="container">
      <h2 className="h2" id="references-h">Explore the technical approach</h2>
      <p>These guides and controlled lab write-ups explain methods, not client results or production assurance.</p>
      <div className="card-grid">
        <article className="card reveal"><h3>Wazuh and detection tuning</h3><p><Link href="/knowledge/siem-tuning-without-blinding">Read the evidence-led SIEM tuning guide</Link></p><p><Link href="/lab/wazuh-deployment-tuning">Explore the Wazuh deployment lab</Link> (lab evidence)</p></article>
        <article className="card reveal"><h3>Linux configuration and verification</h3><p><Link href="/knowledge/ubuntu-hardening-checklist">Read the Ubuntu hardening checklist</Link></p><p><Link href="/lab/linux-hardening-baseline">Explore the Linux baseline lab</Link> (lab evidence)</p></article>
      </div>
    </div></section>
    <section aria-labelledby="boundaries-h"><div className="container two-col">
      <div className="prose reveal"><h2 className="h2" id="boundaries-h">Authorization and clear boundaries first</h2><p>Before work begins, agree the systems, permitted activities, access method, expected output and point of contact. Review and remediation can be separate tasks; production changes need explicit approval and an appropriate recovery plan.</p><p>VYRA does not provide unauthorized testing, represent itself as a managed SOC, or guarantee that every security issue will be found.</p></div>
      <aside className="side-card reveal"><h2>What to include in an enquiry</h2><ul><li>The environment you own or are authorized to manage</li><li>The specific problem or outcome you need</li><li>Current tools, versions and relevant constraints</li><li>Any deadline, review window or change-control needs</li></ul><p>Do not send passwords, API keys or raw sensitive logs through the enquiry form. Access and data handling should be agreed separately.</p></aside>
    </div></section>
    <section className="section-alt" aria-labelledby="cta-h"><div className="container container-narrow"><h2 className="h2" id="cta-h">Start with the problem, not a broad package.</h2><p className="lede">Describe what you need reviewed or improved. The next step is to check fit and agree a useful, authorized scope.</p><div className="btn-row"><Link className="btn btn-primary" href="/contact">Discuss a service</Link></div></div></section>
  </>;
}
