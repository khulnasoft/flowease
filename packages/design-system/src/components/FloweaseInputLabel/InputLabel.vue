<template>
	<div :class="$style.container" v-bind="$attrs" data-test-id="input-label">
		<label
			v-if="label || $slots.options"
			:for="inputName"
			:class="{
				'flowease-input-label': true,
				[$style.inputLabel]: true,
				[$style.heading]: !!label,
				[$style.underline]: underline,
				[$style[size]]: true,
				[$style.overflow]: !!$slots.options,
			}"
		>
			<div v-if="label" :class="$style.title">
				<FloweaseText :bold="bold" :size="size" :compact="compact" :color="color">
					{{ label }}
					<FloweaseText v-if="required" color="primary" :bold="bold" :size="size">*</FloweaseText>
				</FloweaseText>
			</div>
			<span
				v-if="tooltipText && label"
				:class="[$style.infoIcon, showTooltip ? $style.visible : $style.hidden]"
			>
				<FloweaseTooltip placement="top" :popper-class="$style.tooltipPopper">
					<FloweaseIcon icon="question-circle" size="small" />
					<template #content>
						<div v-html="addTargetBlank(tooltipText)" />
					</template>
				</FloweaseTooltip>
			</span>
			<div
				v-if="$slots.options && label"
				:class="{ [$style.overlay]: true, [$style.visible]: showOptions }"
			/>
			<div
				v-if="$slots.options"
				:class="{ [$style.options]: true, [$style.visible]: showOptions }"
				:data-test-id="`${inputName}-parameter-input-options-container`"
			>
				<slot name="options" />
			</div>
		</label>
		<slot />
	</div>
</template>

<script lang="ts" setup>
import FloweaseText from '../FloweaseText';
import FloweaseIcon from '../FloweaseIcon';
import FloweaseTooltip from '../FloweaseTooltip';
import type { TextColor } from '@/types/text';

const SIZE = ['small', 'medium'] as const;

interface InputLabelProps {
	compact?: boolean;
	color?: TextColor;
	label?: string;
	tooltipText?: string;
	inputName?: string;
	required?: boolean;
	bold?: boolean;
	size?: (typeof SIZE)[number];
	underline?: boolean;
	showTooltip?: boolean;
	showOptions?: boolean;
}

defineOptions({ name: 'FloweaseInputLabel' });
withDefaults(defineProps<InputLabelProps>(), {
	compact: false,
	bold: true,
	size: 'medium',
});

const addTargetBlank = (html: string) =>
	html && html.includes('href=') ? html.replace(/href=/g, 'target="_blank" href=') : html;
</script>

<style lang="scss" module>
.container {
	display: flex;
	flex-direction: column;
}
.inputLabel {
	display: block;
}
.container:hover,
.inputLabel:hover {
	.infoIcon {
		opacity: 1;
	}

	.options {
		opacity: 1;
		transition: opacity 100ms ease-in; // transition on hover in
	}

	.overlay {
		opacity: 1;
		transition: opacity 100ms ease-in; // transition on hover in
	}
}

.title {
	display: flex;
	align-items: center;
	min-width: 0;

	> * {
		white-space: nowrap;
	}
}

.infoIcon {
	display: flex;
	align-items: center;
	color: var(--color-text-light);
	padding-left: var(--spacing-4xs);
	z-index: 1;
}

.options {
	opacity: 0;
	transition: opacity 250ms cubic-bezier(0.98, -0.06, 0.49, -0.2); // transition on hover out

	> * {
		float: right;
	}
}

.overlay {
	position: relative;
	flex-grow: 1;
	opacity: 0;
	transition: opacity 250ms cubic-bezier(0.98, -0.06, 0.49, -0.2); // transition on hover out

	> div {
		position: absolute;
		width: 60px;
		height: 19px;
		top: 0;
		right: 0;
		z-index: 0;

		background: linear-gradient(
			270deg,
			var(--color-foreground-xlight) 72.19%,
			rgba(255, 255, 255, 0) 107.45%
		);
	}
}

.hidden {
	opacity: 0;
}

.visible {
	opacity: 1;
}

.overflow {
	overflow-x: hidden;
	overflow-y: clip;
}

.heading {
	display: flex;

	&.small {
		margin-bottom: var(--spacing-5xs);
	}
	&.medium {
		margin-bottom: var(--spacing-2xs);
	}
}

.underline {
	border-bottom: var(--border-base);
}

:root .tooltipPopper {
	max-width: 400px;

	li {
		margin-left: var(--spacing-s);
	}
}
</style>
