"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  value: string | null;
  onToggle: (value: string) => void;
  type: "single" | "multiple";
}>({ value: null, onToggle: () => {}, type: "single" });

interface AccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
}

function Accordion({ type = "single", className, children }: AccordionProps) {
  const [value, setValue] = React.useState<string | null>(null);

  const onToggle = (itemValue: string) => {
    setValue((prev) => (prev === itemValue ? null : itemValue));
  };

  return (
    <AccordionContext.Provider value={{ value, onToggle, type }}>
      <div className={cn("divide-y divide-border", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean }>({
  value: "",
  isOpen: false,
});

function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { value: activeValue } = React.useContext(AccordionContext);
  const isOpen = activeValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn("py-1", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { onToggle } = React.useContext(AccordionContext);
  const { value, isOpen } = React.useContext(AccordionItemContext);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => onToggle(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[aria-expanded=true]>svg]:rotate-180",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

function AccordionContent({ className, children }: AccordionContentProps) {
  const { isOpen } = React.useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn("pb-4 pt-0 text-muted-foreground", className)}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
