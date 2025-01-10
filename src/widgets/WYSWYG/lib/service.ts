import { ApiResponse, ApisauceInstance, create } from 'apisauce'

import { ApiConfig, DEFAULT_API_CONFIG } from '@/shared/config/api'

export class AiService {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  async remakeText(prompt: string, text: string) {
    try {
      const response: ApiResponse<string> = await this.apisauce.post(
        '/remake',
        {
          prompt,
          text,
        },
      )

      if (!response.ok) {
        throw new Error(
          `Error ${response.status} (${response.problem}): ${response.data}`,
        )
      }

      return { kind: 'ok', text: response.data }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error('Failed to remake text: ', err)
      }
    }
  }
}

export const aiApi = new AiService()
