<template>
  <el-container class="container">
    <el-header class="header">
      <el-button @click="returnHome()" class="icon">
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
      <el-button @click="save()" class="icon">
        <i style="font-size: 22px;" class="ri-save-line"></i>
      </el-button>
      <el-button class="icon">
        <i style="font-size: 22px;" class="ri-export-line"></i>
      </el-button>
      <el-button class="icon">
        <i style="font-size: 22px;" class="ri-printer-line"></i>
      </el-button>
      <span style="font-size: 20px; margin: 0 auto;">编辑器介绍</span>
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"
        style="margin-right: 2px" />
      <span style="margin-right: 6vw">电子笨蛋</span>
    </el-header>
    <el-main class="main">
      <div v-if="editor" class="fixed-menu">
        <el-tooltip content="撤回" :hide-after="0">
          <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
            <i class="ri-arrow-go-back-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="取消撤回" :hide-after="0">
          <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
            <i class="ri-arrow-go-forward-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="清除样式" :hide-after="0">
          <button @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
            <i class="ri-eraser-fill"></i>
          </button>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-select v-model="header" @change="handleHeader" style="width: 72px">
          <el-option :key="0" label="正文" :value="0">
            正文
          </el-option>
          <el-option v-for="i in 5" :key="i" :label="'H' + i" :value="i">
            <i :class="`ri-h-${i}`" :style="{ fontSize: `${28 - i * 2}px` }"></i>
          </el-option>
        </el-select>
        <el-tooltip content="字体" :hide-after="0">
          <el-dropdown trigger="click">
            <button>
              <i class="ri-font-family"></i>
              <i class="ri-arrow-drop-down-fill"></i>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editor.chain().focus().unsetFontFamily().run()">默认</el-dropdown-item>
                <el-dropdown-item v-for="font in fontFamily" :key="font"
                  @click="editor.chain().focus().setFontFamily(font).run()">
                  <div :style="{ fontFamily: font }">{{ font }}</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip content=" 加粗" :hide-after="0">
          <button @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }">
            <i class="ri-bold"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="斜体" :hide-after="0">
          <button @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }">
            <i class="ri-italic"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="下划线" :hide-after="0">
          <button @click="editor.chain().focus().toggleUnderline().run()"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor.isActive('underline') }">
            <i class="ri-underline"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="删除线" :hide-after="0">
          <button @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }">
            <i class="ri-strikethrough"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="文字颜色" :hide-after="0">
          <span>
            <el-popover trigger="click" width="250">
              <div class="color-box">
                <div class="color-item" v-for="color in colorList" :key="color"
                  @click="editor.chain().focus().setColor(color).run()" :style="{ backgroundColor: color }"></div>
              </div>
              <template #reference>
                <button>
                  <i class="ri-font-color"></i>
                  <i class="ri-arrow-drop-down-fill"></i>
                </button>
              </template>
            </el-popover>
          </span>
        </el-tooltip>
        <el-tooltip content="文本高亮" :hide-after="0">
          <button @click="editor.chain().focus().toggleHighlight().run()"
            :class="{ 'is-active': editor.isActive('highlight') }">
            <i class="ri-mark-pen-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="代码" :hide-after="0">
          <button @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }">
            <i class="ri-code-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="代码块" :hide-after="0">
          <button @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }">
            <i class="ri-code-box-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="上标" :hide-after="0">
          <button @click="editor.chain().focus().toggleSuperscript().run()"
            :disabled="!editor.can().chain().focus().toggleSuperscript().run()"
            :class="{ 'is-active': editor.isActive('superscript') }">
            <i class="ri-superscript"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="下标" :hide-after="0">
          <button @click="editor.chain().focus().toggleSubscript().run()"
            :disabled="!editor.can().chain().focus().toggleSubscript().run()"
            :class="{ 'is-active': editor.isActive('subscript') }">
            <i class="ri-subscript"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="链接" :hide-after="0">
          <button @click="setLink()" :class="{ 'is-active': editor.isActive('link') }">
            <i class="ri-link"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="取消链接" :hide-after="0">
          <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
            <i class="ri-link-unlink"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="插入图片" :hide-after="0">
          <button @click="addImage">
            <i class="ri-image-add-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="表格" :hide-after="0">
          <span>
            <el-dropdown trigger="click">
              <button><i class="ri-table-2"></i></button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">插入表格</el-dropdown-item>
                  <el-dropdown-item divided @click="editor.chain().focus().addRowAfter().run()">添加行</el-dropdown-item>
                  <el-dropdown-item @click="editor.chain().focus().deleteRow().run()">删除行</el-dropdown-item>
                  <el-dropdown-item divided
                    @click="editor.chain().focus().addColumnAfter().run()">添加列</el-dropdown-item>
                  <el-dropdown-item @click="editor.chain().focus().deleteColumn().run()">删除列</el-dropdown-item>
                  <el-dropdown-item divided @click="editor.chain().focus().mergeCells().run()">合并单元格</el-dropdown-item>
                  <el-dropdown-item @click="editor.chain().focus().splitCell().run()">拆分单元格</el-dropdown-item>
                  <el-dropdown-item @click="editor.chain().focus().deleteTable().run()">删除表格</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip content="无序列表" :hide-after="0">
          <button @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }">
            <i class="ri-list-unordered"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="有序列表" :hide-after="0">
          <button @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }">
            <i class="ri-list-ordered-2"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="任务列表" :hide-after="0">
          <button @click="editor.chain().focus().toggleTaskList().run()"
            :class="{ 'is-active': editor.isActive('taskList') }">
            <i class="ri-task-line"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="左对齐" :hide-after="0">
          <button @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive('textAlign', { align: 'left' }) }">
            <i class="ri-align-left"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="居中对齐" :hide-after="0">
          <button @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive('textAlign', { align: 'center' }) }">
            <i class="ri-align-center"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="右对齐" :hide-after="0">
          <button @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive('textAlign', { align: 'right' }) }">
            <i class="ri-align-right"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="引用" :hide-after="0">
          <button @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }">
            <i class="ri-double-quotes-l"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="分隔线" :hide-after="0">
          <button @click="editor.chain().focus().setHorizontalRule().run()">
            <i class="ri-separator"></i>
          </button>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-button type="primary" text bg @click="dialogVisible = true">OCR</el-button>
        <el-dropdown trigger="click">
          <el-button type="primary" text bg><i class="ri-bard-line"></i>AI</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>帮我写</el-dropdown-item>
              <el-dropdown-item>帮我改</el-dropdown-item>
              <el-dropdown-item>帮我写</el-dropdown-item>
              <el-dropdown-item>全文总结</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
        <div class="bubble-menu">
          <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            <i class="ri-bold"></i>
          </button>
          <button @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }">
            <i class="ri-italic"></i>
          </button>
          <button @click="editor.chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor.isActive('underline') }">
            <i class="ri-underline"></i>
          </button>
          <button @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }">
            <i class="ri-strikethrough"></i>
          </button>
          <button @click="editor.chain().focus().toggleHighlight().run()"
            :class="{ 'is-active': editor.isActive('highlight') }">
            <i class="ri-mark-pen-line"></i>
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
          <button @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }">
            <i class="ri-double-quotes-l"></i>
          </button>
          <button @click="editor.chain().focus().setHorizontalRule().run()">
            <i class="ri-separator"></i>
          </button>
        </div>
      </bubble-menu>
      <div class="editor-container">
        <div class="docs">
          <h2 style="color: #555;margin-left: 5vw">我的文档</h2>
          <!-- <div class="doc" v-for="i in 5" :key="i"></div> -->
        </div>
        <div class="content">
          <editor-content :editor="editor" class="editor-content" />
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
      <el-dialog v-model="dialogVisible" width="500" title="上传图片">
        <el-upload ref="upload" drag action="http://127.0.0.1:5000/function/ocr" accept=".jpg, .jpeg, .png" :limit="1"
          :on-exceed="handleExceed" :before-upload="beforeUpload" :auto-upload="false" :on-success="handleSuccess">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将图片拖到此处或 <em>点击上传</em>
          </div>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitUpload">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { ElMessage, genFileId } from "element-plus";
import request from "../utils/request.js";
import router from "../router";
import colorList from "../utils/colors.js"
import fontFamily from "../utils/fontFamily.js"
import valueHtml from '../utils/valueHtml.js';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { BubbleMenu, useEditor, EditorContent } from '@tiptap/vue-3'
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

const lowlight = createLowlight()
lowlight.register({ html, ts, css, js })
const header = ref(0); //标题级别
const dialogVisible = ref(false); //OCR弹窗
const upload = ref(null); // 上传图片
// 返回文档页面
const returnHome = () => {
  router.push('/dashboard/DocumentPage')
}
// 创建编辑器实例
const editor = useEditor({
  content: valueHtml,
  extensions: [StarterKit.configure({ codeBlock: false }), Underline, TextAlign.configure({ types: ['heading', 'paragraph'] }), Superscript, Subscript, TextStyle, Color, FontFamily, Typography, TaskList,
    TaskItem, CharacterCount, Highlight.configure({ multicolor: true }), Link, Image, Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, Placeholder.configure({ placeholder: '开始输入 …' }), CodeBlockLowlight.configure({ lowlight })],
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
// 正文或列表
const handleHeader = (value) => {
  if (value === 0) {
    editor.value.chain().focus().setParagraph().run();
  } else {
    editor.value.chain().focus().toggleHeading({ level: value }).run();
  }
}
// 设置链接
const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return // Abort if the user cancels
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
};
// 添加图片
const addImage = () => {
  const url = window.prompt('URL')
  if (url === null) return // Abort if the user cancels
  editor.value.chain().focus().setImage({ src: url }).run()
}
// 检查上传文件格式
const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
  const whiteList = ["jpg", "jpeg", "png"];
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error("上传文件只能是jpg, png格式");
    return false;
  }
};
// 处理超出文件
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
// 提交上传
const submitUpload = () => {
  upload.value.submit();
}
// 上传成功
const handleSuccess = (response) => {
  if (response.code !== 200) {
    ElMessage.error(response.message);
    return;
  }
  ElMessage.success("上传成功");
  dialogVisible.value = false;
};
// 加载文档
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
// 保存文档
const save = () => {
  console.log(editor.value.getHTML());
}
onMounted(() => {
  // loadDocument();
});

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
