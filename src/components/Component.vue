<template>
	<node-view-wrapper class="vue-component">
		<label>文心一言</label>
		<div class="content">
			<textarea class="resizable-textarea" placeholder="请输入内容..."></textarea>
		</div>
		<div class="buttons">
			<el-select v-model="value" placeholder="切换风格" style="width: 140px">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button type="primary" @click="send">发送</el-button>
		</div>
	</node-view-wrapper>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const value = ref('')

const options = [
	{
		value: 'Option1',
		label: 'Option1',
	},
	{
		value: 'Option2',
		label: 'Option2',
	},
	{
		value: 'Option3',
		label: 'Option3',
	},
	{
		value: 'Option4',
		label: 'Option4',
	},
	{
		value: 'Option5',
		label: 'Option5',
	},
]
// 定义 props
const props = defineProps(nodeViewProps)

// 定义 send 方法
const send = () => {

}
</script>

<style lang="scss">
.tiptap {

	/* Vue component */
	.vue-component {
		// background-color: var(--purple-light);
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

		.content {
			margin-top: 1.5rem;
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

		.buttons {
			margin: 0 0.5rem;
			margin-bottom: 0.5rem;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>