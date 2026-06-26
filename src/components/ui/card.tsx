import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    />
  );
}

export { Card };
