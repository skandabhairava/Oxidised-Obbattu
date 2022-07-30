import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
	}
});

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./service-worker.js")
	.then((data) => console.log("Service worker registered", data))
	.catch((err) => console.log("err occurred while loading service worker", err))
}

export default app;