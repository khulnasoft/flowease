import FloweaseRadioButtons from './RadioButtons.vue';

import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

export default {
	title: 'Atoms/RadioButtons',
	component: FloweaseRadioButtons,
	argTypes: {
		size: {
			type: 'select',
			options: ['small', 'medium'],
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-xlight' },
	},
};

const methods = {
	onInput: action('update:modelValue'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		FloweaseRadioButtons,
	},
	template: `<flowease-radio-buttons v-model="val" v-bind="args" @update:modelValue="onInput">
		</flowease-radio-buttons>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Example = Template.bind({});
Example.args = {
	options: [
		{
			label: 'Test',
			value: 'test',
		},
		{
			label: 'World',
			value: 'world',
		},
		{
			label: 'Hello',
			value: 'hello',
		},
	],
};

export const Disabled = Template.bind({});
Disabled.args = {
	modelValue: 'enabled',
	options: [
		{
			label: 'Enabled',
			value: 'enabled',
		},
		{
			label: 'Disabled',
			value: 'disabled',
			disabled: true,
		},
	],
};
