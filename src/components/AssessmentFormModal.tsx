
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AssessmentData } from '@/types/assessment';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';

const assessmentSchema = z.object({
  title: z.string().min(1, 'Assessment title is required'),
  words: z.array(z.object({
    word: z.string().min(1, 'Word is required'),
    hint: z.string().optional(),
  })).min(1, 'At least one word is required'),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormModalProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (assessment: AssessmentData) => void;
  selectedAssessment?: AssessmentData
  onCancel: () => void;
}
const AssessmentFormModal = ({ isOpen, onOpenChange, onSubmit, onCancel, selectedAssessment }: AssessmentFormModalProps) => {
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
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onCancel()
  };

  useEffect(() => {
    if (selectedAssessment) {
      form.reset({
        title: selectedAssessment.title,
        words: selectedAssessment.words.map((word) => ({
          word: word.word,
          hint: word.hint,
        })),
      });
    }
  }, [selectedAssessment, form]);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-900">
            <div className="flex justify-between items-center">
              <h2 id="modalTitle" className="text-xl font-bold text-white flex items-center gap-2">
                🎯 Create New Assessment
              </h2>
              <button
                onClick={handleCancel}
                className="text-white hover:text-gray-300 text-3xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
                {/* Title Input */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-lg font-semibold text-gray-800 mb-2">
                        Assessment Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-lg"
                          placeholder="Enter assessment title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Words & Clues Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-semibold text-gray-800">Words & Clues</label>
                    <button
                      type="button"
                      onClick={() => append({ word: '', hint: '' })}
                      className="px-8 py-3 text-sm bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium transition"
                    >
                      Add Word
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-4">📝 Word</div>
                        <div className="col-span-5">💡 Clue</div>
                        <div className="col-span-2 text-center">Action</div>
                      </div>
                    </div>

                    {/* Word Rows */}
                    <div id="wordsTableBody" className="max-h-64 overflow-y-auto">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-100 transition"
                        >
                          <div className="col-span-1 text-center font-medium text-gray-600">
                            {index + 1}
                          </div>
                          <div className="col-span-4">
                            <FormField
                              control={form.control}
                              name={`words.${index}.word`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                                      placeholder="Enter word..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-span-5">
                            <FormField
                              control={form.control}
                              name={`words.${index}.hint`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                                      placeholder="Enter hint..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-span-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 text-sm font-semibold bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full transition"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-10 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-10 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-black text-white rounded-md font-semibold transition hover:bg-gray-800"
                  >
                    Save Game
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>

    </Dialog>
  )
}

export default AssessmentFormModal