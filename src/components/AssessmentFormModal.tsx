
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
const AssessmentFormModal = ({ isOpen, onOpenChange,  onSubmit, onCancel, selectedAssessment}: AssessmentFormModalProps) => {
console.log("ass", selectedAssessment)
    const form = useForm<AssessmentFormData>({
        resolver: zodResolver(assessmentSchema),
        defaultValues:  {
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
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden fade-in border-4 border-purple-200">
                <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-400 to-pink-400">
                    <div className="flex justify-between items-center">
                        <h2 id="modalTitle" className="text-2xl font-bold text-white flex items-center gap-2">🎯 Create New Assessment</h2>
                        <button onClick={handleCancel} className="text-white hover:text-purple-200 text-3xl font-bold">×</button>
                    </div>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
                <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
                <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">Assessment Title</FormLabel>
                      <FormControl>
                        <Input className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-lg" placeholder="Enter assessment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-lg font-bold text-purple-700 flex items-center gap-2">
                            🔤 Words &amp; Clues
                        </label>
                        <button type="button"  onClick={() => append({ word: '', hint: '' })} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                            ➕ Add Word
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 border-b-2 border-purple-200">
                            <div className="grid grid-cols-12 gap-4 font-bold text-purple-800">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-4">📝 Word</div>
                                <div className="col-span-5">💡 Clue</div>
                                <div className="col-span-2 text-center">Action</div>
                            </div>
                        </div>
                        <div id="wordsTableBody" className="max-h-64 overflow-y-auto">
                            {fields.map((field, index) => (
                                <div key={field.id} className="word-row grid grid-cols-12 gap-4 px-4 py-3 border-b border-purple-100 hover:bg-purple-50 transition-colors items-center">
                                <div className="col-span-1 text-center font-bold text-purple-600">{index + 1}</div>
                                <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name={`words.${index}.word`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        <Input 
                                        className="word-input w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                                        placeholder="Enter word..." {...field} />
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
                                        className="hint-input w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium"
                                        placeholder="Enter hint..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                                <div className="col-span-2 text-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-800 font-bold bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full transition-colors text-sm">
                                        ❌
                                    </button>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-purple-200">
                            <button type="button" onClick={handleCancel} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-bold transition-all duration-200">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                🎉 Save Game
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