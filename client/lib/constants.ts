import { Post } from "./types";

export const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Art of Minimalist Design',
    subtitle: 'How simplicity can transform your creative work',
    content: 'Minimalism isn\'t about having less—it\'s about making room for more of what matters. In design, every element should serve a purpose. When we strip away the unnecessary, we reveal the essential beauty that was there all along.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop',
    author: 'Anand S',
    date: '2024-01-15',
    tags: ['Design', 'Minimalism', 'Creativity'],
    likes: 234,
    comments: 45,
    views: 2847
  },
  {
    id: '2',
    title: 'Building Better User Experiences',
    subtitle: 'A journey through modern UX principles',
    content: 'Great user experience is invisible. Users shouldn\'t have to think about how to use your product—they should just use it. This requires deep empathy, careful planning, and constant iteration.',
    coverImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop',
    author: 'Anand S',
    date: '2024-01-12',
    tags: ['UX', 'Design', 'User Research'],
    likes: 189,
    comments: 32,
    views: 1956
  },
  {
    id: '3',
    title: 'The Future of Web Development',
    subtitle: 'Exploring emerging trends and technologies',
    content: 'The web is evolving faster than ever. From server components to edge computing, the tools we use today will shape the experiences of tomorrow. Stay curious, keep learning.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    author: 'Sarah Chen',
    date: '2024-01-10',
    tags: ['Web Dev', 'Technology', 'Future'],
    likes: 412,
    comments: 67,
    views: 3421
  }
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Feed', color: 'bg-[#f5b800]', shadow: 'shadow-[#f5b800]/40', activeShadow: '0 0 25px rgba(245, 184, 0, 0.5)' },
  { id: 'dashboard', label: 'Main', color: 'bg-[#101828]', shadow: 'shadow-[#101828]/30', activeShadow: '0 0 25px rgba(16, 24, 40, 0.4)' },
  { id: 'new', label: 'Write', color: 'bg-[#101828]', shadow: 'shadow-[#101828]/30', activeShadow: '0 0 25px rgba(16, 24, 40, 0.4)' },
  { id: 'myblogs', label: 'Library', color: 'bg-[#101828]', shadow: 'shadow-[#101828]/30', activeShadow: '0 0 25px rgba(16, 24, 40, 0.4)' },
  { id: 'settings', label: 'Config', color: 'bg-zinc-600', shadow: 'shadow-zinc-600/30', activeShadow: '0 0 25px rgba(82, 82, 91, 0.4)' }
];
