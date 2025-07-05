import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Plus } from 'lucide-react';
import { AssessmentData } from '@/types/assessment';

const assessmentSchema = z.object({
  title: z.string().min(1, 'Assessment title is required'),
  words: z.array(z.object({
    word: z.string().min(1, 'Word is required'),
    hint: z.string().optional(),
  })).min(1, 'At least one word is required'),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  onSubmit: (assessment: AssessmentData) => void;
  onCancel: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: '',
      words: [{ word: '', hint: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'words',
  });

  const handleSubmit = (data: AssessmentFormData) => {
    const assessment: AssessmentData = {
      id: Date.now().toString(),
      title: data.title,
      type: 'guess-the-word',
      words: data.words.map((word, index) => ({
        id: (index + 1).toString(),
        word: word.word.toUpperCase(),
        hint: word.hint,
      })),
    };
    onSubmit(assessment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create New Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assessment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Words & Hints</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ word: '', hint: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Word
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name={`words.${index}.word`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Word {index + 1}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter word" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`words.${index}.hint`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hint (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter hint" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                            className="mt-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Assessment
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentForm;