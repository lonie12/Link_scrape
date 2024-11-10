import { PropsWithChildren } from "react";

export default function Button({
  children,
  ...rest
}: PropsWithChildren & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-3 py-2 rounded-md flex items-center justify-center gap-2 text-sm"
      {...rest}
    >
      {children}
    </button>
  );
}
