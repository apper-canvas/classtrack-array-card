import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  options, 
  required = false,
  error,
  placeholder,
  className = ""
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === "select" ? (
        <Select name={name} value={value} onChange={handleChange}>
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
        />
      )}
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;