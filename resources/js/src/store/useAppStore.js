import { create } from 'zustand';

const useAppStore = create((set) => ({
  location: 'Yaguará',
  searchQuery: '',
  businessType: 'all', // 'all', 'services', 'commerce'
  selectedCategory: null,
  activeChat: null,

  setLocation: (loc) => set({ location: loc }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBusinessType: (type) => set({ businessType: type }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setActiveChat: (chat) => set({ activeChat: chat }),
}));

export default useAppStore;
