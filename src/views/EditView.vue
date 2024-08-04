<template>
  <el-container class="container">
    <el-header class="header">
      <EditHeader :title="title" :editor="editor" @reload="loadDocuments" @updateTitle="title = $event" />
    </el-header>
    <el-main class="main">
      <FixedMenu v-if="editor" :editor="editor" />
      <BubbleMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }" />
      <div class="editor-container">
        <div class="left-side">
          <div class="title">
            <div @click="catalog = false" :class="['option', { 'option-active': !catalog }]">文 档</div>
            <div @click="catalog = true" :class="['option', { 'option-active': catalog }]">大 纲</div>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="catalog" key="catalog">
              <transition-group name="fade" tag="div">
                <div v-for="item in outline" :key="item.text" :level="item.level" class="outline-item"
                  @click="goToHeading(item)">
                  {{ item.text }}
                </div>
              </transition-group>
            </div>
            <div v-else key="docs">
              <div class="doc" :class="{ 'doc-active': doc.id == router.currentRoute.value.params.id }"
                v-for="doc in documents" :key="doc.id" @click="handleDocClick(doc.id)">
                <h3>{{ doc.title }}</h3>
                <p>{{ doc.content.replace(/<[^>]*>/g, " ") }}</p>
              </div>
            </div>
          </transition>
        </div>
        <div class="content">
          <editor-content :editor="editor" id="editor-content" />
        </div>
        <div class="right-side">
          <div class="title">
            <div @click="typography = false" :class="['option', { 'option-active': !typography }]">提 示</div>
            <div @click="typography = true" :class="['option', { 'option-active': typography }]">排 版</div>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="typography" key="typographyTemps">
              <transition-group name="fade" tag="div">
                <div v-for="item in typographyTemps" :key="item.title" class="typography-card"
                  @click="setTypograph(item)">
                  <h3><i class="ri-article-fill" style="color: var(--el-color-primary-light-5);"></i> {{ item.title }}
                  </h3>
                  <p><b><i class="ri-font-family"></i>&nbsp;字体：</b>{{ item.font }}</p>
                  <p><b><i class="ri-font-size"></i>&nbsp;字号：</b>{{ item.font_size }}</p>
                  <p><b><i class="ri-line-height"></i>&nbsp;行距：</b>{{ item.line_spacing }}</p>
                  <p><b><i class="ri-paragraph"></i>&nbsp;段落：</b>{{ item.paragraph }}</p>
                </div>
              </transition-group>
            </div>
            <div v-else key="promptPresets">
              <el-select v-model="profession" placeholder="选择职业" style="margin-top: 1vh;">
                <el-option v-for="item in promptPresets" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <div v-for="item in promptPresets.find(item => item.value === profession).options" class="presets-card"
                @click="InsertErnie(item.prompt)">
                <h3>
                  <i v-for="item in promptPresets" :key="item.value" :class="item.value === profession ? item.icon : ''"
                    style="color: var(--el-color-primary-light-5);"></i>
                  {{ item.title }}
                </h3>
                <p>{{ item.prompt }}</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="word-count">总字符数：{{ editor?.storage.characterCount.characters() }}</div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { ElContainer, ElHeader, ElMain, ElLoading } from 'element-plus';
import { ElMessage } from "element-plus";
import EditHeader from '../components/EditHeader.vue';
import FixedMenu from '../components/FixedMenu.vue';
import BubbleMenu from '../components/BubbleMenu.vue';
import request from "../utils/request.js";
import router from "../router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Color } from '@tiptap/extension-color'
import VueComponent from '../utils/Extension.js'
import slash from '../utils/slash.js'
import suggestion from '../utils/suggestion.js'
import promptPresets from '../utils/promptPresets';
import typographyTemps from '../utils/typographyTemps';

const lowlight = createLowlight()
lowlight.register({ html, ts, css, js })
const title = ref('');
const documents = ref([]);
const catalog = ref(false);
const profession = ref('学生');
const typography = ref(false);

// 创建编辑器实例
const editor = useEditor({
  content: "",
  extensions: [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Superscript,
    Subscript,
    TextStyle,
    Color,
    FontFamily,
    Typography,
    TaskList,
    TaskItem,
    CharacterCount,
    Highlight.configure({ multicolor: true }),
    Link,
    Image,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'paragraph' && node.childCount === 0) {
          return '键入 / 以唤起AI助手...';
        }
        return '开始输入...'
      },
    }),
    CodeBlockLowlight.configure({ lowlight }),
    VueComponent,
    slash.configure({ suggestion }),],
})
// 计算大纲
const outline = computed(() => {
  const matches = []
  editor.value?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      const start = pos
      const end = pos + node.content.size
      const level = node.attrs.level
      const text = node.textContent
      matches.push({ start, end, level, text })
    }
  })
  return matches
});
// 跳转到大纲
const goToHeading = (item) => {
  const selection = { from: item.start, to: item.end + 1 };
  editor.value.chain().setTextSelection(selection).setHighlight({ color: '#dedcff' }).run();
  editor.value.commands.focus(item.end + 1);
  setTimeout(() => {
    editor.value.chain().setTextSelection(selection).unsetHighlight().run();
    editor.value.commands.focus(item.end + 1);
  }, 800);
}
// 加载文档
const loadDocuments = async () => {
  try {
    NProgress.start();
    let response = await request.get("/document/user");
    if (response.code == 200) {
      documents.value = response.documents;
    } else {
      ElMessage.error(response.message);
    }
    response = await request.get("/document/" + router.currentRoute.value.params.id);
    if (response.code == 200) {
      editor.value.commands.setContent(response.document.content);
      if (response.document.user_id == 1) {
        editor.value.setEditable(false);
        //禁用编辑按钮
        document.querySelectorAll('button').forEach(item => {
          if (!item.classList.contains('exclude')) {
            item.disabled = true;
          }
        });
        ElMessage.info("只读模式");
      }
      title.value = response.document.title;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};
// 处理文档点击
const handleDocClick = (id) => {
  router.push({ name: 'edit', params: { id: id } });
  loadDocuments();
};
// 文心助手
const InsertErnie = (prompt) => {
  editor.value.chain().focus().insertContent(`<vue-component message="${prompt}" />`).run();
  editor.value.chain().blur().run();
}
// 排版
const setTypograph = async (item) => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await fetch('/api/function/typography', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editor.value.getHTML(), title: item.title, font: item.font, font_size: item.font_size, line_spacing: item.line_spacing, paragraph: item.paragraph }),
    });
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    editor.value.commands.setContent('');
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let receivedText = '';
    loadingInstance.close();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedValue = decoder.decode(value, { stream: true });
      receivedText += decodedValue;
      editor.value.chain().focus().insertContent(decodedValue).run();
    }
  } catch (error) {
    ElMessage.error(error.message);
  }
}
// 初次挂载
onMounted(loadDocuments);
// 销毁编辑器
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
  justify-content: space-between;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
