const principles = [
  { step: '01 / SCOPE', title: 'Scope', body: 'Confirm the system owner, permitted activities, intended outcome and boundaries before technical work begins.' },
  { step: '02 / UNDERSTAND', title: 'Understand', body: 'Map the environment, configuration and normal behavior before recommending a change.' },
  { step: '03 / PRIORITIZE', title: 'Prioritize', body: 'Focus on the risks and controls that matter to the agreed scope, not a generic checklist.' },
  { step: '04 / REVIEW', title: 'Review', body: 'Examine evidence, configuration and telemetry carefully within the approved boundary.' },
  { step: '05 / VALIDATE', title: 'Validate', body: 'Use controlled, authorized checks to confirm observations and avoid assumptions.' },
  { step: '06 / DOCUMENT', title: 'Document', body: 'Record observations, limitations, decisions and recommended actions in clear language.' },
  { step: '07 / HAND OVER', title: 'Hand over', body: 'Leave the system owner with practical next steps, context and reusable operational notes.' },
  { step: '08 / IMPROVE', title: 'Improve', body: 'Use findings to strengthen visibility, configuration and response readiness over time.' },
];

export default function Philosophy() {
  return <div className="phil-grid">{principles.map((p) => <div key={p.title} className="phil reveal"><span className="step">{p.step}</span><h3>{p.title}</h3><p>{p.body}</p></div>)}</div>;
}
