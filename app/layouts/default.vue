<!--
  文件路径: app/layouts/default.vue
  作用: 整个网站的全局布局，包括顶部导航栏、页脚、主题切换、语言切换等。
  本次修改要点:
    1. 页脚第一个图标 → 使用自定义 youtube.svg，链接为你的 YouTube 频道。
    2. 页脚第二个图标 → 使用自定义 bilibili.svg，链接为你的 B 站内容。
    3. 页脚第三个图标 → 保留 GitHubIcon，链接为你的 GitHub 主页。
    4. 顶部导航栏右侧的 Star 按钮保持原样（指向原项目仓库，显示原项目 star 数）。
    5. 其他功能（主题、语言、响应式菜单）完全保留。
-->

<script setup lang="ts">
// 引入数字动画组件（用于显示 star 数量）
import NumberFlow from '@number-flow/vue'
// 引入图标: Menu（菜单）、Star（星标）、X（关闭）
import { Menu, Star, X } from 'lucide-vue-next'
// 引入第三方图标组件: GitHubIcon（GitHub 猫）、TelegramIcon（纸飞机，但此处已不再使用）、XIcon（不再使用，保留以防其他位置用到）
import { GitHubIcon, TelegramIcon, XIcon } from 'vue3-simple-icons'

// 移动端菜单显示状态
const showMenu = ref(false)
// 从应用配置中获取标题、社交链接等（这些值通常来自 app.config.ts 或环境变量）
const { title, telegram, twitter, github } = useAppConfig()
// 获取 GitHub 仓库的统计数据（包括 star 数量），此处 rawStats 指向原项目地址（未作修改）
const { rawStats } = useGithubStats()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- ======================= 头部导航栏 ======================= -->
    <header>
      <nav
        :data-state="showMenu && 'active'"
        class="fixed z-20 w-full border-b bg-background/50 backdrop-blur-3xl"
      >
        <div class="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div
            class="
              relative flex flex-wrap items-center justify-between gap-6 py-3
              lg:gap-0 lg:py-4
            "
          >
            <!-- Logo 区域 -->
            <div
              class="
                flex w-full items-center justify-between gap-12
                lg:w-auto
              "
            >
              <NuxtLink
                to="/"
                :title="title"
                aria-label="home"
                class="flex items-center space-x-2"
              >
                <span
                  class="flex size-8 items-center justify-center rounded-full"
                >
                  <img
                    src="/sink.png"
                    :alt="`${title} Logo`"
                    class="size-full rounded-full"
                  >
                </span>
                <span class="text-xl font-black">{{ title }}</span>
              </NuxtLink>

              <!-- 移动端菜单按钮 -->
              <button
                aria-label="Toggle Menu"
                :aria-expanded="showMenu"
                aria-controls="mobile-menu"
                class="
                  relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5
                  lg:hidden
                "
                @click="showMenu = !showMenu"
              >
                <Menu
                  class="m-auto size-6 duration-200" :class="[
                    showMenu && 'scale-0 rotate-180 opacity-0',
                  ]"
                />
                <X
                  class="absolute inset-0 m-auto size-6 duration-200" :class="[
                    showMenu ? 'scale-100 rotate-0 opacity-100' : `
                      scale-0 -rotate-180 opacity-0
                    `,
                  ]"
                />
              </button>
            </div>

            <!-- 右侧菜单（完整导航项） -->
            <div
              id="mobile-menu"
              class="
                mb-6 w-full flex-wrap items-center justify-end space-y-8
                rounded-3xl border bg-background p-6 shadow-2xl
                shadow-zinc-300/20
                md:flex-nowrap
                lg:m-0 lg:flex lg:w-fit lg:items-center lg:gap-6 lg:space-y-0
                lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none
                dark:shadow-none dark:lg:bg-transparent
              " :class="[
                showMenu ? 'block' : 'hidden',
              ]"
            >
              <div
                class="
                  flex w-full flex-col items-center space-y-3
                  sm:flex-row sm:gap-3 sm:space-y-0
                  md:w-fit
                "
              >
                <!-- Star 按钮：保持指向原项目仓库（未修改） -->
                <Button
                  as-child
                  variant="outline"
                  size="sm"
                >
                  <a
                    :href="github"
                    target="_blank"
                    :title="$t('layouts.footer.social.github')"
                    class="flex items-center gap-1.5"
                  >
                    <GitHubIcon class="size-4" />
                    <Star class="size-3" />
                    <NumberFlow class="tabular-nums" :value="rawStats.stars" />
                  </a>
                </Button>

                <!-- 语言切换组件（预置） -->
                <SwitchLanguage />
                <!-- 主题切换组件（预置） -->
                <SwitchTheme />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- ======================= 主内容区域 ======================= -->
    <main class="flex flex-1 flex-col pt-20">
      <slot />
    </main>

    <!-- ======================= 页脚 ======================= -->
    <footer class="border-t bg-background py-8">
      <div class="mx-auto max-w-6xl px-6">
        <div
          class="
            flex flex-col items-center gap-6 pt-2
            md:flex-row md:justify-between
          "
        >
          <!-- 左侧：Logo + 版权信息 -->
          <div
            class="
              flex flex-col items-center gap-4
              md:flex-row md:gap-6
            "
          >
            <NuxtLink
              to="/"
              :title="title"
              aria-label="home"
              class="block size-fit"
            >
              <div class="flex items-center space-x-2">
                <span
                  class="flex size-8 items-center justify-center rounded-full"
                >
                  <img
                    src="/sink.png"
                    :alt="`${title} Logo`"
                    class="size-full rounded-full"
                  >
                </span>
                <span class="text-xl font-black">{{ title }}</span>
              </div>
            </NuxtLink>

            <small class="block text-center text-sm text-muted-foreground">
              &copy; {{ new Date().getFullYear() }}
              <a
                href="https://html.zone"
                target="_blank"
                title="HTML.ZONE"
                class="hover:text-primary"
              >
                {{ $t('layouts.footer.copyright') }}
              </a>
            </small>
          </div>

          <!-- 右侧：三个社交媒体图标（均已自定义） -->
          <div class="flex justify-center gap-6 text-sm">
            <!-- 
              图标 1：YouTube
              使用自定义 SVG（路径 /icons/youtube.svg）
              链接指向你的 YouTube 频道
            -->
            <a
              href="https://youtube.com/channel/UCn6epUD3BxsRhQrBTMun3YQ?si=rhB13pPeBtuQFapn"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              aria-label="YouTube"
              class="block text-muted-foreground hover:text-primary"
            >
              <img 
                src="/icons/youtube.svg" 
                alt="YouTube" 
                class="size-6"
              />
            </a>

            <!-- 
              图标 2：Bilibili（哔哩哔哩）
              使用自定义 SVG（路径 /icons/bilibili.svg）
              链接指向你的 B 站页面（例如视频或空间）
            -->
            <a
              href="https://b23.tv/jypNXVG"
              target="_blank"
              rel="noopener noreferrer"
              title="Bilibili"
              aria-label="Bilibili"
              class="block text-muted-foreground hover:text-primary"
            >
              <img 
                src="/icons/bilibili.svg" 
                alt="Bilibili" 
                class="size-6"
              />
            </a>

            <!-- 
              图标 3：GitHub
              使用 vue3-simple-icons 提供的 GitHubIcon 组件
              链接指向你的 GitHub 个人主页
            -->
            <a
              href="https://github.com/GZMOTRO-lang"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
              class="block text-muted-foreground hover:text-primary"
            >
              <GitHubIcon class="size-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>