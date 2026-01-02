import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    question: 'How does AI sticker generation work?',
    answer: 'Our AI sticker generator uses advanced artificial intelligence to create unique, custom stickers based on your text prompts. Simply describe what you want, and our AI will generate a one-of-a-kind design for you!',
  },
  {
    question: 'Can I customize my stickers and keychains?',
    answer: 'Yes! We offer multiple customization options including uploading your own images, adding text overlays, choosing different shapes (circle, square, star, heart, hexagon), selecting colors, and applying filters.',
  },
  {
    question: 'What is the Premium subscription?',
    answer: 'Premium subscription (₹99) gives you access to exclusive premium stickers and keychains, faster delivery, and special discounts. Premium members also get early access to new designs!',
  },
  {
    question: 'How do I earn and use loyalty points?',
    answer: 'You earn 5 loyalty points for every ₹1 spent. Collect points to unlock rewards like free stickers, discounts, and premium access. Check the loyalty widget to see your progress and available rewards!',
  },
  {
    question: 'How many times can I use the Lucky Spin and Scratch Card?',
    answer: 'You can use the Lucky Spin Wheel 2 times per month and the Scratch Card 2 times per month. Both reset at the beginning of each calendar month!',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, debit cards, and UPI payments (Google Pay, PhonePe, Paytm). You can also scan our UPI QR code for instant payments.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Premium members enjoy quick delivery within 3-5 business days. We ship across India!',
  },
  {
    question: 'What is the Mystery Box?',
    answer: 'Mystery Boxes contain random assortments of stickers and keychains at discounted prices. It\'s a fun way to discover new designs! We offer Basic (3 items), Premium (6 items), and Mega (10 items) boxes.',
  },
  {
    question: 'Can I return or exchange products?',
    answer: 'We want you to be completely satisfied! If you receive damaged or incorrect items, contact us within 7 days for a replacement or refund. Custom and AI-generated stickers are non-returnable.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! During checkout, you can add gift wrapping for ₹30. Your order will come in a beautiful gift box with ribbon and you can include a personalized message.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">FAQ</span>
          </div>
          <h2 className="text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about StickerCraft
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => (
            <div
              key={index}
              className="glass bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            We're here to help! Follow us on Instagram for updates and support
          </p>
          <a
            href="https://instagram.com/stickercraft_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            <span>📱</span>
            Contact Us on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
