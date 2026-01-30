'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockTemplates } from '@/data/mockData';
import { Template } from '@/types';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Template Workflow Manager</h1>
            </div>
            <Link
              href="/templates/create"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Template
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <Link href={`/templates/${template.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer h-full">
        {/* Thumbnail */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 h-32 flex items-center justify-center text-5xl">
          {template.thumbnail || '📄'}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">{template.name}</h3>
            {template.validated && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Validated
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

          {/* Workflow Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {template.workflowPreset?.parties || 0} Parties
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {template.workflowPreset?.signingOrder || 'N/A'}
            </span>
            {template.workflowPreset?.requiresApproval && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Approval Required
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">{template.category}</span>
            <span>Used {template.usageCount} times</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
