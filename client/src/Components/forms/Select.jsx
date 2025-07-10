const Select = ({ label, name, options, value, onChange, required }) => (
  <div className="flex flex-col mb-4 w-full">
    <label className="mb-1 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
