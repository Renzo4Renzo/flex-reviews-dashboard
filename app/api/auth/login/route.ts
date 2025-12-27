import { NextResponse } from 'next/server';

const VALID_EMAIL = 'manager@flex.com';
const VALID_PASSWORD = 'flex2024';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const response = NextResponse.json({ success: true });

      response.cookies.set('auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
