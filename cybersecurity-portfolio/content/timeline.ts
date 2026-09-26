/**
 * Engineering journey — data-driven so new milestones are trivial to add.
 * Honest, forward-looking, no fabricated employers or dates of employment.
 */

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
    id: 'software-dev',
    phase: 'Foundation',
    title: 'Software Development',
    status: 'done',
    summary:
      'Built real applications with JavaScript/TypeScript, Node.js, Express, React and MongoDB. Learned how software actually breaks — which is where security thinking starts.',
    skills: ['JavaScript', 'Node.js', 'Express', 'React', 'MongoDB', 'REST APIs', 'JWT'],
  },
  {
    id: 'networking',
    phase: 'Foundation',
    title: 'Networking',
    status: 'done',
    summary:
      'Studied how packets move: addressing, routing, DNS, DHCP, NAT, firewalls and segmentation. Built small lab networks and captured traffic to see theory on the wire.',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'Subnetting', 'Wireshark', 'Nmap (authorized)'],
  },
  {
    id: 'linux',
    phase: 'Foundation',
    title: 'Linux & Infrastructure',
    status: 'done',
    summary:
      'Administered Ubuntu servers: users, permissions, SSH hardening, UFW, systemd, logs and updates. Learned that most security failures are administration failures.',
    skills: ['Ubuntu', 'SSH', 'UFW', 'systemd', 'Bash', 'Log analysis'],
  },
  {
    id: 'cybersecurity',
    phase: 'Core',
    title: 'Cybersecurity Fundamentals',
    status: 'done',
    summary:
      'Threat modeling, attack surfaces, defense in depth, secure defaults, least privilege. Applied controls to my own projects and documented what worked.',
    skills: ['Threat modeling', 'Defense in depth', 'Hardening', 'Security headers'],
  },
  {
    id: 'soc-siem',
    phase: 'Core',
    title: 'SOC & Security Monitoring',
    status: 'active',
    summary:
      'Deployed Wazuh SIEM in a home lab: agents, rules, alert triage, investigation notes and tuning. Practicing the full loop from telemetry to documented finding.',
    skills: ['Wazuh', 'SIEM', 'Detection engineering', 'Alert triage', 'Incident notes'],
  },
  {
    id: 'sec-eng',
    phase: 'Now',
    title: 'Security Engineering',
    status: 'active',
    summary:
      'Building MlinziOps and SecureOps: telemetry pipelines, detection logic, audit logging and defensive automation — engineered like production, documented like research.',
    skills: ['Python', 'Automation', 'Audit logging', 'Secure APIs', 'CI/CD security'],
  },
  {
    id: 'sec-arch',
    phase: 'Next',
    title: 'Security Architecture',
    status: 'next',
    summary:
      'Direction of travel: designing secure systems end-to-end — identity, network, data and application layers — with evidence that each control actually works.',
    skills: ['Architecture', 'Zero trust thinking', 'Cloud security', 'Roadmap'],
  },
];
