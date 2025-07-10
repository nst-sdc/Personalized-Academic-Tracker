const Input = ({ label, name, type = "text", value, onChange, required }) => (
  <div className="flex flex-col mb-4 w-full">
    <label className="mb-1 text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
    />
  </div>
);

export default Input;
