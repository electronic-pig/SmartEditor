<template>
  <div class="container" style="width: 100%; height: 100%;">
    <div ref="jsmindContainer" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import jsMind from 'jsmind'
import 'jsmind/style/jsmind.css'

const props = defineProps({
  htmlContent: {
    type: String,
    required: true
  }
});

const jsmindContainer = ref(null);

const parseHtmlToNode = (html) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(html, 'text/html');
  const nodeArray = [];
  const headings = content.querySelectorAll('h1, h2, h3');
  let idCounter = 0;
  let parentStack = [];

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    const nodeId = idCounter.toString();
    const node = {
      id: nodeId,
      topic: heading.textContent.trim(),
      parentid: level === 1 ? null : parentStack[level - 2]?.id
    };

    nodeArray.push(node);
    parentStack[level - 1] = node;
    idCounter++;
  });

  if (nodeArray.length > 0) {
    nodeArray[0].isroot = true; // 第一个节点为根节点
  }

  return nodeArray;
};

const initJsMind = () => {
  const nodes = parseHtmlToNode(props.htmlContent);

  const mind = {
    "meta": {
      "name": "妙笔mindMap",
      "author": "2234333815@qq.com",
      "version": "0.1"
    },
    "format": "node_array",
    "data": nodes
  };

  const options = {
    container: jsmindContainer.value,
    editable: false,
    theme: 'primary',
  };

  const jm = new jsMind(options);
  jm.show(mind);
}

onMounted(async () => {
  await nextTick();
  initJsMind();
});
</script>
