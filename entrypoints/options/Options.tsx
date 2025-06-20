import OptionList from './components/options-list'
import OptionDetails from './components/option-details'
import { createSignal } from "solid-js"

export type Options = '大模型设置' | 'OTA 网址配置'

export default function Options() {
	const [selectedOption, setSelectedOption] = createSignal<Options>('大模型设置')
	const descriptions = new Map<Options, string>([
		['大模型设置', '设置 API 密钥及模型'],
		['OTA 网址配置', '配置平台网址以读取订单信息']
	])


	return (
		<div class='container'>
			<div class='column-left'>
				<header class='header'>
					<img
						src={browser.runtime.getURL('/icon/icon.png')}
						alt='logo'
					/>{' '}
					<span>
						<p>Resvie</p>
						<p>2.0.0</p>
					</span>
				</header>
				<OptionList
					selectedOption={selectedOption}
					setSelectedOptions={setSelectedOption}
				/>
			</div>
			<OptionDetails selectedOption={selectedOption} descriptions={descriptions}/>
		</div>
	)
}
