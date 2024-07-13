<template>
  <el-container class="container">
    <el-header class="header">
      <EditHeader :title="title" :editor="editor" @reload="loadDocuments" @updateTitle="title = $event" />
    </el-header>
    <el-main class="main">
      <FixedMenu v-if="editor" :editor="editor" />
      <BubbleMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }" />
      <div class="editor-container">
        <div class="docs">
          <h2 style="color: #555;margin-left: 5vw">我的文档</h2>
          <div class="doc" :class="{ 'doc-active': doc.id == router.currentRoute.value.params.id }"
            v-for="doc in documents" :key="doc.id" @click="handleDocClick(doc.id)">
            <h3>{{ doc.title }}</h3>
            <p>{{ doc.content.replace(/<[^>]*>/g, " ").slice(0, 28) }}...</p>
          </div>
        </div>
        <div class="content">
          <editor-content :editor="editor" id="editor-content" />
        </div>
        <div class="catalog">
          <h2 style="color: #555;">大纲</h2>
          <div v-for="(item, index) in outline" :key="index" :level="item.level" class="outline-item"
            @click="goToHeading(item)">
            {{ item.text }}
          </div>
        </div>
      </div>
      <div class="word-count">总字符数：{{ editor?.storage.characterCount.characters() }}</div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { ElContainer, ElHeader, ElMain } from 'element-plus';
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

const lowlight = createLowlight()
lowlight.register({ html, ts, css, js })
const title = ref('');
const documents = ref([]);

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
</style>
