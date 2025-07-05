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
  
  export interface AssessmentData {
    id: string;
    title: string;
    type: 'guess-the-word';
    words: WordData[];
  }