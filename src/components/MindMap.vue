<template>
  <div ref="jsmindContainer" style="width: 100%; height: 100%; display: flex;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import "jsmind/style/jsmind.css";
import JsMind from "jsmind";

const props = defineProps({
  htmlContent: {
    type: String,
    required: true
  }
});

const jsmindContainer = ref(null);

const parseHtmlToMindMap = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const nodes = Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName.slice(1)); // 获取标签的级别
    const content = heading.textContent; // 获取标签的内容

    return {
      id: index,
      parent: level === 1 ? null : index - 1, // 如果级别是 1，那么这个节点没有父节点
      topic: content,
      direction: level === 1 ? 'right' : undefined, // 如果级别是 1，那么这个节点的方向是 'right'
    };
  });

  return nodes;
};

onMounted(() => {
  // const mind = parseHtmlToMindMap(props.htmlContent);
  const mind = {
    meta: {
      name: 'jsmind demo',
      author: 'jsmind',
      version: '0.0.1'
    },
    format: 'node_tree',
    data: {
      id: 'root1',
      topic: 'jsMind',
      children: [
        {
          id: 'root2',
          topic: 'jsMind1',
        },
        {
          id: 'root3',
          topic: 'jsMind2',
        },
        {
          id: 'root4',
          topic: 'jsMind3',
        },
        {
          id: 'root5',
          topic: 'jsMind4',
        }
      ]
    }
  };

  const options = {
    container: jsmindContainer.value,
    editable: false,
    theme: 'primary'
  };

  const jm = new JsMind(options);
  jm.show(mind);
});
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
