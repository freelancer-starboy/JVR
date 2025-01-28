import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "jvr-auth",
      private_key_id: "4b01bd27144bfc5ee4b44e16a232ed92c5414587",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy+IXEHUO3baYC\ny0o9/qfPwK4pUgy46UTkz0Rka0Y0f9+/yOPOqdgf9H+saXv62qjz8IawxCb77IU1\n0SfyoxMCSsTmEKahqmxO2xQNFqwZQMLi/HvfphRk+D5cwIEIs9yst8H0pfb7sfsP\ncMwFCQfMUraIUrWc4tEIVWEVF8JsD9ivJP0hNqbDm/TF5aWwy3tsDWLusc0FyXTZ\ng6v8Sc6WkShqMb2J01RrB2g4ty9EwVAht5m9FVyY9auKyWjF+sB3OApsAn568pe9\n7u3iuIQAl96JffNdHnvYg+J9Ml4MJC0Ab44xLpYud2n61BDrA8zCvFzfBvtXuKY9\nKf/v6eyxAgMBAAECggEAMYNF5pq+CDoiinVZZctU+8nvpOjZMjL+51pcLnfrJU0X\nRsS6GYutijGnPLi2HxFtWod5i9/IdTvbIqdpqNvqv2CWFpwWrXUrn6lGY9SY6ieb\ngxac4qPc0o5HGnv7dr/j1jjERP3BVaLItV3cY6w65xEfBJn1OqEZeXe9cwtus1w7\nf1AH48RpConZItlJj6Rq5rflYeoSs0xc1MlPh+9vU7Yt+CJsEHcl72Z0EbuPzVdv\n4yo6iBHS62JdGA0CSVIRjyOdpF6SAXRidmOD/up71oUjzfG8qOj9RYC/Xvy0YRLR\nRkkd3AMS/3ZR78PbjpmGuRy711QXx+WG9lXPci0ynQKBgQDz/7a7tnnR3p4B2h+U\nO3lqkbAcAfPz3L+21TAs3C5rbip1UYY71OA81TTVrdRnlL0hbMCUY7kS/COwoLJJ\n74OA19UkVI2+RpmEH6XEPvfx1lPp5Ojm4YI4ZxxJVEMMg5iLEsUe3YfiSpf4DLap\n9gOwfV9FAF52rKM4FE5gJO3FGwKBgQC7xgOt0J6TiUYE7XZJlYqe6DCvtT7kOYdY\n4IgEOeO9I5uGZ2FkCx4fYrRg3hx28JEwt6yZ+v6/Co1+dajmL5GY3mnDkdrNDYct\nh91I1muTRDBo4yNO1c98fid/aOUa3a7bDeUdAisve/3PdM2moR2SvQUH4rnBrbvb\nwb8l+GmOIwKBgQC+sSQMEnGkjtpoUiOKAu1CV3gOe4xAE08VwgmzlaUFuwSdycgh\n7J4PjQWM1h0BkuI5RDhCAKn852exO/X7CKB6yrO+gAKDKcQC2YUBGcFHlRzh2FAZ\nWTcfg548xQjdt985GcNK+xGeznN0neMIc8ewYFtbnw00rHmnc19JjrLw7wKBgET5\nClbpX6Zf8SlUNHP5Cy8tqNyR3eUlQJMj/rJWtVG/Z5xqEvsVnl32+rzuOVRzL1HO\n1gbFjJeN/8Vo4L6U0I1vfTgKNm3Fv1a5Jk5f/KnejU2pyUlm/k0DZezGEgnZTiZG\np1cNeeF6URPIGtZPLja9WcC4xnTfJTcmptkCs3szAoGBAMsEtbH6TPervATCqrZL\nIeTC3RCT3V2Cbob9mjaNYn0tXRpoeMXpmW95HnJBTU5HrBhWf9b7PLcpY8MjZd8B\nYO0B7V0/vL0sgGdjPbk5lJJvJ53bnVHyIpte9ANYcIpkgcFhKNiLPugHwuWLRe3N\ns63GTbG+aBoLFH9V0Ov2H+02\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
      client_email: "firebase-adminsdk-osaeu@jvr-auth.iam.gserviceaccount.com",
      client_id: "108142129351505147280",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-osaeu%40jvr-auth.iam.gserviceaccount.com",
    }),
  });
}

// Export the admin instance for use in other files
export const adminAuth = admin.auth();

export async function verifyIdToken(token) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    throw new Error("Invalid or expired token");
  }
}
