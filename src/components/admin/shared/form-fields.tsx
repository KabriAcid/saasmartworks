"use client";

import { useId, useState, type ComponentProps, type ChangeEvent } from "react";
import { CalendarDaysIcon, CurrencyDollarIcon, DocumentTextIcon, EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FieldProps = { fieldLabel: string };
function clean(value: string, multiline: boolean) {
  return value.normalize("NFC").replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
}
function useField(label: string) {
  const id = useId();
  const [error, setError] = useState("");
  function validate(control: Control) {
    control.setCustomValidity("");
    const value = control.value.trim();
    let message = control.required && !value ? `${label} is required.` : "";
    if (value && /phone/i.test(label) && !/^\+?[\d\s().-]{7,25}$/.test(value)) message = "Enter a valid phone number.";
    if (value && /slug/i.test(label) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) message = "Use lowercase letters, numbers, and single hyphens.";
    if (value && control instanceof HTMLInputElement && control.type === "number" && !Number.isSafeInteger(Number(value))) message = "Enter a whole number within the supported range.";
    control.setCustomValidity(message);
    setError(message || control.validationMessage);
    if (control instanceof HTMLInputElement && control.type === "date" && control.form) {
      const dates = Array.from(control.form.querySelectorAll<HTMLInputElement>('input[type="date"]'));
      if (dates.length === 2) {
        const [start, end] = dates;
        end.setCustomValidity(start.value && end.value && end.value < start.value ? "End date must be on or after the start date." : "");
      }
    }
  }
  return { id, error, validate };
}

export function AdminFieldIcon({ fieldLabel: label }: FieldProps) {
  const Icon = /email/i.test(label) ? EnvelopeIcon : /phone/i.test(label) ? PhoneIcon : /date/i.test(label) ? CalendarDaysIcon : /amount|total|price/i.test(label) ? CurrencyDollarIcon : /name|client|manager|owner|assignee|facilitator/i.test(label) ? UserIcon : DocumentTextIcon;
  return <Icon aria-hidden="true" className="admin-field-label-icon" />;
}

export function AdminInput({ fieldLabel, onChange, onBlur, ...props }: ComponentProps<"input"> & FieldProps) {
  const { id, error, validate } = useField(fieldLabel);
  const type = props.type ?? (/email/i.test(fieldLabel) ? "email" : /phone/i.test(fieldLabel) ? "tel" : "text");
  if (type === "checkbox" || type === "radio") return <input {...props} type={type} onChange={onChange} onBlur={onBlur} />;
  function change(event: ChangeEvent<HTMLInputElement>) {
    event.target.value = clean(event.target.value, false);
    onChange?.(event);
    validate(event.target);
  }
  return <span className="admin-field-control"><span className="admin-field-input"><input {...props} type={type} id={props.id ?? id} maxLength={props.maxLength ?? 250} step={type === "number" ? props.step ?? 1 : props.step} placeholder={props.placeholder ?? (/email/i.test(fieldLabel) ? "you@example.com" : `Enter ${fieldLabel.toLowerCase()}`)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : props["aria-describedby"]} onChange={change} onInvalid={event => validate(event.currentTarget)} onBlur={event => { event.target.value = clean(event.target.value, false).trim(); onChange?.(event as unknown as ChangeEvent<HTMLInputElement>); validate(event.target); onBlur?.(event); }} /></span>{error && <span id={`${id}-error`} className="admin-field-error" role="alert">{error}</span>}</span>;
}

export function AdminTextarea({ fieldLabel, onChange, onBlur, ...props }: ComponentProps<"textarea"> & FieldProps) {
  const { id, error, validate } = useField(fieldLabel);
  return <span className="admin-field-control"><span className="admin-field-input"><textarea {...props} id={props.id ?? id} maxLength={props.maxLength ?? 10000} placeholder={props.placeholder ?? `Enter ${fieldLabel.toLowerCase()}`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : props["aria-describedby"]} onChange={event => { event.target.value = clean(event.target.value, true); onChange?.(event); validate(event.target); }} onInvalid={event => validate(event.currentTarget)} onBlur={event => { event.target.value = clean(event.target.value, true).trim(); onChange?.(event as unknown as ChangeEvent<HTMLTextAreaElement>); validate(event.target); onBlur?.(event); }} /></span>{error && <span id={`${id}-error`} className="admin-field-error" role="alert">{error}</span>}</span>;
}

export function AdminSelect({ fieldLabel, onChange, ...props }: ComponentProps<"select"> & FieldProps) {
  const { id, error, validate } = useField(fieldLabel);
  return <span className="admin-field-control"><span className="admin-field-input"><select {...props} id={props.id ?? id} aria-invalid={!!error} onChange={event => { onChange?.(event); validate(event.target); }} onInvalid={event => validate(event.currentTarget)} /></span>{error && <span className="admin-field-error" role="alert">{error}</span>}</span>;
}
