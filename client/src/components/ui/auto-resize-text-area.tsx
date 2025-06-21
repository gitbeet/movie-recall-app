import * as React from "react";
import { cn } from "@/lib/utils";

interface AutoResizeTextAreaProps extends React.ComponentProps<"textarea"> {
  maxHeight?: number;
}

function AutoResizeTextArea({
  maxHeight = 150,
  ...props
}: AutoResizeTextAreaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${
      ref.current.scrollHeight > maxHeight
        ? maxHeight
        : ref.current.scrollHeight
    }px`;
  }

  React.useEffect(adjustHeight, [props.value, maxHeight]);

  return (
    <Textarea
      ref={ref}
      {...props}
      className={`resize-none ${props.className ?? ""}`}
    />
  );
}

function Textarea({
  className,
  rows = 1,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content  w-full rounded-md border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export { Textarea, AutoResizeTextArea };
