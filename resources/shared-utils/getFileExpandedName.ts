export default function getFileExpandedName(filePath?: string | null) {
  if (!filePath) return ''
  const index = filePath.lastIndexOf('.')
  const ext = filePath.substring(index + 1)
  return ext.toLowerCase()
}
