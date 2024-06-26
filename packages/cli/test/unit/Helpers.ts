import type { INodeTypeData } from 'flowease-workflow';

/**
 * Ensure all pending promises settle. The promise's `resolve` is placed in
 * the macrotask queue and so called at the next iteration of the event loop
 * after all promises in the microtask queue have settled first.
 */
export const flushPromises = async () => await new Promise(setImmediate);

export function mockNodeTypesData(
	nodeNames: string[],
	options?: {
		addTrigger?: boolean;
	},
) {
	return nodeNames.reduce<INodeTypeData>((acc, nodeName) => {
		return (
			(acc[`flowease-nodes-base.${nodeName}`] = {
				sourcePath: '',
				type: {
					description: {
						displayName: nodeName,
						name: nodeName,
						group: [],
						description: '',
						version: 1,
						defaults: {},
						inputs: [],
						outputs: [],
						properties: [],
					},
					trigger: options?.addTrigger ? async () => undefined : undefined,
				},
			}),
			acc
		);
	}, {});
}
