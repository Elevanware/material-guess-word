export interface WordData {
  id: string;
  word: string;
  hint?: string;
}

export interface GuessResult {
  wordId: string;
  word: string;
  completed: boolean;
  wrongGuesses: number;
  skipped: boolean;
  timeSpent: number;
}

export interface PuzzlePiece {
  id: string;
  imageUrl: string;
  correctPosition: number;
}

export interface PuzzleConfig {
  rows: number;
  cols: number;
  finalImageUrl: string;
}

export interface PuzzleResult {
  completed: boolean;
  timeSpent: number;
  moves: number;
}

export type AssessmentType = 'guess-the-word' | 'image-puzzle';

export interface BaseAssessment {
  id: string;
  title: string;
  type: AssessmentType;
}

export interface GuessTheWordAssessment extends BaseAssessment {
  type: 'guess-the-word';
  words: WordData[];
}

export interface ImagePuzzleAssessment extends BaseAssessment {
  type: 'image-puzzle';
  puzzle: PuzzleConfig;
}

export type AssessmentData = GuessTheWordAssessment | ImagePuzzleAssessment;