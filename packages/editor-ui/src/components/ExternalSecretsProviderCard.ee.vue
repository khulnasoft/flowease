<script lang="ts" setup>
import type { PropType, Ref } from 'vue';
import type { ExternalSecretsProvider } from '@/Interface';
import ExternalSecretsProviderImage from '@/components/ExternalSecretsProviderImage.ee.vue';
import ExternalSecretsProviderConnectionSwitch from '@/components/ExternalSecretsProviderConnectionSwitch.ee.vue';
import { useExternalSecretsStore } from '@/stores/externalSecrets.ee.store';
import { useUIStore } from '@/stores/ui.store';
import { useToast } from '@/composables/useToast';
import { useI18n } from '@/composables/useI18n';
import { useExternalSecretsProvider } from '@/composables/useExternalSecretsProvider';
import { EXTERNAL_SECRETS_PROVIDER_MODAL_KEY } from '@/constants';
import { DateTime } from 'luxon';
import { computed, nextTick, onMounted, toRefs } from 'vue';

const props = defineProps({
	provider: {
		type: Object as PropType<ExternalSecretsProvider>,
		required: true,
	},
});

const externalSecretsStore = useExternalSecretsStore();
const i18n = useI18n();
const uiStore = useUIStore();
const toast = useToast();

const { provider } = toRefs(props) as Ref<ExternalSecretsProvider>;
const providerData = computed(() => provider.value.data);
const {
	connectionState,
	initialConnectionState,
	normalizedProviderData,
	testConnection,
	setConnectionState,
} = useExternalSecretsProvider(provider, providerData);

const actionDropdownOptions = computed(() => [
	{
		value: 'setup',
		label: i18n.baseText('settings.externalSecrets.card.actionDropdown.setup'),
	},
	...(props.provider.connected
		? [
				{
					value: 'reload',
					label: i18n.baseText('settings.externalSecrets.card.actionDropdown.reload'),
				},
			]
		: []),
]);

const canConnect = computed(() => {
	return props.provider.connected || Object.keys(props.provider.data).length > 0;
});

const formattedDate = computed((provider: ExternalSecretsProvider) => {
	return DateTime.fromISO(props.provider.connectedAt ?? new Date()).toFormat('dd LLL yyyy');
});

onMounted(() => {
	setConnectionState(props.provider.state);
});

async function onBeforeConnectionUpdate() {
	if (props.provider.connected) {
		return true;
	}

	await externalSecretsStore.getProvider(props.provider.name);
	await nextTick();
	const status = await testConnection();

	return status !== 'error';
}

function openExternalSecretProvider() {
	uiStore.openModalWithData({
		name: EXTERNAL_SECRETS_PROVIDER_MODAL_KEY,
		data: { name: props.provider.name },
	});
}

async function reloadProvider() {
	try {
		await externalSecretsStore.reloadProvider(props.provider.name);
		toast.showMessage({
			title: i18n.baseText('settings.externalSecrets.card.reload.success.title'),
			message: i18n.baseText('settings.externalSecrets.card.reload.success.description', {
				interpolate: { provider: props.provider.displayName },
			}),
			type: 'success',
		});
	} catch (error) {
		toast.showError(error, i18n.baseText('error'));
	}
}

async function onActionDropdownClick(id: string) {
	switch (id) {
		case 'setup':
			openExternalSecretProvider();
			break;
		case 'reload':
			await reloadProvider();
			break;
	}
}
</script>

<template>
	<flowease-card :class="$style.card">
		<div :class="$style.cardBody">
			<ExternalSecretsProviderImage :class="$style.cardImage" :provider="provider" />
			<div :class="$style.cardContent">
				<flowease-text bold>{{ provider.displayName }}</flowease-text>
				<flowease-text v-if="provider.connected" color="text-light" size="small">
					<span>
						{{
							i18n.baseText('settings.externalSecrets.card.secretsCount', {
								interpolate: {
									count: `${externalSecretsStore.secrets[provider.name]?.length}`,
								},
							})
						}}
					</span>
					|
					<span>
						{{
							i18n.baseText('settings.externalSecrets.card.connectedAt', {
								interpolate: {
									date: formattedDate,
								},
							})
						}}
					</span>
				</flowease-text>
			</div>
			<div v-if="canConnect" :class="$style.cardActions">
				<ExternalSecretsProviderConnectionSwitch
					:provider="provider"
					:before-update="onBeforeConnectionUpdate"
					:disabled="connectionState === 'error' && !provider.connected"
				/>
				<flowease-action-toggle
					class="ml-s"
					theme="dark"
					:actions="actionDropdownOptions"
					@action="onActionDropdownClick"
				/>
			</div>
			<flowease-button v-else type="tertiary" @click="openExternalSecretProvider()">
				{{ i18n.baseText('settings.externalSecrets.card.setUp') }}
			</flowease-button>
		</div>
	</flowease-card>
</template>

<style lang="scss" module>
.card {
	position: relative;
	margin-bottom: var(--spacing-2xs);
}

.cardImage {
	width: 28px;
	height: 28px;
}

.cardBody {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.cardContent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin-left: var(--spacing-s);
}

.cardActions {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: var(--spacing-s);
}
</style>
