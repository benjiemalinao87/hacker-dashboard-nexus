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

    console.log('Making request for workspace:', workspaceId)
    console.log('Token length:', token.length, 'First 10 chars:', token.substring(0, 10))
    
    const apiUrl = `https://www.uchat.com.au/api/partner/workspace/${workspaceId}`
    console.log('Requesting URL:', apiUrl)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const responseText = await response.text()
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        })
        throw new Error(`API request failed with status ${response.status}: ${responseText}`)
      }

      const data = await response.json()
      console.log('Successful response for workspace:', workspaceId)

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      throw new Error(`Network request failed: ${fetchError.message}`)
    }
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