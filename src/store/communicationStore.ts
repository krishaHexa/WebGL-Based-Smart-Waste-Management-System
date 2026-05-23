import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'instruction' | 'alert' | 'general';
}

interface CommunicationState {
  messages: ChatMessage[];
  unreadCount: number;
  addMessage: (msg: ChatMessage) => void;
  markAsRead: (messageId: string) => void;
  getMessagesForVehicle: (vehicleId: string) => ChatMessage[];
}

export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  messages: [
    {
      id: 'm1',
      senderId: 'OPERATOR_1',
      receiverId: 'v1',
      text: 'Mohammed, please verify load sensor calibration before next stop.',
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'instruction'
    },
    {
      id: 'm2',
      senderId: 'SYSTEM',
      receiverId: 'v2',
      text: 'Rerouting due to traffic congestion on King Fahd Hwy.',
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'alert'
    }
  ],
  unreadCount: 1,
  addMessage: (msg) => set(state => ({ 
    messages: [msg, ...state.messages],
    unreadCount: msg.senderId !== 'DRIVER' ? state.unreadCount + 1 : state.unreadCount
  })),
  markAsRead: (id) => set(state => ({
    messages: state.messages.map(m => m.id === id ? { ...m, isRead: true } : m),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  getMessagesForVehicle: (vid) => get().messages.filter(m => m.receiverId === vid || m.senderId === vid)
}));
