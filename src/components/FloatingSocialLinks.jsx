"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, MessageSquare } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/harrypeter07",
    color: "hover:bg-gray-800",
    delay: 0.1
  },
  {
    name: "LinkedIn", 
    icon: Linkedin,
    href: "https://linkedin.com/in/harrypeter07",
    color: "hover:bg-blue-600",
    delay: 0.2
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/harrypeter07",
    color: "hover:bg-pink-600",
    delay: 0.3
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:contact@portifier.com?subject=Contact Request",
    color: "hover:bg-green-600",
    delay: 0.4
  },
  {
    name: "Contact",
    icon: MessageSquare,
    href: "#contact",
    color: "hover:bg-purple-600",
    delay: 0.5,
    onClick: true
  }
];

export default function FloatingSocialLinks() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleContactClick = (e, link) => {
    if (link.onClick) {
      e.preventDefault();
      // Scroll to contact section or open contact modal
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll to top for contact form
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-3"
          >
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleContactClick(e, link)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: link.delay }}
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full 
                    bg-white/10 backdrop-blur-xl border border-white/20 
                    text-white transition-all duration-300 transform
                    hover:scale-110 hover:shadow-lg ${link.color}
                  `}
                  title={link.name}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full 
          bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
          text-white shadow-lg transition-all duration-300 transform
          hover:scale-110 hover:shadow-xl
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        title={isExpanded ? "Close social links" : "Open social links"}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isExpanded ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Contribution Message removed as requested */}
    </div>
  );
}
