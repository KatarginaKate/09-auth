import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const cookieHeader = allCookies
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    if (accessToken || refreshToken) {
      try {
        await api.post('/auth/logout', null, {
          headers: {
            Cookie: cookieHeader,
          },
        });
      } catch (error) {
        if (isAxiosError(error)) {
          const status = error.response?.status;

          if (status !== 401 && status !== 404) {
            logErrorResponse(error.response?.data);
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('sessionId');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}