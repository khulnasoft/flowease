import { Service } from 'typedi';
import { DataSource, Repository } from '@flowease/typeorm';
import { AuthIdentity } from '../entities/AuthIdentity';

@Service()
export class AuthIdentityRepository extends Repository<AuthIdentity> {
	constructor(dataSource: DataSource) {
		super(AuthIdentity, dataSource.manager);
	}
}
