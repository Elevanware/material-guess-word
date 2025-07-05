import React from 'react';
import GuessTheWordAssessment from '@/components/GuessTheWordAssessment';
import { AssessmentData } from '@/types/assessment';

const Home = () => {
  // Sample assessment data - this would come from your form/database in a real app
  const sampleAssessment: AssessmentData = {
    id: '1',
    title: "What's The Word?",
    type: 'guess-the-word',
    words: [
      { id: '1', word: 'HAPPY', hint: 'A feeling of joy' },
      { id: '2', word: 'BRAVE', hint: 'Not afraid' },
      { id: '3', word: 'KIND', hint: 'Nice to others' },
      { id: '4', word: 'SMART', hint: 'Very clever' },
      { id: '5', word: 'STRONG', hint: 'Has power' },
    ]
  };

  return (
    <GuessTheWordAssessment assessment={sampleAssessment} />
  );
};

export default Home;