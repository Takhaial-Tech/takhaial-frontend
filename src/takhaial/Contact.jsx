import { useState } from "react";
import { company, services } from "./content";
export default function Contact({ email = company.email }) {
  const [brief, setBrief] = useState(""),
    [copied, setCopied] = useState(false),
    [prepared, setPrepared] = useState(false);
  const selected = new URLSearchParams(location.search).get("service") || "";
  function prepare(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPrepared(true);
    setBrief(
      `Project enquiry — Takhaial Tech\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company") || "Not specified"}\nFocus: ${data.get("service")}\n\nWorkflow or project:\n${data.get("workflow")}\n\nCurrent tools:\n${data.get("tools") || "To discuss"}\n\nWhat a useful result looks like:\n${data.get("outcome") || "To define together"}`,
    );
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "takhaial-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main id="main" className="tk-contact tk-container">
      <div className="tk-contact__intro">
        <p className="tk-label">Start a conversation</p>
        <h1>
          What should
          <br />
          work better?
        </h1>
        <p>
          Tell us about one workflow, a product idea or an experience you want
          to build. We’ll start with the problem and find the right next step.
        </p>
        <a className="tk-contact-email" href={`mailto:${email}`}>
          {email}
        </a>
        <a
          className="tk-text-link"
          href={`https://wa.me/${company.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          Talk on WhatsApp <span>↗</span>
        </a>
        <div className="tk-contact-note">
          <h3>A useful first conversation</h3>
          <p>
            Bring the current process, the tools you use and where work gets
            stuck. You don’t need a finished specification.
          </p>
        </div>
      </div>
      <div className="tk-contact__form">
        {prepared ? (
          <section className="tk-brief-result" aria-live="polite">
            <p className="tk-label">Ready for the next step</p>
            <h2>Your brief is ready.</h2>
            <p>
              It has not been sent. Open an email draft, copy it or download it
              to share with our team.
            </p>
            <textarea
              aria-label="Prepared project brief"
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value);
                setCopied(false);
              }}
            />
            <a
              className="tk-button"
              href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry — Takhaial Tech")}&body=${encodeURIComponent(brief)}`}
            >
              Open email draft <span>↗</span>
            </a>
            <div className="tk-brief-actions">
              <button onClick={download}>Download brief</button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(brief);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? "Copied" : "Copy brief"}
              </button>
              <button
                onClick={() => {
                  setBrief("");
                  setCopied(false);
                  setPrepared(false);
                }}
              >
                Start another brief
              </button>
            </div>
          </section>
        ) : (
          <form onSubmit={prepare}>
            <div className="tk-field-pair">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Work email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                />
              </label>
            </div>
            <label>
              Company
              <input
                name="company"
                autoComplete="organization"
                maxLength={150}
              />
            </label>
            <label>
              What would you like to explore?
              <select
                name="service"
                defaultValue={
                  services.find((s) => s.slug === selected)?.name || ""
                }
                required
              >
                <option value="" disabled>
                  Select a focus
                </option>
                {services.map((s) => (
                  <option key={s.slug}>{s.name}</option>
                ))}
                <option>Not sure yet — help us find the opportunity</option>
              </select>
            </label>
            <label>
              What workflow or project do you have in mind?
              <textarea
                name="workflow"
                required
                minLength={15}
                maxLength={4000}
                placeholder="What happens today? Where does work slow down?"
              />
            </label>
            <label>
              Which tools are involved? <span>(optional)</span>
              <input
                name="tools"
                maxLength={300}
                placeholder="Your CRM, documents, chat, internal systems…"
              />
            </label>
            <label>
              What would a useful result look like? <span>(optional)</span>
              <textarea
                name="outcome"
                maxLength={1500}
                placeholder="Fewer handoffs, faster review, a working prototype…"
              />
            </label>
            <button className="tk-button" type="submit">
              Prepare my brief <span>→</span>
            </button>
            <p className="tk-form-privacy">
              This form prepares a brief in your browser. Nothing is sent or
              stored on a server. Please don’t include passwords or confidential
              documents. <a href="/privacy">Privacy details</a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
