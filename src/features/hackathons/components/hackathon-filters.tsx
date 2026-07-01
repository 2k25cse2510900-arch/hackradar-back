"use client";

import { Filter, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { defaultHackathonFilters, hackathonFilterOptions, type HackathonFilterKey, type HackathonFilters } from "../types";
import { formatFilterCount } from "../utils";

type HackathonFiltersProps = {
  filters: HackathonFilters;
  onChange: (filters: HackathonFilters) => void;
};

const sections: Array<{ key: HackathonFilterKey; label: string }> = [
  { key: "modes", label: "Mode" },
  { key: "statuses", label: "Status" },
  { key: "domains", label: "Domain" },
  { key: "difficulties", label: "Difficulty" },
  { key: "registrations", label: "Registration" },
  { key: "prizeBands", label: "Prize Pool" },
];

export function HackathonFilters({ filters, onChange }: HackathonFiltersProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onClickAway = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    window.addEventListener("mousedown", onClickAway);

    return () => {
      window.removeEventListener("keydown", onEscape);
      window.removeEventListener("mousedown", onClickAway);
    };
  }, []);

  const activeCount = formatFilterCount(filters);

  const toggleValue = (key: HackathonFilterKey, value: string) => {
    const currentValues = filters[key];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    onChange({ ...filters, [key]: nextValues });
  };

  return (
    <div ref={panelRef} className="relative">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full justify-between rounded-2xl px-4 sm:w-auto sm:min-w-40"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="size-4" />
            Filters
          </span>
          {activeCount > 0 ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </div>

      {open ? (
        <div className="absolute right-0 z-30 mt-3 w-full overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:w-[36rem]">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Filters</h3>
              <p className="text-sm text-muted-foreground">Refine hackathon discovery instantly.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close filters"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {sections.map((section) => {
              const options = hackathonFilterOptions[section.key];

              return (
                <div key={section.key} className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">{section.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => {
                      const isActive = filters[section.key].includes(option);

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleValue(section.key, option)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            isActive
                              ? "border-primary-border bg-primary-soft text-primary dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
                              : "border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => onChange(defaultHackathonFilters)}
            >
              <RotateCcw className="size-4" />
              Reset Filters
            </Button>
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => setOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
