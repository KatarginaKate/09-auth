import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Use fetch instead of a missing axios instance. Base URL can be provided
    // via NEXT_PUBLIC_API_URL; otherwise request is sent to relative /auth/logout.
    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    await fetch(`${base}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    // fetch throws generic errors; log and return 500
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}