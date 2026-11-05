/** Technical capability map. It describes relevant foundations, not client work. */
export interface Milestone {
  id: string;
  phase: string;
  title: string;
  status: 'done' | 'active' | 'next';
  summary: string;
  skills: string[];
}

export const milestones: Milestone[] = [
  {
    id: 'systems', phase: 'Foundation', title: 'Systems & Infrastructure', status: 'done',
    summary: 'Linux administration, access control, service configuration, logging and secure remote-access fundamentals that support focused configuration reviews.',
    skills: ['Ubuntu', 'SSH', 'UFW', 'systemd', 'Bash', 'Log analysis'],
  },
  {
    id: 'networking', phase: 'Foundation', title: 'Network Security', status: 'done',
    summary: 'Network fundamentals relevant to authorized security review: addressing, routing, DNS, firewalls, segmentation and traffic analysis.',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'Firewall posture', 'Wireshark', 'Nmap (authorized)'],
  },
  {
    id: 'monitoring', phase: 'Service area', title: 'Security Monitoring', status: 'active',
    summary: 'SIEM and Wazuh-focused work around telemetry, alert logic, triage context, tuning observations and operational documentation.',
    skills: ['Wazuh', 'SIEM', 'Detection logic', 'Alert triage', 'Documentation'],
  },
  {
    id: 'automation', phase: 'Service area', title: 'Log Automation', status: 'active',
    summary: 'Small Python utilities for log parsing, normalization, filtering and reporting where an agreed task benefits from repeatable analysis.',
    skills: ['Python', 'Automation', 'Audit logging', 'Data parsing', 'Runbooks'],
  },
  {
    id: 'response', phase: 'Service area', title: 'Incident Triage Documentation', status: 'active',
    summary: 'Evidence organization, timeline building and written handover material to support the system owner’s incident decisions.',
    skills: ['Evidence handling', 'Timelines', 'Triage notes', 'Handover documentation'],
  },
];
