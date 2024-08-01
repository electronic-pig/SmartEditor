<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
    <div class="bubble-menu">
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
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <i class="ri-bold"></i>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <i class="ri-italic"></i>
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }">
        <i class="ri-underline"></i>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
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
      <el-divider direction="vertical" />
      <el-dropdown trigger="click">
        <el-button type="primary" text bg><i class="ri-bard-line"></i>AI <i class="ri-arrow-drop-down-fill"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="AIfunc('续写')">AI 续写</el-dropdown-item>
            <el-dropdown-item @click="AIfunc('润色')">AI 润色</el-dropdown-item>
            <el-dropdown-item @click="AIfunc('校对')">AI 校对</el-dropdown-item>
            <el-dropdown-item @click="AIfunc('翻译')">AI 翻译</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </bubble-menu>
</template>

<script setup>
import { BubbleMenu } from '@tiptap/vue-3'
import { computed } from 'vue';
import { ElButton, ElDivider, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { ElMessage, ElLoading } from "element-plus";
import request from "../utils/request.js";

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
// AI功能
const AIfunc = async (command) => {
  const { from, to } = props.editor.state.selection;
  const selectedText = props.editor.state.doc.textBetween(from, to, ' ');
  try {
    const response = await fetch('/function/AIFunc', {
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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedText += decoder.decode(value, { stream: true });

      // 逐步插入接收到的文本
      const transaction = props.editor.state.tr.insertText(receivedText, from, to);
      props.editor.view.dispatch(transaction);
    }

    // 最后一次解码剩余的文本
    receivedText += decoder.decode();
    const transaction = props.editor.state.tr.insertText(receivedText, from, to);
    props.editor.view.dispatch(transaction);

  } catch (error) {
    ElMessage.error(error.message);
  }
}
</script>