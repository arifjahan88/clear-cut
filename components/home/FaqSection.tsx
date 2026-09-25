"use client";


import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FAQ_ITEMS } from "@/lib/constants";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-muted/50 text-xs font-semibold text-indigo-600 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything you need to know about in-browser background removal.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-3xl border border-border/80 bg-card px-6 py-2 shadow-xs">
          <Accordion defaultValue={["faq-1"]} className="w-full">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="py-1">
                <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </motion.div>
    </section>
  );
}
