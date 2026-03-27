import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL;

    if (!MEDIA_BASE_URL) {
      throw new Error('MEDIA_BASE_URL is not defined');
    }

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    if (!fileUrl.startsWith(MEDIA_BASE_URL)) {
      return NextResponse.json({ error: 'Invalid file URL domain' }, { status: 400 });
    }

    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RiddleLoader/1.0)',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch file: ${response.status}` }, { status: response.status });
    }

    const content = await response.text();

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
        'Cache-Control': 'public, max-age=3600', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error fetching riddle file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
