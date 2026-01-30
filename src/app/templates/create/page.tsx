'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { workflowPresets } from '@/data/mockData';
import { WorkflowPreset, FormField } from '@/types';
import { ArrowLeft, Sparkles, Upload, FileText, Wand2 } from 'lucide-react';

type CreationMethod = 'ai' | 'upload' | 'scratch';
type Step = 'method' | 'details' | 'fields' | 'workflow' | 'review';

export default function CreateTemplatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<CreationMethod>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Template details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Legal');
  const [documentStructure, setDocumentStructure] = useState('');
  
  // Fields
  const [fields, setFields] = useState<FormField[]>([]);
  
  // Workflow
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowPreset | null>(null);

  const handleMethodSelect = (selectedMethod: CreationMethod) => {
    setMethod(selectedMethod);
    if (selectedMethod === 'ai') {
      setStep('details');
    } else {
      setStep('details');
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI-generated content
    setName(aiPrompt.includes('NDA') ? 'AI-Generated NDA' : 'AI-Generated Agreement');
    setDescription('Automatically generated template based on your description');
    setDocumentStructure('AI-generated document structure with standard clauses and terms');
    setFields([
      { id: 'f1', name: 'Party 1 Name', type: 'text', required: true, party: 1 },
      { id: 'f2', name: 'Party 1 Signature', type: 'signature', required: true, party: 1 },
      { id: 'f3', name: 'Party 2 Name', type: 'text', required: true, party: 2 },
      { id: 'f4', name: 'Party 2 Signature', type: 'signature', required: true, party: 2 },
      { id: 'f5', name: 'Date', type: 'date', required: true },
    ]);
    
    setIsGenerating(false);
    setStep('workflow');
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    alert('Template created successfully!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {(['method', 'details', 'fields', 'workflow', 'review'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === s ? 'bg-primary-600 text-white' : 
                  ['method', 'details', 'fields', 'workflow', 'review'].indexOf(step) > idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {idx + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{s}</span>
                {idx < 4 && <div className="w-12 h-0.5 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step: Method Selection */}
        {step === 'method' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">How would you like to create your template?</h2>
              <p className="text-gray-600">Choose the method that best suits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI-Assisted */}
              <button
                onClick={() => handleMethodSelect('ai')}
                className="bg-white border-2 border-primary-200 rounded-lg p-6 hover:border-primary-500 transition-colors text-left group"
              >
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Assisted Generation</h3>
                <p className="text-sm text-gray-600">
                  Describe your template and let AI generate the structure and fields
                </p>
              </button>

              {/* Upload */}
              <button
                onClick={() => handleMethodSelect('upload')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors text-left group"
              >
                <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
                <p className="text-sm text-gray-600">
                  Upload an existing document and we&apos;ll recognize the fields
                </p>
              </button>

              {/* From Scratch */}
              <button
                onClick={() => handleMethodSelect('scratch')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors text-left group"
              >
                <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start from Scratch</h3>
                <p className="text-sm text-gray-600">
                  Manually create your template with full control
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step: Details / AI Prompt */}
        {step === 'details' && method === 'ai' && (
          <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Describe Your Template</h2>
              <p className="text-gray-600">Tell us what kind of template you need</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Description
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., 'Create a standard NDA for vendors with 2 parties signing sequentially, including confidentiality clauses and a 1-year term'"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('method')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Workflow Selection */}
        {step === 'workflow' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Select Workflow Preset</h2>
              <p className="text-gray-600">Choose a workflow configuration for your template</p>
            </div>

            {/* AI Suggestion */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">AI Recommendation</h3>
                  <p className="text-sm text-blue-800">
                    Based on your template, we recommend: <strong>{workflowPresets[0].name}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Presets */}
            <div className="space-y-4">
              {workflowPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedWorkflow(preset)}
                  className={`w-full bg-white border-2 rounded-lg p-6 text-left transition-colors ${
                    selectedWorkflow?.id === preset.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{preset.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {preset.parties} Parties
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">
                        {preset.signingOrder}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>• {preset.securityLevel} security</span>
                    <span>• Reminders every {preset.reminderDays} days</span>
                    <span>• Expires in {preset.expirationDays} days</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('details')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedWorkflow}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Template
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
