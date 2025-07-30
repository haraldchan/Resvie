import { defaultPrompts } from '@/models/defaults'
import { Prompts } from '@/models/models'
import { SettingIcon, OkIcon, CancelIcon } from '../svg-icons/button-icons'

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
						user: updatedUserPrompt,
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
		setPrompts((await storage.getItem('local:prompts')) ?? defaultPrompts)
	})

	return (
		<div class='options-details-section'>
			<header class='options-header'>
				<div style='width:100px'>平台名称</div>
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
										<SettingIcon />
										设置
									</div>
								</Show>
								<Show when={curEditingAgent() === item.agent}>
									<div class='prompt-setting editing'>
										<button
											class='save-button'
											onclick={() => setCurEditingAgent('')}
										>
											<CancelIcon />
										</button>
										<button
											class='save-button'
											onclick={handlePromptUpdate}
										>
											<OkIcon />
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
