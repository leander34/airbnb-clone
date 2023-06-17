"use client";
import { InputHTMLAttributes } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import classnames from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  //   type?: string;
  //   disabled?: boolean;
  formatPrice?: boolean;
  //   required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}
const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  //   disabled,
  formatPrice,
  register,
  required,
  errors,
  ...props
}) => {
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        {...register(id, { required, valueAsNumber: type === "number" })}
        placeholder=" "
        type={type}
        className={classnames(
          "peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed",
          {
            "pl-9": formatPrice,
          },
          {
            "pl-4": !formatPrice,
          },
          {
            "border-rose-500 focus:border-rose-500": errors[id],
          },
          {
            "border-neutral-300 focus:border-black": !errors[id],
          }
        )}
        {...props}
      />
      <label
        className={classnames(
          "absolute text-base duration-150 transition -translate-y-3 top-5 z-10 origin[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
          {
            "left-9": formatPrice,
          },
          {
            "left-4": !formatPrice,
          },
          {
            "text-rose-500": errors[id],
          },
          {
            "text-zinc-400": !errors[id],
          }
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
