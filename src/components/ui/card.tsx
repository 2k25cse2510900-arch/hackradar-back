import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-border bg-surface shadow-[0_10px_30px_rgba(31,25,48,0.06)]",
        className
      )}
      {...props}
    />
  );
}

export { Card };
