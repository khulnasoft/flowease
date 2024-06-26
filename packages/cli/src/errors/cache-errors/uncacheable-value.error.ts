import { ApplicationError } from 'flowease-workflow';

export class UncacheableValueError extends ApplicationError {
	constructor(key: string) {
		super('Value cannot be cached in Redis', {
			extra: { key, hint: 'Does the value contain circular references?' },
		});
	}
}
