export default defineAppConfig({
  title: 'Sink',
  github: 'https://github.com/miantiao-me/sink',
  coffee: 'https://sink.cool/coffee',
  twitter: 'https://sink.cool/x',
  telegram: 'https://sink.cool/telegram',
  // 修改点：英文改为中文 + 精简宣传语
  description: '简短、快速、安全的短链服务，100% 运行于 Cloudflare。申请 short.cn.mt 短链，让后缀更可信。',
  image: 'https://sink.cool/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
