import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Input } from "./input";
import { Label } from "./label";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  autoComplete?: string;
  error?: string;
}

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1 relative">
        <Field
          as={Input}
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className="pl-10 pr-10"
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
        <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
}
