import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, X, Plus, Search, Book, Camera, Trash2 } from 'lucide-react';
import {fetchGenre} from "../../actions/genreAction";
import { Genre } from "../../types/genre/genreDetails";
import { uploadContent } from '../../actions/novelAction';
// ==================== TYPES ====================
interface Chapter {
  id: string;
  title: string;
  content?: string; // For novels
  images?: File[]; // For manga
}

interface ContentData {
  type: 'novel' | 'manga';
  title: string;
  description: string;
  genres: string[];
  cover_image: File | null;
  chapters: Chapter[];
}

interface FormErrors {
  title?: string;
  description?: string;
  genres?: string;
  cover_image?: string;
  chapters?: string;
}

// ====================== HOOKS =======================
  
// ==================== COMPONENTS ====================

// Genre Selector Component
const GenreSelector: React.FC<{
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  error?: string;
}> = ({ selectedGenres, onGenreToggle, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  useEffect(() =>{
    const loadGenres = async () => {
        const data = await fetchGenre();
        setAllGenres(data);
        };
        loadGenres();
  }, []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Genres *
      </label>
      
      {/* Selected Genres */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg border">
          {selectedGenres.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-600 text-white font-medium"
            >
              {genre}
              <button
                type="button"
                onClick={() => onGenreToggle(genre)}
                className="ml-2 text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Box */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search genres..."
          className="text-black w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Genre Options */}
      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
        {allGenres.length > 0 ? (
          allGenres.map((genre) => (
            <button
              key={genre.name}
              type="button"
              onClick={() => onGenreToggle(genre.name)}
              className={`bg-white w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedGenres.includes(genre.name)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {genre.name}
              {selectedGenres.includes(genre.name) && (
                <span className="float-right text-blue-600">✓</span>
              )}
            </button>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-500 text-center">
            No genres found
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Image Preview Component
const ImagePreview: React.FC<{
  images: File[];
  onRemove: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}> = ({ images, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          Images Preview ({images.length} files)
        </h4>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={URL.createObjectURL(image)}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Page Number */}
              <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                {index + 1}
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* File Name */}
            <p className="text-xs text-gray-500 mt-1 truncate" title={image.name}>
              {image.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chapter Component
const ChapterComponent: React.FC<{
  chapter: Chapter;
  index: number;
  type: 'novel' | 'manga';
  onUpdate: (updates: Partial<Chapter>) => void;
  onRemove: () => void;
}> = ({ chapter, index, type, onUpdate, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      onUpdate({ images: imageFiles });
    }
  };

  const removeImage = (imageIndex: number) => {
    const newImages = chapter.images?.filter((_, i) => i !== imageIndex) || [];
    onUpdate({ images: newImages });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Chapter {index + 1}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Chapter Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter Title *
          </label>
          <input
            type="text"
            value={chapter.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-black bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter chapter title"
          />
        </div>

        {/* Novel Content */}
        {type === 'novel' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={chapter.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={8}
              className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Write your chapter content here..."
            />
          </div>
        )}

        {/* Manga Images */}
        {type === 'manga' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images *
            </label>
            
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WebP up to 10MB each
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image Preview */}
            <ImagePreview
              images={chapter.images || []}
              onRemove={removeImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const UploadScreen: React.FC = () => {
  const [formData, setFormData] = useState<ContentData>({
    type: 'novel',
    title: '',
    description: '',
    genres: [],
    cover_image: null,
    chapters: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ==================== HANDLERS ====================
  
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, cover_image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      
      if (errors.cover_image) {
        setErrors(prev => ({ ...prev, cover_image: undefined }));
      }
    }
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
    
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: undefined }));
    }
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      ...(formData.type === 'novel' ? { content: '' } : { images: [] })
    };
    
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const updateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, ...updates } : chapter
      )
    }));
  };

  const removeChapter = (chapterId: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.genres.length === 0) newErrors.genres = 'At least one genre is required';
    if (!formData.cover_image) newErrors.cover_image = 'Cover image is required';
    
    if (formData.chapters.length === 0) {
      newErrors.chapters = 'At least one chapter is required';
    } else {
      const hasInvalidChapter = formData.chapters.some(chapter => {
        if (!chapter.title.trim()) return true;
        if (formData.type === 'novel' && !chapter.content?.trim()) return true;
        if (formData.type === 'manga' && (!chapter.images || chapter.images.length === 0)) return true;
        return false;
      });

      if (hasInvalidChapter) {
        newErrors.chapters = 'All chapters must have a title and content/images';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await uploadContent(formData);
      console.log('Uploaded:', result);
      alert(`${formData.type === 'novel' ? 'Novel' : 'Manga'} uploaded successfully!`);      
      // Reset form
      setFormData({
        type: 'novel',
        title: '',
        description: '',
        genres: [],
        cover_image: null,
        chapters: []
      });
      setCoverPreview('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== RENDER ====================
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Content</h1>
          <p className="text-gray-600">Share your story with the world</p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-8">
          {/* Content Type */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Content Type</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'novel', icon: Book, label: 'Novel', desc: 'Text-based storytelling' },
                { type: 'manga', icon: Camera, label: 'Manga', desc: 'Visual storytelling' }
              ].map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type as 'novel' | 'manga', chapters: [] }))}
                  className={`bg-white p-4 rounded-lg border-2 transition-all text-left ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${formData.type === type ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${formData.type === type ? 'text-blue-900' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </div>
                  <p className={`text-sm ${formData.type === type ? 'text-blue-700' : 'text-gray-500'}`}>
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Title & Description */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`text-black w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`text-black w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your story..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image *</label>
                <div className="space-y-3">
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className={`aspect-[3/4] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      errors.cover_image ? 'border-red-500' : 'border-gray-300'
                    } ${coverPreview ? 'border-solid' : ''}`}
                  >
                    {coverPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverPreview('');
                            setFormData(prev => ({ ...prev, cover_image: null }));
                            if (coverInputRef.current) {
                              coverInputRef.current.value = '';
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="text-sm text-center">Click to upload cover</p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  {errors.cover_image && <p className="text-red-500 text-sm">{errors.cover_image}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <GenreSelector
              selectedGenres={formData.genres}
              onGenreToggle={toggleGenre}
              error={errors.genres}
            />
          </div>

          {/* Chapters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Chapters</h2>
              <button
                type="button"
                onClick={addChapter}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </button>
            </div>

            {formData.chapters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Book className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-1">No chapters yet</p>
                <p className="text-sm">Click "Add Chapter" to start writing your story</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.chapters.map((chapter, index) => (
                  <ChapterComponent
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    type={formData.type}
                    onUpdate={(updates) => updateChapter(chapter.id, updates)}
                    onRemove={() => removeChapter(chapter.id)}
                  />
                ))}
              </div>
            )}
            
            {errors.chapters && <p className="text-red-500 text-sm mt-4">{errors.chapters}</p>}
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-3" />
                    Publish {formData.type === 'novel' ? 'Novel' : 'Manga'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;