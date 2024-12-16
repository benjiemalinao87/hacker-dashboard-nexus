import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { workspaceId, token } = await req.json()

    if (!workspaceId || !token) {
      console.error('Missing required parameters:', { workspaceId: !!workspaceId, token: !!token })
      return new Response(
        JSON.stringify({ error: 'Workspace ID and token are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate token format
    if (typeof token !== 'string' || token.length < 10) {
      console.error('Invalid token format:', { tokenLength: token?.length })
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Making request for workspace: ${workspaceId}`)
    console.log(`Using token starting with: ${token.substring(0, 10)}...`)
    
    const apiUrl = `https://www.uchat.com.au/api/partner/workspace/${workspaceId}`
    console.log('Requesting URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const responseText = await response.text()
    console.log('API Response status:', response.status)
    console.log('API Response headers:', Object.fromEntries(response.headers))
    console.log('API Response body:', responseText)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${responseText}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse API response:', e)
      throw new Error('Invalid JSON response from API')
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in workspace-proxy:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})