import { Agent, Agents } from '@/models/models'
import { defaultAgentSrc, defaultOtaSystemPrompt, defaultOtaUserPrompt } from '@/models/defaults'
import { prompts, setPrompts } from './prompt-options'
import { CancelIcon, OkIcon, DeleteIcon } from '../svg-icons/button-icons'

export default function OtaOptions() {
	const [agentSrc, setAgentSrc] = createSignal<Agents>(defaultAgentSrc)
	const [addAgent, setAddAgent] = createSignal<boolean>(false)

	function handleAgentSourcesUpdate(e: Event) {
		const input = e.target as HTMLInputElement
		const updated = agentSrc().map((item) => {
			if (item.name === input.name) {
				if (input.type === 'url') {
					return { ...item, domain: input.value }
				} else {
					if (input.id.includes('url')) {
						return { ...item, keyword: { url: input.value, document: item.keyword.document } }
					} else {
						return { ...item, keyword: { url: item.keyword.url, document: input.value } }
					}
				}
			} else {
				return item
			}
		})

		setAgentSrc(updated)
		storage.setItem('local:agentSrc', updated)
	}

	async function handleAddCustomAgent(isSave: boolean) {
		if (isSave) {
			const name = document.getElementById('new-agent-name') as HTMLInputElement
			const domain = document.getElementById('new-agent-domain') as HTMLInputElement
			const kwUrl = document.getElementById('new-agent-keyword-url') as HTMLInputElement
			const kwDoc = document.getElementById('new-agent-keyword-document') as HTMLInputElement
			if (name.value === '' || domain.value === '' || kwUrl.value === '') {
				setAddAgent(false)
				return
			}

			const newAgent: Agent = {
				agent: 'custom-' + name.value,
				domain: domain.value,
				name: name.value,
				keyword: {
					url: kwUrl.value,
				},
			}

			if (kwDoc.value !== '') newAgent.keyword.document = kwDoc.value

			const newPrompt = {
				agent: newAgent.agent,
				name: newAgent.name,
				prompt: {
					system: defaultOtaSystemPrompt,
					user: defaultOtaUserPrompt,
				},
			}

			setAgentSrc([...agentSrc(), newAgent])
			setPrompts([...prompts(), newPrompt])
			storage.setItem('local:agentSrc', agentSrc())
			storage.setItem('local:prompts', prompts())
		}

		setAddAgent(false)
	}

	async function handleCustomAgentDeletion(name: string) {
		const updatedAgentSrc = agentSrc().filter((agent) => agent.name !== name)
		const updatedPrompts = prompts().filter((agent) => agent.name !== name)

		setAgentSrc(updatedAgentSrc)
		setPrompts(updatedPrompts)
		storage.setItem('local:agentSrc', agentSrc())
		storage.setItem('local:prompts', prompts())
	}

	onMount(async () => {
		setAgentSrc((await storage.getItem('local:agentSrc')) ?? defaultAgentSrc)
	})

	return (
		<>
			<div class='options-details-section'>
				<header class='options-header'>
					<div style='width:100px'>平台名称</div>
					<div style='margin-left:40px; width: 20vw'>网站地址</div>
					<div style='width: 10vw'>URL 关键字</div>
					<div style='margin-left: 2vw; width: 10vw'>网页关键字</div>
				</header>
				<ul class='options-items'>
					{agentSrc()
						.filter((item) => !item.agent.includes('custom'))
						.map((item) => {
							return (
								<li class='list-item'>
									<div>{item.name}</div>
									<div>
										<input
											type='url'
											name={item.name}
											value={item.domain}
											style='margin-left:20px; width: 20vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
									<div>
										<input
											type='text'
											name={item.name}
											id={item.name + '-kw-url'}
											value={item.keyword.url}
											style='margin-left:10px; width: 10vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
									<div>
										<input
											type='text'
											name={item.name}
											id={item.name + '-kw-document'}
											value={item.keyword.document ?? ''}
											style='margin-left:10px; width: 10vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
								</li>
							)
						})}
				</ul>
			</div>

			<h1 style='margin-top:30px'>自定义平台</h1>
			<p>此部分将由大模型解析</p>
			<div class='options-details-section'>
				<header class='options-header'>
					<div style='width:100px'>平台名称</div>
					<div style='margin-left:40px; width: 20vw'>网站地址</div>
					<div style='width: 10vw'>URL 关键字</div>
					<div style='margin-left: 2vw; width: 10vw'>网页关键字</div>
				</header>
				<ul class='options-items'>
					{agentSrc()
						.filter((item) => item.agent.includes('custom'))
						.map((item) => {
							return (
								<li class='list-item'>
									<div>{item.name}</div>
									<div>
										<input
											type='url'
											name={item.name}
											value={item.domain}
											style='margin-left:20px; width: 20vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
									<div>
										<input
											type='text'
											name={item.name}
											id={item.name + '-kw-url'}
											value={item.keyword.url}
											style='margin-left:10px; width: 10vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
									<div>
										<input
											type='text'
											name={item.name}
											id={item.name + '-kw-document'}
											value={item.keyword.document ?? ''}
											placeholder='可选'
											style='margin-left:10px; width: 10vw'
											onchange={handleAgentSourcesUpdate}
										/>
									</div>
									<button
										class='save-button'
										onclick={() => handleCustomAgentDeletion(item.name)}
									>
										<DeleteIcon fill='gray' />
									</button>
								</li>
							)
						})}
					<li class='list-item'>
						<Show when={!addAgent()}>
							<button
								class='options-add-button'
								style={{ 'margin-left': '0px' }}
								onclick={() => setAddAgent(true)}
							>
								添加
							</button>
						</Show>
						<Show when={addAgent()}>
							<div style={{ margin: '0 10px 0 0' }}>
								<input
									type='text'
									placeholder='Agent 名称'
									style={{ width: '130px' }}
									id='new-agent-name'
								/>
							</div>
							<div>
								<input
									type='url'
									style='margin-left:20px; width:20vw'
									placeholder='平台网站地址'
									id='new-agent-domain'
								/>
							</div>
							<div>
								<input
									type='text'
									style='margin-left:10px; width: 10vw'
									placeholder='URL 关键字'
									id='new-agent-keyword-url'
								/>
							</div>
							<div>
								<input
									type='text'
									style='margin-left:10px; width: 10vw'
									placeholder='网页关键字 (可选)'
									id='new-agent-keyword-document'
								/>
							</div>
							<button
								class='save-button'
								onclick={() => handleAddCustomAgent(false)}
							>
								<CancelIcon />
							</button>
							<button
								class='save-button'
								onclick={() => handleAddCustomAgent(true)}
							>
								<OkIcon />
							</button>
						</Show>
					</li>
				</ul>
			</div>
		</>
	)
}
