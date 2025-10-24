"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { vieraskortti as initialVieraskortti, weddingCouple } from "@/lib/mock-data";

// Wedding Context
const WeddingContext = createContext(undefined);

// Hook to use Wedding Context
export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error("useWedding must be used within WeddingProvider");
  }
  return context;
};

// Wedding Provider Component
export function WeddingProvider({ children }) {
  // Guest cards state
  const [vieraskortti, setVieraskortti] = useState(initialVieraskortti);
  
  // Wedding site state
  const [weddingSite, setWeddingSite] = useState({
    id: 1,
    name: "Ikimetsä",
    theme: "forest",
    published: false,
    publishedAt: null,
    url: "ikimetsa",
    passwordProtected: false,
    accessCode: "",
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString()
  });

  // Wedding couple data
  const [couple] = useState(weddingCouple);

  // ============ VIERASKORTTI FUNCTIONS ============
  
  // Add new guest card
  const addVieraskortti = (newCard) => {
    const card = {
      ...newCard,
      id: Math.max(...vieraskortti.map(c => c.id), 0) + 1,
      invitationSent: false,
      invitationSentDate: null,
      invitationViewed: false,
      invitationViewedDate: null,
      rsvpStatus: null,
      rsvpDate: null,
      confirmed: false
    };
    setVieraskortti([...vieraskortti, card]);
    return card;
  };

  // Update guest card
  const updateVieraskortti = (cardId, updates) => {
    setVieraskortti(vieraskortti.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
  };

  // Delete guest card
  const deleteVieraskortti = (cardId) => {
    setVieraskortti(vieraskortti.filter(card => card.id !== cardId));
  };

  // Toggle card confirmation
  const toggleCardConfirmation = (cardId) => {
    setVieraskortti(vieraskortti.map(card =>
      card.id === cardId ? { ...card, confirmed: !card.confirmed } : card
    ));
  };

  // Send invitation to cards
  const sendInvitations = (cardIds) => {
    const sentDate = new Date().toISOString();
    setVieraskortti(vieraskortti.map(card =>
      cardIds.includes(card.id)
        ? { 
            ...card, 
            invitationSent: true, 
            invitationSentDate: sentDate 
          }
        : card
    ));
  };

  // ============ WEDDING SITE FUNCTIONS ============

  // Publish wedding site
  const publishSite = () => {
    setWeddingSite({
      ...weddingSite,
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  // Unpublish wedding site
  const unpublishSite = () => {
    setWeddingSite({
      ...weddingSite,
      published: false,
      publishedAt: null,
      updatedAt: new Date().toISOString()
    });
  };

  // Update site settings
  const updateSiteSettings = (settings) => {
    setWeddingSite({
      ...weddingSite,
      ...settings,
      updatedAt: new Date().toISOString()
    });
  };

  // Set password protection
  const setPasswordProtection = (enabled, code = "") => {
    setWeddingSite({
      ...weddingSite,
      passwordProtected: enabled,
      accessCode: code,
      updatedAt: new Date().toISOString()
    });
  };

  // Generate access code
  const generateAccessCode = () => {
    const words = ["kulta", "sydän", "rakas", "unelma", "tähti", "kuu", "aurinko", "ilo", "onni", "rakkaus"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNum = Math.floor(Math.random() * 99) + 1;
    return `${randomWord}${randomNum}`;
  };

  // Submit RSVP response
  const submitRsvp = (cardId, guestId, status, additionalInfo = {}) => {
    setVieraskortti(vieraskortti.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          rsvpStatus: status === "tulossa" ? "accepted" : "declined",
          rsvpDate: new Date().toISOString(),
          vieraat: card.vieraat.map(guest => 
            guest.id === guestId 
              ? { ...guest, rsvpStatus: status, ...additionalInfo }
              : guest
          )
        };
      }
      return card;
    }));
  };

  // ============ STATISTICS ============

  const stats = {
    // Card statistics
    totalCards: vieraskortti.length,
    invitedCards: vieraskortti.filter(c => c.invitationSent).length,
    viewedCards: vieraskortti.filter(c => c.invitationViewed).length,
    acceptedCards: vieraskortti.filter(c => c.rsvpStatus === "accepted").length,
    declinedCards: vieraskortti.filter(c => c.rsvpStatus === "declined").length,
    confirmedCards: vieraskortti.filter(c => c.confirmed).length,
    
    // Guest statistics (people count)
    totalGuests: vieraskortti.reduce((sum, card) => sum + card.vieraat.length, 0),
    comingGuests: vieraskortti.reduce((sum, card) => {
      return sum + card.vieraat.filter(g => g.rsvpStatus === "tulossa").length;
    }, 0),
    noResponseGuests: vieraskortti.reduce((sum, card) => {
      return sum + card.vieraat.filter(g => g.rsvpStatus === "ei_vastausta").length;
    }, 0),
    
    // Pending responses
    get pendingCards() {
      return this.invitedCards - this.acceptedCards - this.declinedCards;
    }
  };

  // Context value
  const value = {
    // Data
    vieraskortti,
    weddingSite,
    couple,
    stats,
    
    // Vieraskortti functions
    addVieraskortti,
    updateVieraskortti,
    deleteVieraskortti,
    toggleCardConfirmation,
    sendInvitations,
    submitRsvp,
    
    // Site functions
    publishSite,
    unpublishSite,
    updateSiteSettings,
    setPasswordProtection,
    generateAccessCode
  };

  return (
    <WeddingContext.Provider value={value}>
      {children}
    </WeddingContext.Provider>
  );
}
