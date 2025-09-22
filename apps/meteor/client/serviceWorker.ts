const KEY = 'sw_last_reload';
const RELOAD_WINDOW = 1000 * 10;

function safeLocalStorageGet(key: string) {
        try {
                return localStorage.getItem(key);
        } catch (error) {
                console.warn('service worker: unable to access localStorage', error);
                return null;
        }
}

function safeLocalStorageSet(key: string, value: string) {
        try {
                localStorage.setItem(key, value);
        } catch (error) {
                console.warn('service worker: unable to persist service worker reload marker', error);
        }
}

function reload() {
        const lastReload = safeLocalStorageGet(KEY);

	if (lastReload) {
		const last = Date.parse(lastReload);

		if (!isNaN(last)) {
			const elapsed = Date.now() - last;

			if (elapsed < RELOAD_WINDOW) {
				return;
			}
		}
	}

        safeLocalStorageSet(KEY, new Date().toISOString());
        console.log('service worker: reloading to activate');
        window.location.reload();
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/enc.js', {
			scope: '/',
		})
		.then((reg) => {
			if (reg.active) {
				console.log('service worker: installed');
				if (!navigator.serviceWorker.controller) {
					reload();
				}
			}
		})
		.catch((err) => {
			console.log(`registration failed: ${err}`);
		});
}
