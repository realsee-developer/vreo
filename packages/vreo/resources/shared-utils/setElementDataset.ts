export default function setElementDataset(element: any, dataset: Record<string, string | number>) {
  if (element) {
    Object.keys(dataset).forEach((key) => {
      
      const value = dataset[key].toString()

      if (element instanceof Element) {
        element.setAttribute(`data-${key}`, value)
      } else if (element instanceof Document) {
        element.documentElement.setAttribute(`data-${key}`, value)
      } else if (element instanceof HTMLElement) {
          element.dataset[key] = value
      } else {
          (element as any).setAttribute(`data-${key}`, value)
      }
    })
}
}
