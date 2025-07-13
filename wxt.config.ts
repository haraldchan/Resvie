import { defineConfig } from 'wxt'

const version = import.meta.env.WXT_APP_VERSION

export default defineConfig({
    modules: ['@wxt-dev/module-solid', '@wxt-dev/auto-icons'],
    manifest: {
        name: "Resvie",
        version: version,
        description: "一键获取订单信息，轻松处理预订。",
        permissions: ["tabs", "activeTab", "clipboardWrite", "scripting", "storage", "https://api.deepseek.com/*"],
        web_accessible_resources: [
            {
                matches: ['<all_urls>'],
                resources: ['/*.png']
            }
        ],
    },
    webExt: {
        firefoxProfile: '.wxt/firefox-profile',
        keepProfileChanges: true,
    },
})