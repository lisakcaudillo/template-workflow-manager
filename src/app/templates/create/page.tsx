'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { workflowPresets } from '@/data/mockData';
import { WorkflowPreset } from '@/types';
import { FXDATemplate } from '@/types/fxda';
import DocumentCanvas from '@/components/DocumentCanvas';
import { ArrowLeft, Sparkles, Upload, FileText, Wand2, CheckCircle } from 'lucide-react';

type CreationMethod = 'ai' | 'upload' | 'scratch';
type Step = 'method' | 'generate' | 'preview' | 'workflow' | 'complete';

export default function CreateTemplatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<CreationMethod>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // FXDA Template
  const [fxdaTemplate, setFxdaTemplate] = useState<FXDATemplate | null>(null);
  
  // Workflow
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowPreset | null>(null);

  const handleMethodSelect = (selectedMethod: CreationMethod) => {
    setMethod(selectedMethod);
    setStep('generate');
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Call the AI generation API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      
      const fxdaData: FXDATemplate = await response.json();
      setFxdaTemplate(fxdaData);
      
      // Auto-select suggested workflow
      if (fxdaData.workflowPresetId) {
        const suggested = workflowPresets.find(w => w.id === fxdaData.workflowPresetId);
        if (suggested) setSelectedWorkflow(suggested);
      }
      
      setStep('preview');
    } catch (error) {
      console.error('Failed to generate template:', error);
      alert('Failed to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!fxdaTemplate || !selectedWorkflow) return;
    
    // In a real app, this would save to backend
    console.log('Saving template:', {
      fxda: fxdaTemplate,
      workflow: selectedWorkflow,
    });
    
    setStep('complete');
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
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {(['method', 'generate', 'preview', 'workflow', 'complete'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === s ? 'bg-primary-600 text-white' : 
                  ['method', 'generate', 'preview', 'workflow', 'complete'].indexOf(step) > idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
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

        {/* Step: Generate / AI Prompt */}
        {step === 'generate' && method === 'ai' && (
          <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Describe Your Template</h2>
              <p className="text-gray-600">Tell us what kind of template you need and we&apos;ll generate it in FXDA format</p>
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
              <p className="mt-2 text-sm text-gray-500">
                ✨ AI will generate a complete FXDA document with form fields positioned on a canvas
              </p>
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
                    Generating FXDA Template...
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

        {/* Step: Preview Canvas */}
        {step === 'preview' && fxdaTemplate && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Review Generated Template</h2>
                  <p className="text-gray-600">AI has generated your template in FXDA JSON format with positioned form fields</p>
                </div>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(fxdaTemplate, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${fxdaTemplate.documentId}.json`;
                    link.click();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Download FXDA JSON
                </button>
              </div>

              <DocumentCanvas fxdaDocument={fxdaTemplate} />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('generate')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Regenerate
              </button>
              <button
                onClick={() => setStep('workflow')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Continue to Workflow
              </button>
            </div>
          </div>
        )}

        {/* Step: Workflow Selection */}
        {step === 'workflow' && fxdaTemplate && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Apply Workflow Preset</h2>
              <p className="text-gray-600">Select a workflow to apply to your template - this determines signing order, parties, and approval requirements</p>
            </div>

            {/* AI Suggestion */}
            {selectedWorkflow && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">AI Recommended Workflow</h3>
                    <p className="text-sm text-blue-800">
                      Based on your template, we recommend: <strong>{selectedWorkflow.name}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    {preset.requiresApproval && <span>• Requires approval</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Preview
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!selectedWorkflow}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Apply Workflow & Save Template
              </button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && fxdaTemplate && selectedWorkflow && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Template Created Successfully!</h2>
                <p className="text-gray-600">
                  Your template has been generated in FXDA format with workflow preset applied
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Template Name:</span>
                  <span className="font-semibold">{fxdaTemplate.documentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{fxdaTemplate.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Form Fields:</span>
                  <span className="font-semibold">{fxdaTemplate.fields.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Workflow:</span>
                  <span className="font-semibold">{selectedWorkflow.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Document ID:</span>
                  <span className="font-mono text-xs">{fxdaTemplate.documentId}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-sm text-gray-600">
                  🎉 In a production environment, this template would now be:
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-1 max-w-md mx-auto">
                  <li>✓ Saved to Foxit DMS with versioning</li>
                  <li>✓ Available for reuse across teams</li>
                  <li>✓ Ready to forward to eSign with pre-configured workflow</li>
                  <li>✓ Discoverable through template library</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(fxdaTemplate, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${fxdaTemplate.documentId}.json`;
                    link.click();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Download FXDA JSON
                </button>
                <Link
                  href="/"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Back to Templates
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
