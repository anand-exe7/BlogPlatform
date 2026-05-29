export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
}

export interface NavItem {
  id: string;
  label: string;
  color: string;
  shadow: string;
  activeShadow: string;
}

export interface NewPost {
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  tags: string;
}
