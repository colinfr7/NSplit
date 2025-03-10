
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Plus, Share2, UserPlus } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from 'sonner';

const EventQR: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const handleCopyInviteLink = () => {
    const url = `${window.location.origin}/join-event/${eventId}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Invite link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy invite link"));
  };
  
  const handleAddTransaction = () => {
    navigate(`/event/${eventId}/add-payment`);
  };
  
  const handleAddPeopleManually = () => {
    navigate(`/event/${eventId}`);
    toast("You can add people in the event details page");
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-nsplit-600 hover:text-nsplit-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Event QR Code</h1>
        <p className="text-gray-600 mb-6">Share this QR code to invite people to your event</p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6 flex flex-col items-center">
          <div className="bg-nsplit-50 border border-nsplit-100 p-4 rounded-lg w-64 h-64 flex items-center justify-center mb-4">
            <QrCode size={200} className="text-nsplit-800" strokeWidth={1} />
          </div>
          
          <h2 className="text-lg font-semibold mb-1">Scan to join the event</h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Anyone with this QR code can join your event and view all expenses
          </p>
          
          <Button 
            onClick={handleCopyInviteLink}
            variant="outline"
            fullWidth
          >
            <Share2 size={16} className="mr-2" />
            Copy Invite Link
          </Button>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleAddTransaction}
            fullWidth
          >
            <Plus size={16} className="mr-2" />
            Add Transaction to Event
          </Button>
          
          <Button 
            onClick={handleAddPeopleManually}
            variant="outline"
            fullWidth
          >
            <UserPlus size={16} className="mr-2" />
            Add People Manually
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventQR;
