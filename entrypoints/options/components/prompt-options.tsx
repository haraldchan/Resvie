import { defaultPrompts } from '@/models/defaults'
import { Prompts } from '@/models/models'

export const [prompts, setPrompts] = createSignal<Prompts>(defaultPrompts)

export default function PromptOptions() {
	const [curEditingAgent, setCurEditingAgent] = createSignal('')

	function handlePromptUpdate(e: Event) {
		e.preventDefault()

		const updatedSystemPrompt = (document.getElementById(`system-prompt-${curEditingAgent()}`) as HTMLTextAreaElement).value
		const updatedUserPrompt = (document.getElementById(`user-prompt-${curEditingAgent()}`) as HTMLTextAreaElement).value

		const updated = prompts().map((item) => {
			if (item.agent === curEditingAgent()) {
				return {
					agent: item.agent,
					name: item.name,
					prompt: {
						system: updatedSystemPrompt,
						user: updatedUserPrompt
					},
				}
			} else {
				return item
			}
		})

		setPrompts(updated)
		setCurEditingAgent('')
		storage.setItem('local:prompts', updated)
	}

	onMount(async () => {
		setPrompts((await storage.getItem('local:prompts') ?? defaultPrompts))
	})

	return (
		<div class='options-details-section'>
			<header class='options-header'>
				<span>平台名称</span>
			</header>
			<ul class='options-items'>
				{prompts().map((item) => {
					return (
						<>
							<li
								class='list-item'
								style={{ 'justify-content': 'space-between' }}
							>
								<div>{item.name}</div>
								<Show when={curEditingAgent() !== item.agent}>
									<div
										class='prompt-setting'
										onclick={() => setCurEditingAgent(item.agent)}
									>
										{' '}
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											width='15px'
											height='15px'
										>
											<g
												fill='none'
												stroke='currentColor'
											>
												<path d='M3.082 13.945c-.529-.95-.793-1.426-.793-1.945s.264-.994.793-1.944L4.43 7.63l1.426-2.381c.559-.933.838-1.4 1.287-1.66c.45-.259.993-.267 2.08-.285L12 3.26l2.775.044c1.088.018 1.631.026 2.08.286s.73.726 1.288 1.659L19.57 7.63l1.35 2.426c.528.95.792 1.425.792 1.944s-.264.994-.793 1.944L19.57 16.37l-1.426 2.381c-.559.933-.838 1.4-1.287 1.66c-.45.259-.993.267-2.08.285L12 20.74l-2.775-.044c-1.088-.018-1.631-.026-2.08-.286s-.73-.726-1.288-1.659L4.43 16.37z'></path>
												<circle
													cx='12'
													cy='12'
													r='3'
												></circle>
											</g>
										</svg>
										设置
									</div>
								</Show>
								<Show when={curEditingAgent() === item.agent}>
									<div class='prompt-setting editing'>
										<button class='save-button' onclick={() => setCurEditingAgent('')}>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 512 512'
												width='20px'
												height='20px'
											>
												<path
													fill='red'
													fill-rule='evenodd'
													d='M420.48 121.813L390.187 91.52L256 225.92L121.813 91.52L91.52 121.813L225.92 256L91.52 390.187l30.293 30.293L256 286.08l134.187 134.4l30.293-30.293L286.08 256z'
												></path>
											</svg>
										</button>
										<button class='save-button' onclick={handlePromptUpdate}>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'
												width='25px'
												height='25px'
											>
												<path
													fill='green'
													d='m15.3 5.3l-6.8 6.8l-2.8-2.8l-1.4 1.4l4.2 4.2l8.2-8.2z'
												></path>
											</svg>
										</button>
									</div>
								</Show>
							</li>
							<Show when={curEditingAgent() === item.agent}>
								<li class='list-item list-item-expanded'>
									<div class='prompt-block'>
										<h4>系统提示词</h4>
										<textarea
											class='prompt-details'
											id={`system-prompt-${item.agent}`}
											name={item.agent}
											value={item.prompt.system}
										></textarea>
									</div>
									<div class='prompt-block'>
										<h4>用户提示词</h4>
										<textarea
											class='prompt-details'
											id={`user-prompt-${item.agent}`}
											name={item.agent}
											value={item.prompt.user}
										></textarea>
									</div>
								</li>
							</Show>
						</>
					)
				})}
			</ul>
		</div>
	)
}
