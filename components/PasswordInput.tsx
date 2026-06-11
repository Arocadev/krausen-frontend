"use client";

import { useState } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
};

export default function PasswordInput({ id, label, value, onChange, required = true }: Props) {
  const [ver, setVer] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-malta">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={ver ? "text" : "password"}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-linea bg-white px-4 py-2.5 pr-11 text-malta outline-none transition-colors focus:border-ambar"
        />
        <button
          type="button"
          onClick={() => setVer(!ver)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tostado/60 transition-colors hover:text-malta"
        >
          {ver ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}