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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Assessment Manager</h1>
          <Button onClick={() => setView('form')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Assessment
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  {assessment.words.length} word{assessment.words.length !== 1 ? 's' : ''}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Words:</strong>
                    <div className="mt-1 space-y-1">
                      {assessment.words.slice(0, 3).map((word) => (
                        <div key={word.id} className="flex justify-between">
                          <span>{word.word}</span>
                          {word.hint && <span className="text-xs text-gray-500">({word.hint})</span>}
                        </div>
                      ))}
                      {assessment.words.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{assessment.words.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => handlePlayAssessment(assessment)}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAssessment(assessment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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