import type { ICredentialType, INodeProperties } from 'flowease-workflow';

export class OrbitApi implements ICredentialType {
	name = 'orbitApi';

	displayName = 'Orbit API';

	documentationUrl = 'orbit';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
