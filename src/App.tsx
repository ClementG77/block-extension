import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { BlockedSite, BlockedWord } from './types';

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [blockedWords, setBlockedWords] = useState<BlockedWord[]>([]);
  const [newSite, setNewSite] = useState('');
  const [newWord, setNewWord] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState<{ type: 'site' | 'word', value: string } | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(['blockedSites', 'blockedWords'], (result) => {
      setBlockedSites(result.blockedSites || []);
      setBlockedWords(result.blockedWords || []);
    });
  }, []);

  const showConfirmDialog = (type: 'site' | 'word', value: string) => {
    setItemToConfirm({ type, value });
    setShowConfirm(true);
  };

  const confirmAdd = () => {
    if (itemToConfirm) {
      if (itemToConfirm.type === 'site') {
        addSite(itemToConfirm.value);
      } else {
        addWord(itemToConfirm.value);
      }
    }
    setShowConfirm(false);
    setItemToConfirm(null);
  };

  const addSite = (site: string) => {
    const updatedSites = [...blockedSites, { id: Date.now().toString(), url: site }];
    setBlockedSites(updatedSites);
    chrome.storage.sync.set({ blockedSites: updatedSites });
    setNewSite('');
  };

  const addWord = (word: string) => {
    const updatedWords = [...blockedWords, { id: Date.now().toString(), word: word }];
    setBlockedWords(updatedWords);
    chrome.storage.sync.set({ blockedWords: updatedWords });
    setNewWord('');
  };

  return (
    <div className="w-96 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Website Blocker</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Blocked Sites</h2>
        <div className="flex mb-2">
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            placeholder="Enter website URL"
            className="flex-grow p-2 border rounded-l"
          />
          <button 
            onClick={() => showConfirmDialog('site', newSite)} 
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={!newSite}
          >
            <PlusCircle size={24} />
          </button>
        </div>
        <ul>
          {blockedSites.map((site) => (
            <li key={site.id} className="flex justify-between items-center mb-1">
              <span>{site.url}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Blocked Words</h2>
        <div className="flex mb-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter word to block"
            className="flex-grow p-2 border rounded-l"
          />
          <button 
            onClick={() => showConfirmDialog('word', newWord)} 
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={!newWord}
          >
            <PlusCircle size={24} />
          </button>
        </div>
        <ul>
          {blockedWords.map((word) => (
            <li key={word.id} className="flex justify-between items-center mb-1">
              <span>{word.word}</span>
            </li>
          ))}
        </ul>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-4 text-yellow-600">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirmation</h3>
            </div>
            <p className="mb-4">
              Are you sure you want to permanently block "{itemToConfirm?.value}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowConfirm(false)} 
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAdd} 
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;