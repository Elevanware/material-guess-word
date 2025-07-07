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

export interface ThemeConfig {
  backgroundColor: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

export interface AnimationConfig {
  alphabetAnimation: 'fade' | 'bounce' | 'slide' | 'flip';
  wordCompleteAnimation: 'confetti' | 'fireworks' | 'sparkle';
  transitionSpeed: 'slow' | 'medium' | 'fast';
  nextSkipAnimation: 'fade' | 'bounce' | 'slide' | 'flip' | 'shake' | 'tilt';
}

export interface GameConfig {
  maxWrongGuesses: number;
  soundEffects: {
    correctGuess: string;
    wrongGuess: string;
    wordComplete: string;
  };
  navigationArrows: {
    next: string;
    skip: string;
  };
}

export interface AssessmentData {
  id: string;
  title: string;
  type: 'guess-the-word';
  words: WordData[];
  theme: ThemeConfig;
  animations: AnimationConfig;
  gameConfig: GameConfig;
}