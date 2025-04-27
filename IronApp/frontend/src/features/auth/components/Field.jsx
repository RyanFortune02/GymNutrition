/*
Field component
It is used to render a single field in the form
The component is used by the Step component
*/

export default function Field({ config, value, onChange, inputRef }) {
  const { type, name, label, required, options } = config;
  const handle = (val) => onChange(name, val);

  switch (type) {
    case "text":
    case "email":
    case "number":
    case "password":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}{required && " *"}</label>
          <input
            ref={inputRef}
            type={type}
            value={value || ""}
            onChange={(e) => handle(e.target.value)}
            className="w-full p-2 border rounded"
            required={required}
          />
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}{required && " *"}</label>
          <select
            ref={inputRef}
            value={value || ""}
            onChange={(e) => handle(e.target.value)}
            className="w-full p-2 border rounded"
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case "checkboxGroup":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}</label>
          <div className="flex flex-wrap gap-3">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={value?.includes(opt.value) || false}
                  onChange={() => {
                    const arr = value || [];
                    const next = arr.includes(opt.value)
                      ? arr.filter((v) => v !== opt.value)
                      : [...arr, opt.value];
                    handle(next);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
