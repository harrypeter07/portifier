"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, MessageSquare, Copy, Check } from "lucide-react";

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
    href: "https://www.linkedin.com/in/hassanmansurii/",
    color: "hover:bg-blue-600",
    delay: 0.2
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/hassan._mansuri",
    color: "hover:bg-pink-600",
    delay: 0.3
  },
  {
    name: "Email",
    icon: Mail,
    href: "hassanmansuri570@gmail.com",
    color: "hover:bg-green-600",
    delay: 0.4,
    showEmail: true
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

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
    } else if (link.showEmail) {
      e.preventDefault();
      // Show email modal
      setShowEmailModal(true);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hassanmansuri570@gmail.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
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
                  href={link.showEmail ? '#' : link.href}
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
                  title={link.showEmail ? link.href : link.name}
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

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute right-16 bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg min-w-[200px]"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                hassanmansuri570@gmail.com
              </span>
              <button
                onClick={copyEmail}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title={emailCopied ? "Copied!" : "Copy email"}
              >
                {emailCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-0 h-0 border-l-4 border-l-white/95 dark:border-l-gray-900/95 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmailModal(false)}
        />
      )}

      {/* Contribution Message removed as requested */}
    </div>
  );
}
