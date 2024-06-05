<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
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
        <button @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          <i class="ri-paragraph"></i>
        </button>
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
      <editor-content :editor="editor" class="editor-content" />
    </el-main>
  </el-container>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'


const editor = useEditor({
  content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
  extensions: [StarterKit, Underline, TextAlign, Superscript, Subscript],
})
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

.main {
  padding: 10px;
}
</style>
