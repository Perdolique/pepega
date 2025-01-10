export default defineEventHandler(async (event) => {
  await clearAppSession(event)

  sendRedirect(event, '/login', 307)
})
