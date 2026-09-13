import { useEffect, useRef, useState } from "react";
const lanes = {
  sales: {
    label: "Customer inquiries",
    input:
      "“We need a product experience for our next launch. Can your team help?”",
    steps: [
      "Capture inquiry",
      "Identify the request",
      "Prepare a brief",
      "Human review",
      "Assign & follow up",
    ],
    outputs: [
      "A new inquiry enters the workflow.",
      "Topic: product experience. Launch date and scope still needed.",
      "Draft: requirements, open questions and suggested next step.",
      "A team member checks the brief before any commitment.",
      "Approved brief is ready for its owner. No external message was sent.",
    ],
  },
  operations: {
    label: "Internal operations",
    input:
      "A team submits a project request with an attachment and a missing approval.",
    steps: [
      "Capture request",
      "Validate inputs",
      "Find missing approval",
      "Human review",
      "Create next action",
    ],
    outputs: [
      "The request and its attachment are grouped together.",
      "Required fields are checked against the workflow rules.",
      "Approval is missing. The request enters the review queue.",
      "The owner confirms the details and approves the next step.",
      "A task draft is ready with context, owner and a clear next action.",
    ],
  },
  knowledge: {
    label: "Company knowledge",
    input: "“What do we need to prepare before a project handover?”",
    steps: [
      "Receive question",
      "Find approved sources",
      "Prepare answer",
      "Check references",
      "Review & use",
    ],
    outputs: [
      "The question is scoped to project handover.",
      "The example searches a maintained source collection.",
      "A draft checklist is prepared from the selected material.",
      "Source references remain attached so the answer can be checked.",
      "A person reviews the answer before using it in a project.",
    ],
  },
  training: {
    label: "Guided experiences",
    input: "A visitor wants to understand a product inside an interactive showroom.",
    steps: [
      "Understand the question",
      "Find approved context",
      "Guide exploration",
      "Check understanding",
      "Hand over the next step",
    ],
    outputs: [
      "The visitor’s question sets the direction of the experience.",
      "Only approved product information is selected for the example guide.",
      "The interface suggests a relevant feature to inspect in the spatial scene.",
      "The visitor can ask for clarification or request help from a person.",
      "A human-reviewed follow-up is proposed. This example is not connected to a headset or a live assistant.",
    ],
  },
};
export default function WorkflowDemo({ initial = "sales" }) {
  const [lane, setLane] = useState(lanes[initial] ? initial : "sales"),
    [step, setStep] = useState(-1),
    [running, setRunning] = useState(false);
  const choices=useRef(null);
  const current = lanes[lane];
  useEffect(()=>{
    const group=choices.current;
    const selected=group?.querySelector('[aria-pressed="true"]');
    if(!group||!selected)return;
    const box=group.getBoundingClientRect(),item=selected.getBoundingClientRect();
    if(item.right>box.right)group.scrollLeft+=item.right-box.right+12;
    else if(item.left<box.left)group.scrollLeft-=box.left-item.left+12;
  },[lane]);
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      setStep(Math.min(step + 1, 4));
      if (step >= 3) setRunning(false);
    }, 1000);
    return () => clearTimeout(id);
  }, [running, step]);
  const select = (name) => {
    setLane(name);
    setStep(-1);
    setRunning(false);
  };
  return (
    <div className="tk-workflow">
      <div
        ref={choices}
        className="tk-workflow__tabs"
        role="group"
        aria-label="Workflow examples"
      >
        {Object.entries(lanes).map(([key, item]) => (
          <button
            key={key}
            aria-pressed={lane === key}
            onClick={() => select(key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tk-workflow__canvas">
        <div className="tk-flow-input">
          <span>Example input</span>
          <p>{current.input}</p>
        </div>
        <ol className="tk-flow-steps">
          {current.steps.map((label, i) => (
            <li
              key={label}
              data-state={i < step ? "done" : i === step ? "active" : "waiting"}
            >
              <span>{i < step ? "✓" : String(i + 1).padStart(2, "0")}</span>
              <p>{label}</p>
            </li>
          ))}
        </ol>
        <div className="tk-flow-output" aria-live="polite">
          <small>
            {step < 0
              ? "READY TO EXPLORE"
              : step === 4
                ? "EXAMPLE COMPLETE"
                : `STEP ${step + 1} OF 5`}
          </small>
          <p>
            {step < 0
              ? "See how context becomes a reviewed action. Run the example or step through it yourself."
              : current.outputs[step]}
          </p>
        </div>
      </div>
      <div className="tk-flow-controls">
        <button
          className="tk-button"
          onClick={() => {
            if (step === 4) setStep(-1);
            setRunning((s) => !s);
          }}
        >
          {running
            ? "Pause"
            : step === 4
              ? "Run again"
              : step < 0
                ? "Run example"
                : "Continue"}
          <span aria-hidden="true">{running ? "Ⅱ" : "→"}</span>
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setStep((s) => Math.min(s + 1, 4));
          }}
          disabled={step === 4}
        >
          Next step
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setStep(-1);
          }}
          disabled={step === -1 && !running}
        >
          Reset
        </button>
        <p>Interactive example · No AI service or business system is called.</p>
      </div>
    </div>
  );
}
