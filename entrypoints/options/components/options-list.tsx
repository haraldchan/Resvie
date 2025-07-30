import { Options } from '../Options'
import { Accessor, Setter } from 'solid-js'
import { ModelIcon, OtaIcon, PromptIcon } from '../svg-icons/list-icons'

type Props = {
	selectedOption: Accessor<Options>
	setSelectedOptions: Setter<Options>
}

export default function OptionList({ selectedOption, setSelectedOptions }: Props) {
	const optionListMap = [
		['OTA 网址配置', <OtaIcon />],
		['大模型设置', <ModelIcon />],
		['提示词设置', <PromptIcon />],
	]

	function setClickedOption(e: Event) {
		e.preventDefault()
		setSelectedOptions((e.target as HTMLLIElement).innerText as Options)
	}

	return (
		<ul class='option-list-items'>
			{optionListMap.map(([optionText, icon]) => (
				<li
					onclick={setClickedOption}
					class={selectedOption() === optionText ? 'li-clicked' : ''}
				>
					{icon} {optionText}
				</li>
			))}
		</ul>
	)
}
