export const getImageUrl = (folderAndName: string) => {
  return new URL(`../assets/${folderAndName}`, import.meta.url).href
}
