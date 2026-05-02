<!-- app/pages/apply.vue -->
<script setup lang="ts">
import type { AnyFieldApi } from '@tanstack/vue-form'
import { LinkSchema, nanoid } from '#shared/schemas/link'
import { useForm } from '@tanstack/vue-form'
import { Shuffle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({
  layout: 'default', // 使用公共布局，不使用 dashboard 布局
})

const { t } = useI18n()

const urlValidator = LinkSchema.shape.url
const slugValidator = LinkSchema.shape.slug
const commentValidator = z.string().max(500).optional()

const generateSlug = nanoid()

type ApplyFormData = {
  url: string
  slug?: string
  comment?: string
  expiration?: Date
}

const form = useForm({
  defaultValues: {
    url: '',
    slug: '',
    comment: '',
    expiration: undefined,
  } satisfies ApplyFormData,
  onSubmit: async ({ value }) => {
    try {
      const payload = {
        url: value.url,
        slug: value.slug || undefined,
        comment: value.comment || undefined,
        expiration: value.expiration ? Math.floor(new Date(value.expiration).getTime() / 1000) : undefined,
      }
      const result = await $fetch('/api/public/links', {
        method: 'POST',
        body: payload,
      })
      toast.success('申请成功！', {
        description: `短链接已生成：${result.shortLink}`,
        duration: 10000,
      })
      // 清空表单（可选）
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error('申请失败', {
        description: error instanceof Error ? error.message : String(error),
      })
    }
  },
})

function makeValidator<T>(schema: z.ZodSchema<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value)
    return result.success ? undefined : result.error.errors[0]?.message
  }
}

const validateUrl = makeValidator(urlValidator)
const validateSlug = makeValidator(slugValidator)
const validateComment = makeValidator(commentValidator)

function isInvalid(field: AnyFieldApi) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}

function getAriaInvalid(field: AnyFieldApi) {
  return isInvalid(field) ? 'true' : undefined
}

function formatErrors(errors: unknown[]): string[] {
  return errors
    .map((e) => {
      if (typeof e === 'string') return e
      if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') return e.message
      return null
    })
    .filter((m): m is string => m !== null)
}

function randomSlug() {
  form.setFieldValue('slug', generateSlug())
}
</script>

<template>
  <div class="mx-auto max-w-3xl py-12 md:py-16">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold md:text-4xl">
        申请短链接
      </h1>
      <p class="mt-2 text-muted-foreground">
        免费、快速、无需注册。生成以 <code class="rounded bg-muted px-1">short.cn.mt/</code> 开头的短链接。
      </p>
    </div>

    <div class="rounded-lg border bg-card p-6 shadow-sm">
      <form
        class="w-full space-y-4"
        @submit.prevent="form.handleSubmit"
      >
        <!-- URL 字段 -->
        <form.Field
          v-slot="{ field }"
          name="url"
          :validators="{ onBlur: validateUrl }"
        >
          <div :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name" class="mb-2 block">
              长链接 <span class="text-destructive">*</span>
            </FieldLabel>
            <Input
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="getAriaInvalid(field)"
              placeholder="https://example.com/very/long/path"
              autocomplete="url"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
            />
            <FieldError
              v-if="isInvalid(field)"
              :errors="formatErrors(field.state.meta.errors)"
              class="mt-1 text-sm text-destructive"
            />
          </div>
        </form.Field>

        <!-- 自定义短码字段 -->
        <form.Field
          v-slot="{ field }"
          name="slug"
          :validators="{ onBlur: validateSlug }"
        >
          <div :data-invalid="isInvalid(field)">
            <div class="flex items-center justify-between">
              <FieldLabel :for="field.name" class="mb-2 block">
                自定义短码（可选）
              </FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                aria-label="生成随机短码"
                @click="randomSlug"
              >
                <Shuffle class="h-4 w-4" />
              </Button>
            </div>
            <Input
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="getAriaInvalid(field)"
              placeholder="例如: mylink"
              autocomplete="off"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
            />
            <p class="mt-1 text-xs text-muted-foreground">
              可使用字母、数字、短横线。留空则自动生成。
            </p>
            <FieldError
              v-if="isInvalid(field)"
              :errors="formatErrors(field.state.meta.errors)"
              class="mt-1 text-sm text-destructive"
            />
          </div>
        </form.Field>

        <!-- 备注字段 -->
        <form.Field
          v-slot="{ field }"
          name="comment"
          :validators="{ onBlur: validateComment }"
        >
          <div :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name" class="mb-2 block">
              备注（可选）
            </FieldLabel>
            <Textarea
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="getAriaInvalid(field)"
              placeholder="例如：用于某次推广活动"
              rows="2"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLTextAreaElement).value)"
            />
            <FieldError
              v-if="isInvalid(field)"
              :errors="formatErrors(field.state.meta.errors)"
              class="mt-1 text-sm text-destructive"
            />
          </div>
        </form.Field>

        <!-- 过期时间字段 -->
        <form.Field
          v-slot="{ field }"
          name="expiration"
        >
          <div>
            <FieldLabel :for="field.name" class="mb-2 block">
              过期时间（可选）
            </FieldLabel>
            <Input
              :id="field.name"
              :name="field.name"
              type="datetime-local"
              :model-value="field.state.value"
              @blur="field.handleBlur"
              @input="field.handleChange(($event.target as HTMLInputElement).value)"
            />
            <p class="mt-1 text-xs text-muted-foreground">
              默认为永不过期。设置后链接将在指定时间后失效。
            </p>
          </div>
        </form.Field>

        <div class="pt-2">
          <Button type="submit" class="w-full">
            提交申请
          </Button>
        </div>
      </form>
    </div>

    <div class="mt-8 text-center text-sm text-muted-foreground">
      <p>
        提交即表示你同意不使用本服务进行垃圾邮件、钓鱼或任何非法活动。
        <br>
        所有短链接均会经过安全扫描，违规链接将被删除。
      </p>
    </div>
  </div>
</template>
