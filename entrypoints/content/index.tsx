import './style.css'
import App from './App'

export default defineContentScript({
	matches: [
		'*://ebooking.jladmin.cn/*',
		'*://ql-gz.com/ebooking/*',
		'*://www.ql-gz.com/ebooking/*',
		// '*://ebooking.ctrip.com/*',
		// '*://eb.meituan.com/*',
		// '*://hotel.fliggy.com/*',
		'*://mail.qiye.163.com/*',
	],
	cssInjectionMode: 'ui',
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'rh-app',
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