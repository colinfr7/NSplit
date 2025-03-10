import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Wallet, MessageSquare, Globe, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    walletAddress: user?.walletAddress || '',
    discordName: user?.discordName || '',
    paymentPreference: user?.paymentPreference || 'crypto',
    makeEventsPublic: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in?redirect=/settings');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: 'cash' | 'crypto') => {
    setFormData((prev) => ({ ...prev, paymentPreference: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, makeEventsPublic: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      updateUserProfile({
        displayName: formData.displayName,
        walletAddress: formData.walletAddress,
        discordName: formData.discordName,
        paymentPreference: formData.paymentPreference as 'cash' | 'crypto',
      });
      
      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <User size={18} className="mr-2 text-nsplit-600" />
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>
          
          {/* Payment Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <CreditCard size={18} className="mr-2 text-nsplit-600" />
              <h2 className="text-lg font-semibold">Payment Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Preferred Payment Method</Label>
                <RadioGroup 
                  value={formData.paymentPreference} 
                  onValueChange={handleRadioChange as (value: string) => void}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto" className="cursor-pointer">Cryptocurrency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="Your crypto wallet address"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Used for receiving crypto payments</p>
              </div>
            </div>
          </div>
          
          {/* Connected Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <MessageSquare size={18} className="mr-2 text-nsplit-600" />
              <h2 className="text-lg font-semibold">Connected Accounts</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="discordName">Discord Username</Label>
                <Input
                  id="discordName"
                  name="discordName"
                  value={formData.discordName}
                  onChange={handleChange}
                  placeholder="Your Discord username"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Used for notifications and reminders</p>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <Globe size={18} className="mr-2 text-nsplit-600" />
              <h2 className="text-lg font-semibold">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="makeEventsPublic" className="text-base">Make events public</Label>
                  <p className="text-xs text-gray-500">Allow other users to find and join your events</p>
                </div>
                <Switch
                  id="makeEventsPublic"
                  checked={formData.makeEventsPublic}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
