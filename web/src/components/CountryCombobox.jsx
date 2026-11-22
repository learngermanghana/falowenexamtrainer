import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { getCountryName, getCountryOptions } from "../data/countries";

const normalizeSearch = (value) => String(value || "")
  .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Accessible, keyboard-operable local country selector. No network requests.
export default function CountryCombobox({
  id, label, locale = "en", value = "", onChange, placeholder = "Search for a country",
  inputRef, inputStyle, error = "", required = true,
}) {
  const listId = useId();
  const root = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState(() => getCountryName(value, locale));
  const [active, setActive] = useState(0);
  const options = useMemo(() => getCountryOptions(locale), [locale]);
  const results = useMemo(() => {
    const search = normalizeSearch(query);
    return options.filter(({ code, label: name }) =>
      !search || normalizeSearch(name).includes(search) || code.toLowerCase() === search
    ).slice(0, search ? 30 : 40);
  }, [query, options]);

  useEffect(() => {
    setQuery(getCountryName(value, locale));
  }, [value, locale]);
  useEffect(() => { setActive(0); }, [query]);

  const choose = (country) => {
    onChange(country.code);
    setQuery(country.label);
    setOpen(false);
  };

  const keyDown = (event) => {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive(current => (current + (event.key === "ArrowDown" ? 1 : -1) + Math.max(1, results.length)) % Math.max(1, results.length));
    }
    if (event.key === "Enter" && isOpen && results[active]) {
      event.preventDefault();
      choose(results[active]);
    }
  };

  return (
    <div ref={root} style={{ position: "relative" }}>
      <input
        type="text"
        autoComplete="off"
        role="combobox"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen && results[active] ? `${listId}-${results[active].code}` : undefined}
        aria-invalid={Boolean(error)}
        id={id}
        ref={inputRef}
        required={required}
        value={query}
        onFocus={() => setOpen(true)}
        onKeyDown={keyDown}
        onBlur={(event) => {
          if (!root.current?.contains(event.relatedTarget)) setOpen(false);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          if (value) onChange("");
          setOpen(true);
        }}
        style={inputStyle}
        placeholder={placeholder}
      />
      <input type="hidden" name="countryCode" value={value} />
      {isOpen && (
        <div id={listId} role="listbox" aria-label={label} style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30,
          background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10,
          boxShadow: "0 12px 24px rgba(15,23,42,0.16)", maxHeight: 250, overflowY: "auto",
        }}>
          {results.length ? results.map((country, index) => (
            <button
              id={`${listId}-${country.code}`}
              type="button"
              role="option"
              aria-selected={country.code === value}
              key={country.code}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(country)}
              style={{
                display: "block", textAlign: "left", width: "100%", border: 0,
                background: index === active ? "#eff6ff" : "#fff",
                padding: "9px 12px", fontSize: 15, color: "#0f172a", cursor: "pointer",
              }}
            >{country.label}</button>
          )) : (
            <p style={{ margin: 0, padding: 12, color: "#64748b" }}>No matching country. Check the spelling.</p>
          )}
        </div>
      )}
    </div>
  );
}
