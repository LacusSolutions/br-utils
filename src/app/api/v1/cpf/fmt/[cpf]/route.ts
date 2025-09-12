import { NextRequest, NextResponse } from 'next/server';
import { cpf as cpfUtils } from 'br-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const { cpf: cpfValue } = await params;
    const { searchParams } = new URL(request.url);
    const dotKey = searchParams.get('dot_key') ?? '.';
    const dashKey = searchParams.get('dash_key') ?? '-';
    const escape = searchParams.get('escape') === 'true';
    const hidden = searchParams.get('hidden') === 'true';
    const hiddenKey = searchParams.get('hidden_key') ?? '*';
    const hiddenStart = searchParams.get('hidden_start') ?? '3';
    const hiddenEnd = searchParams.get('hidden_end') ?? '10';
    const result = cpfUtils.format(cpfValue, {
      delimiters: {
        dot: dotKey,
        dash: dashKey,
      },
      escape,
      hidden,
      hiddenKey,
      hiddenRange: {
        start: parseInt(hiddenStart),
        end: parseInt(hiddenEnd),
      },
      onFail() {
        throw new TypeError();
      },
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
      { error: 'Unable to format CPF.' },
      { status: 500 },
    );
  }
}
