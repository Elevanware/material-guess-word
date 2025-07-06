import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Edit, Trash2 } from 'lucide-react';
import { AssessmentData } from '@/types/assessment';
import AssessmentForm from '@/components/AssessmentForm';
import GuessTheWordAssessment from '@/components/GuessTheWordAssessment';

const AssessmentManager = () => {
  const [view, setView] = useState<'list' | 'form' | 'play'>('list');
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
      <GuessTheWordAssessment assessment={selectedAssessment} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 create-game-bg">
      <div className="w-7xl mx-auto">
        <div className="flex items-center justify-between mb-20">
          <h1 className="text-3xl font-bold text-white">Assessment Manager</h1>
          <Button onClick={() => setView('form')} className='create-btn'>
            <Plus className="w-4 h-4 mr-2" />
            Create New Assessment
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md  transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] min-h-[360px] flex flex-col justify-between"
            >
              {/* Animated gradient ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-xl opacity-20 animate-pulse z-0 rounded-2xl" />

              {/* Header */}
              <CardHeader className="relative z-10 text-center space-y-2 py-5">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                  {assessment.title}
                </h2>
                <p className="text-md text-gray-700">
                  {assessment.words.length} word{assessment.words.length !== 1 ? 's' : ''}
                </p>
              </CardHeader>

              {/* Content and buttons */}
              <CardContent className="relative z-10 p-5 flex flex-col justify-between flex-grow">
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-800">🧠 Words:</h4>
                    <div className="space-y-1">
                      {assessment.words.slice(0, 3).map((word) => (
                        <div key={word.id} className="flex justify-between">
                          <span className="font-medium">{word.word}</span>
                          {word.hint && <span className="text-gray-400 italic">({word.hint})</span>}
                        </div>
                      ))}
                      {assessment.words.length > 3 && (
                        <p className="text-xs text-gray-400 italic">
                          +{assessment.words.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons always fixed to bottom of card */}
                <div className="flex gap-3 pt-5 mt-auto">
                  <Button
                    size="sm"
                    onClick={() => handlePlayAssessment(assessment)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-teal-500 text-white hover:brightness-110 transition-all font-bold shadow-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 transition-all"
                    onClick={() => handleDeleteAssessment(assessment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {assessments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No assessments created yet.</p>
            <Button onClick={() => setView('form')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentManager;