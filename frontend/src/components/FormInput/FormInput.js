/**
 * Form Input Component
 * 
 * Reusable form input component supporting multiple input types:
 * - text
 * - textarea
 * - select
 * - date
 * 
 * Features: error handling, validation, accessibility
 */

import React from 'react';
import './FormInput.css';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 3,
  ...otherProps
}) => {
  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  /**
   * Render input based on type
   */
  const renderInput = () => {
    const inputId = `input-${name}`;
    const inputClasses = `form-input ${error ? 'form-input-error' : ''}`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            className={inputClasses}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...otherProps}
          />
        );

      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            className={inputClasses}
            value={value}
            onChange={handleChange}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...otherProps}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            id={inputId}
            name={name}
            type={type}
            className={inputClasses}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...otherProps}
          />
        );
    }
  };

  return (
    <div className="form-input-group">
      <label htmlFor={`input-${name}`} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      {renderInput()}
      {error && (
        <span id={`input-${name}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;

