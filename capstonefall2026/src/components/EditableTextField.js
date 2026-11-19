import React, { useRef, useState } from "react";

// This file was entirely generated using ChatGPT
export default function EditableTextField({ label, value, onSave }) {
  const dialog = useRef(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openEditor() {
    setDraft(value);
    setError("");
    dialog.current.showModal();
  }

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");

    try {
      await onSave(draft);
      dialog.current?.close();
    } catch {
      setError("Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editable-text">
      <style>{styles}</style>
      <strong>{label}</strong>
      <p className="editable-text-value">{value}</p>
      <button type="button" onClick={openEditor} aria-label={`Edit ${label}`}>Edit</button>

      <dialog ref={dialog} aria-label={`Edit ${label}`}
        onCancel={event => { if (saving) event.preventDefault(); }}>
        <form onSubmit={save}>
          <h2>Edit {label}</h2>
          <label>
            Content
            <textarea autoFocus rows={6} value={draft} disabled={saving}
              onChange={event => setDraft(event.target.value)} />
          </label>
          {error && <p role="alert">{error}</p>}
          <footer>
            <button type="button" disabled={saving}
              onClick={() => dialog.current.close()}>Cancel</button>
            <button type="submit" disabled={saving || draft === value}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}

const styles = `
  .editable-text { font-family: Inter, system-ui, sans-serif; }
  .editable-text-value { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; margin: .4rem 0 .75rem; }
  .editable-text button { font: inherit; font-weight: 600; padding: .55rem 1rem; border: 1px solid #cbd5e1; border-radius: .65rem; background: white; color: #24324a; cursor: pointer; }
  .editable-text button:hover:enabled { background: #eef2ff; }
  .editable-text button:focus-visible, .editable-text textarea:focus-visible { outline: 3px solid #6366f1; outline-offset: 2px; }
  .editable-text dialog { box-sizing: border-box; width: min(32rem, calc(100% - 2rem)); max-height: 85vh; overflow: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 1.25rem; background: white; color: #18233a; box-shadow: 0 20px 80px #0f172a40; }
  .editable-text dialog::backdrop { background: #0f172a70; backdrop-filter: blur(5px); }
  .editable-text form { padding: clamp(1.25rem, 5vw, 2rem); }
  .editable-text h2 { margin: 0 0 1.4rem; font-size: 1.5rem; letter-spacing: -.03em; }
  .editable-text label { display: block; font-weight: 600; }
  .editable-text textarea { display: block; box-sizing: border-box; width: 100%; margin-top: .5rem; padding: .85rem; resize: vertical; border: 1px solid #aebad0; border-radius: .75rem; background: #fafbff; color: #18233a; font: 400 1rem/1.55 Inter, system-ui, sans-serif; }
  .editable-text footer { display: flex; justify-content: flex-end; gap: .6rem; margin-top: 1.5rem; }
  .editable-text button[type="submit"] { background: #4338ca; color: white; border-color: transparent; }
  .editable-text button[type="submit"]:hover:enabled { background: #3730a3; }
  .editable-text button:disabled { opacity: .55; cursor: default; }
  .editable-text [role="alert"] { color: #a32236; }
`;
