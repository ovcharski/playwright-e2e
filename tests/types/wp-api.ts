export interface RouteInfo {
    namespace: string;
    // add more properties here if needed
  }
  
  export interface ApiStructure {
    namespace: string;
    routes: Record<string, RouteInfo>;
  }
  
  export interface Page {
    id: number;
    link: string;
    slug: string;
  }
  
  export interface Post {
    id: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    slug: string;
  }
  
  export interface MediaItem {
    id: number;
    source_url: string;
    alt_text: string;
  }
  
  export interface SearchResult {
    id: number;
    slug: string;
    title: { rendered: string };
  }
  
  export interface CommentItem {
    post: number;
  }
  
  export interface User {
    id: number;
    name: string;
    slug: string;
  }
  