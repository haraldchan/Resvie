import './style.css'
import App from './App'

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: 'ui',
	// runAt: import.meta.env.BROWSER === 'chrome' ? 'document_start' : undefined,
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'resvie-app',
			position: 'inline',
			anchor: 'body',
		
			onMount: (container) => {
				const unmount = render(() => <App />, container)
				return unmount
			},
			onRemove: (unmount) => {
				unmount?.()
			},
		})

		ui.mount()
	},
})