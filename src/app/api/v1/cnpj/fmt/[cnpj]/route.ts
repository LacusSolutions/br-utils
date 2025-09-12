import { NextRequest, NextResponse } from 'next/server';
import { cnpj as cnpjUtils } from 'br-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  try {
    const { cnpj: cnpjValue } = await params;
    const { searchParams } = new URL(request.url);
    const dotKey = searchParams.get('dot_key') ?? '.';
    const slashKey = searchParams.get('slash_key') ?? '/';
    const dashKey = searchParams.get('dash_key') ?? '-';
    const escape = searchParams.get('escape') === 'true';
    const hidden = searchParams.get('hidden') === 'true';
    const hiddenKey = searchParams.get('hidden_key') ?? '*';
    const hiddenStart = searchParams.get('hidden_start') || '5';
    const hiddenEnd = searchParams.get('hidden_end') || '13';
    const result = cnpjUtils.format(cnpjValue, {
      delimiters: {
        dot: dotKey,
        slash: slashKey,
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
      { error: 'Unable to format CNPJ.' },
      { status: 500 },
    );
  }
}
