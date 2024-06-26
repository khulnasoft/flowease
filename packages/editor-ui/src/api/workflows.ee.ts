import type { IRestApiContext, IShareWorkflowsPayload, IWorkflowsShareResponse } from '@/Interface';
import { makeRestApiRequest } from '@/utils/apiUtils';
import type { IDataObject } from 'flowease-workflow';

export async function setWorkflowSharedWith(
	context: IRestApiContext,
	id: string,
	data: IShareWorkflowsPayload,
): Promise<IWorkflowsShareResponse> {
	return await makeRestApiRequest(
		context,
		'PUT',
		`/workflows/${id}/share`,
		data as unknown as IDataObject,
	);
}
