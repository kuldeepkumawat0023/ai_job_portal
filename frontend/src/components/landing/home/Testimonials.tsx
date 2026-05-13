"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Testimonials = () => {
  const testimonials = [
    {
      text: '"The AI interview prep was a game changer. I felt so much more confident after 5 rounds with the bot."',
      author: 'Sarah Jenkins',
      role: 'Product Manager @ Google',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6bcAtG4R97Z2Wk4VGpO44IIBEoHQkVPX-ZdEHPksRt_Rv71QCxjaNqZge0ZY7cMR4AVeWjkH0TFBG7L0Z2yQ3Oa7ZVERtW5Ca5BtM97R2_TYd_xdJFWIhmJ5x_RFqT1omRZUzXaP5-8YYW34rEXAIbtmF_oKrEgf8iHZlLuGrtJfSc3vFdkHXqU-F6wmM22dMLkrxNFNhdraSSRAoLygcgXKPARVBzJBsozAlYdyjH32IFTy-gERcqNANiUBAfFqKd-3VBYpk0GE',
      color: 'primary'
    },
    {
      text: '"My match rate went from 10% to 80% after using the Resume Optimization tool. Truly precision hiring."',
      author: 'Marcus Chen',
      role: 'Senior Designer @ Adobe',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl7Bp2h3i2l8nXGuzXaInkt0N-nllkZByFgWDTbU7MDl7Mghg2wDTfw_tSQvoOApzeDo5Ukoa7tj7pta66X2UNTTVCYfcI3GfWjh7LT7yb7fnZ1264IpRrfoH4nlpxoDAE2LLpdFaNYnPY2d36hNTrOWojxA47--9gUHfIyHbpPjTi7ASG00dZkPBlIm1gu9XKn3IoDOZhebLc-8bgPh2iRvYUsHOUTjR_2z61qfPAb0zXTFPycrzVzaqGkCOLImnAB02qCGl6cI',
      color: 'secondary'
    },
    {
      text: '"The lifetime deal is a steal. This tool replaced three other career subscriptions for me."',
      author: 'Jason Miller',
      role: 'Engineer @ Stripe',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT1NDJXMzFqGtIOjMhFzoCCTCHWN9M6U-r0AwXVqhVIUo1brK5YI7HspS9JwVcjkx4G-wMntR1evEpy3QHxVICmr1iyeMPhCS9JJjurl4dIf4fLmjCVDrfDSiKjXud56lxzQneClHbaLADyun8RqXluKrXNNWCL8y84F-GyPLbFzw2fuBmHbEWeDolckBifGn8NaBbkZzRZMpGLs-PJsObdjV_wxSjmPTPW0Ng0-QCIl4S7p_KyDbMS6u0Cp9S857JpHBpne6mxCo',
      color: 'primary'
    }
  ];

  return (
    <section className="py-13 md:py-32 px-6 bg-surface-container-lowest overflow-hidden border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-center mb-12 md:mb-24"
        >
          Success Stories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card p-6 md:p-10 rounded-[24px] md:rounded-[32px] flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              <p className="italic text-on-surface-variant text-lg mb-8">{t.text}</p>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full border-2 overflow-hidden relative ${t.color === 'primary' ? 'border-primary/20' : 'border-secondary/20'}`}>
                  <Image 
                    src={t.image} 
                    alt={t.author}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold">{t.author}</div>
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-1">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
