import { Container } from 'typedi';
import { SETTINGS_LICENSE_CERT_KEY } from '@/constants';
import { BaseCommand } from '../BaseCommand';
import { SettingsRepository } from '@db/repositories/settings.repository';

export class ClearLicenseCommand extends BaseCommand {
	static description = 'Clear license';

	static examples = ['$ flowease clear:license'];

	async run() {
		this.logger.info('Clearing license from database.');
		await Container.get(SettingsRepository).delete({
			key: SETTINGS_LICENSE_CERT_KEY,
		});
		this.logger.info('Done. Restart flowease to take effect.');
	}

	async catch(error: Error) {
		this.logger.error('Error updating database. See log messages for details.');
		this.logger.error('\nGOT ERROR');
		this.logger.info('====================================');
		this.logger.error(error.message);
		this.logger.error(error.stack!);
	}
}
