import { PlusCircle, Save } from "lucide-react";
import { useState } from "react";
import { STATUSES } from "../constants.js";

const emptyForm = {
  title: "",
  description: "",
  contactInformation: "",
  status: "pending"
};

export function TicketForm({ mode = "create", initialTicket, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState(initialTicket || emptyForm);
  const isEdit = mode === "edit";

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function submit(event) {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      contactInformation: form.contactInformation
    };

    if (isEdit) {
      payload.status = form.status;
    }

    onSubmit(payload);
    if (!isEdit) {
      setForm(emptyForm);
    }
  }

  return (
    <form className="ticket-form" onSubmit={submit}>
      <label>
        <span>Title</span>
        <input
          name="title"
          minLength="3"
          maxLength="120"
          value={form.title}
          onChange={updateField}
          placeholder="Short issue summary"
          required
        />
      </label>

      <label>
        <span>Description</span>
        <textarea
          name="description"
          minLength="10"
          maxLength="2000"
          value={form.description}
          onChange={updateField}
          placeholder="What happened, impact, and expected result"
          required
        />
      </label>

      <label>
        <span>Contact information</span>
        <input
          name="contactInformation"
          minLength="3"
          maxLength="160"
          value={form.contactInformation}
          onChange={updateField}
          placeholder="Email, phone, Slack, or department"
          required
        />
      </label>

      {isEdit ? (
        <label>
          <span>Status</span>
          <select name="status" value={form.status} onChange={updateField}>
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="form-actions">
        {onCancel ? (
          <button className="button button--ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="button button--primary" type="submit" disabled={isSaving}>
          {isEdit ? <Save size={18} /> : <PlusCircle size={18} />}
          {isSaving ? "Saving" : isEdit ? "Save changes" : "Create ticket"}
        </button>
      </div>
    </form>
  );
}
