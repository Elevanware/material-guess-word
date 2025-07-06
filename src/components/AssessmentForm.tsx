import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { splitImage } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { AssessmentData, AssessmentType } from '@/types/assessment';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';

const wordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  hint: z.string().optional(),
});

const puzzlePieceSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
});



const baseAssessmentSchema = z.object({
  title: z.string().min(1, 'Assessment title is required'),
  type: z.enum(['guess-the-word', 'image-puzzle'] as const),
});

const guessTheWordSchema = baseAssessmentSchema.extend({
  type: z.literal('guess-the-word'),
  words: z.array(wordSchema).min(1, 'At least one word is required'),
});

const imagePuzzleSchema = baseAssessmentSchema.extend({
  type: z.literal('image-puzzle'),
  rows: z.number().min(2).max(5),
  cols: z.number().min(2).max(5),
  pieces: z.array(puzzlePieceSchema),
  finalImageUrl: z.string().min(1, 'Final image URL is required'),
  imageFile: z
    .any()
    .refine((file) => !file || file instanceof File, "Must be a file")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

const assessmentSchema = z.discriminatedUnion('type', [
  guessTheWordSchema,
  imagePuzzleSchema,
]);

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  onSubmit: (assessment: AssessmentData) => void;
  onCancel: () => void;
}



const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, onCancel }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<AssessmentType>('guess-the-word');

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: '',
      type: 'guess-the-word',
      words: [{ word: '', hint: '' }],
    },
  });

  const { fields: wordFields, append: appendWord, remove: removeWord } = useFieldArray({
    control: form.control,
    name: 'words',
  });

  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleTypeChange = (type: AssessmentType) => {
    setSelectedType(type);
    setUploadedImage(null);
    form.reset({
      title: form.getValues('title'),
      type,
      ...(type === 'guess-the-word' 
        ? { words: [{ word: '', hint: '' }] }
        : { rows: 3, cols: 3, pieces: [], finalImageUrl: '' }
      ),
    });
  };


  const handleSubmit = (data: AssessmentFormData) => {
    if (data.type === 'guess-the-word') {
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
    } else {
      
      const assessment: AssessmentData = {
        id: Date.now().toString(),
        title: data.title,
        type: 'image-puzzle',
        puzzle: {
          rows: data.rows,
          cols: data.cols,
          pieces: [],
          finalImageUrl: data.finalImageUrl,
          correctOrder: [],
        },
      };
      onSubmit(assessment);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-2xl mx-auto">
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
                  <FormLabel>Assessment Type</FormLabel>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={selectedType === 'guess-the-word' ? 'default' : 'outline'}
                      onClick={() => handleTypeChange('guess-the-word')}
                      className="flex-1"
                    >
                      Word Guessing
                    </Button>
                    <Button
                      type="button"
                      variant={selectedType === 'image-puzzle' ? 'default' : 'outline'}
                      onClick={() => handleTypeChange('image-puzzle')}
                      className="flex-1"
                    >
                      Image Puzzle
                    </Button>
                  </div>
                </div>

                {selectedType === 'guess-the-word' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Words & Hints</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendWord({ word: '', hint: '' })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Word
                      </Button>
                    </div>

                    {wordFields.map((field, index) => (
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

                          {wordFields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeWord(index)}
                              className="mt-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rows"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rows</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={2}
                                max={5}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cols"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Columns</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={2}
                                max={5}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormLabel>Upload Image or Enter URL</FormLabel>
                      <ImageUploadZone 
                        onImageUpload={(file) => {
                          const imageUrl = URL.createObjectURL(file);
                          setUploadedImage(imageUrl);
                          form.setValue('finalImageUrl', imageUrl);
                          form.setValue('imageFile', file);
                        }} 
                      />
                      {isProcessingImage && (
                        <div className="text-center text-sm text-blue-600 mt-2">
                          Processing image...
                        </div>
                      )}
                      
                      {uploadedImage && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded puzzle" 
                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="finalImageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Or Enter Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter image URL" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  const url = e.target.value;
                                  setUploadedImage(url);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  
                  </div>
                )}

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