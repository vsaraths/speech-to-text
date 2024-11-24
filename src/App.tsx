import React from 'react';
import { Headphones, Mic, Clock, Users, FileText, Download, ChevronRight, Wand2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import TranscriptionForm from './components/TranscriptionForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff1d58] via-[#f75990] to-[#0049B7]">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Headphones className="w-12 h-12 text-[#ff1d58]" />
            <h1 className="text-5xl font-bold text-[#0049B7] ml-4">VoiceScribe</h1>
          </div>
          <p className="text-2xl text-[#f75990] mb-12 max-w-2xl mx-auto font-medium">
            Transform your audio into accurate text with our powerful AI-driven transcription service
          </p>
          <button 
            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#0049B7] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#00DDFF] transition-colors duration-300 flex items-center mx-auto group"
          >
            Start Transcribing
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Powerful Features for Perfect Transcription
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-[#ff1d58]" />}
              title="High Accuracy"
              description="Advanced AI models ensure precise transcription across multiple accents and languages"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-[#ff1d58]" />}
              title="Timestamps"
              description="Automatic timestamping for easy navigation through your transcribed content"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-[#ff1d58]" />}
              title="Speaker Detection"
              description="Intelligent speaker identification for multi-person recordings"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-[#ff1d58]" />}
              title="Multiple Formats"
              description="Support for WAV, MP3, and M4A audio file formats"
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-[#ff1d58]" />}
              title="Easy Export"
              description="Download your transcriptions in various formats for seamless integration"
            />
            <FeatureCard
              icon={<Wand2 className="w-8 h-8 text-[#ff1d58]" />}
              title="AI-Powered"
              description="State-of-the-art machine learning for continuous improvement"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20">
        <div className="container mx-auto px-6">
          <TranscriptionForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0049B7] text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0 hover:scale-105 transition-transform">
              <Headphones className="w-8 h-8 text-[#fff685]" />
              <span className="ml-2 text-xl font-bold">VoiceScribe</span>
            </div>
            <div className="text-[#00DDFF] hover:text-[#fff685] transition-colors">
              © {new Date().getFullYear()} VoiceScribe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#fff685]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#0049B7] mb-3">{title}</h3>
      <p className="text-[#f75990]">{description}</p>
    </div>
  );
}

export default App;