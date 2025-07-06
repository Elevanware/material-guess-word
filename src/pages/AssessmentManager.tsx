import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Edit, Trash2 } from 'lucide-react';
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
    setView('form');
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
      <GuessTheWordAssessment assessment={selectedAssessment} onComplete={() => {console.log("clcc");setView('list')}} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 create-game-bg">
      <div className="w-7xl mx-auto">
        {/* <div className="flex items-center justify-between mb-20">
          <h1 className="text-3xl font-bold text-white">Assessment Manager</h1>
          <Button onClick={() => setView('form')} className='create-btn'>
            <Plus className="w-4 h-4 mr-2" />
            Create New Assessment
          </Button>
        </div> */}
        <header className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        🕵️&zwj;♀️ Word Detective
                    </h1>
                    <p className="text-purple-100 text-sm">Create fun word games for kids!</p>
                </div>
                <button onClick={() => setOpenForm(true)} className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    ✨ Create New Game
                </button>
            </div>
        </div>
    </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border-2 border-purple-200 p-6 card-hover">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-purple-800 mb-2 flex items-center gap-2">
                        🎯 {assessment.title}
                    </h3>
                    <p className="text-purple-600 font-medium flex items-center gap-1">
                       {assessment.type}
                    </p>
                </div>
                
                <div className="mb-4">
                    <div className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
                        👀 Preview:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {assessment.words.slice(0, 3).map((word) => (
                        <span key={word.id} className="bg-gradient-to-r from-yellow-200 to-pink-200 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">{word.word}</span>
                      ))}
                       
                        {assessment.words.length > 3 && (
                          <span className="text-purple-500 text-sm font-bold">+ {assessment.words.length - 3} more...!</span>
                          )}
                    </div>
                </div>
                
                <div className="flex space-x-2">
                    <button onClick={() => handlePlayAssessment(assessment)} className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-4 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        🎮 Play
                    </button>
                    <button onClick={() => handleEditAssessment(assessment)} className="flex-1 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white py-3 px-4 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteAssessment(assessment.id)} className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white py-3 px-3 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
          ))}
        </div>


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
      <AssessmentFormModal isOpen={openForm} onOpenChange={setOpenForm} onSubmit={handleCreateAssessment} onCancel={() => {setOpenForm(false)}} />
    </div>
  );
};

export default AssessmentManager;
