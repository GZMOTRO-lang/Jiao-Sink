// server/middleware/2.auth.ts
export default eventHandler((event) => {
  // 公开 API 路径跳过认证
  if (event.path.startsWith('/api/public/')) {
    return
  }

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  if (event.path.startsWith('/api/') && token !== useRuntimeConfig(event).siteToken) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }
  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})