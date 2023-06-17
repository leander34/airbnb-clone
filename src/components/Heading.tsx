"use client";
import classnames from "classnames";
interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}
const Heading: React.FC<HeadingProps> = ({ title, center, subtitle }) => {
  return (
    <header
      className={classnames(
        { "text-center": center },
        {
          "text-start": !center,
        }
      )}
    >
      <div className="text-2xl font-bold">{title}</div>
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
    </header>
  );
};

export default Heading;
