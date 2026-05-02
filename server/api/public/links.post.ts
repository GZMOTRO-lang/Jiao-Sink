// server/api/public/links.post.ts
import { LinkSchema, nanoid } from '#shared/schemas/link'
import { normalizeSlug, getLink, putLink } from '~/server/utils/link-store'

defineRouteMeta({
  openAPI: {
    description: 'Public endpoint to create a short link without authentication',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['url'],
            properties: {
              url: { type: 'string', description: 'The target URL' },
              slug: { type: 'string', description: 'Custom slug (auto-generated if not provided)' },
              comment: { type: 'string', description: 'Optional comment' },
              expiration: { type: 'integer', description: 'Expiration timestamp (unix seconds)' },
            },
          },
        },
      },
    },
  },
})

export default eventHandler(async (event) => {
  // 只允许提交部分字段（防止恶意提交高级字段）
  const body = await readBody(event)
  const allowedFields = {
    url: body.url,
    slug: body.slug,
    comment: body.comment,
    expiration: body.expiration,
  }

  // 使用相同的 LinkSchema 验证，但忽略敏感字段
  const link = await LinkSchema.parseAsync({
    ...allowedFields,
    slug: allowedFields.slug || nanoid(),
  })

  link.slug = normalizeSlug(event, link.slug)

  // 可选：自动检测不安全链接（同原逻辑）
  if (link.unsafe === undefined) {
    const safe = await isSafeUrl(event, link.url)
    if (!safe) link.unsafe = true
  }

  const existingLink = await getLink(event, link.slug)
  if (existingLink) {
    throw createError({ status: 409, statusText: 'Short link already exists' })
  }

  await putLink(event, link)
  setResponseStatus(event, 201)
  const shortLink = buildShortLink(event, link.slug)
  return { link, shortLink }
})
