import { useState } from 'react';
import { MaterialBundle, MaterialFilter, MaterialSort, MaterialLibraryState } from '../types/material';
import MaterialFilterBar from '../components/MaterialFilterBar';
import MaterialBundleForm from '../components/MaterialBundleForm';
import { Dialog, DialogContent } from '../components/ui/dialog';
import Layout from '@/components/Layout';

const MOCK_BUNDLES: MaterialBundle[] = [
  {
    id: '1',
    title: "Let's Learn Our Emotions",
    description: "This recommended bundled lesson reinforces emotions vocabulary and teaches students examples of different types of feelings.",
    thumbnail: "/emotions-thumbnail.png",
    metadata: {
      grades: ['K', '1'],
      tags: [
        { id: '1', name: 'SEL', category: 'Subject' },
        { id: '2', name: 'Feelings/Emotions', category: 'Topic' }
      ],
      subject: 'Social Emotional Learning',
    },
    contents: {
      introVideo: {
        id: 'v1',
        title: 'Introduction to Emotions',
        type: 'video',
        description: 'An engaging introduction to different emotions',
        url: '/videos/intro-emotions.mp4',
        thumbnailUrl: '/thumbnails/intro-video.png',
        metadata: {
          grades: ['K', '1'],
          tags: [],
        },
        duration: 180,
      },
      activities: [],
      games: [],
      printables: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Teacher',
    status: 'published',
  },
];

export default function MaterialLibrary() {
  const [state, setState] = useState<MaterialLibraryState>({
    bundles: MOCK_BUNDLES,
    filters: {},
    sort: { field: 'createdAt', direction: 'desc' },
    loading: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<MaterialBundle | undefined>();

  const handleFilterChange = (newFilters: MaterialFilter) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  };

  const handleSortChange = (newSort: MaterialSort) => {
    setState(prev => ({
      ...prev,
      sort: newSort,
    }));
  };

  const handleCreateNew = () => {
    setEditingBundle(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (bundle: MaterialBundle) => {
    setEditingBundle(bundle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (bundle: MaterialBundle) => {
    if (editingBundle) {
      // Update existing bundle
      setState(prev => ({
        ...prev,
        bundles: prev.bundles.map(b => 
          b.id === bundle.id ? bundle : b
        ),
      }));
    } else {
      // Add new bundle
      setState(prev => ({
        ...prev,
        bundles: [...prev.bundles, { ...bundle, id: Date.now().toString() }],
      }));
    }
    setIsFormOpen(false);
    setEditingBundle(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBundle(undefined);
  };

  const renderMaterialCard = (bundle: MaterialBundle) => {
    return (
      <div key={bundle.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="relative aspect-video mb-4">
          {bundle.thumbnail && (
            <img 
              src={bundle.thumbnail} 
              alt={bundle.title}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{bundle.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {bundle.metadata.grades.map(grade => (
            <span key={grade} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Grade {grade}
            </span>
          ))}
          {bundle.metadata.tags.map(tag => (
            <span key={tag.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
            onClick={() => handleEdit(bundle)}
          >
            View Details
          </button>
          <span className="text-sm text-gray-500">
            {new Date(bundle.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Material Library</h1>
        <button 
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          onClick={handleCreateNew}
        >
          Create New Material
        </button>
      </div>

      <MaterialFilterBar
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentFilters={state.filters}
        currentSort={state.sort}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <MaterialBundleForm
            initialData={editingBundle}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.bundles.map(renderMaterialCard)}
      </div>
    </div>
    </Layout>
  );
}