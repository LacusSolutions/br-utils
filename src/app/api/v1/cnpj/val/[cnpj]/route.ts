import { NextRequest, NextResponse } from 'next/server';
import { cnpj as cnpjUtils } from 'br-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  try {
    const { cnpj: cnpjValue } = await params;
    const result = cnpjUtils.isValid(cnpjValue);

    return NextResponse.json(
      { result },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to validate CNPJ.' },
      { status: 500 },
    );
  }
}
