import { DeepSeek } from '@/models/models'

export default function ModelOptions() {
	const [deepseek, setDeepseek] = createSignal<DeepSeek>({ key: '', model: 'deepseek-chat' })

	function handleApiUpdate(e: Event) {
		const input = e.target as HTMLInputElement
		const updated = {...deepseek(), key: input.value}

		setDeepseek(updated)
		storage.setItem('local:deepseek', updated)
	}
	
	function handleModelUpdate(e: Event) {
		const select = e.target as HTMLSelectElement
		const updated = {...deepseek(), model: select.value}
		
		setDeepseek(updated)
		storage.setItem('local:deepseek', updated)
	}

	onMount(async () => {
		setDeepseek((await storage.getItem('local:deepseek')) ?? deepseek())
	})

	return (
		<div class="options-details-section">
			<header class='options-header'>
				<span>通用模型</span>
				<span>API 密钥</span>
			</header>
			<ul class='options-items'>
				<li class='list-item'>
					<img
						src='/deepseek-color-VhubYub3.png'
						alt='DeepSeek'
					/>
					<div style={{width: '130px'}}>DeepSeek</div>
					<div>
						<input
							type='url'
							name='deepseek-api'
							value={deepseek().key}
							onchange={handleApiUpdate}
						/>
						<select name="model-select" id="model-select" onchange={handleModelUpdate}>
							<option value="deepseek-chat">chat</option>
							<option value="deepseek-reasoner">reasoner</option>
						</select>
					</div>
				</li>
			</ul>
		</div>
	)
}
