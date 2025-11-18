
import React, { useState } from 'react';
import { Copy, Link, Smartphone } from 'lucide-react';
import { t } from '../lib/constants';
import { Lang } from '../lib/types';

interface RemoteConnectionProps {
  lang: Lang;
  peerId: string;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  isHost: boolean;
  onHost: () => void;
  onJoin: (id: string) => void;
}

export const RemoteConnection: React.FC<RemoteConnectionProps> = ({
  lang, peerId, connectionStatus, isHost, onHost, onJoin
}) => {
  const [inputRemoteId, setInputRemoteId] = useState('');
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');
  const text = t(lang);

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
  };

  if (connectionStatus === 'connected') return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 w-full max-w-[600px] border border-stone-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-stone-800">
        <Smartphone size={24} />
        {text.modeOnline}
      </h3>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-stone-200 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('host')}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'host' ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
        >
          {text.createRoom}
        </button>
        <button 
          onClick={() => setActiveTab('join')}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'join' ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
        >
          {text.joinRoom}
        </button>
      </div>

      {activeTab === 'host' ? (
        <div className="space-y-4">
          {!peerId ? (
            <button 
              onClick={onHost}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-bold transition-colors"
            >
              {text.createRoom}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-stone-600 text-sm">{text.waiting}</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-stone-100 p-3 rounded-lg font-mono text-lg border border-stone-300 flex items-center justify-center select-all">
                  {peerId}
                </div>
                <button onClick={copyId} className="p-3 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors" title={text.copy}>
                  <Copy size={20} />
                </button>
              </div>
              <p className="text-xs text-stone-500 text-center">Share this ID with your friend</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{text.enterRoomId}</label>
            <input 
              type="text" 
              value={inputRemoteId}
              onChange={(e) => setInputRemoteId(e.target.value)}
              className="w-full p-3 bg-stone-100 border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="e.g. 1234-abcd..."
            />
          </div>
          <button 
            onClick={() => onJoin(inputRemoteId)}
            disabled={!inputRemoteId}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Link size={18} />
            {text.connect}
          </button>
        </div>
      )}
    </div>
  );
};
