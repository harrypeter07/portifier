"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Zap, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  Rocket,
  Globe,
  Code,
  FileText,
  Download,
  Eye,
  Heart
} from "lucide-react";
import ShockwaveScene from "@/components/ShockWave";

export default function Home() {
  return (
    <div className="min-h-screen grainy-bg page-container">
      {/* Hero Section */}
      <section className="flex overflow-hidden relative justify-center items-center min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border backdrop-blur-xl bg-white/10 border-white/20 text-white/90"
            >
              <Sparkles className="mr-2 w-4 h-4" />
              AI-Powered Portfolio Builder
            </motion.div>
            
            <h1 className="text-6xl font-bold leading-tight text-white md:text-8xl lg:text-9xl font-epilogue">
              Create Stunning
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700">
                Portfolios
              </span>
              in Minutes
            </h1>
            
            <p className="mx-auto max-w-3xl text-2xl leading-relaxed md:text-3xl lg:text-4xl text-white/90 font-epilogue">
              Transform your resume into a beautiful, professional portfolio with our AI-powered builder. 
              No design skills required.
            </p>
            
            <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
              <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold text-black bg-white hover:bg-white/90">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg text-white border-white/30 bg-white/20 hover:bg-white/30 hover:text-white">
                <Link href="/templates-demo">
                  <Eye className="mr-2 w-5 h-5" />
                  View Templates
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-10 top-20 w-16 h-16 bg-gradient-to-br rounded-full blur-xl from-blue-400/20 to-purple-400/20"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-20 top-40 w-24 h-24 bg-gradient-to-br rounded-full blur-xl from-pink-400/20 to-orange-400/20"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-20 bottom-40 w-20 h-20 bg-gradient-to-br rounded-full blur-xl from-green-400/20 to-blue-400/20"
        />
      </section>

      {/* About Our App Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white md:text-5xl">
                  We Create Amazing
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    Portfolios
                  </span>
                </h2>
                <p className="text-xl leading-relaxed text-white/80">
                  Our AI-powered platform transforms your resume into stunning, professional portfolios 
                  that showcase your skills and achievements. No design experience required - just upload, 
                  customize, and publish.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white/90">AI-powered resume parsing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white/90">50+ professional templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white/90">Mobile-responsive design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white/90">One-click publishing</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold text-black bg-white hover:bg-white/90">
                  <Link href="/auth/signup">
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg text-white border-white/30 hover:bg-white/10">
                  <Link href="/templates-demo">
                    <Eye className="mr-2 w-5 h-5" />
                    See Examples
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Right Side - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl glass">
                <img
                  src="/hero.jpg"
                  alt="Portfolio Creation Process"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-white/70">Portfolios Created</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -top-6 -right-6 p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/70">Templates</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Showcase Component
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Discover the amazing interactive 3D components available for your portfolio website
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="overflow-hidden relative rounded-2xl shadow-2xl glass"
          >
            <div className="h-[600px] w-full flex items-center justify-center">
              <ShockwaveScene />
            </div>
            <div className="absolute top-4 left-4 px-3 py-2 rounded-lg backdrop-blur-sm bg-black/50">
              <p className="text-sm text-white">
                ✨ Interactive 3D Component • Double-click to create shockwaves
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Why Choose Our Platform?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Everything you need to create a professional portfolio that stands out
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered",
                description: "Our AI analyzes your resume and automatically creates a stunning portfolio layout",
                color: "from-yellow-400 to-orange-400"
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Beautiful Templates",
                description: "Choose from dozens of professionally designed templates that match your style",
                color: "from-pink-400 to-purple-400"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "No Coding Required",
                description: "Drag, drop, and customize. No technical skills needed to create amazing portfolios",
                color: "from-blue-400 to-cyan-400"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Private",
                description: "Your data is encrypted and secure. Control who can see your portfolio",
                color: "from-green-400 to-emerald-400"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Mobile Responsive",
                description: "Your portfolio looks perfect on all devices - desktop, tablet, and mobile",
                color: "from-indigo-400 to-blue-400"
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Optimized for speed. Your portfolio loads instantly anywhere in the world",
                color: "from-red-400 to-pink-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full transition-all duration-300 glass-glow hover:bg-white/15">
                  <CardContent className="p-8 text-center glass-glow">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r glass ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="leading-relaxed text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Create your professional portfolio in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload Your Resume",
                description: "Upload your PDF resume and our AI will extract all your information automatically",
                icon: <FileText className="w-12 h-12" />
              },
              {
                step: "02",
                title: "Choose Your Template",
                description: "Browse our collection of beautiful templates and pick the one that matches your style",
                icon: <Palette className="w-12 h-12" />
              },
              {
                step: "03",
                title: "Publish & Share",
                description: "Customize your portfolio, preview it, and publish it with a single click",
                icon: <Rocket className="w-12 h-12" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full transition-all duration-300 glass-glow hover:bg-white/15">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="inline-flex p-6 mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full">
                        {step.icon}
                      </div>
                      <div className="flex absolute -top-2 -right-2 justify-center items-center w-8 h-8 text-sm font-bold text-black bg-white rounded-full">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">{step.title}</h3>
                    <p className="leading-relaxed text-white/70">{step.description}</p>
                  </CardContent>
                </Card>
                
                {index < 2 && (
                  <div className="hidden absolute -right-4 top-1/2 transform -translate-y-1/2 md:block">
                    <ArrowRight className="w-8 h-8 text-white/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: "10K+", label: "Portfolios Created" },
              { number: "50+", label: "Templates Available" },
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  {stat.number}
                </div>
                <div className="text-lg text-white/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-4xl text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Ready to Create Your Portfolio?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-white/70">
              Join thousands of professionals who have already created stunning portfolios with our platform
            </p>
            <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
              <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold text-black bg-white hover:bg-white/90">
                <Link href="/auth/signup">
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg text-white border-white/30 bg-white/10 hover:bg-white/20">
                <Link href="/templates-demo">
                  <Eye className="mr-2 w-5 h-5" />
                  Browse Templates
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex justify-center items-center mr-3 w-8 h-8 bg-white rounded-lg">
                <span className="text-sm font-bold text-black">P</span>
              </div>
              <span className="text-2xl font-bold text-white">Portfolio Maker</span>
            </div>
            <p className="mb-6 text-white/60">
              Create stunning portfolios with AI-powered tools
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/dashboard" className="transition-colors text-white/60 hover:text-white">
                Dashboard
              </Link>
              <Link href="/templates-demo" className="transition-colors text-white/60 hover:text-white">
                Templates
              </Link>
              <Link href="/settings" className="transition-colors text-white/60 hover:text-white">
                Settings
              </Link>
            </div>
            <div className="pt-8 mt-8 border-t border-white/20">
              <p className="text-sm text-white/40">
                © 2024 Portfolio Maker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
