'use client'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQSection({ items, heading }: { items: FAQItem[]; heading?: string }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-6">
        {heading || 'Frequently Asked Questions'}
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              className="w-full text-left px-5 py-4 font-semibold text-slate-900 flex justify-between items-center gap-3 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{item.question}</span>
              <svg
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                <p className="pt-3">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
