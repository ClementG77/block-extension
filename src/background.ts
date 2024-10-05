import { BlockedSite, BlockedWord } from './types';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [], blockedWords: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.storage.sync.get(['blockedSites', 'blockedWords'], (result) => {
      const blockedSites: BlockedSite[] = result.blockedSites || [];
      const blockedWords: BlockedWord[] = result.blockedWords || [];

      const isBlocked = blockedSites.some((site) => tab.url?.includes(site.url));
      const containsBlockedWord = blockedWords.some((word) => 
        tab.title?.toLowerCase().includes(word.word.toLowerCase()) || 
        tab.url?.toLowerCase().includes(word.word.toLowerCase())
      );

      if (isBlocked || containsBlockedWord) {
        chrome.tabs.update(tabId, { url: 'blocked.html' });
      }
    });
  }
});