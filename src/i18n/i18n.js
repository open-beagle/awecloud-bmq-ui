import {createI18n} from 'vue-i18n'
import lang from './index'

const i18n = createI18n({
    locale:localStorage.lang||'zh',
    messages:lang
})

export default i18n