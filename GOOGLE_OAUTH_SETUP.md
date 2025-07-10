# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:8080`
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
9. Click "Create"
10. Note your Client ID and Client Secret

## 2. Configure Environment Variables

Update the `.env` file in the server directory with your Google OAuth credentials:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## 3. Start the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

3. Navigate to `http://localhost:8080` in your browser
4. Click "Login with Google" to test the authentication

## Troubleshooting

- If you encounter CORS issues, ensure the CORS configuration in `server/src/middlewares/3.session.js` includes all necessary origins
- Check the server logs for any authentication errors
- Verify that your Google OAuth credentials are correctly configured
- Make sure the redirect URI in Google Cloud Console exactly matches the one in your `.env` file