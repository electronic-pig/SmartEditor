<template>
	<node-view-wrapper class="vue-component">
		<label>文心一言</label>
		<div class="reply">
			<blockquote>
				<p v-if="replySuccess">{{ reply }}</p>
			</blockquote>
		</div>
		<div class="content">
			<textarea v-model="prompt" class="resizable-textarea" placeholder="请输入内容..."></textarea>
		</div>
		<div class="footer">
			<el-select v-model="tone" placeholder="切换风格" style="width: 140px">
				<el-option v-for="item in options" :key="item" :label="item" :value="item" />
			</el-select>
			<div class="buttons">
				<el-button v-if="replySuccess" type="primary" :icon="Check" round plain @click="copyToClipboard">复制</el-button>
				<el-button type="primary" @click="send">{{ replySuccess ? '重新' : '' }}发送</el-button>
			</div>
		</div>
	</node-view-wrapper>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'
import { ref, defineProps } from 'vue';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import request from "../utils/request.js";
import { ElMessage, ElLoading } from "element-plus";

const prompt = ref('')
const reply = ref('')
const tone = ref('')
const replySuccess = ref(false)

const options = ["写实", "学术", '恐怖'];
// 定义 props
const props = defineProps(nodeViewProps)

// 定义 send 方法
const send = async () => {
	const loadingInstance = ElLoading.service({
		fullscreen: true,
		text: "正在生成内容...",
	});
	try {
		const response = await request.post('/function/AIFunc', { command: '', text: '', prompt: prompt.value, tone: tone.value });
		if (response.code == 200) {
			reply.value = response.message;
			replySuccess.value = true;
		} else {
			ElMessage.error(response.message);
		}
	} catch (error) {
		ElMessage.error(error);
	} finally {
		loadingInstance.close();
	}
}

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(reply.value)
		ElMessage.success('复制到剪贴板')
	} catch (error) {
		ElMessage.error('复制失败', error)
	}
}
</script>

<style lang="scss">
.tiptap {

	/* Vue component */
	.vue-component {
		border: 2px solid var(--theme--color);
		border-radius: 0.5rem;
		margin: 2rem 0;
		position: relative;

		label {
			background-color: var(--theme--color);
			border-radius: 0 0 0.5rem 0;
			color: var(--white);
			font-size: 0.75rem;
			font-weight: bold;
			padding: 0.25rem 0.5rem;
			position: absolute;
			top: 0;
		}

		.reply {
			padding: 1.5rem 1rem 0 1rem;

			blockquote {
				border-left: 4px solid var(--el-color-primary-light-7);
				margin: 0;
				padding-left: 1rem;
			}
		}

		.content {
			padding: 0.5rem;
			display: flex;
			justify-content: center;

			.resizable-textarea {
				width: 100%;
				height: 60px;
				background-color: transparent;
				border: 1px solid var(--purple-contrast);
				border-radius: 8px;
				font-size: 1rem;
				padding: 0.5rem;
				resize: vertical;
			}

			textarea:focus {
				outline: none;
				box-shadow: 0 0 10px rgba(0, 0, 255, .2);
			}

			.resizable-textarea::placeholder {
				color: #999;
				font-style: italic;
			}
		}

		.footer {
			margin: 0 0.5rem;
			margin-bottom: 0.5rem;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>