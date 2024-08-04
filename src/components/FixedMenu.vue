<template>
  <div class="fixed-menu">
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
    <el-tooltip content="段落级别" :hide-after="0">
      <el-dropdown trigger="click">
        <button :class="{ 'is-active': headingStyle }">
          <i v-if="headingLevel == 0" class="ri-paragraph"></i>
          <i v-else :class="`ri-h-${headingLevel}`"></i>
          <i class="ri-arrow-drop-down-fill"></i>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="editor.chain().focus().setParagraph().run()">
              <i class="ri-paragraph"></i>正文</el-dropdown-item>
            <el-dropdown-item v-for="index in 4" :key="index"
              @click="editor.chain().focus().toggleHeading({ level: index }).run()">
              <i :class="`ri-h-${index}`"></i>标题{{ index }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
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
        :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
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
        :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
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
          <button>
            <i class="ri-table-view"></i>
            <i class="ri-arrow-drop-down-fill"></i>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">插入表格</el-dropdown-item>
              <el-dropdown-item divided @click="editor.chain().focus().addRowAfter().run()">添加行</el-dropdown-item>
              <el-dropdown-item @click="editor.chain().focus().deleteRow().run()">删除行</el-dropdown-item>
              <el-dropdown-item divided @click="editor.chain().focus().addColumnAfter().run()">添加列</el-dropdown-item>
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
    <el-tooltip content="强制换行" :hide-after="0">
      <button @click="editor.chain().focus().setHardBreak().run()">
        <i class="ri-text-wrap"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="分隔线" :hide-after="0">
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        <i class="ri-separator"></i>
      </button>
    </el-tooltip>
    <el-divider direction="vertical" />
    <el-dropdown trigger="click">
      <el-button type="primary" text bg><i class="ri-bard-line"></i>AI <i class="ri-arrow-drop-down-fill"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="AIfunc('续写')"><i class="ri-edit-line"></i> 文本续写</el-dropdown-item>
          <el-dropdown-item @click="AIfunc('润色')"><i class="ri-palette-fill"></i>修饰润色</el-dropdown-item>
          <el-dropdown-item @click="AIfunc('校对')"><i class="ri-shield-check-fill"></i>病句改写</el-dropdown-item>
          <el-dropdown-item @click="AIfunc('翻译')"><i class="ri-translate"></i>中英翻译</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElButton, ElTooltip, ElDivider, ElDropdown, ElDropdownMenu, ElDropdownItem, ElPopover } from 'element-plus';
import { ElMessage, ElLoading } from "element-plus";
import request from "../utils/request.js";
import colorList from "../utils/colors.js"
import fontFamily from "../utils/fontFamily.js"

const props = defineProps({
  editor: Object
});
// 计算标题级别
const headingLevel = computed(() => {
  for (let level = 1; level <= 4; level++) {
    if (props.editor.isActive('heading', { level })) {
      return level;
    }
  }
  return 0; // 正文
});
// 计算标题样式
const headingStyle = computed(() => {
  if (headingLevel.value == 0) {
    return props.editor.isActive('paragraph');
  }
  return props.editor.isActive('heading', { level: headingLevel.value });
});
// 设置链接
const setLink = () => {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return // Abort if the user cancels
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
};
// 添加图片
const addImage = () => {
  const url = window.prompt('URL')
  if (url === null) return // Abort if the user cancels
  props.editor.chain().focus().setImage({ src: url }).run()
}
// AI功能
const AIfunc = async (command) => {
  let { from, to } = props.editor.state.selection;
  if (from === to) {
    ElMessage.warning('请先选中文本!');
    return;
  }
  const selectedText = props.editor.state.doc.textBetween(from, to, ' ');
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await fetch('/api/function/AIFunc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: selectedText, command: command }),
    });

    if (!response.ok) {
      throw new Error('网络响应不正常');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let receivedText = '';
    let firstChunk = true; // 标记是否是第一次插入

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedValue = decoder.decode(value, { stream: true });
      receivedText += decodedValue;

      let transaction;
      if (firstChunk) {
        loadingInstance.close();
        // 第一次插入时覆盖选中的文本
        transaction = props.editor.state.tr.insertText(decodedValue, from, to);
        firstChunk = false; // 标记为已经插入过第一次
      } else {
        // 后续插入追加文本
        transaction = props.editor.state.tr.insertText(decodedValue, from);
      }
      props.editor.view.dispatch(transaction);

      // 更新 from 的位置
      from += decodedValue.length;
    }

  } catch (error) {
    ElMessage.error(error.message);
  }
}
</script>