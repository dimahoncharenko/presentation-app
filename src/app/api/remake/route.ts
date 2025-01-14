import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

import { KEYS } from '@/shared/constants/env'
import { parseResponse } from './lib/utils'

const client = new Mistral({ apiKey: KEYS.MISTRAL_KEY })

type RemakeBodyParams = {
  prompt: string
  text: string
}

interface ExtendedNextApiRequest extends NextRequest {
  json(): Promise<RemakeBodyParams>
}

export const POST = async (params: ExtendedNextApiRequest) => {
  const res = await params.json()

  const chatResponse = await client.agents.complete({
    agentId: `${KEYS.MISTRAL_AGENT}`,
    messages: [
      {
        role: 'user',
        content: `
          User prompt: ${res.prompt}\n
          Text to transform: ${res.text}
        `,
      },
    ],
  })

  return NextResponse.json(parseResponse(chatResponse))
}
