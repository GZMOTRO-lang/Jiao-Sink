<!-
  路径: app/components/home/Hero.vue
  作用: 首页首屏 Hero 区域
  修改:
    - YouTube 关注按钮链接改为你的 YouTube 频道
    - 左侧图标使用自定义 /youtube.svg（位于 public/ 根目录）
    - GitHub 按钮链接改为你的仓库地址
-->

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { GitHubIcon } from 'vue3-simple-icons'
import heroUrl from '@/assets/images/hero.svg?url'

const { title, description, github, twitter } = useAppConfig()
</script>

<template>
  <section>
    <div class="py-16 md:py-24">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:justify-between">
        <div class="max-w-lg text-center lg:text-left">
          <!-- YouTube 关注按钮 -->
          <a
            href="https://youtube.com/channel/UCn6epUD3BxsRhQrBTMun3YQ?si=rhB13pPeBtuQFapn"
            target="_blank"
            rel="noopener noreferrer"
            title="在 YouTube 上关注我"
            class="mx-auto mb-8 inline-flex w-fit items-center gap-2 rounded-full border p-1 pr-3 lg:mx-0"
          >
            <span class="flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs">
              <!-- 修正路径：直接使用 /public/youtube.svg -->
              <img src="/public/youtube.svg" alt="YouTube" class="size-4" />
            </span>
            <span class="text-sm">在 YouTube 上关注我</span>
            <span class="block h-4 w-px bg-border" />
            <ArrowRight aria-hidden="true" class="size-4" />
          </a>

          <h1 class="text-4xl font-medium text-balance md:text-5xl xl:text-6xl">
            {{ title }}
          </h1>
          <p class="mt-6 text-lg text-pretty text-muted-foreground">
            {{ description }}
          </p>

          <div class="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
            <Button as-child size="lg" class="px-5 text-base">
              <NuxtLink to="/dashboard">
                <span class="text-nowrap">{{ $t('dashboard.title') }}</span>
              </NuxtLink>
            </Button>
            <Button as-child size="lg" variant="ghost" class="px-5 text-base">
              <a
                href="https://github.com/GZMOTRO-lang/Jiao-Sink/tree/master"
                target="_blank"
                title="GitHub 仓库"
                class="flex items-center gap-1.5"
              >
                <GitHubIcon aria-hidden="true" class="size-5" />
                <span class="text-nowrap">{{ $t('home.hero.github_repo') }}</span>
              </a>
            </Button>
          </div>
        </div>

        <object
          type="image/svg+xml"
          :data="heroUrl"
          class="hidden aspect-square w-96 shrink-0 md:block lg:w-[420px]"
          aria-label="Link sharing illustration"
          suppressHydrationWarning
        />
      </div>
    </div>
  </section>
</template>