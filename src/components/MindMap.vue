<template>
  <div ref="jsmindContainer" style="width: 100%; height: 100%; display: flex;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import jsMind from 'jsmind'
import 'jsmind/style/jsmind.css'

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
  const mindData = [];

  const stack = [];

  const parseNode = (node, parentId = null) => {
    const nodeName = node.nodeName.toLowerCase();
    if (['h1', 'h2', 'h3'].includes(nodeName)) {
      const nodeId = `node${mindData.length + 1}`;
      const mindNode = {
        id: nodeId,
        parentid: parentId,
        topic: node.textContent.trim()
      };

      if (parentId === null) {
        mindNode.isroot = true;
      }

      mindData.push(mindNode);
      stack.push({ level: parseInt(nodeName[1]), id: nodeId });

      let nextNode = node.nextElementSibling;
      while (nextNode && !['h1', 'h2', 'h3'].includes(nextNode.nodeName.toLowerCase())) {
        nextNode = nextNode.nextElementSibling;
      }

      if (nextNode) {
        const nextLevel = parseInt(nextNode.nodeName[1]);
        while (stack.length && stack[stack.length - 1].level >= nextLevel) {
          stack.pop();
        }
        parseNode(nextNode, stack.length ? stack[stack.length - 1].id : null);
      }
    }
  };

  const processNode = (node) => {
    parseNode(node);
    let sibling = node.nextElementSibling;
    while (sibling) {
      parseNode(sibling);
      sibling = sibling.nextElementSibling;
    }
  };

  Array.from(doc.body.children).forEach(processNode);
  return mindData;
};

onMounted(() => {
  if (jsmindContainer.value) {
    const nodes = parseHtmlToMindMap(props.htmlContent);
    const mind = {
      /* 元数据，定义思维导图的名称、作者、版本等信息 */
      "meta": {
        "name": "妙笔mindMap",
        "author": "2234333815@qq.com",
        "version": "0.1"
      },
      /* 数据格式声明 */
      "format": "node_array",
      /* 数据内容 */
      "data": [
        { "id": "root", "isroot": true, "topic": "jsmind" },

        { "id": "open", "parentid": "root", "topic": "Open Source"},
        { "id": "powerful", "parentid": "root", "topic": "Powerful" },
        
        { "id": "open1", "parentid": "open", "topic": "on GitHub" },
        { "id": "open2", "parentid": "open", "topic": "BSD License" },

        { "id": "powerful1", "parentid": "powerful", "topic": "Base on Javascript" },
        { "id": "powerful2", "parentid": "powerful", "topic": "Base on HTML5" },
        { "id": "powerful3", "parentid": "powerful", "topic": "Depends on you" },
      ]
    };

    const options = {
      container: jsmindContainer.value,
      editable: false,
      theme: 'primary',
    };

    const jm = new jsMind(options);
    jm.show(mind);
  }
});
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
