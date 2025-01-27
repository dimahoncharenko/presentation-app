export const filterParagraphContent = (input: string) => {
  const regex = /<p[^>]*>(.*?)<\/p>/ // Matches any <p> tag and captures its content
  const match = input.match(regex)

  return match ? match[1] : '' // Return the captured content, or an empty string if no match
}
