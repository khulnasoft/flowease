<script lang="ts" setup>
import Modal from './Modal.vue';
import { SOURCE_CONTROL_PULL_MODAL_KEY } from '@/constants';
import type { PropType } from 'vue';
import type { EventBus } from 'flowease-design-system/utils';
import type { SourceControlAggregatedFile } from '@/Interface';
import { useI18n } from '@/composables/useI18n';
import { useLoadingService } from '@/composables/useLoadingService';
import { useToast } from '@/composables/useToast';
import { useSourceControlStore } from '@/stores/sourceControl.store';
import { useUIStore } from '@/stores/ui.store';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, ref } from 'vue';
import { sourceControlEventBus } from '@/event-bus/source-control';

const props = defineProps({
	data: {
		type: Object as PropType<{ eventBus: EventBus; status: SourceControlAggregatedFile[] }>,
		default: () => ({}),
	},
});

const incompleteFileTypes = ['variables', 'credential'];

const loadingService = useLoadingService();
const uiStore = useUIStore();
const toast = useToast();
const i18n = useI18n();
const sourceControlStore = useSourceControlStore();
const router = useRouter();
const route = useRoute();

const files = ref<SourceControlAggregatedFile[]>(props.data.status || []);

const workflowFiles = computed(() => {
	return files.value.filter((file) => file.type === 'workflow');
});

const modifiedWorkflowFiles = computed(() => {
	return workflowFiles.value.filter((file) => file.status === 'modified');
});

const deletedWorkflowFiles = computed(() => {
	return workflowFiles.value.filter((file) => file.status === 'deleted');
});

function close() {
	uiStore.closeModal(SOURCE_CONTROL_PULL_MODAL_KEY);
}

async function pullWorkfolder() {
	loadingService.startLoading(i18n.baseText('settings.sourceControl.loading.pull'));
	close();

	try {
		await sourceControlStore.pullWorkfolder(true);

		const hasVariablesOrCredentials = files.value.some((file) => {
			return incompleteFileTypes.includes(file.type);
		});

		toast.showMessage({
			title: i18n.baseText('settings.sourceControl.pull.success.title'),
			type: 'success',
		});

		if (hasVariablesOrCredentials) {
			void nextTick(() => {
				toast.showMessage({
					message: i18n.baseText('settings.sourceControl.pull.oneLastStep.description'),
					title: i18n.baseText('settings.sourceControl.pull.oneLastStep.title'),
					type: 'info',
					duration: 0,
					showClose: true,
					offset: 0,
				});
			});
		}
		sourceControlEventBus.emit('pull');
	} catch (error) {
		toast.showError(error, 'Error');
	} finally {
		loadingService.stopLoading();
	}
}
</script>

<template>
	<Modal
		width="500px"
		:title="i18n.baseText('settings.sourceControl.modals.pull.title')"
		:event-bus="data.eventBus"
		:name="SOURCE_CONTROL_PULL_MODAL_KEY"
	>
		<template #content>
			<div :class="$style.container">
				<flowease-text>
					{{ i18n.baseText('settings.sourceControl.modals.pull.description') }}
					<flowease-link :to="i18n.baseText('settings.sourceControl.docs.using.pushPull.url')">
						{{ i18n.baseText('settings.sourceControl.modals.pull.description.learnMore') }}
					</flowease-link>
				</flowease-text>

				<div v-if="modifiedWorkflowFiles.length > 0" class="mt-l">
					<ul :class="$style.filesList">
						<li v-for="file in modifiedWorkflowFiles" :key="file.id">
							<flowease-link :class="$style.fileLink" new-window :to="`/workflow/${file.id}`">
								{{ file.name }}
								<flowease-icon icon="external-link-alt" />
							</flowease-link>
						</li>
					</ul>
				</div>
			</div>
		</template>

		<template #footer>
			<div :class="$style.footer">
				<flowease-button type="tertiary" class="mr-2xs" @click="close">
					{{ i18n.baseText('settings.sourceControl.modals.pull.buttons.cancel') }}
				</flowease-button>
				<flowease-button type="primary" @click="pullWorkfolder">
					{{ i18n.baseText('settings.sourceControl.modals.pull.buttons.save') }}
				</flowease-button>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.container > * {
	overflow-wrap: break-word;
}

.filesList {
	list-style: inside;
	margin-top: var(--spacing-3xs);
	padding-left: var(--spacing-2xs);

	li {
		margin-top: var(--spacing-3xs);
	}
}

.fileLink {
	svg {
		display: none;
		margin-left: var(--spacing-4xs);
	}

	&:hover svg {
		display: inline-flex;
	}
}

.footer {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
