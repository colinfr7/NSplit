
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';

const SignUp: React.FC = () => {
  const { signInWithGoogle, isAuthenticated, isLoading, updateUserProfile, user } = useAuth();
  const navigate = useNavigate();
  const [discordName, setDiscordName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'cash' | 'crypto'>('cash');
  
  // Redirect if authenticated but profile not completed
  useEffect(() => {
    if (isAuthenticated && !isLoading && user?.discordName && user?.paymentPreference) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, user]);
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      discordName,
      walletAddress,
      paymentPreference
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Sign Up</h1>
        
        {!isAuthenticated ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <p className="text-center text-gray-600 mb-6">
              First, sign in with your Google account. Then you can complete your profile.
            </p>
            
            <Button 
              onClick={handleGoogleSignIn} 
              isLoading={isLoading}
              fullWidth
              className="mb-4"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Sign in with Google
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <p className="text-center text-gray-600 mb-6">
              Complete your profile to start using NSplit
            </p>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="discord-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Discord Username (optional)
                </label>
                <input
                  id="discord-name"
                  type="text"
                  value={discordName}
                  onChange={(e) => setDiscordName(e.target.value)}
                  placeholder="e.g. username#1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Crypto Wallet Address (optional)
                </label>
                <input
                  id="wallet-address"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="e.g. 0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Payment Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment-preference"
                      value="cash"
                      checked={paymentPreference === 'cash'}
                      onChange={() => setPaymentPreference('cash')}
                      className="mr-2 focus:ring-nsplit-500 focus:border-nsplit-500"
                    />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment-preference"
                      value="crypto"
                      checked={paymentPreference === 'crypto'}
                      onChange={() => setPaymentPreference('crypto')}
                      className="mr-2 focus:ring-nsplit-500 focus:border-nsplit-500"
                    />
                    Crypto
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" fullWidth>
                  Complete Profile
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
