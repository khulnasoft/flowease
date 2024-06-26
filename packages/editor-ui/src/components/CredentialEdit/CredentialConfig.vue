<template>
	<div :class="$style.container" data-test-id="node-credentials-config-container">
		<Banner
			v-show="showValidationWarning"
			theme="danger"
			:message="
				$locale.baseText(
					`credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow${
						credentialPermissions.update || credentialPermissions.isOwner ? '' : '.sharee'
					}`,
					{ interpolate: { owner: credentialOwnerName } },
				)
			"
		/>

		<Banner
			v-if="authError && !showValidationWarning"
			theme="danger"
			:message="
				$locale.baseText(
					`credentialEdit.credentialConfig.couldntConnectWithTheseSettings${
						credentialPermissions.update || credentialPermissions.isOwner ? '' : '.sharee'
					}`,
					{ interpolate: { owner: credentialOwnerName } },
				)
			"
			:details="authError"
			:button-label="$locale.baseText('credentialEdit.credentialConfig.retry')"
			button-loading-label="Retrying"
			:button-title="$locale.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
			:button-loading="isRetesting"
			@click="$emit('retest')"
		/>

		<Banner
			v-show="showOAuthSuccessBanner && !showValidationWarning"
			theme="success"
			:message="$locale.baseText('credentialEdit.credentialConfig.accountConnected')"
			:button-label="$locale.baseText('credentialEdit.credentialConfig.reconnect')"
			:button-title="$locale.baseText('credentialEdit.credentialConfig.reconnectOAuth2Credential')"
			@click="$emit('oauth')"
		>
			<template v-if="isGoogleOAuthType" #button>
				<p
					:class="$style.googleReconnectLabel"
					v-text="`${$locale.baseText('credentialEdit.credentialConfig.reconnect')}:`"
				/>
				<GoogleAuthButton @click="$emit('oauth')" />
			</template>
		</Banner>

		<Banner
			v-show="testedSuccessfully && !showValidationWarning"
			theme="success"
			:message="$locale.baseText('credentialEdit.credentialConfig.connectionTestedSuccessfully')"
			:button-label="$locale.baseText('credentialEdit.credentialConfig.retry')"
			:button-loading-label="$locale.baseText('credentialEdit.credentialConfig.retrying')"
			:button-title="$locale.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
			:button-loading="isRetesting"
			data-test-id="credentials-config-container-test-success"
			@click="$emit('retest')"
		/>

		<template v-if="credentialPermissions.update">
			<flowease-notice v-if="documentationUrl && credentialProperties.length" theme="warning">
				{{ $locale.baseText('credentialEdit.credentialConfig.needHelpFillingOutTheseFields') }}
				<span class="ml-4xs">
					<flowease-link :to="documentationUrl" size="small" bold @click="onDocumentationUrlClick">
						{{ $locale.baseText('credentialEdit.credentialConfig.openDocs') }}
					</flowease-link>
				</span>
			</flowease-notice>

			<AuthTypeSelector
				v-if="showAuthTypeSelector && isNewCredential"
				:credential-type="credentialType"
				@auth-type-changed="onAuthTypeChange"
			/>

			<CopyInput
				v-if="isOAuthType && !allOAuth2BasePropertiesOverridden"
				:label="$locale.baseText('credentialEdit.credentialConfig.oAuthRedirectUrl')"
				:value="oAuthCallbackUrl"
				:copy-button-text="$locale.baseText('credentialEdit.credentialConfig.clickToCopy')"
				:hint="
					$locale.baseText('credentialEdit.credentialConfig.subtitle', { interpolate: { appName } })
				"
				:toast-title="
					$locale.baseText('credentialEdit.credentialConfig.redirectUrlCopiedToClipboard')
				"
				:redact-value="true"
			/>
		</template>
		<EnterpriseEdition v-else :features="[EnterpriseEditionFeature.Sharing]">
			<div>
				<flowease-info-tip :bold="false">
					{{
						$locale.baseText('credentialEdit.credentialEdit.info.sharee', {
							interpolate: { credentialOwnerName },
						})
					}}
				</flowease-info-tip>
			</div>
		</EnterpriseEdition>

		<CredentialInputs
			v-if="credentialType && credentialPermissions.update"
			:credential-data="credentialData"
			:credential-properties="credentialProperties"
			:documentation-url="documentationUrl"
			:show-validation-warnings="showValidationWarning"
			@update="onDataChange"
		/>

		<OauthButton
			v-if="
				isOAuthType &&
				requiredPropertiesFilled &&
				!isOAuthConnected &&
				credentialPermissions.isOwner
			"
			:is-google-o-auth-type="isGoogleOAuthType"
			@click="$emit('oauth')"
		/>

		<flowease-text v-if="isMissingCredentials" color="text-base" size="medium">
			{{ $locale.baseText('credentialEdit.credentialConfig.missingCredentialType') }}
		</flowease-text>

		<EnterpriseEdition :features="[EnterpriseEditionFeature.ExternalSecrets]">
			<template #fallback>
				<flowease-info-tip class="mt-s">
					{{ $locale.baseText('credentialEdit.credentialConfig.externalSecrets') }}
					<flowease-link bold :to="$locale.baseText('settings.externalSecrets.docs')" size="small">
						{{ $locale.baseText('credentialEdit.credentialConfig.externalSecrets.moreInfo') }}
					</flowease-link>
				</flowease-info-tip>
			</template>
		</EnterpriseEdition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import type { ICredentialType, INodeTypeDescription } from 'flowease-workflow';
import { getAppNameFromCredType, isCommunityPackageName } from '@/utils/nodeTypesUtils';

import Banner from '../Banner.vue';
import CopyInput from '../CopyInput.vue';
import CredentialInputs from './CredentialInputs.vue';
import OauthButton from './OauthButton.vue';
import { addCredentialTranslation } from '@/plugins/i18n';
import { BUILTIN_CREDENTIALS_DOCS_URL, DOCS_DOMAIN, EnterpriseEditionFeature } from '@/constants';
import type { IPermissions } from '@/permissions';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useRootStore } from '@/stores/floweaseRoot.store';
import { useNDVStore } from '@/stores/ndv.store';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useNodeTypesStore } from '@/stores/nodeTypes.store';
import type { ICredentialsResponse } from '@/Interface';
import AuthTypeSelector from '@/components/CredentialEdit/AuthTypeSelector.vue';
import GoogleAuthButton from './GoogleAuthButton.vue';
import EnterpriseEdition from '@/components/EnterpriseEdition.ee.vue';

export default defineComponent({
	name: 'CredentialConfig',
	components: {
		EnterpriseEdition,
		AuthTypeSelector,
		Banner,
		CopyInput,
		CredentialInputs,
		OauthButton,
		GoogleAuthButton,
	},
	props: {
		credentialType: {
			type: Object,
		},
		credentialProperties: {
			type: Array,
		},
		parentTypes: {
			type: Array,
		},
		credentialData: {},
		credentialId: {
			type: String,
			default: '',
		},
		showValidationWarning: {
			type: Boolean,
			default: false,
		},
		authError: {
			type: String,
		},
		testedSuccessfully: {
			type: Boolean,
		},
		isOAuthType: {
			type: Boolean,
		},
		allOAuth2BasePropertiesOverridden: {
			type: Boolean,
		},
		isOAuthConnected: {
			type: Boolean,
		},
		isRetesting: {
			type: Boolean,
		},
		credentialPermissions: {
			type: Object,
			default: (): IPermissions => ({}),
		},
		requiredPropertiesFilled: {
			type: Boolean,
		},
		mode: {
			type: String,
			required: true,
		},
		showAuthTypeSelector: {
			type: Boolean,
		},
	},
	data() {
		return {
			EnterpriseEditionFeature,
		};
	},
	async beforeMount() {
		if (this.rootStore.defaultLocale === 'en') return;

		this.uiStore.activeCredentialType = this.credentialType.name;

		const key = `flowease-nodes-base.credentials.${this.credentialType.name}`;

		if (this.$locale.exists(key)) return;

		const credTranslation = await this.credentialsStore.getCredentialTranslation(
			this.credentialType.name,
		);

		addCredentialTranslation(
			{ [this.credentialType.name]: credTranslation },
			this.rootStore.defaultLocale,
		);
	},
	computed: {
		...mapStores(
			useCredentialsStore,
			useNDVStore,
			useNodeTypesStore,
			useRootStore,
			useUIStore,
			useWorkflowsStore,
		),
		activeNodeType(): INodeTypeDescription | null {
			const activeNode = this.ndvStore.activeNode;

			if (activeNode) {
				return this.nodeTypesStore.getNodeType(activeNode.type, activeNode.typeVersion);
			}
			return null;
		},
		appName(): string {
			if (!this.credentialType) {
				return '';
			}

			const appName = getAppNameFromCredType((this.credentialType as ICredentialType).displayName);

			return (
				appName ||
				this.$locale.baseText('credentialEdit.credentialConfig.theServiceYouReConnectingTo')
			);
		},
		credentialTypeName(): string {
			return (this.credentialType as ICredentialType)?.name;
		},
		credentialOwnerName(): string {
			return this.credentialsStore.getCredentialOwnerNameById(`${this.credentialId}`);
		},
		documentationUrl(): string {
			const type = this.credentialType as ICredentialType;
			const activeNode = this.ndvStore.activeNode;
			const isCommunityNode = activeNode ? isCommunityPackageName(activeNode.type) : false;

			const documentationUrl = type?.documentationUrl;

			if (!documentationUrl) {
				return '';
			}

			let url: URL;
			if (documentationUrl.startsWith('https://') || documentationUrl.startsWith('http://')) {
				url = new URL(documentationUrl);
				if (url.hostname !== DOCS_DOMAIN) return documentationUrl;
			} else {
				// Don't show documentation link for community nodes if the URL is not an absolute path
				if (isCommunityNode) return '';
				else url = new URL(`${BUILTIN_CREDENTIALS_DOCS_URL}${documentationUrl}/`);
			}

			if (url.hostname === DOCS_DOMAIN) {
				url.searchParams.set('utm_source', 'flowease_app');
				url.searchParams.set('utm_medium', 'credential_settings');
				url.searchParams.set('utm_campaign', 'create_new_credentials_modal');
			}

			return url.href;
		},
		isGoogleOAuthType(): boolean {
			return (
				this.credentialTypeName === 'googleOAuth2Api' ||
				this.parentTypes.includes('googleOAuth2Api')
			);
		},
		oAuthCallbackUrl(): string {
			const oauthType =
				this.credentialTypeName === 'oAuth2Api' || this.parentTypes.includes('oAuth2Api')
					? 'oauth2'
					: 'oauth1';
			return this.rootStore.oauthCallbackUrls[oauthType as keyof {}];
		},
		showOAuthSuccessBanner(): boolean {
			return (
				this.isOAuthType &&
				this.requiredPropertiesFilled &&
				this.isOAuthConnected &&
				!this.authError
			);
		},
		isMissingCredentials(): boolean {
			return this.credentialType === null;
		},
		isNewCredential(): boolean {
			return this.mode === 'new' && !this.credentialId;
		},
	},
	methods: {
		getCredentialOptions(type: string): ICredentialsResponse[] {
			return this.credentialsStore.allUsableCredentialsByType[type];
		},
		onDataChange(event: { name: string; value: string | number | boolean | Date | null }): void {
			this.$emit('update', event);
		},
		onDocumentationUrlClick(): void {
			this.$telemetry.track('User clicked credential modal docs link', {
				docs_link: this.documentationUrl,
				credential_type: this.credentialTypeName,
				source: 'modal',
				workflow_id: this.workflowsStore.workflowId,
			});
		},
		onAuthTypeChange(newType: string): void {
			this.$emit('authTypeChanged', newType);
		},
	},
	watch: {
		showOAuthSuccessBanner(newValue, oldValue) {
			if (newValue && !oldValue) {
				this.$emit('scrollToTop');
			}
		},
	},
});
</script>

<style lang="scss" module>
.container {
	--notice-margin: 0;
	> * {
		margin-bottom: var(--spacing-l);
	}
}
.googleReconnectLabel {
	margin-right: var(--spacing-3xs);
}
</style>
