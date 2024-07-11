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
  // 创建一个新的DOM解析器
  const parser = new DOMParser();
  // 解析HTML字符串
  const doc = parser.parseFromString(html, 'text/html');
  // 获取所有的h1, h2, h3标签
  const headers = doc.querySelectorAll('h1, h2, h3');
  // 初始化节点数组
  const nodeArray = [];

  // 使用一个递归函数来遍历DOM节点并构建节点数组
  function traverseNodes(node, parent) {
    // 如果节点是标题元素，创建一个新节点对象
    if (node.tagName.match(/^(H1|H2|H3)$/)) {
      const level = parseInt(node.tagName.substring(1)); // 根据标签名确定层级
      const newNode = {
        id: nodeArray.length + 1, // 简单的ID生成逻辑
        topic: node.textContent.trim(),
        parent: parent ? parent.id : 0, // 如果有父节点，则设置父节点ID
        children: []
      };

      // 如果父节点存在，将当前节点添加到父节点的children数组中
      if (parent) {
        parent.children.push(newNode);
      } else {
        // 如果没有父节点，则是根节点，直接添加到节点数组中
        nodeArray.push(newNode);
      }

      // 递归处理下一个兄弟节点
      let nextSibling = node.nextSibling;
      while (nextSibling) {
        if (nextSibling.tagName.match(/^(H1|H2|H3)$/)) {
          const nextLevel = parseInt(nextSibling.tagName.substring(1));
          if (nextLevel > level) {
            traverseNodes(nextSibling, newNode); // 当前节点是下一个兄弟节点的父节点
          } else {
            break; // 如果下一个兄弟节点的层级不高于当前节点，停止递归
          }
        } else {
          traverseNodes(nextSibling, newNode); // 非标题节点，继续递归处理
        }
        nextSibling = nextSibling.nextSibling;
      }
    }
  }

  // 开始遍历第一个标题节点
  headers.forEach(header => {
    if (!nodeArray.length) { // 如果节点数组为空，则从当前标题开始遍历
      traverseNodes(header, null);
    }
  });

  return nodeArray;
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
      "data":
        [
          { "id": "0", "isroot": true, "topic": "PPT大纲" },

          { "id": "1", "parentid": "0", "topic": "目录" },
          { "id": "2", "parentid": "0", "topic": "简要介绍" },
          { "id": "3", "parentid": "0", "topic": "主题分析" },
          { "id": "4", "parentid": "0", "topic": "重点内容" },
          { "id": "5", "parentid": "0", "topic": "结论" },
          { "id": "6", "parentid": "0", "topic": "感谢" },
          
          { "id": "3.1", "parentid": "3", "topic": "1. 模板运营目标达成情况" },
          { "id": "3.2", "parentid": "3", "topic": "2. 模板运营策略优化" },
          { "id": "3.3", "parentid": "3", "topic": "3. 模板运营团队建设" },
          { "id": "3.4", "parentid": "3", "topic": "4. 模板运营市场拓展" },
          { "id": "3.5", "parentid": "3", "topic": "5. 模板运营未来规划" },

          { "id": "4.1", "parentid": "4", "topic": "1. 模板运营目标达成情况" },
          { "id": "4.2", "parentid": "4", "topic": "2. 模板运营策略优化" },
          { "id": "4.3", "parentid": "4", "topic": "3. 模板运营团队建设" },
          { "id": "4.4", "parentid": "4", "topic": "4. 模板运营市场拓展" },
          { "id": "4.5", "parentid": "4", "topic": "5. 模板运营未来规划" },
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
