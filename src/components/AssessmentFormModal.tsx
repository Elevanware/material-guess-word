
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AnimationConfig, AssessmentData, GameConfig, ThemeConfig } from '@/types/assessment';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const assessmentSchema = z.object({
  title: z.string().min(1, 'Assessment title is required'),
  words: z.array(z.object({
    word: z.string().min(1, 'Word is required'),
    hint: z.string().optional(),
  })).min(1, 'At least one word is required'),
  theme: z.object({
    backgroundColor: z.string().min(1, 'Background color is required'),
    backgroundImage: z.string().optional(),
    primaryColor: z.string().min(1, 'Primary color is required'),
    secondaryColor: z.string().min(1, 'Secondary color is required'),
    accentColor: z.string().min(1, 'Accent color is required'),
    textColor: z.string().min(1, 'Text color is required'),
  }),
  gameConfig: z.object({
    maxWrongGuesses: z.number().min(1).max(10),
    soundEffects: z.object({
      correctGuess: z.string().min(1, 'Correct guess sound is required'),
      wrongGuess: z.string().min(1, 'Wrong guess sound is required'),
      wordComplete: z.string().min(1, 'Word complete sound is required'),
    }),
    navigationArrows: z.object({
      next: z.string().min(1, 'Next arrow image is required'),
      skip: z.string().min(1, 'Skip arrow image is required'),
    }),
  }),
  animation: z.object({
    alphabetAnimation: z.enum(['fade', 'bounce', 'slide', 'flip']),
    wordCompleteAnimation: z.enum(['confetti', 'fireworks', 'sparkle']),
    transitionSpeed: z.enum(['slow', 'medium', 'fast']),
    nextSkipAnimation: z.enum(['fade', 'bounce', 'slide', 'flip', 'shake', 'tilt']),
  })
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormModalProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (assessment: AssessmentData) => void;
  selectedAssessment?: AssessmentData
  onCancel: () => void;
}

const defaultTheme: ThemeConfig = {
  backgroundColor: '#1e293b',
  primaryColor: '#fbbf24',
  secondaryColor: '#ffffff',
  accentColor: '#22c55e',
  textColor: '#ffffff',
};

const defaultAnimations: AnimationConfig = {
  alphabetAnimation: 'fade',
  wordCompleteAnimation: 'confetti',
  transitionSpeed: 'medium',
  nextSkipAnimation: 'tilt',
};

const defaultGameConfig: GameConfig = {
  maxWrongGuesses: 5,
  soundEffects: {
    correctGuess: '/sound/level-up.mp3',
    wrongGuess: '/sound/failure.mp3',
    wordComplete: '/sound/winSound.aac',
  },
  navigationArrows: {
    next: '/images/green-arrow.png',
    skip: '/images/orange-arrow.png',
  },
};
const AssessmentFormModal = ({ isOpen, onSubmit, onCancel, selectedAssessment }: AssessmentFormModalProps) => {
  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: '',
      words: [{ word: '', hint: '' }],
      theme: {
        backgroundColor: defaultTheme.backgroundColor,
        backgroundImage: defaultTheme.backgroundImage,
        primaryColor: defaultTheme.primaryColor,
        secondaryColor: defaultTheme.secondaryColor,
        accentColor: defaultTheme.accentColor,
        textColor: defaultTheme.textColor,
      },
      animation: defaultAnimations,
      gameConfig: {
        maxWrongGuesses: defaultGameConfig.maxWrongGuesses,
        soundEffects: {
          correctGuess: defaultGameConfig.soundEffects.correctGuess,
          wrongGuess: defaultGameConfig.soundEffects.wrongGuess,
          wordComplete: defaultGameConfig.soundEffects.wordComplete,
        },
        navigationArrows: {
          next: defaultGameConfig.navigationArrows.next,
          skip: defaultGameConfig.navigationArrows.skip,
        },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'words',
  });

  const handleSubmit = (data: AssessmentFormData) => {
    const assessment: AssessmentData = {
      id: selectedAssessment?.id || Date.now().toString(),
      title: data.title,
      type: 'guess-the-word',
      words: data.words.map((word, index) => ({
        id: (index + 1).toString(),
        word: word.word.toUpperCase(),
        hint: word.hint,
      })),
      theme: {
        backgroundColor: data.theme.backgroundColor,
        backgroundImage: data.theme.backgroundImage,
        primaryColor: data.theme.primaryColor,
        secondaryColor: data.theme.secondaryColor,
        accentColor: data.theme.accentColor,
        textColor: data.theme.textColor,
      },
      animations: {
        alphabetAnimation: data.animation.alphabetAnimation,
        wordCompleteAnimation: data.animation.wordCompleteAnimation,
        transitionSpeed: data.animation.transitionSpeed,
        nextSkipAnimation: data.animation.nextSkipAnimation,
      },
      gameConfig: {
        maxWrongGuesses: data.gameConfig.maxWrongGuesses,
        soundEffects: {
          correctGuess: data.gameConfig.soundEffects.correctGuess,
          wrongGuess: data.gameConfig.soundEffects.wrongGuess,
          wordComplete: data.gameConfig.soundEffects.wordComplete,
        },
        navigationArrows: {
          next: data.gameConfig.navigationArrows.next,
          skip: data.gameConfig.navigationArrows.skip,
        },
      }
    }
    onSubmit(assessment);
    form.reset();
    onCancel();
  };

  const handleCancel = () => {
    form.reset();
    onCancel()
  };

  useEffect(() => {
    // Reset form to default values when selectedAssessment is null
    if (!selectedAssessment) {
      form.reset({
        title: '',
        words: [{ word: '', hint: '' }],
      });
    } else {
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
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="p-0 border-0">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-900">
            <div className="flex justify-between items-center">
              <h2 id="modalTitle" className="text-xl font-bold text-white flex items-center gap-2">
                🎯 {selectedAssessment ? 'Edit Assessment' : 'Create New Assessment'}
              </h2>
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
                              className="text-red-600 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded-full transition"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Theme Configuration Section */}
                <div>
                  <h2 className='text-lg font-semibold text-gray-800 mb-2'>Theme Configuration</h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="theme.backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="theme.backgroundImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="theme.primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="theme.secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="theme.accentColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accent Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="theme.textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Animation Configuration Section */}
                <div>
                  <h2 className='text-lg font-semibold text-gray-800 mb-2'>Animation Configuration</h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="animation.alphabetAnimation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alphabet Animation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select animation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white text-black shadow-lg border border-gray-200 rounded-md">
                                <SelectItem value="fade" className="bg-white hover:bg-gray-100">
                                  Fade
                                </SelectItem>
                                <SelectItem value="bounce" className="bg-white hover:bg-gray-100">
                                  Bounce
                                </SelectItem>
                                <SelectItem value="slide" className="bg-white hover:bg-gray-100">
                                  Slide
                                </SelectItem>
                                <SelectItem value="flip" className="bg-white hover:bg-gray-100">
                                  Flip
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="animation.wordCompleteAnimation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Complete Animation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select animation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white text-black shadow-lg border border-gray-200 rounded-md">
                                <SelectItem value="confetti">Confetti</SelectItem>
                                <SelectItem value="fireworks">Fireworks</SelectItem>
                                <SelectItem value="sparkle">Sparkle</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animation.transitionSpeed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transition Speed</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select speed" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white text-black shadow-lg border border-gray-200 rounded-md">
                                <SelectItem value="slow">Slow</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="fast">Fast</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animation.nextSkipAnimation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next/Skip Buton Animation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Animation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white text-black shadow-lg border border-gray-200 rounded-md">
                                <SelectItem value="fade">Fade</SelectItem>
                                <SelectItem value="bounce">Bounce</SelectItem>
                                <SelectItem value="slide">Slide</SelectItem>
                                <SelectItem value="flip">Flip</SelectItem>
                                <SelectItem value="shake">Shake</SelectItem>
                                <SelectItem value="tilt">Tilt</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Game Configuration Card */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Game Configuration</h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <FormField
                      control={form.control}
                      name="gameConfig.maxWrongGuesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Wrong Guesses <span className='text-sm text-red'>(Number between 1 and 10)</span></FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4 mt-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Sound Effects</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gameConfig.soundEffects.correctGuess"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Correct Guess Sound</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter sound file path" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gameConfig.soundEffects.wrongGuess"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wrong Guess Sound</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter sound file path" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gameConfig.soundEffects.wordComplete"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Word Complete Sound</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter sound file path" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 mt-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Navigation Arrows</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gameConfig.navigationArrows.next"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Next Arrow Image</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter image path" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gameConfig.navigationArrows.skip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skip Arrow Image</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter image path" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-10">
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