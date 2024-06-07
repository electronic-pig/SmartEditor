<template>
  <el-container class="container">
    <el-header class="header">
      <el-button @click="returnHome" class="icon">
        <el-icon :size="22">
          <HomeFilled />
        </el-icon>
      </el-button>
      <el-button class="icon">
        <el-icon :size="22">
          <Plus />
        </el-icon>
      </el-button>
      <el-divider direction="vertical" />
      <el-button class="icon">
        <el-icon :size="22">
          <MoreFilled />
        </el-icon>
      </el-button>
      <span style="margin: 0 auto;">文件名</span>
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"
        style="margin-right: 2px" />
      <span style="margin-right: 3vw">电子笨蛋</span>

    </el-header>
    <el-main class="main">
      <div v-if="editor" class="fixed-menu">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          <i class="ri-arrow-go-back-line"></i>
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          <i class="ri-arrow-go-forward-line"></i>
        </button>
        <button @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
          <i class="ri-delete-bin-line"></i>
        </button>
        <el-divider direction="vertical" />
        <el-select v-model="header" @change="handleHeader" style="width: 72px">
          <el-option :key="0" label="正文" :value="0">
            正文
          </el-option>
          <el-option v-for="i in 5" :key="i" :label="'H' + i" :value="i">
            <i :class="`ri-h-${i}`" :style="{ fontSize: `${28 - i * 2}px` }"></i>
          </el-option>
        </el-select>
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          <i class="ri-bold"></i>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <i class="ri-italic"></i>
        </button>
        <button @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }">
          <i class="ri-underline"></i>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <i class="ri-strikethrough"></i>
        </button>
        <button @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }">
          <i class="ri-code-line"></i>
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }">
          <i class="ri-code-box-line"></i>
        </button>
        <button @click="editor.chain().focus().toggleSuperscript().run()"
          :disabled="!editor.can().chain().focus().toggleSuperscript().run()"
          :class="{ 'is-active': editor.isActive('superscript') }">
          <i class="ri-superscript"></i>
        </button>
        <button @click="editor.chain().focus().toggleSubscript().run()"
          :disabled="!editor.can().chain().focus().toggleSubscript().run()"
          :class="{ 'is-active': editor.isActive('subscript') }">
          <i class="ri-subscript"></i>
        </button>
        <el-divider direction="vertical" />
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          <i class="ri-list-unordered"></i>
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          <i class="ri-list-ordered-2"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive('textAlign', { align: 'left' }) }">
          <i class="ri-align-left"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive('textAlign', { align: 'center' }) }">
          <i class="ri-align-center"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive('textAlign', { align: 'right' }) }">
          <i class="ri-align-right"></i>
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }">
          <i class="ri-double-quotes-l"></i> </button>
      </div>
      <div class="editor-container">
        <div class="docs">
          <h2 style="color: #555;margin-left: 5vw">我的文档</h2>
          <div class="doc"></div>
          <div class="doc"></div>
          <div class="doc"></div>
          <div class="doc"></div>
          <div class="doc"></div>
        </div>
        <div class="content">
          <editor-content :editor="editor" class="editor-content" />
        </div>
        <div class="catalog">
          <h2 style="color: #555;">目录</h2>
          <div v-for="(item, index) in toc" :key="index" :id="index" :type="item.type" class="toc-item"
            @mousedown="handleMousedown">
            {{ item.text }}
          </div>
        </div>
      </div>
      <div class="word-count">总字数：{{ wordCount }}</div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { ElMessage } from "element-plus";
import request from "../utils/request.js";
import router from "../router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'

// 标题列表
const headers = ref([]);

// 内容 HTML
const valueHtml = ref('<h1>标题</h1><h2>标题A</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题A1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题A2</h3><p>文本</p><p>文本</p><p>文本</p><h2>标题B</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题B1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题B2</h3><p>文本</p><p>文本</p><p>文本</p>')

const wordCount = computed(() => {
  const text = valueHtml.value.replace(/<[^>]*>/g, ''); // 去除 HTML 标签
  return text.length;
});

const toc = computed(() => {
  const regex = /<h([1-3])>(.*?)<\/h[1-3]>/g;
  const matches = [...valueHtml.value.matchAll(regex)];
  return matches.map((match) => ({ type: "header" + match[1], text: match[2] }));
});

const editor = useEditor({
  content: valueHtml.value,
  extensions: [StarterKit, Underline, TextAlign, Superscript, Subscript],
})

const returnHome = () => {
  router.push('/dashboard/DocumentPage')
}

const header = ref(0);

const handleHeader = (value) => {
  if (value === 0) {
    editor.value.chain().focus().setParagraph().run();
  } else {
    editor.value.chain().focus().toggleHeading({ level: value }).run();
  }
}

const loadDocument = async () => {
  try {
    NProgress.start();
    const response = await request.get("/document/" + router.currentRoute.value.query.id);
    if (response.code == 200) {
      editor.value.commands.setContent(response.document.content);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
    console.error(error);
  } finally {
    NProgress.done();
  }
};

// onMounted(() => {
//   loadDocument();
// });

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.container {
  height: 100vh;
  background-color: var(--nav--color) !important;
}

.header {
  height: 6vh;
  box-shadow: 0 0 2rem 0 rgba(41, 48, 66, 0.1);
  display: flex;
  align-items: center;
  background-color: var(--nav--color);
  color: #606266;
}

.icon {
  padding: 2px 3px;
  margin: 0 4px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: transparent;
}

.main {
  padding: 1vh;
  overflow-y: hidden;
}
</style>
