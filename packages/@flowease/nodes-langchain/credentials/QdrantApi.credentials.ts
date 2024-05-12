import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'flowease-workflow';

export class QdrantApi implements ICredentialType {
	name = 'qdrantApi';

	displayName = 'QdrantApi';

	documentationUrl =
		'https://docs.flowease.khulnasoft.com/integrations/builtin/credentials/qdrant/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: false,
			default: '',
		},
		{
			displayName: 'Qdrant URL',
			name: 'qdrantUrl',
			type: 'string',
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.qdrantUrl}}',
			headers: {
				accept: 'application/json; charset=utf-8',
			},
		},
	};
}
