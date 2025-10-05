import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "team-jvr",
      private_key_id: "53e5bc70c140d5beb7d6dc9cdc2a9a91043cd591",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQfkBft8/NqQSI\n3lEdHAzCGpIbChVw433VzR6cQs6GDuojETPvdZSojXoNDgDq8og/HL7fJh5KNdZG\nh3BRnvK+v74cPfMT+B5KNC0JswjHJoov0QoRzFrELzcEaAqTq+NOcgqFYc+c9N3a\nxFxLC/kmU295f2vqYkXY/DV+U4WuJuxJaD+5mk/MQHCLWOByIzStbhfAsSYvDsO2\nvPLMbQ4mhfHNQon+qFnXNWdOAuPvUXxw7mH87qGEJgDm67NxBsT0OKt/TkqwD7b7\ntMnXEthTPR8Hyz5kTIJAoWSuC7KMtucF/wOM+AXtFFDbf4W/esH+E8WVUgLuVy1W\n3xryNRrNAgMBAAECggEADMd1twwhL025o8c8bPLRorXJ4o/86cvc5wn/S+T8B07j\nYJrsDnYbjIqyrDE8XeB5sfyUrv9b4hv/1E4J3it3dEJYtH5ldLMsLqDjCNQSPIFz\n6vBgenF/POb2Gogpw09fnkz8vDjfLUEE1rfTd88FHTbM3vXThq+5VgxRniy8inSE\nblcJO3h1JVZqvpQVEvxzjOu5LxC35tyPJrNo1Lf23HnNDVO2OVZb1KrML5w6cV7j\n0Z+TRftrtVWVC0voUhCN46hLx8nT3jcEWqdG2ZGE4tR92ZD1jjj2GZ1nqXp4dkhY\nhyFv41gKDAO3f//vva7V+Xm4TVNiJi5AXVQG/+zjGwKBgQDIHCJkct0eSBGLn3tt\nfRpKEE8XQkjlFrlBquIEujAoeA81dMc61mwYmUpwZZp8sopKDwkMyu/EWOKzpaQW\ns+uZVP5mb6bDZDkXNcC/xeMxKj+Vqa/rjIIfbBBUAoy62Bg1yGDQ82oFfxF+C5uS\nWEQo5IhQd5fHDpNhiIm0e7rklwKBgQC42YTMgm4MVE2hg+GWL04LMzQfuM7P0Uzf\nbRvH1sS+jzc8pT1mPVu7MYm6zOrmaYqgwWWt/aJcuiNYSZPzMJCEYZWPACO92wD6\nMqo023DHhsykm9p7G6NMcu9dSlCpN3z6p6SHBxAbrbA5FC7XGfvRwoMgiLi0MJo3\n17WLgaJ0OwKBgFscLDCN981ExPBMUbc9IY4dNNWDMYtUuE6EzlmWqDyUxV/yZo+M\ndzUP/kuEhz1FUR99DwLLFzXPvpBK15Yanyd2AkqDhWsrI69EoxjtsY5+DOtIkjdu\nBwTlf92wN4EOyJ8cN7CLU3djLoS0JkYQeCAiRUpV2T4hjcr3jrMlLqfLAoGAQfyM\nVoEdDdOuXsD4b6d1YbQmoEhVs4QQwBVv/Fejpi7z1fdawruWmm1lsERkelokvZws\nUv8ezaE46tRhN0gX3toDDKhNGgIrCCW78uB/EwsA1KY6SQYlti21WwUjZDTFrajY\np8cSrf7D0KxuyCSja07Xhm6oGNLcyqB7U1C0kG8CgYADMr6YkvpxzOMkOgYh57hY\nKW5QRpNAdAT5U/ZJlqk3f58UBqYOo8JuWkp8Adp1504iyR72vmFI4e5mQ4KLFHZU\n3NpgkICRPg1Cb/ykwtZ8h0kuTZWWwTfy1JJMyHs+T2SevO554AwI1upI/XYE6dNN\nafGP0rOKC8EYhARMPJ9avQ==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
      client_email: "firebase-adminsdk-fbsvc@team-jvr.iam.gserviceaccount.com",
      client_id: "111176910032562667261",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40team-jvr.iam.gserviceaccount.com",
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
