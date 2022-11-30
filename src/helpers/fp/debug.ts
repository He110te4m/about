export const trace = (message: string) => <T>(data: T) => {
  window.console.log(message, data)
  return data
}
