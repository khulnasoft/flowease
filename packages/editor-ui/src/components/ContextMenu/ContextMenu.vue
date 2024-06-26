<script lang="ts" setup>
import { type ContextMenuAction, useContextMenu } from '@/composables/useContextMenu';
import { FloweaseActionDropdown } from 'flowease-design-system';
import type { INode } from 'flowease-workflow';
import { watch, ref } from 'vue';

const contextMenu = useContextMenu();
const { position, isOpen, actions, target } = contextMenu;
const dropdown = ref<InstanceType<typeof FloweaseActionDropdown>>();
const emit = defineEmits<{ (event: 'action', action: ContextMenuAction, nodes: INode[]): void }>();

watch(
	isOpen,
	() => {
		if (isOpen) {
			dropdown.value?.open();
		} else {
			dropdown.value?.close();
		}
	},
	{ flush: 'post' },
);

function onActionSelect(item: string) {
	const action = item as ContextMenuAction;
	contextMenu._dispatchAction(action);
	emit('action', action, contextMenu.targetNodes.value);
}

function onVisibleChange(open: boolean) {
	if (!open) {
		contextMenu.close();
	}
}
</script>

<template>
	<Teleport v-if="isOpen" to="body">
		<div
			:class="$style.contextMenu"
			:style="{
				left: `${position[0]}px`,
				top: `${position[1]}px`,
			}"
		>
			<FloweaseActionDropdown
				ref="dropdown"
				:items="actions"
				placement="bottom-start"
				data-test-id="context-menu"
				:hide-arrow="target.source !== 'node-button'"
				@select="onActionSelect"
				@visible-change="onVisibleChange"
			>
				<template #activator>
					<div :class="$style.activator"></div>
				</template>
			</FloweaseActionDropdown>
		</div>
	</Teleport>
</template>

<style module lang="scss">
.contextMenu {
	position: fixed;
}

.activator {
	pointer-events: none;
	opacity: 0;
}
</style>
