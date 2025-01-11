'use server';

import { cookies } from 'next/headers';

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('firebaseToken'); // Delete the cookie
  return new Response('Cookie deleted successfully', { status: 200 });
}
