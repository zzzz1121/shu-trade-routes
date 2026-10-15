# 平台与环境核对

核对日期：2026-10-15（Asia/Shanghai）。初始目录为空，无 Git 仓库、既有代码或依赖。系统 PATH 无 Node/npm，使用 Codex 内置 Node 完成本地测试。未发现小红书开发者工具，未获得 AppID。

官方参考：

- [全局配置](https://miniapp.xiaohongshu.com/doc/DC813994)：确认 app.json 的 pages/window 与 .json/.js/.xhsml/.css 页面格式。
- [模块化](https://miniapp.xiaohongshu.com/doc/DC638236)：确认 require/module.exports，共用规则模块采用 CommonJS，并以 UMD 提供浏览器入口。
- [代码构成](https://miniapp.xiaohongshu.com/doc/DC602239)：确认 Page、setData、bindtap、xhs: 模板指令；该页标题为小组件，具体小程序配置另以全局配置页交叉核对。
- [快速开始](https://miniapp.xiaohongshu.com/doc/DC611695)：开发权限、真实 AppID、工具创建与预览步骤。
- [开发者工具概览](https://miniapp.xiaohongshu.com/doc/DC514746)：工具下载、导入、编译及扫码预览。
- [小程序介绍](https://miniapp.xiaohongshu.com/doc/DC137160)：平台独立开发要求；上线类型和资质后续按实际主体确认。

没有微信文件格式或 wx API，也未编造平台专有 API。无业务网络请求。开发者工具项目配置交由实际工具生成，避免虚构 appid、SDK 版本或配置字段。

技术选择：原生页面、浏览器 DOM、Node 标准库提供基础能力；无大型游戏引擎或生产依赖。此关卡无需额外渲染/状态库，避免为几处按钮引入跨平台框架。可选浏览器测试复用成熟开源 Playwright（测试环境库，不进入小程序包）。

待平台验收：模板指令与表达式、CSS 变量/@import、页面滚动、安全区域、基础库兼容；A/B 路线真机点击、撤销、重试、重复点击。当前仅声明规则与浏览器验证通过。
