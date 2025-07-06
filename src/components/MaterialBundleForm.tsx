import { useState } from 'react';
import { MaterialBundle, MaterialContent, MaterialTag, GradeLevel, MaterialMetadata } from '../types/material';

interface MaterialBundleFormProps {
  initialData?: MaterialBundle;
  onSubmit: (data: MaterialBundle) => void;
  onCancel: () => void;
}

const DEFAULT_METADATA: MaterialMetadata = {
  grades: [],
  tags: [],
};

const DEFAULT_BUNDLE: MaterialBundle = {
  id: '',
  title: '',
  description: '',
  metadata: DEFAULT_METADATA,
  contents: {
    introVideo: undefined,
    learningVideos: [],
    activities: [],
    games: [],
    assessments: [],
    printables: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'Teacher',
  status: 'draft',
};

export default function MaterialBundleForm({
  initialData = DEFAULT_BUNDLE,
  onSubmit,
  onCancel,
}: MaterialBundleFormProps) {
  const [formData, setFormData] = useState<MaterialBundle>(initialData);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'metadata'>('basic');

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetadataChange = (field: keyof MaterialMetadata, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const handleGradeToggle = (grade: GradeLevel) => {
    const grades = formData.metadata.grades || [];
    const updatedGrades = grades.includes(grade)
      ? grades.filter(g => g !== grade)
      : [...grades, grade];
    handleMetadataChange('grades', updatedGrades);
  };

  const handleTagToggle = (tag: MaterialTag) => {
    const currentTags = formData.metadata.tags || [];
    const tagExists = currentTags.find(t => t.id === tag.id);
    const updatedTags = tagExists
      ? currentTags.filter(t => t.id !== tag.id)
      : [...currentTags, tag];
    handleMetadataChange('tags', updatedTags);
  };

  const handleContentAdd = (type: keyof MaterialBundle['contents'], content: MaterialContent) => {
    setFormData(prev => ({
      ...prev,
      contents: {
        ...prev.contents,
        [type]: Array.isArray(prev.contents[type])
          ? [...(prev.contents[type] || []), content]
          : content,
      },
    }));
  };

  const handleContentRemove = (type: keyof MaterialBundle['contents'], contentId: string) => {
    setFormData(prev => ({
      ...prev,
      contents: {
        ...prev.contents,
        [type]: Array.isArray(prev.contents[type])
          ? (prev.contents[type] as MaterialContent[]).filter(c => c.id !== contentId)
          : undefined,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'basic' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Information
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('metadata')}
        >
          Metadata
        </button>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleBasicInfoChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleBasicInfoChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => {
                // TODO: Handle file upload
              }}
            />
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Intro Video Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Intro Video</h3>
            {/* TODO: Add video upload/embed component */}
          </div>

          {/* Learning Videos Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Learning Videos</h3>
            {/* TODO: Add multiple video upload/embed component */}
          </div>

          {/* Activities Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Activities</h3>
            {/* TODO: Add activity creation component */}
          </div>

          {/* Games Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Games</h3>
            {/* TODO: Add game selection/configuration component */}
          </div>

          {/* Assessments Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Assessments</h3>
            {/* TODO: Add assessment creation/selection component */}
          </div>

          {/* Printables Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Printables</h3>
            {/* TODO: Add file upload component for printables */}
          </div>
        </div>
      )}

      {/* Metadata Tab */}
      {activeTab === 'metadata' && (
        <div className="space-y-6">
          {/* Grade Levels */}
          <div>
            <h3 className="text-lg font-medium mb-2">Grade Levels</h3>
            <div className="flex flex-wrap gap-2">
              {['K', '1', '2', '3', '4', '5', '6'].map(grade => (
                <button
                  key={grade}
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.metadata.grades.includes(grade as GradeLevel)
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleGradeToggle(grade as GradeLevel)}
                >
                  {grade === 'K' ? 'K' : `Grade ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subject/Tags */}
          <div>
            <h3 className="text-lg font-medium mb-2">Subjects & Tags</h3>
            {/* TODO: Add tag selection component */}
          </div>

          {/* Additional Metadata */}
          <div>
            <h3 className="text-lg font-medium mb-2">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.metadata.language || ''}
                  onChange={(e) => handleMetadataChange('language', e.target.value)}
                >
                  <option value="">Select Language</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  {/* Add more languages as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.metadata.difficulty || ''}
                  onChange={(e) => handleMetadataChange('difficulty', e.target.value)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
        <button
          type="button"
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          {initialData.id ? 'Update Material' : 'Create Material'}
        </button>
      </div>
    </form>
  );
}