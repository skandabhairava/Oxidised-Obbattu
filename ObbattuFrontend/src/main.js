import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
	}
});

console.log(navigator)
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./service-worker.js")
}

export default app;