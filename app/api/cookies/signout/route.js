'use server';

import { cookies } from 'next/headers';

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('firebaseToken'); // Delete the cookie
  return new Response(JSON.stringify({ success : true, message: 'Token deleted successfully' }), { status: 200 });
}
