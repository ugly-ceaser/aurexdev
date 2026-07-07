'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What is Aurex Capital and how does it work?',
      answer: 'Aurex Capital is a state-of-the-art quantitative investment platform utilizing advanced neural asset algorithms. Our systems run 24/7 scanning order flows and executing high-performance arbitrage trades and liquidity optimization setups to capture consistent yield.',
    },
    {
      question: 'How do I start earning passive income?',
      answer: 'Getting started is simple. Register for a free account, complete your security setup, select one of our curated yield allocation pools matching your risk profile, and deploy your capital to start earning daily accrued ROI.',
    },
    {
      question: 'What are the minimum and maximum deposit limits?',
      answer: 'The minimum deposit is $100 for the Starter Plan. Yield pools have specific principal range parameters (e.g., Starter: $100 - $2,999; Gold: $3,000 - $9,999; Zenith: $10,000+). There is no hard maximum limit on our corporate enterprise tiers.',
    },
    {
      question: 'Is my capital secured?',
      answer: 'Yes, capital preservation is our top priority. We use vault insurance frameworks, hedge funds, multi-signature institutional cold wallets, and audited ledger databases to protect your principal capital from systemic risks.',
    },
    {
      question: 'Can I withdraw my profits at any time?',
      answer: 'Daily accrued yields are credited directly to your ledger every morning. You can withdraw your accrued interest balances at any time, while your initial deployed capital is fully unlocked and returnable at the end of the pool lockup term.',
    },
    {
      question: 'How does the AI trading engine achieve high accuracy?',
      answer: 'Our deep learning models analyze 200+ historical and real-time market signals simultaneously across global exchange matrices. This allows our quantitative algorithms to execute trades with sub-millisecond precision and pre-calculated safety guardrails.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 text-left">
      {faqs.map((faq, idx) => {
        const isOpen = activeIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-md border border-gray-250/20 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 font-syne font-bold text-gray-900 hover:text-[#7c3aed] transition-colors text-base"
            >
              <span>{faq.question}</span>
              <div className="h-6 w-6 rounded-full bg-[#f0eee9] flex items-center justify-center shrink-0 text-gray-500">
                {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-60 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 py-5 text-sm font-light text-gray-500 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
