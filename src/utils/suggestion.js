import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import CommandsList from '../components/CommandsList.vue';
import { ElMessage, ElLoading } from "element-plus";

export default {
	items: ({ query }) => {
		return [
			{
				title: '内容简化',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在加载中...",
					});
					try {
						const response = await fetch('/api/function/AIFunc', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ text: editor.getHTML(), command: '内容简化' }),
						});
						if (!response.ok) {
							throw new Error('网络响应不正常');
						}
						const reader = response.body.getReader();
						const decoder = new TextDecoder('utf-8');
						let receivedText = '';
						loadingInstance.close();
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							const decodedValue = decoder.decode(value, { stream: true });
							receivedText += decodedValue;
							editor.chain().focus().insertContent(decodedValue).run();
						}
					} catch (error) {
						ElMessage.error(error.message);
					}
				},
			},
			{
				title: '全文总结',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在加载中...",
					});
					try {
						const response = await fetch('/api/function/AIFunc', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ text: editor.getHTML(), command: '全文总结' }),
						});
						if (!response.ok) {
							throw new Error('网络响应不正常');
						}
						const reader = response.body.getReader();
						const decoder = new TextDecoder('utf-8');
						let receivedText = '';
						loadingInstance.close();
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							const decodedValue = decoder.decode(value, { stream: true });
							receivedText += decodedValue;
							editor.chain().focus().insertContent(decodedValue).run();
						}
					} catch (error) {
						ElMessage.error(error.message);
					}
				},
			},
			{
				title: '重点提取',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在加载中...",
					});
					try {
						const response = await fetch('/api/function/AIFunc', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ text: editor.getHTML(), command: '重点提取' }),
						});
						if (!response.ok) {
							throw new Error('网络响应不正常');
						}
						const reader = response.body.getReader();
						const decoder = new TextDecoder('utf-8');
						let receivedText = '';
						loadingInstance.close();
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							const decodedValue = decoder.decode(value, { stream: true });
							receivedText += decodedValue;
							editor.chain().focus().insertContent(decodedValue).run();
						}
					} catch (error) {
						ElMessage.error(error.message);
					}
				},
			},
			{
				title: '全文翻译',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在加载中...",
					});
					try {
						const response = await fetch('/api/function/AIFunc', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ text: editor.getHTML(), command: '全文翻译' }),
						});
						if (!response.ok) {
							throw new Error('网络响应不正常');
						}
						const reader = response.body.getReader();
						const decoder = new TextDecoder('utf-8');
						let receivedText = '';
						loadingInstance.close();
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							const decodedValue = decoder.decode(value, { stream: true });
							receivedText += decodedValue;
							editor.chain().focus().insertContent(decodedValue).run();
						}
					} catch (error) {
						ElMessage.error(error.message);
					}
				},
			},
		].filter(item => item.title.startsWith(query))
	},

	render: () => {
		let component
		let popup

		return {
			onStart: props => {
				component = new VueRenderer(CommandsList, {
					// using vue 2:
					// parent: this,
					// propsData: props,
					props,
					editor: props.editor,
				})

				if (!props.clientRect) {
					return
				}

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: component.element,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start',
				})
			},

			onUpdate(props) {
				component.updateProps(props)

				if (!props.clientRect) {
					return
				}

				popup[0].setProps({
					getReferenceClientRect: props.clientRect,
				})
			},

			onKeyDown(props) {
				if (props.event.key === 'Escape') {
					popup[0].hide()

					return true
				}

				return component.ref?.onKeyDown(props)
			},

			onExit() {
				popup[0].destroy()
				component.destroy()
			},
		}
	},
}