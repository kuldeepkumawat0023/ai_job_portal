"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Find Jobs', href: '#', primary: true },
    { name: 'For Recruiters', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Resources', href: '#' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-background/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-outline-variant/10 dark:border-white/10 shadow-sm">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4"
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all duration-300">
              A
            </div>
            <span className="font-bold text-2xl tracking-tight text-gradient">
              AI JobFit
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center ml-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${link.primary ? 'text-primary font-semibold' : 'text-on-surface-variant dark:text-white'
                  }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          )}

          <div className="hidden md:flex gap-4 items-center">
            <Link href="/login">
              <Button variant="ghost" className="relative group px-4 py-2 hover:bg-transparent">
                <span className="relative z-10">Login</span>
                <span className="absolute bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="gradient"
                glow
                className="shadow-lg shadow-primary/20"
              >
                Join Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-on-surface-variant"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-background dark:bg-[#0B0F19] border-b border-outline-variant/10 dark:border-white/10 overflow-hidden md:hidden"
            >
              <div className="flex flex-col p-6 gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-between ${link.primary
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant dark:text-white hover:bg-surface-container dark:hover:bg-white/5'
                      }`}
                  >
                    {link.name}
                    {link.primary && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </Link>
                ))}
                <div className="h-px bg-outline-variant/10 dark:bg-white/10 my-2" />
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start px-0 text-lg font-medium text-primary">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full py-4 font-bold">Join Now</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default Navbar;
