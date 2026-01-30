import { NextResponse } from 'next/server';
import { mockTemplates } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const template = mockTemplates.find(t => t.id === params.id);
  
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  
  return NextResponse.json(template);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  
  // In a real app, this would update the database
  const updatedTemplate = {
    ...body,
    id: params.id,
    updatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(updatedTemplate);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real app, this would delete from the database
  return NextResponse.json({ message: 'Template deleted' });
}
