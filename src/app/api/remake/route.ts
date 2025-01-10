import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

import { KEYS } from '@/shared/constants/env'

const client = new Mistral({ apiKey: KEYS.MISTRAL_KEY })

type ChatParams = {
  prompt: string
  text: string
}

export const POST = async (params: NextRequest) => {
  const res = (await params.json()) as unknown as ChatParams

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

  return NextResponse.json(
    chatResponse?.choices ? chatResponse?.choices[0]?.message.content : '',
  )
}
