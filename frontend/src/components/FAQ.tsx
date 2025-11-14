import React from "react";
import { motion } from "framer-motion";

const faqs = [
  { question: "Is this tool free?", answer: "Yes, fully free with no signup." },
  { question: "Supported formats?", answer: "MP3, WAV, and most audio/video formats." },
  { question: "Processing time?", answer: "Usually a few seconds to a minute." },
  { question: "Download vocals & instrumentals?", answer: "Yes, both are downloadable." },
];

export default function FAQ() {
  return (
    <section id="faq" className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer text-white"
          >
            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
            <p>{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
