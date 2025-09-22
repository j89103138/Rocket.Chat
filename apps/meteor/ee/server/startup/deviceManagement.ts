import { addSettings } from '../settings/deviceManagement';

// Device Management - Made available without license restrictions
(async () => {
	try {
		const { createPermissions, createEmailTemplates } = await import('../lib/deviceManagement/startup');
		const { listenSessionLogin } = await import('../lib/deviceManagement/session');

		await addSettings();
		if (createPermissions) await createPermissions();
		if (createEmailTemplates) await createEmailTemplates();
		if (listenSessionLogin) await listenSessionLogin();
	} catch (error) {
		console.error('Failed to initialize device management:', error);
	}
})();
