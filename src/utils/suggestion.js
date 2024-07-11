import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import CommandsList from '../components/CommandsList.vue';
import request from "../utils/request.js";
import { ElMessage, ElLoading } from "element-plus";

export default {
	items: ({ query }) => {
		return [
			{
				title: '文心助手',
				command: ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					editor.chain().focus().insertContent('<vue-component />').run()
				},
			},
			{
				title: '智能排版',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在生成内容...",
					});
					try {
						const response = await request.post('/function/AIFunc', { text: editor.getHTML(), command: '智能排版' });
						if (response.code == 200) {
							editor.commands.setContent(response.message);
						} else {
							ElMessage.error(response.message);
						}
					} catch (error) {
						ElMessage.error(error);
					} finally {
						loadingInstance.close();
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
						text: "正在生成内容...",
					});
					try {
						const response = await request.post('/function/AIFunc', { text: editor.getHTML(), command: '全文总结' });
						if (response.code == 200) {
							editor.chain().focus().insertContent(response.message).run();
						} else {
							ElMessage.error(response.message);
						}
					} catch (error) {
						ElMessage.error(error);
					} finally {
						loadingInstance.close();
					}
				},
			},
			{
				title: '摘要提取',
				command: async ({ editor }) => {
					const { state, dispatch } = editor.view;
					const { $from } = state.selection;
					const tr = state.tr.delete($from.pos - 1, $from.pos);
					dispatch(tr);
					const loadingInstance = ElLoading.service({
						fullscreen: true,
						text: "正在生成内容...",
					});
					try {
						const response = await request.post('/function/AIFunc', { text: editor.getHTML(), command: '摘要提取' });
						if (response.code == 200) {
							editor.chain().focus().insertContent(response.message).run();
						} else {
							ElMessage.error(response.message);
						}
					} catch (error) {
						ElMessage.error(error);
					} finally {
						loadingInstance.close();
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
						text: "正在生成内容...",
					});
					try {
						const response = await request.post('/function/AIFunc', { text: editor.getHTML(), command: '全文翻译' });
						if (response.code == 200) {
							editor.commands.setContent(response.message);
						} else {
							ElMessage.error(response.message);
						}
					} catch (error) {
						ElMessage.error(error);
					} finally {
						loadingInstance.close();
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