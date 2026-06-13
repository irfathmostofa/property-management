// components/ui/Input.jsx
import { cn } from "../../lib/utils";

export function Input({
  label,
  error,
  hint,
  icon: IconComponent,  // Rename to IconComponent to avoid confusion
  className,
  required,
  ...props
}) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <div className="field-wrap">
        {IconComponent && (
          <span className="field-icon">
            {typeof IconComponent === 'function' ? <IconComponent size={16} /> : IconComponent}
          </span>
        )}
        <input
          className={cn(
            "field-input",
            IconComponent && "field-input--icon",
            error && "field-input--error",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      {hint && !error && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  children,
  required,
  className,
  icon: IconComponent,
  ...props
}) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <div className="field-wrap">
        {IconComponent && (
          <span className="field-icon">
            {typeof IconComponent === 'function' ? <IconComponent size={16} /> : IconComponent}
          </span>
        )}
        <select
          className={cn(
            "field-input field-select",
            IconComponent && "field-input--icon",
            error && "field-input--error",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <p className="field-error">{error}</p>}
      {hint && !error && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className,
  icon: IconComponent,
  ...props
}) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <div className="field-wrap">
        {IconComponent && (
          <span className="field-icon">
            {typeof IconComponent === 'function' ? <IconComponent size={16} /> : IconComponent}
          </span>
        )}
        <textarea
          className={cn(
            "field-input field-textarea",
            IconComponent && "field-input--icon",
            error && "field-input--error",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      {hint && !error && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="checkbox-label">
      <input type="checkbox" className="checkbox-input" {...props} />
      <span className="checkbox-text">{label}</span>
    </label>
  );
}