import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    
    // Fetch stories from external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/stories`,
      {
        params: { page, limit },
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    // Cache response for 5 minutes
    const headers = new Headers({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      'Content-Type': 'application/json',
    });

    // Return the stories data
    return new NextResponse(
      JSON.stringify({
        stories: response.data.stories || [],
        pagination: response.data.pagination || null,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error fetching stories:', error);
    
    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to fetch stories';
      
      return NextResponse.json(
        { 
          error: message,
          stories: [],
        },
        { status }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        stories: [],
      },
      { status: 500 }
    );
  }
}
