import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MaterialBundle } from '../types/material';
import Layout from '@/components/Layout';

export default function MaterialView() {
  const { id } = useParams();
  const [material, setMaterial] = useState<MaterialBundle | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'printables'>('overview');

  useEffect(() => {
    // TODO: Fetch material data
    // For now, using mock data
    if (id === '1') {
      setMaterial({
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
      });
    }
  }, [id]);

  if (!material) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{material.title}</h1>
          <p className="mt-2 text-gray-600">{material.description}</p>
        </div>
        <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
          Assign/Schedule
        </button>
      </div>

      {/* Metadata Tags */}
      <div className="flex flex-wrap gap-2">
        {material.metadata.grades.map(grade => (
          <span key={grade} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Grade {grade}
          </span>
        ))}
        {material.metadata.tags.map(tag => (
          <span key={tag.id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            {tag.name}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'content', 'printables'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Intro Video */}
              {material.contents.introVideo && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Introduction</h2>
                  <div className="aspect-video bg-gray-100 rounded-lg">
                    {/* Video player would go here */}
                    <div className="w-full h-full flex items-center justify-center">
                      Video Player
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Learning Objectives</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Understand different types of emotions</li>
                  <li>Recognize emotional expressions</li>
                  <li>Learn appropriate responses to emotions</li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Material Details</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Duration</dt>
                    <dd className="font-medium text-gray-900">45 minutes</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Subject</dt>
                    <dd className="font-medium text-gray-900">{material.metadata.subject}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Last Updated</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(material.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Learning Videos */}
            {material.contents.learningVideos && material.contents.learningVideos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Learning Videos</h2>
                <div className="grid grid-cols-3 gap-4">
                  {material.contents.learningVideos.map(video => (
                    <div key={video.id} className="bg-white rounded-lg shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg" />
                      <div className="p-4">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-500">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {material.contents.activities && material.contents.activities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Activities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {material.contents.activities.map(activity => (
                    <div key={activity.id} className="bg-white p-4 rounded-lg shadow">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-500 mt-2">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Games */}
            {material.contents.games && material.contents.games.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Games</h2>
                <div className="grid grid-cols-2 gap-4">
                  {material.contents.games.map(game => (
                    <div key={game.id} className="bg-white p-4 rounded-lg shadow">
                      <h3 className="font-medium">{game.title}</h3>
                      <p className="text-sm text-gray-500 mt-2">{game.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'printables' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {material.contents.printables?.map(printable => (
                <div key={printable.id} className="bg-white rounded-lg shadow">
                  <div className="aspect-[3/4] bg-gray-100 rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="font-medium">{printable.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{printable.description}</p>
                    <button className="mt-3 text-pink-600 hover:text-pink-700 text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}