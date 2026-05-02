// server/api/public/links.post.ts
import { LinkSchema, nanoid } from '#shared/schemas/link'
// 使用相对路径引入 link-store 中的工具函数
import { normalizeSlug, getLink, buildShortLink } from '../../utils/link-store'

export default eventHandler(async (event) => {
  const body = await readBody(event)

  // 只允许提交基本字段，防止恶意字段
  const allowedFields = {
    url: body.url,
    slug: body.slug,
    comment: body.comment,
    expiration: body.expiration,
  }

  // 验证并生成 link 对象 (slug 自动生成)
  const link = await LinkSchema.parseAsync({
    ...allowedFields,
    slug: allowedFields.slug || nanoid(),
  })

  // 规范化 slug（大小写敏感由配置决定）
  link.slug = normalizeSlug(event, link.slug)

  // 检查是否已存在
  const existing = await getLink(event, link.slug)
  if (existing) {
    throw createError({ status: 409, statusText: 'Short link already exists' })
  }

  // 直接写入 KV（避免使用 putLink 中未导出的 getExpiration）
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 计算过期时间（秒级时间戳）
  let expirationTtl: number | undefined
  if (link.expiration) {
    const now = Math.floor(Date.now() / 1000)
    const ttl = link.expiration - now
    if (ttl > 0) {
      expirationTtl = ttl
    }
  }

  await KV.put(`link:${link.slug}`, JSON.stringify(link), {
    expirationTtl,
    metadata: {
      expiration: link.expiration,
      url: link.url,
      comment: link.comment,
    },
  })

  setResponseStatus(event, 201)
  const shortLink = buildShortLink(event, link.slug)
  return { link, shortLink }
})