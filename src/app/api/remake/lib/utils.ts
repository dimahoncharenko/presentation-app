import { ChatCompletionResponse } from '@mistralai/mistralai/models/components'

export const parseResponse = (response: ChatCompletionResponse) => {
  return response?.choices ? response?.choices[0]?.message.content : ''
}
