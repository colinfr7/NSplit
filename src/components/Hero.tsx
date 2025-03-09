
import React from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-subtle z-[-1]" />
      <div className="absolute top-1/3 -left-64 w-96 h-96 bg-nsplit-200 rounded-full blur-3xl opacity-20 z-[-1]" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-nsplit-300 rounded-full blur-3xl opacity-20 z-[-1]" />
      
      <div className="container-content relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Overline */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-nsplit-100 text-nsplit-800 text-xs font-medium animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nsplit-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nsplit-600"></span>
            </span>
            Simplify group expenses
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up text-balance leading-tight">
            Split expenses <span className="hero-text-gradient">effortlessly</span> with friends
          </h1>
          
          {/* Subheadline */}
          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            NSplit helps you track shared expenses, calculate balances, and settle up without the math or awkward money conversations.
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create an Event
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 md:mt-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-gray-500 mb-4">Trusted by friends worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {['10k+', '99%', '4.9', '$2M+'].map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-800">{stat}</span>
                  <span className="text-xs text-gray-500">
                    {index === 0 ? 'Users' : 
                     index === 1 ? 'Satisfaction' : 
                     index === 2 ? 'App Rating' : 
                     'Expenses Split'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* App Preview (Mockup) */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="aspect-[16/9] bg-gradient-to-br from-nsplit-50 to-gray-100 p-6 flex items-center justify-center">
              <div className="text-center opacity-60">
                <svg className="mx-auto h-16 w-16 text-nsplit-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4 text-sm text-gray-500">App Dashboard Preview Coming Soon</p>
              </div>
            </div>
          </div>
          
          {/* Gradient glows under the app preview */}
          <div className="absolute -bottom-10 left-1/4 w-1/2 h-8 bg-nsplit-400 blur-2xl opacity-20 z-[-1]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
