import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import './faq-tabs.css';

export const FAQ = ({ 
  title = "FAQs",
  subtitle = "Frequently Asked Questions",
  badge,
  categories,
  faqData,
  className,
  ...props 
}) => {
  const categoryKeys = categories ? Object.keys(categories) : (faqData ? Object.keys(faqData) : []);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] || '');

  return (
    <section 
      className={cn(
        "relative overflow-hidden bg-background px-4 py-16 text-foreground faq-tabs-section",
        className
      )}
      {...props}
    >
      <FAQHeader title={title} subtitle={subtitle} badge={badge} />
      {categories && Object.keys(categories).length > 1 && (
        <FAQTabs 
          categories={categories}
          selected={selectedCategory} 
          setSelected={setSelectedCategory} 
        />
      )}
      {faqData && (
        <FAQList 
          faqData={faqData}
          selected={selectedCategory} 
        />
      )}
    </section>
  );
};

const FAQHeader = ({ title, subtitle, badge }) => (
  <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-10 faq-tabs-header">
    {badge && (
      <div className="faq-tabs-badge">
        {badge}
      </div>
    )}
    {subtitle && (
      <span className="faq-tabs-subtitle">
        {subtitle}
      </span>
    )}
    <h2 className="faq-tabs-title">{title}</h2>
    <span className="faq-tabs-ambient-glow" />
  </div>
);

const FAQTabs = ({ categories, selected, setSelected }) => (
  <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-10 faq-tabs-nav">
    {Object.entries(categories).map(([key, label]) => (
      <button
        key={key}
        type="button"
        onClick={() => setSelected(key)}
        className={cn(
          "relative overflow-hidden whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 faq-tab-btn",
          selected === key
            ? "border-primary text-background active-tab font-semibold"
            : "border-border bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="relative z-10">{label}</span>
        <AnimatePresence>
          {selected === key && (
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "backOut" }}
              className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 faq-tab-indicator"
            />
          )}
        </AnimatePresence>
      </button>
    ))}
  </div>
);

const FAQList = ({ faqData, selected }) => (
  <div className="mx-auto max-w-3xl w-full relative z-10 faq-tabs-list-wrap">
    <AnimatePresence mode="wait">
      {Object.entries(faqData).map(([category, questions]) => {
        if (selected === category) {
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              {questions.map((faq, index) => (
                <FAQItem key={index} {...faq} index={index} />
              ))}
            </motion.div>
          );
        }
        return null;
      })}
    </AnimatePresence>
  </div>
);

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "rounded-xl border transition-colors faq-accordion-card",
        isOpen ? "bg-muted/50 is-open" : "bg-card"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left faq-accordion-trigger"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-base sm:text-lg font-medium transition-colors faq-accordion-q",
            isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: "45deg" },
            closed: { rotate: "0deg" },
          }}
          transition={{ duration: 0.2 }}
          className="faq-accordion-plus-wrap"
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors faq-accordion-plus",
              isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : "0px", 
          opacity: isOpen ? 1 : 0,
          marginBottom: isOpen ? "16px" : "0px" 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-5 faq-accordion-body"
      >
        <p className="text-muted-foreground faq-accordion-ans">{answer}</p>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;
