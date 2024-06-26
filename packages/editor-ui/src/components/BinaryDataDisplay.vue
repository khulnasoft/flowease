<template>
	<div v-if="windowVisible" :class="['binary-data-window', binaryData?.fileType]">
		<flowease-button
			size="small"
			class="binary-data-window-back"
			:title="$locale.baseText('binaryDataDisplay.backToOverviewPage')"
			icon="arrow-left"
			:label="$locale.baseText('binaryDataDisplay.backToList')"
			@click.stop="closeWindow"
		/>

		<div class="binary-data-window-wrapper">
			<div v-if="!binaryData">
				{{ $locale.baseText('binaryDataDisplay.noDataFoundToDisplay') }}
			</div>
			<BinaryDataDisplayEmbed v-else :binary-data="binaryData" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import type { IBinaryData, IRunData } from 'flowease-workflow';

import BinaryDataDisplayEmbed from '@/components/BinaryDataDisplayEmbed.vue';

import { useWorkflowsStore } from '@/stores/workflows.store';
import { useNodeHelpers } from '@/composables/useNodeHelpers';

export default defineComponent({
	name: 'BinaryDataDisplay',

	components: {
		BinaryDataDisplayEmbed,
	},
	props: [
		'displayData', // IBinaryData
		'windowVisible', // boolean
	],
	setup() {
		const nodeHelpers = useNodeHelpers();

		return {
			nodeHelpers,
		};
	},
	computed: {
		...mapStores(useWorkflowsStore),
		binaryData(): IBinaryData | null {
			const binaryData = this.nodeHelpers.getBinaryData(
				this.workflowRunData,
				this.displayData.node,
				this.displayData.runIndex,
				this.displayData.outputIndex,
			);

			if (binaryData.length === 0) {
				return null;
			}

			if (
				this.displayData.index >= binaryData.length ||
				binaryData[this.displayData.index][this.displayData.key] === undefined
			) {
				return null;
			}

			const binaryDataItem: IBinaryData = binaryData[this.displayData.index][this.displayData.key];

			return binaryDataItem;
		},

		workflowRunData(): IRunData | null {
			const workflowExecution = this.workflowsStore.getWorkflowExecution;
			if (workflowExecution === null) {
				return null;
			}
			const executionData = workflowExecution.data;
			return executionData ? executionData.resultData.runData : null;
		},
	},
	methods: {
		closeWindow() {
			// Handle the close externally as the visible parameter is an external prop
			// and is so not allowed to be changed here.
			this.$emit('close');
			return false;
		},
	},
});
</script>

<style lang="scss">
.binary-data-window {
	position: absolute;
	top: 50px;
	left: 0;
	z-index: 10;
	width: 100%;
	height: calc(100% - 50px);
	background-color: var(--color-run-data-background);
	overflow: hidden;
	text-align: center;

	&.json {
		overflow: auto;
	}

	.binary-data-window-wrapper {
		margin-top: 0.5em;
		padding: 0 1em;
		height: calc(100% - 50px);

		.el-row,
		.el-col {
			height: 100%;
		}
	}
}
</style>
