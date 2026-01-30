import { NextResponse } from 'next/server';

// Mock AI service for generating templates
export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock AI-generated template suggestions
  const aiResponse = {
    name: extractTemplateName(prompt),
    description: 'AI-generated template based on your description',
    category: extractCategory(prompt),
    documentStructure: generateDocumentStructure(prompt),
    fields: generateFields(prompt),
    suggestedWorkflowId: suggestWorkflow(prompt),
  };
  
  return NextResponse.json(aiResponse);
}

function extractTemplateName(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('nda') || lowerPrompt.includes('non-disclosure')) return 'AI-Generated NDA';
  if (lowerPrompt.includes('offer') || lowerPrompt.includes('employment')) return 'AI-Generated Offer Letter';
  if (lowerPrompt.includes('vendor') || lowerPrompt.includes('contract')) return 'AI-Generated Vendor Contract';
  return 'AI-Generated Template';
}

function extractCategory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('legal') || lowerPrompt.includes('nda')) return 'Legal';
  if (lowerPrompt.includes('hr') || lowerPrompt.includes('employee')) return 'HR';
  if (lowerPrompt.includes('vendor') || lowerPrompt.includes('procurement')) return 'Procurement';
  return 'General';
}

function generateDocumentStructure(prompt: string): string {
  return `AI-generated document structure including: introduction, main clauses based on your requirements, signature section, and standard legal disclaimers.`;
}

function generateFields(prompt: string): any[] {
  const baseFields = [
    { id: 'f1', name: 'Party 1 Name', type: 'text', required: true, party: 1 },
    { id: 'f2', name: 'Party 1 Signature', type: 'signature', required: true, party: 1 },
    { id: 'f3', name: 'Date', type: 'date', required: true },
  ];
  
  // Add more fields based on content
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('2 part') || lowerPrompt.includes('two part')) {
    baseFields.push(
      { id: 'f4', name: 'Party 2 Name', type: 'text', required: true, party: 2 },
      { id: 'f5', name: 'Party 2 Signature', type: 'signature', required: true, party: 2 }
    );
  }
  
  return baseFields;
}

function suggestWorkflow(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('nda')) return 'nda-standard';
  if (lowerPrompt.includes('offer')) return 'hr-offer';
  if (lowerPrompt.includes('vendor')) return 'vendor-contract';
  return 'simple-agreement';
}
