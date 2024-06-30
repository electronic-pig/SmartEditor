import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'

import CommandsList from '../components/CommandsList.vue'

export default {
	items: ({ query }) => {
		return [
			{
				title: '文心助手',
				command: ({ editor }) => {
					editor.chain().focus().insertContent('<vue-component />').run()
				},
			},
			{
				title: '智能排版',
				command: async ({ editor }) => {
					const content = await editor.getHTML();
					console.log(content);
				},
			},
			{
				title: '全文总结',
				command: async ({ editor }) => {
					const content = await editor.getHTML();
					console.log(content);
				},
			},
			{
				title: '摘要提取',
				command: async ({ editor }) => {
					const content = await editor.getHTML();
					console.log(content);
				},
			},
			{
				title: '全文翻译',
				command: async ({ editor }) => {
					const content = await editor.getHTML();
					console.log(content);
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