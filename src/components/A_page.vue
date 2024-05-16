<template>
  <div class="editor">
    <div style="border-bottom: 1px solid #e8e8e8;">
      <Toolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    </div>
    <div class="editor-container">
      <div class="content">
        <div class="title">
          <input placeholder="标题...">
        </div>
        <Editor class="editor-text-area editor-content-view" v-model="valueHtml" :defaultConfig="editorConfig"
          mode="default" @onCreated="handleCreated" @onChange="handleChange" />
        <div class="word-count">总字数：{{ wordCount }}</div>
      </div>
      <div class="catalog">
        <h2>目录</h2>
        <div v-for="(item, index) in toc" :key="index" :id="index" :type="item.type" class="toc-item"
          @mousedown="handleMousedown">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 标题列表
const headers = ref([]);

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<h1>标题</h1><h2>标题A</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题A1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题A2</h3><p>文本</p><p>文本</p><p>文本</p><h2>标题B</h2><p>文本</p><p>文本</p><p>文本</p><h3>标题B1</h3><p>文本</p><p>文本</p><p>文本</p><h3>标题B2</h3><p>文本</p><p>文本</p><p>文本</p>'
  }, 1500)
})

const toolbarConfig = {
  excludeKeys: ["fullScreen", "group-video"]
}

const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  console.log('created', editor)
  setTimeout(() => {
    const toolbar = DomEditor.getToolbar(editor)
    const curToolbarConfig = toolbar?.getConfig();
    console.log(curToolbarConfig?.toolbarKeys);
  }, 100)
}

const handleChange = (editor) => {
  headers.value = editor.getElemsByTypePrefix('header');
}
const wordCount = computed(() => {
  const text = valueHtml.value.replace(/<[^>]*>/g, ''); // 去除 HTML 标签
  return text.length;
});

const toc = computed(() => {
  const regex = /<h([1-3])>(.*?)<\/h[1-3]>/g;
  const matches = [...valueHtml.value.matchAll(regex)];
  return matches.map((match) => ({ type: "header" + match[1], text: match[2] }));
});

const handleMousedown = (event) => {
  if (event.target.tagName !== 'DIV') return;
  event.preventDefault();
  const index = event.target.id;
  const editor = editorRef.value;
  editor.scrollToElem(headers.value[index].id);
};

</script>

<style scoped>
.editor {
  width: 100%;
}

.editor-toolbar {
  background-color: #FCFCFC;
  margin: 0 auto;
}

.editor-text-area :deep(.w-e-text-container [data-slate-editor]) {
  padding: 0;
}

.editor-container {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px 50px 50px 50px;
  height: 74vh;
}

.title {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.title input {
  font-size: 30px;
  font-weight: bolder;
  border: 0;
  outline: none;
  width: 100%;
  line-height: 1;
}

.catalog {
  width: 18vw;
  padding: 20px;
  border-left: 1px solid #e8e8e8;
  background-color: #fff;
  height: calc(100vh - 126px);
}

.word-count {
  padding-top: 10px;
  font-size: 14px;
  color: #888;
  border-top: 1px solid #e8e8e8;
}

.toc-item {
  cursor: pointer;
  padding: 10px 0;
  color: #666;
}

.toc-item:hover {
  color: #000;
}

.toc-item[type="header1"] {
  font-size: 20px;
  font-weight: bold;
}

.toc-item[type="header2"] {
  font-size: 16px;
  padding-left: 15px;
  font-weight: bold;
}

.toc-item[type="header3"] {
  font-size: 14px;
  padding-left: 30px;
}
</style>