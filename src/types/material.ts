import { AssessmentData } from './assessment';

export type MaterialType = 'video' | 'activity' | 'game' | 'assessment' | 'document' | 'image';
export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface MaterialTag {
  id: string;
  name: string;
  category: string; // e.g., 'SEL', 'Subject', 'Topic'
}

export interface MaterialMetadata {
  grades: GradeLevel[];
  tags: MaterialTag[];
  subject?: string;
  duration?: number; // in minutes
  language?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface MaterialContent {
  id: string;
  title: string;
  type: MaterialType;
  description: string;
  url: string;
  thumbnailUrl?: string;
  metadata: MaterialMetadata;
}

export interface VideoContent extends MaterialContent {
  type: 'video';
  duration: number; // in seconds
  transcriptUrl?: string;
}

export interface ActivityContent extends MaterialContent {
  type: 'activity';
  instructions: string;
  objectives: string[];
  materials?: string[];
}

export interface GameContent extends MaterialContent {
  type: 'game';
  gameType: string;
  skillsTargeted: string[];
  difficultyLevels?: string[];
}

export interface DocumentContent extends MaterialContent {
  type: 'document';
  fileType: string; // e.g., 'pdf', 'doc'
  pageCount?: number;
  printable: boolean;
}

export interface ImageContent extends MaterialContent {
  type: 'image';
  fileType: string; // e.g., 'jpg', 'png'
  dimensions?: {
    width: number;
    height: number;
  };
  printable: boolean;
}

export interface MaterialBundle {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  metadata: MaterialMetadata;
  contents: {
    introVideo?: VideoContent;
    learningVideos?: VideoContent[];
    activities?: ActivityContent[];
    games?: GameContent[];
    assessments?: AssessmentData[];
    printables?: (DocumentContent | ImageContent)[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
}

export interface MaterialFilter {
  grades?: GradeLevel[];
  tags?: string[];
  types?: MaterialType[];
  subject?: string;
  search?: string;
  difficulty?: MaterialMetadata['difficulty'];
}

export interface MaterialSort {
  field: 'title' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface MaterialLibraryState {
  bundles: MaterialBundle[];
  filters: MaterialFilter;
  sort: MaterialSort;
  loading: boolean;
  error?: string;
}