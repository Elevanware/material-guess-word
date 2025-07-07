import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Edit, Trash2, Trash2Icon } from 'lucide-react';
import { AssessmentData } from '@/types/assessment';
import AssessmentForm from '@/components/AssessmentForm';
import GuessTheWordAssessment from '@/components/GuessTheWordAssessment';
import AssessmentFormModal from '@/components/AssessmentFormModal';

const AssessmentManager = () => {
  const [view, setView] = useState<'list' | 'form' | 'play'>('list');
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [assessments, setAssessments] = useState<AssessmentData[]>([
    {
      id: '1',
      title: "I am ...",
      type: 'guess-the-word',
      words: [
        { id: '1', word: 'HAPPY', hint: 'A feeling of joy' },
        { id: '2', word: 'BRAVE', hint: 'Not afraid' },
        { id: '3', word: 'KIND', hint: 'Nice to others' },
        { id: '4', word: 'SMART', hint: 'Very clever' },
        { id: '5', word: 'STRONG', hint: 'Has power' },
      ]
    },
    {
      id: '2',
      title: "I am... a Forest Friend!",
      type: 'guess-the-word',
      words: [
        { id: '1', word: 'TIGER', hint: 'I am the biggest wild cat with orange fur and black stripes.' },
        { id: '2', word: 'MONKEY', hint: 'I am clever and love swinging from trees and eating bananas.' },
        { id: '3', word: 'BEAR', hint: 'I am big and strong, I love honey and can sleep all winter.' },
        { id: '4', word: 'OWL', hint: 'I am wise and can see in the dark, saying "hoot hoot" at night.' },
        { id: '5', word: 'DEER', hint: 'I have antlers and run fast through the forest.' },
        { id: '6', word: 'ELEPHANT', hint: 'I am the biggest animal on land, with a long trunk.' },
        { id: '7', word: 'FOX', hint: 'I am clever and have a bushy tail and red fur.' }
      ]
    }
  ]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);

  const handleCreateAssessment = (assessment: AssessmentData) => {
    setAssessments(prev => [...prev, assessment]);
    setView('list');
  };

  const handlePlayAssessment = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
    setView('play');
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  const handleEditAssessment = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
    setOpenForm(true);
  };

  if (view === 'form') {
    return (
      <AssessmentForm
        onSubmit={handleCreateAssessment}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'play' && selectedAssessment) {
    return (
      <GuessTheWordAssessment assessment={selectedAssessment} onComplete={() => { setSelectedAssessment(null); setView('list') }} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 create-game-bg">
      <div className="w-full mx-auto">
        <header className="bg-gradient-to-r bg-black shadow-lg relative z-10">
          <div className="container mx-auto px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🧩 Word Detective
              </h1>
              <p className="text-purple-100 text-sm">Create fun word games for kids!</p>
            </div>
            <button onClick={() => setOpenForm(true)} className="text-sm bg-white text-black-800 px-8 py-4 rounded-md font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Create New Game
            </button>
          </div>
        </header>
        <main className="container w-full mx-auto py-8">
          <div id="assessmentsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🎯 {assessment.title}
                  </h3>
                  {assessment.type === 'guess-the-word' && (
                    <p className="text-sm text-gray-500 mt-1">Guess the word game</p>
                  )}
                </div>

                <div className="mb-4 mt-8">
                  <div className="text-sm font-medium text-gray-600 mb-2">Preview Words</div>
                  <div className="flex flex-wrap gap-2">
                    {assessment.words.slice(0, 3).map((word) => (
                      <span
                        key={word.id}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {word.word}
                      </span>
                    ))}
                    {assessment.words.length > 3 && (
                      <span className="text-sm text-gray-400">+ {assessment.words.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-15">
                  <button
                    onClick={() => handlePlayAssessment(assessment)}
                    className="flex-1 bg-black text-white text-md py-2 px-4 rounded-md transition"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => handleEditAssessment(assessment)}
                    className="flex-1 border-1 bg-gray-100 text-black text-md py-2 px-4 rounded-md hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="border-1 text-red-900 text-sm py-2 px-3 rounded-md hover:bg-red-200 transition"
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>

        {assessments.length === 0 && (
          <div className="text-center py-16 hidden">
            <div className="text-8xl mb-4 animate-bounce">🎮</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-2">No assessments yet!</h3>
            <p className="text-purple-600 mb-6 text-lg">Let's create your first awesome assessment!</p>
            <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              🚀 Create Your First Game
            </button>
          </div>
        )}
      </div>
      <AssessmentFormModal isOpen={openForm} onOpenChange={setOpenForm} onSubmit={handleCreateAssessment} onCancel={() => { setOpenForm(false) }} selectedAssessment={selectedAssessment} />
    </div>
  );
};

export default AssessmentManager;
