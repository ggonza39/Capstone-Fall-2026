import React, { useId, useRef, useState } from "react";

// This file was entirely generated using ChatGPT.
export default function EditableForm({ label, fields, values = {}, id, onLoad, onSave }) {
  const dialog = useRef(null);
  const savePending = useRef(false);
  const loadRequest = useRef(null);
  const headingId = useId();
  const [draft, setDraft] = useState({});
  const [original, setOriginal] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadStatus, setLoadStatus] = useState("ready");
  const [error, setError] = useState("");

  const changed = fields.some(({ name }) => draft[name] !== original[name]);

  async function openEditor() {
    const modal = dialog.current;
    const request = {};
    loadRequest.current = request;
    setError("");
    setLoadStatus(onLoad ? "loading" : "ready");
    if (!modal.open) modal.showModal();

    try {
      const record = onLoad ? await onLoad(id) : values;
      if (dialog.current !== modal || !modal.open || loadRequest.current !== request) return;
      if (record == null) throw new Error("Record was not found");

        const initial = Object.fromEntries(
        fields.map(({ name, type }) => [
            name,
            type === "datetime-local"
            ? toDateTimeInputValue(record[name])
            : String(record[name] ?? ""),
        ])
);

      setOriginal(initial);
      setDraft(initial);
      setLoadStatus("ready");
    } catch {
      if (dialog.current !== modal || !modal.open || loadRequest.current !== request) return;

      setLoadStatus("failed");
      setError("Could not load this record. Please try again.");
    }
  }

   function toDateTimeInputValue(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  return `${day}T${time}`;
}

  async function save(event) {
    event.preventDefault();
    if (savePending.current || loadStatus !== "ready" || !changed) return;

    savePending.current = true;
    setSaving(true);
    setError("");

    try {
      const payload = Object.fromEntries(
  fields.map(({ name }) => {
    const value = draft[name] ?? "";

    if (name === "accessibilityFeatures") {
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      return [name, items];
    }

    if (name === "seatAvailability") {
      return [name, value === "" ? null : Number(value)];
    }

    if (name === "dateTime") {
       return [name, value ? new Date(value).toISOString() : null];
    }

    return [name, value];
  })
);

await onSave(payload);
dialog.current?.close();
    } catch {
      setError("Could not save your changes. Please try again.");
    } finally {
      savePending.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="editable-form">
      <style>{styles}</style>
      <strong>{label}</strong>
      <button type="button" onClick={openEditor} aria-label={`Edit ${label}`}>
        Edit
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={headingId}
        onCancel={(event) => {
          if (savePending.current) event.preventDefault();
        }}
      >
        <form onSubmit={save} aria-busy={saving || loadStatus === "loading"}>
          <h2 id={headingId}>Edit {label}</h2>
          {loadStatus === "loading" && <p role="status">Loading…</p>}
          {loadStatus === "ready" && fields.map(({ name, label: fieldLabel, type = "text", required }, index) => {
            const control = {
              name,
              required,
              autoFocus: index === 0,
              disabled: saving,
              value: draft[name] ?? "",
              onChange(event) {
                const value = event.target.value;
                setDraft((previous) => ({ ...previous, [name]: value }));
              },
            };

            return (
              <label key={name}>
                {fieldLabel}
                {type === "datetime-local" ? (
                  <input {...control} type="datetime-local" />
                ) : (
                  <input {...control} type={type} />
                )}
              </label>
            );
          })}
          {error && <p role="alert">{error}</p>}
          <footer>
            <button type="button" disabled={saving} onClick={() => dialog.current.close()}>
              Cancel
            </button>
            {loadStatus === "failed" && (
              <button type="button" onClick={openEditor}>Try again</button>
            )}
            <button type="submit" disabled={saving || loadStatus !== "ready" || !changed}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}

const styles = `
  .editable-form { font-family: Inter, system-ui, sans-serif; }
  .editable-form dt, .editable-form label { font-weight: 600; }
  .editable-form dd { margin: .25rem 0 .85rem; white-space: pre-wrap; overflow-wrap: anywhere; }
  .editable-form button { font: inherit; font-weight: 600; padding: .55rem 1rem; border: 1px solid #cbd5e1; border-radius: .65rem; background: white; color: #24324a; cursor: pointer; }
  .editable-form button:hover:enabled { background: #eef2ff; }
  .editable-form :is(button, input, textarea):focus-visible { outline: 3px solid #6366f1; outline-offset: 2px; }
  .editable-form dialog { box-sizing: border-box; width: min(32rem, calc(100% - 2rem)); max-height: 85vh; padding: 0; overflow: auto; border: 1px solid #e2e8f0; border-radius: 1.25rem; background: white; color: #18233a; box-shadow: 0 20px 80px #0f172a40; }
  .editable-form dialog::backdrop { background: #0f172a70; backdrop-filter: blur(5px); }
  .editable-form form { padding: clamp(1.25rem, 5vw, 2rem); }
  .editable-form h2 { margin: 0 0 1.4rem; font-size: 1.5rem; }
  .editable-form label { display: block; margin-bottom: 1rem; }
  .editable-form :is(input, textarea) { display: block; box-sizing: border-box; width: 100%; margin-top: .5rem; padding: .75rem; border: 1px solid #aebad0; border-radius: .75rem; background: #fafbff; color: #18233a; font: 400 1rem/1.55 Inter, system-ui, sans-serif; }
  .editable-form textarea { resize: vertical; }
  .editable-form footer { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .6rem; margin-top: 1.5rem; }
  .editable-form button[type="submit"] { background: #4338ca; color: white; border-color: transparent; }
  .editable-form button[type="submit"]:hover:enabled { background: #3730a3; }
  .editable-form button:disabled { opacity: .55; cursor: default; }
  .editable-form [role="alert"] { color: #a32236; }
`;
