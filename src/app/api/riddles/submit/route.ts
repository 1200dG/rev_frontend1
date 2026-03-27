import { NextRequest, NextResponse } from 'next/server';
import { RiddleSubmissionRequest, RiddleSubmissionResponse, ApiResponse } from '@/lib/types/common/types';
import { getRiddleById } from '@/lib/services/riddleActions';

export async function POST(request: NextRequest) {
  try {
    const body: RiddleSubmissionRequest = await request.json();
    const { riddle_id, solution, user_id } = body;

    if (!riddle_id || !solution || !user_id) {
      const errorResponse: ApiResponse<null> = {
        status: 400,
        message: 'Missing required fields: riddle_id, solution, and user_id are required',
        data: null,
        errors: { validation: ['Missing required fields'] }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    let expectedSolution: string;
    try {
      const riddleData = await getRiddleById(riddle_id);
      expectedSolution = riddleData.solution.answer;
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        status: 404,
        message: `Riddle with ID ${riddle_id} not found`,
        data: null,
        errors: { riddle: ['Riddle not found'] }
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const isCorrect = solution.answer.trim().toLowerCase() === expectedSolution.toLowerCase();

    const responseData: RiddleSubmissionResponse = {
      correct: isCorrect,
      message: isCorrect ? 'Correct solution!' : 'Incorrect solution. Try again!',
      score: isCorrect ? 100 : 0,
      lives_remaining: isCorrect ? undefined : 2 
    };

    const successResponse: ApiResponse<RiddleSubmissionResponse> = {
      status: 200,
      message: 'Solution submitted successfully',
      data: responseData,
      errors: null
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Error processing riddle submission:', error);
    
    const errorResponse: ApiResponse<null> = {
      status: 500,
      message: 'Internal server error',
      data: null,
      errors: { server: ['Failed to process submission'] }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
