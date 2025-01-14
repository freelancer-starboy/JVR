
export async function POST(req) {
  try {
    const { token } = await req.json();
    const response = new Response(JSON.stringify({ message: 'Token saved successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    if (token) {
        response.headers.set(
          'Set-Cookie',
          `firebaseToken=${token}; Max-Age=${30 * 24 * 60 * 60}; Path=/; HttpOnly; ${
            process.env.NODE_ENV === 'production' ? 'Secure' : ''
          }`
        );
      } else {
        throw new Error('Token is missing or invalid');
      }
  
      return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save token' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
