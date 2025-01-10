import { KEYS } from '@/shared/constants/env'

export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: `${KEYS.API}`,
  timeout: 10000,
}
