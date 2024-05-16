<template>
  <div class="editor">
    <div style="border-bottom: 1px solid #e8e8e8;">
      <Toolbar id="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    </div>
    <div id="editor-container">
      <div id="title-container">
        <input placeholder="标题...">
      </div>
      <Editor id="editor-text-area" class="editor-content-view" v-model="valueHtml" :defaultConfig="editorConfig"
        mode="default" @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed"
        @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert" />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
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
  console.log('change:', valueHtml.value)
  console.log('change:', editor.getText())
}
const handleDestroyed = (editor) => { console.log('destroyed', editor) }
const handleFocus = (editor) => { console.log('focus', editor) }
const handleBlur = (editor) => { console.log('blur', editor) }
const customAlert = (info, type) => { alert(`【自定义提示】${type} - ${info}`) }

</script>

<style scoped>
.editor {
  width: 100%;
}

#editor-toolbar {
  background-color: #FCFCFC;
  margin: 0 auto;
}

#editor-container {
  padding: 20px 50px 50px 50px;
  height: 70vh;
}

#title-container {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

#title-container input {
  font-size: 30px;
  font-weight: bolder;
  border: 0;
  outline: none;
  width: 100%;
  line-height: 1;
}

#editor-text-area :deep(.w-e-text-container [data-slate-editor]) {
  padding: 0;
}
</style>