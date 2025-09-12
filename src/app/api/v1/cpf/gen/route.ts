import { NextRequest, NextResponse } from 'next/server';
import { cpf as cpfUtils } from 'br-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || undefined;
    const format = searchParams.get('format') === 'true';
    const result = cpfUtils.generate({
      prefix,
      format,
    });

    return NextResponse.json(
      { result },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: 'Unable to generate CPF.' },
      { status: 500 },
    );
  }
}
