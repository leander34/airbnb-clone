"use client";
import classnames from "classnames";
import { IconType } from "react-icons";

interface CategoryInputProps {
  onClick: (value: string) => void;
  label: string;
  selected?: boolean;
  icon: IconType;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  label,
  selected,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={classnames(
        "rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transtion cursor-pointer",
        {
          "border-black": selected,
        },
        {
          "border-neutral-200": !selected,
        }
      )}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
