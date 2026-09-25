"use client";


import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border/80 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between py-4 text-left text-sm sm:text-base font-semibold transition-all outline-none hover:text-blue-600 dark:hover:text-blue-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer select-none",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:text-blue-600 dark:group-aria-expanded/accordion-trigger:text-blue-400"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
