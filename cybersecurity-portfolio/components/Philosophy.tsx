const principles = [
  { step: '01 / UNDERSTAND', title: 'Understand', body: 'Understand the system before touching it. Read the config, map the flows, know normal.' },
  { step: '02 / MODEL', title: 'Model', body: 'Identify assets, trust boundaries and threats. Draw the diagram before buying the tool.' },
  { step: '03 / BUILD', title: 'Build', body: 'Implement secure architecture with defaults that fail closed and access that stays minimal.' },
  { step: '04 / TEST', title: 'Test', body: 'Validate assumptions through controlled testing against your own systems — scoped and labeled.' },
  { step: '05 / MONITOR', title: 'Monitor', body: 'Collect useful telemetry. You cannot detect what you never collected.' },
  { step: '06 / DETECT', title: 'Detect', body: 'Write rules as hypotheses, tune with evidence, and prove they still fire.' },
  { step: '07 / RESPOND', title: 'Respond', body: 'Contain and remediate with approval-gated actions and a calm, written procedure.' },
  { step: '08 / DOCUMENT', title: 'Document', body: 'Turn experience into reusable knowledge: runbooks, notes and honest post-mortems.' },
  { step: '09 / IMPROVE', title: 'Improve', body: 'Continuously strengthen the system. Every finding feeds the next control.' },
];

export default function Philosophy() {
  return (
    <div className="phil-grid">
      {principles.map((p) => (
        <div key={p.title} className="phil reveal">
          <span className="step">{p.step}</span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
}
