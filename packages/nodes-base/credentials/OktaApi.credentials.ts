import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'flowease-workflow';

export class OktaApi implements ICredentialType {
	name = 'oktaApi';

	displayName = 'Okta API';

	documentationUrl = 'okta';

	icon = 'file:icons/Okta.svg';

	httpRequestNode = {
		name: 'Okta',
		docsUrl: 'https://developer.okta.com/docs/reference/',
		apiBaseUrl: '',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'https://dev-123456.okta.com',
		},
		{
			displayName: 'SSWS Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=SSWS {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v1/api-tokens',
		},
	};
}
