import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '../components/Component.vue'

export default Node.create({
	name: 'vueComponent',

	group: 'block',

	atom: true,

	addAttributes() {
		return {
			message: {
				default: null,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'vue-component',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['vue-component', mergeAttributes(HTMLAttributes)]
	},

	addNodeView() {
		return VueNodeViewRenderer(Component)
	},
})