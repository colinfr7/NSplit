
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Button from '@/components/Button';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* How It Works Section */}
        <section id="howitworks" className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How NSplit Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Splitting expenses with friends has never been easier.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {/* Steps */}
              <div className="space-y-8 md:space-y-12">
                {[
                  {
                    number: '01',
                    title: 'Create an event or trip',
                    description: 'Start by creating a new event and invite your friends to join using their email or phone number.'
                  },
                  {
                    number: '02',
                    title: 'Log expenses as they happen',
                    description: 'Instantly add expenses with details on who paid and how it should be split among participants.'
                  },
                  {
                    number: '03',
                    title: 'View balances in real-time',
                    description: 'See exactly who owes what to whom with our smart balance calculation that minimizes transactions.'
                  },
                  {
                    number: '04',
                    title: 'Settle up with a tap',
                    description: 'Easily settle debts through your preferred payment method or mark them as settled manually.'
                  }
                ].map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-nsplit-100 text-nsplit-700 font-semibold">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA after steps */}
              <div className="mt-12 text-center">
                <Button>Try It Now</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16 md:py-24">
          <div className="container-content">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About NSplit</h2>
              <p className="text-gray-600 mb-8">
                NSplit was created to solve the awkward money conversations between friends. We wanted to build a tool that makes expense sharing simple, fair, and stress-free.
              </p>
              <p className="text-gray-600 mb-6">
                Our mission is to help people focus on enjoying their time together, not splitting bills. Whether you're roommates, traveling with friends, or planning group events, NSplit makes the financial part effortless.
              </p>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-nsplit-50 text-nsplit-700 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Coming soon to app stores
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container-content">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-nsplit-700 to-nsplit-500 bg-clip-text text-transparent">
                NSplit
              </span>
              <p className="text-gray-500 text-sm mt-2">© {new Date().getFullYear()} NSplit. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-nsplit-600 transition-colors">
                Features
              </a>
              <a href="#howitworks" className="text-sm text-gray-600 hover:text-nsplit-600 transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-sm text-gray-600 hover:text-nsplit-600 transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-nsplit-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-nsplit-600 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
