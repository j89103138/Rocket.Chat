// Engagement Dashboard - Made available without license restrictions
(async () => {
	try {
		const { prepareAnalytics, attachCallbacks } = await import('../lib/engagementDashboard/startup');
		if (prepareAnalytics && attachCallbacks) {
			await prepareAnalytics();
			attachCallbacks();
		}
	} catch (error) {
		console.error('Failed to initialize engagement dashboard:', error);
	}
})();
