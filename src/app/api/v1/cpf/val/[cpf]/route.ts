import { NextRequest, NextResponse } from 'next/server';
import { cpf as cpfUtils } from 'br-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { cpf: string } }
) {
  try {
    const { cpf: cpfValue } = params;
    const result = cpfUtils.isValid(cpfValue);

    return NextResponse.json(
      { result },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to validate CPF.' },
      { status: 500 },
    );
  }
}
