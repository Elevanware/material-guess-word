
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AssessmentData, AssessmentType } from '@/types/assessment';
import { useForm, useFieldArray } from 'react-hook-form';
import ImageUploadZone from './ImageUploadZone';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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

interface AssessmentFormModalProps {
    isOpen: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (assessment: AssessmentData) => void;
    selectedAssessment?: AssessmentData
    onCancel: () => void;
}
const AssessmentFormModal = ({ isOpen, onOpenChange, onSubmit, onCancel, selectedAssessment }: AssessmentFormModalProps) => {
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


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'words',
    });

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

    const handleSubmit = async (data: AssessmentFormData) => {
        try {
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
                if (!data.finalImageUrl) {
                    throw new Error('Please upload an image for the puzzle');
                }

                const assessment: AssessmentData = {
                    id: Date.now().toString(),
                    title: data.title,
                    type: 'image-puzzle',
                    puzzle: {
                        rows: data.rows || 3,
                        cols: data.cols || 3,
                        finalImageUrl: data.finalImageUrl,
                    },
                };
                onSubmit(assessment);
            }

            // Reset all states
            form.reset({
                title: '',
                type: 'guess-the-word',
                words: [{ word: '', hint: '' }],
            });
            setSelectedType('guess-the-word');
            setUploadedImage(null);
            onOpenChange(false);
        } catch (error) {
            console.error('Form submission error:', error);
            // You might want to show an error toast here
        }
    };


    const handleCancel = () => {
        form.reset({
            title: '',
            type: 'guess-the-word',
            words: [{ word: '', hint: '' }],
        });
        setSelectedType('guess-the-word');
        setUploadedImage(null);
        onCancel();
    };

    useEffect(() => {
        if (selectedAssessment) {
            setSelectedType(selectedAssessment.type);
            if (selectedAssessment.type === 'guess-the-word') {
                form.reset({
                    title: selectedAssessment.title,
                    type: selectedAssessment.type,
                    words: selectedAssessment.words.map((word) => ({
                        word: word.word,
                        hint: word.hint,
                    })),
                });
            } else if (selectedAssessment.type === 'image-puzzle') {
                form.reset({
                    title: selectedAssessment.title,
                    type: selectedAssessment.type,
                    rows: selectedAssessment.puzzle.rows,
                    cols: selectedAssessment.puzzle.cols,
                    finalImageUrl: selectedAssessment.puzzle.finalImageUrl,
                });
                if (selectedAssessment.puzzle.finalImageUrl) {
                    setUploadedImage(selectedAssessment.puzzle.finalImageUrl);
                }
            }
        } else {
            form.reset({
                title: '',
                type: 'guess-the-word',
                words: [{ word: '', hint: '' }],
            });
            setSelectedType('guess-the-word');
            setUploadedImage(null);
        }
    }, [selectedAssessment, form]);
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden fade-in border-4 border-purple-200">
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
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="flex justify-between items-center">
                                                <FormLabel className="block text-lg font-bold text-purple-700 flex items-center gap-2">
                                                    Assessment Type
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup 
                                                        className="flex gap-4" 
                                                        value={field.value} 
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            handleTypeChange(value as AssessmentType);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <RadioGroupItem value="guess-the-word" id="guess-the-word" />
                                                            <label htmlFor="guess-the-word" className="text-lg font-bold text-purple-700">Guess the Word</label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RadioGroupItem value="image-puzzle" id="image-puzzle" />
                                                            <label htmlFor="image-puzzle" className="text-lg font-bold text-purple-700">Image Puzzle</label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {selectedType === 'guess-the-word' ? (
                                    <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-lg font-bold text-purple-700 flex items-center gap-2">
                                            🔤 Words &amp; Clues
                                        </label>
                                        <button type="button" onClick={() => append({ word: '', hint: '' })} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
                                ):(
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="rows"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="block text-lg font-bold text-purple-700">Rows (2-5)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={2}
                                                                    max={5}
                                                                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
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
                                                            <FormLabel className="block text-lg font-bold text-purple-700">Columns (2-5)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={2}
                                                                    max={5}
                                                                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                                            <FormLabel className="block text-lg font-bold text-purple-700 mb-4">Upload Puzzle Image</FormLabel>
                                            <FormField
                                                control={form.control}
                                                name="imageFile"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ImageUploadZone
                                                                onImageUpload={(file) => {
                                                                    field.onChange(file);
                                                                    const imageUrl = URL.createObjectURL(file);
                                                                    setUploadedImage(imageUrl);
                                                                    form.setValue('finalImageUrl', imageUrl);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {uploadedImage && (
                                                <div className="mt-4">
                                                    <p className="text-lg font-bold text-purple-700 mb-2">Preview:</p>
                                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                        <img
                                                            src={uploadedImage}
                                                            alt="Uploaded puzzle"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
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