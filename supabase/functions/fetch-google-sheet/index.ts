import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    console.log('Parsing service account key...');
    const credentials = JSON.parse(serviceAccountKey);
    
    // Create JWT for Google API authentication
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // Base64URL encode
    const base64UrlEncode = (str: string): string => {
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${headerEncoded}.${payloadEncoded}`;

    // Import private key and sign
    const privateKeyPem = credentials.private_key;
    const pemContents = privateKeyPem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');
    
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(unsignedToken)
    );

    const signatureEncoded = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    const jwt = `${unsignedToken}.${signatureEncoded}`;

    console.log('Getting access token from Google...');
    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      throw new Error(`Failed to get access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('Fetching spreadsheet data...');
    // Fetch spreadsheet data
    const spreadsheetId = '1heUVHt9hYZKFUk8BYkAPaJiLv-i8DuQFlkWc8XCLLas';
    const range = 'A1:Z1000'; // Fetch all data
    
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!sheetResponse.ok) {
      const errorText = await sheetResponse.text();
      console.error('Sheet error:', errorText);
      throw new Error(`Failed to fetch spreadsheet: ${errorText}`);
    }

    const sheetData = await sheetResponse.json();
    const rows = sheetData.values || [];
    
    console.log(`Fetched ${rows.length} rows from spreadsheet`);

    // Parse the data - first row is header
    if (rows.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers = rows[0] as string[];
    console.log('Headers:', headers);
    
    // Find column indices for the required fields
    const imageUrlIndex = headers.findIndex(h => h.includes('圖片連結'));
    const authorizedIndex = headers.findIndex(h => h.includes('受權刊出') || h.includes('授權刊出'));
    const statusIndex = headers.findIndex(h => h.includes('刊登情況'));
    const dateIndex = headers.findIndex(h => h.includes('刊出日期'));

    console.log('Column indices:', { imageUrlIndex, authorizedIndex, statusIndex, dateIndex });

    const data = rows.slice(1).map((row: string[], index: number) => ({
      id: index + 1,
      imageUrl: imageUrlIndex >= 0 ? row[imageUrlIndex] || '' : '',
      authorized: authorizedIndex >= 0 ? row[authorizedIndex] || '' : '',
      status: statusIndex >= 0 ? row[statusIndex] || '' : '',
      publishDate: dateIndex >= 0 ? row[dateIndex] || '' : '',
    })).filter((item: { imageUrl: string; authorized: string; status: string; publishDate: string }) => 
      item.imageUrl || item.authorized || item.status || item.publishDate
    );

    console.log(`Returning ${data.length} records`);

    return new Response(JSON.stringify({ data, headers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const error = err as Error;
    console.error('Error in fetch-google-sheet function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
