'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'

interface FAQ {
  id: number
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I access my digital product after purchase?",
    answer: "Once your payment is confirmed, you'll receive an instant email with a secure download link. You can also access your purchase from your account dashboard at any time. The download link remains active, so you can re-download the product whenever needed."
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, UPI, net banking, and digital wallets through our secure payment gateway. All transactions are encrypted and processed through industry-standard security protocols to ensure your financial information is protected."
  },
  {
    id: 3,
    question: "Is there a refund policy?",
    answer: "Yes! We offer a 7-day money-back guarantee. If you're not completely satisfied with your purchase, contact our support team within 7 days for a full refund—no questions asked. Your satisfaction is our priority."
  },
  {
    id: 4,
    question: "Can I share this digital product with others?",
    answer: "Our digital products are licensed for individual use only. Sharing, distributing, or reselling the content is prohibited and violates our terms of service. If you need multiple licenses for a team or organization, please contact us for volume pricing options."
  },
  {
    id: 5,
    question: "What format will I receive the product in?",
    answer: "Most of our digital products are delivered in PDF format, which is universally compatible with all devices and platforms. Some products may include additional formats or supplementary materials. Check the product details section above for specific format information."
  },
  {
    id: 6,
    question: "Do you offer customer support?",
    answer: "Absolutely! Our dedicated support team is available 24/7 to assist you with any questions or technical issues. You can reach us via email, live chat, or through our contact form. We typically respond within a few hours and are committed to resolving any concerns promptly."
  },
  {
    id: 7,
    question: "Will I receive updates if the product is revised?",
    answer: "Yes, if we make significant updates or revisions to a product you've purchased, you'll receive the updated version free of charge. We'll notify you via email when updates are available, and you can download the latest version from your account dashboard."
  }
]

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our digital products, purchase process, and support
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-4 md:p-6 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                aria-expanded={openId === faq.id}
              >
                <span className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </span>
                <ChevronDown
                  className={`h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-8 md:mt-12 text-center p-6 md:p-8 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Our support team is here to help you with any queries
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}
