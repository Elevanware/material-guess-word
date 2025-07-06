import { useState } from 'react';
import { MaterialFilter, MaterialSort, GradeLevel, MaterialType, MaterialTag } from '../types/material';

interface MaterialFilterBarProps {
  onFilterChange: (filters: MaterialFilter) => void;
  onSortChange: (sort: MaterialSort) => void;
  currentFilters: MaterialFilter;
  currentSort: MaterialSort;
}

const GRADE_LEVELS: GradeLevel[] = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'video', label: 'Videos' },
  { value: 'activity', label: 'Activities' },
  { value: 'game', label: 'Games' },
  { value: 'assessment', label: 'Assessments' },
  { value: 'document', label: 'Documents' },
  { value: 'image', label: 'Images' },
];

const COMMON_TAGS: MaterialTag[] = [
  { id: '1', name: 'SEL', category: 'Subject' },
  { id: '2', name: 'Math', category: 'Subject' },
  { id: '3', name: 'Language Arts', category: 'Subject' },
  { id: '4', name: 'Science', category: 'Subject' },
  { id: '5', name: 'Social Studies', category: 'Subject' },
];

export default function MaterialFilterBar({
  onFilterChange,
  onSortChange,
  currentFilters,
  currentSort,
}: MaterialFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ ...currentFilters, search: value });
  };

  const handleGradeChange = (grade: GradeLevel) => {
    const grades = currentFilters.grades || [];
    const updatedGrades = grades.includes(grade)
      ? grades.filter(g => g !== grade)
      : [...grades, grade];
    onFilterChange({ ...currentFilters, grades: updatedGrades });
  };

  const handleTypeChange = (type: MaterialType) => {
    const types = currentFilters.types || [];
    const updatedTypes = types.includes(type)
      ? types.filter(t => t !== type)
      : [...types, type];
    onFilterChange({ ...currentFilters, types: updatedTypes });
  };

  const handleTagChange = (tagId: string) => {
    const tags = currentFilters.tags || [];
    const updatedTags = tags.includes(tagId)
      ? tags.filter(t => t !== tagId)
      : [...tags, tagId];
    onFilterChange({ ...currentFilters, tags: updatedTags });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search materials..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="absolute right-3 top-2.5 text-gray-400">
          {/* TODO: Add search icon */}
        </span>
      </div>

      {/* Grade Level Filter */}
      <div>
        <h3 className="font-semibold mb-2">Grade Level</h3>
        <div className="flex flex-wrap gap-2">
          {GRADE_LEVELS.map(grade => (
            <button
              key={grade}
              className={`px-3 py-1 rounded-full text-sm ${
                currentFilters.grades?.includes(grade)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleGradeChange(grade)}
            >
              {grade === 'K' ? 'K' : `Grade ${grade}`}
            </button>
          ))}
        </div>
      </div>

      {/* Material Type Filter */}
      <div>
        <h3 className="font-semibold mb-2">Material Type</h3>
        <div className="flex flex-wrap gap-2">
          {MATERIAL_TYPES.map(({ value, label }) => (
            <button
              key={value}
              className={`px-3 py-1 rounded-full text-sm ${
                currentFilters.types?.includes(value)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject/Tag Filter */}
      <div>
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map(tag => (
            <button
              key={tag.id}
              className={`px-3 py-1 rounded-full text-sm ${
                currentFilters.tags?.includes(tag.id)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTagChange(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          value={`${currentSort.field}-${currentSort.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-') as [MaterialSort['field'], MaterialSort['direction']];
            onSortChange({ field, direction });
          }}
        >
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="updatedAt-desc">Recently Updated</option>
        </select>
      </div>
    </div>
  );
}