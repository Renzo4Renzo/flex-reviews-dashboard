import { NextResponse } from 'next/server';

const VALID_EMAIL = process.env.AUTH_EMAIL;
const VALID_PASSWORD = process.env.AUTH_PASSWORD;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!VALID_EMAIL || !VALID_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

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
