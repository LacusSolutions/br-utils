import { NextRequest, NextResponse } from 'next/server';
import { cpf as cpfUtils } from 'br-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const { cpf: cpfValue } = await params;
    const { searchParams } = new URL(request.url);
    const dotKey = searchParams.get('dot_key') || undefined;
    const dashKey = searchParams.get('dash_key') || undefined;
    const escape = searchParams.get('escape') === 'true';
    const hidden = searchParams.get('hidden') === 'true';
    const hiddenKey = searchParams.get('hidden_key') || undefined;
    const hiddenStart = searchParams.get('hidden_start') || undefined;
    const hiddenEnd = searchParams.get('hidden_end') || undefined;
    const result = cpfUtils.format(cpfValue, {
      delimiters: {
        dot: dotKey,
        dash: dashKey,
      },
      escape,
      hidden,
      hiddenKey,
      hiddenRange: {
        start: hiddenStart ? parseInt(hiddenStart) : undefined,
        end: hiddenEnd ? parseInt(hiddenEnd) : undefined,
      },
      onFail() {
        throw new TypeError();
      },
    });

    return NextResponse.json(
      { result },
      {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: 'Unable to format CPF.' },
      { status: 500 },
    );
  }
}
