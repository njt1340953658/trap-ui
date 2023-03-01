/** 布局配置 */
interface ILayoutSettings {
  /** 是否显示切换主题按钮 */
  showThemeSwitch: boolean
  /** 是否显示全屏按钮 */
  showScreenfull: boolean
}

const layoutSettings: ILayoutSettings = {
  showThemeSwitch: true,
  showScreenfull: true
}

export default layoutSettings
