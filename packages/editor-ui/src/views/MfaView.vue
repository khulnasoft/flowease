<template>
	<div :class="$style.container">
		<div :class="$style.logoContainer">
			<Logo />
		</div>
		<flowease-card>
			<div :class="$style.headerContainer">
				<flowease-heading size="xlarge" color="text-dark">{{
					showRecoveryCodeForm
						? $locale.baseText('mfa.recovery.modal.title')
						: $locale.baseText('mfa.code.modal.title')
				}}</flowease-heading>
			</div>
			<div :class="[$style.formContainer, reportError ? $style.formError : '']">
				<flowease-form-inputs
					v-if="formInputs"
					data-test-id="mfa-login-form"
					:inputs="formInputs"
					:event-bus="formBus"
					@input="onInput"
					@submit="onSubmit"
				/>
				<div :class="$style.infoBox">
					<flowease-text
						v-if="!showRecoveryCodeForm && !reportError"
						size="small"
						color="text-base"
						:bold="false"
						>{{ $locale.baseText('mfa.code.input.info') }}
						<a data-test-id="mfa-enter-recovery-code-button" @click="onRecoveryCodeClick">{{
							$locale.baseText('mfa.code.input.info.action')
						}}</a></flowease-text
					>
					<flowease-text v-if="reportError" color="danger" size="small"
						>{{ formError }}
						<a
							v-if="!showRecoveryCodeForm"
							:class="$style.recoveryCodeLink"
							@click="onRecoveryCodeClick"
						>
							{{ $locale.baseText('mfa.recovery.input.info.action') }}</a
						>
					</flowease-text>
				</div>
			</div>
			<div>
				<flowease-button
					float="right"
					:loading="verifyingMfaToken"
					:label="
						showRecoveryCodeForm
							? $locale.baseText('mfa.recovery.button.verify')
							: $locale.baseText('mfa.code.button.continue')
					"
					size="large"
					:disabled="!hasAnyChanges"
					@click="onSaveClick"
				/>
				<flowease-button
					float="left"
					:label="$locale.baseText('mfa.button.back')"
					size="large"
					type="tertiary"
					@click="onBackClick"
				/>
			</div>
		</flowease-card>
	</div>
</template>

<script lang="ts">
import type { IFormInputs } from '@/Interface';
import Logo from '../components/Logo.vue';
import {
	MFA_AUTHENTICATION_RECOVERY_CODE_INPUT_MAX_LENGTH,
	MFA_AUTHENTICATION_TOKEN_INPUT_MAX_LENGTH,
} from '@/constants';
import { useUsersStore } from '@/stores/users.store';
import { mapStores } from 'pinia';
import { mfaEventBus } from '@/event-bus';
import { defineComponent } from 'vue';
import { useToast } from '@/composables/useToast';

export const FORM = {
	MFA_TOKEN: 'MFA_TOKEN',
	MFA_RECOVERY_CODE: 'MFA_RECOVERY_CODE',
} as const;

export default defineComponent({
	name: 'MfaView',
	components: {
		Logo,
	},
	props: {
		reportError: Boolean,
	},
	setup() {
		return {
			...useToast(),
		};
	},
	data() {
		return {
			hasAnyChanges: false,
			formBus: mfaEventBus,
			formInputs: null as null | IFormInputs,
			showRecoveryCodeForm: false,
			verifyingMfaToken: false,
			formError: '',
		};
	},
	async mounted() {
		this.formInputs = [this.mfaTokenFieldWithDefaults()];
	},
	computed: {
		...mapStores(useUsersStore),
	},
	methods: {
		onRecoveryCodeClick() {
			this.formError = '';
			this.showRecoveryCodeForm = true;
			this.hasAnyChanges = false;
			this.formInputs = [this.mfaRecoveryCodeFieldWithDefaults()];
			this.$emit('onFormChanged', FORM.MFA_RECOVERY_CODE);
		},
		onBackClick() {
			if (!this.showRecoveryCodeForm) {
				this.$emit('onBackClick', FORM.MFA_TOKEN);
				return;
			}

			this.showRecoveryCodeForm = false;
			this.hasAnyChanges = true;
			this.formInputs = [this.mfaTokenFieldWithDefaults()];
			this.$emit('onBackClick', FORM.MFA_RECOVERY_CODE);
		},
		onInput({ target: { value, name } }: { target: { value: string; name: string } }) {
			const isSubmittingMfaToken = name === 'token';
			const inputValidLength = isSubmittingMfaToken
				? MFA_AUTHENTICATION_TOKEN_INPUT_MAX_LENGTH
				: MFA_AUTHENTICATION_RECOVERY_CODE_INPUT_MAX_LENGTH;

			if (value.length !== inputValidLength) {
				this.hasAnyChanges = false;
				return;
			}

			this.verifyingMfaToken = true;
			this.hasAnyChanges = true;

			this.onSubmit({ token: value, recoveryCode: value })
				.catch(() => {})
				.finally(() => (this.verifyingMfaToken = false));
		},
		async onSubmit(form: { token: string; recoveryCode: string }) {
			this.formError = !this.showRecoveryCodeForm
				? this.$locale.baseText('mfa.code.invalid')
				: this.$locale.baseText('mfa.recovery.invalid');
			this.$emit('submit', form);
		},
		onSaveClick() {
			this.formBus.emit('submit');
		},
		mfaTokenFieldWithDefaults() {
			return this.formField(
				'token',
				this.$locale.baseText('mfa.code.input.label'),
				this.$locale.baseText('mfa.code.input.placeholder'),
				MFA_AUTHENTICATION_TOKEN_INPUT_MAX_LENGTH,
			);
		},
		mfaRecoveryCodeFieldWithDefaults() {
			return this.formField(
				'recoveryCode',
				this.$locale.baseText('mfa.recovery.input.label'),
				this.$locale.baseText('mfa.recovery.input.placeholder'),
				MFA_AUTHENTICATION_RECOVERY_CODE_INPUT_MAX_LENGTH,
			);
		},
		formField(name: string, label: string, placeholder: string, maxlength: number, focus = true) {
			return {
				name,
				initialValue: '',
				properties: {
					label,
					placeholder,
					maxlength,
					capitalize: true,
					validateOnBlur: false,
					focusInitially: focus,
				},
			};
		},
	},
});
</script>

<style lang="scss" module>
body {
	background-color: var(--color-background-light);
}

.container {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding-top: var(--spacing-2xl);

	> * {
		margin-bottom: var(--spacing-l);
		width: 352px;
	}
}

.logoContainer {
	display: flex;
	justify-content: center;
}

.formContainer {
	padding-bottom: var(--spacing-xl);
}

.headerContainer {
	text-align: center;
	margin-bottom: var(--spacing-xl);
}

.formError input {
	border-color: var(--color-danger);
}

.recoveryCodeLink {
	text-decoration: underline;
}

.infoBox {
	padding-top: var(--spacing-4xs);
}
</style>
