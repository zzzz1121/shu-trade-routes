# 蜀地钱路 / Shu Trade Routes · V0.1

北宋四川交子文化背景的二维轻策略解谜原型。已实现第一关《一车铁钱》，采用参考图指导的生成式游戏美术。游戏数值不代表真实宋代货币兑换比例。

## 本地试玩与仓库

当前只维护本地试玩和 GitHub，已停止 ChatGPT Sites 发布流程。

GitHub私有仓库：https://github.com/zzzz1121/shu-trade-routes 。另一台电脑登录有权限的GitHub账号后克隆：

```sh
git clone https://github.com/zzzz1121/shu-trade-routes.git
cd shu-trade-routes
npm start
```

网页静态包：`npm run build:web` 输出到 `dist/`，与本地试玩及小程序共用同一套规则源文件。构建静态包不会自动发布。历史托管配置已移到 `docs/archive/sites-hosting.json`，不再作为当前发布配置。

## 本地试玩

安装 Node.js 18 或更新版本，用 VS Code 打开本仓库目录，在终端执行：

```sh
npm start
```

打开 http://127.0.0.1:4173 。无需 npm install，无运行依赖。也可用 `node scripts/serve.js`。

当前 Mac 未将 Node 加入 PATH，可执行 `sh scripts/dev.sh`；此脚本优先使用系统 Node，其次使用本机 Codex 内置运行时。VS Code「终端 → 运行任务 → 试玩蜀地钱路」调用同一脚本。关闭终端或 Ctrl+C 停止服务。另一台电脑建议安装正常的 Node 运行环境。

## 自动化验证

```sh
npm test
```

规则测试使用 Node 内置 test/assert，不需安装测试框架。可选浏览器回归：安装 Playwright 并准备 Chrome，保持试玩服务运行，再执行 `node tests/fixed-screen.cjs`。固定屏测试脚本使用 Chrome。截图输出到 outputs/。

## 小红书开发者工具

1. 从官方开发者工具页面下载工具并扫码登录，账号需要具有对应小程序开发权限。
2. 创建/导入小程序，代码目录选择本仓库的 **miniapp/**，填写自己的真实 AppID。
3. 使用工具生成的 project.config.json。本仓库不提供虚构 AppID，也不套用微信配置。
4. 编译 pages/index/index 页面，再用预览二维码真机检查。
5. 若工具只能新建模板，先在另一个空目录创建，再将本仓库 miniapp/ 的 app、pages、core、styles、ui、assets 复制进去，保留工具生成的项目配置。

页面文件为 `.xhsml/.css/.js/.json`，公共模块使用官方支持的 CommonJS。没有调用 wx API，没有网络、登录或支付接口。

**平台验证状态：未验证。** 当前没有 AppID，/Applications 下未发现小红书开发者工具；本地测试通过不代表官方编译或真机通过。尚未确认此游戏玩法的上线类目及审核资格，正式发布前需核对。

官方资料与核对范围见 docs/platform-notes.md。

## 目录

- miniapp/core/level.js：地图、物价、负重、手续费、目标数据。
- miniapp/core/engine.js：纯规则、原子状态转换、完整撤销与重试。
- miniapp/core/presenter.js：两端共用的预览结果、地图展示数据及规则文案。
- miniapp/pages/index/：小红书原生页面；首页、介绍、游戏与结算由页面状态切换。
- miniapp/styles/：共用组件样式和视觉令牌。
- miniapp/ui/scene.js：视觉坐标和展示映射，不改变关卡拓扑。
- miniapp/assets/approved/town-atlas.png：依据最新参考图编辑生成的场景图集。
- miniapp/assets/generated/：资源图标、结算插画和此前生成的备份素材。
- web/：浏览器适配器，直接加载相同规则模块。
- assets/temporary/、assets/final/：临时与正式资产区。
- tests/：规则测试和可选浏览器点击回归。
- docs/：视觉、资产、平台与测试说明。

## 玩法约定

全部剩余铁钱随身携带；首次出发后不能兑换。道路双向，每次进入桥均收费。点击「确认出发」锁定准备状态，点击相邻节点移动。布料付款必须恰好 6；铁钱可用加减键调整，交子自动补齐余款。到达交付点后点击交付，交付本身不耗步。

第 4 步如果未携布抵达交付点，判定失败；第 4 步携布抵达则仍可交付成功。余额不足或走错路可撤销；不做提前死局判定。撤销恢复上一次成功操作的游戏状态，数量选择器属于界面草稿，不计入游戏历史。刷新页面会开始新局。

指定解法：兑换 5 得 4 交子，带 3 铁钱；经桥付 1 钱，在布铺付 2 铁钱+4 交子，3 步交付余额 0。走街巷、后巷免桥费，4 步交付剩 1 铁钱。兑换 3/4 以及其他合法混合付款也能通关。


## 后续优先级

1. 在真实小红书工具编译并真机验收：PNG资源包体、CSS 变量、模板表达式、按钮默认样式、安全区域与点击反馈。
2. 小规模试玩验证兑换引导与失败解释；再决定是否增加可选提示、可行性提示和本地存档。
3. 视觉定稿后按资产清单替换临时图形；进一步将界面中的第一关文案/数字配置化。规则已数据驱动，但 UI 尚不是任意关卡编辑器。

不包含后端、排行、分享支付、第二三关、正式美术或上线发布。

## 固定屏界面更新

当前首页、游戏、交易、结算及规则均为固定屏，不上下滚动。规则可分页。回归运行 `node tests/fixed-screen.cjs`（需Playwright和Chrome，先启动服务）。最新截图 outputs/fixed-prepare-390.png。

## 最新参考图场景版

主地图与首页已使用参考图编辑生成的场景图集，保留完整建筑/河道/植被构图，文字、路线标记及交互继续由代码控制。采用矩形分区，不是六张透明建筑精灵；详见 docs/visual-spec.md。最新实际截图 outputs/game-preview.png、outputs/approved-map-preview.png。20项自动测试及三种手机尺寸固定屏浏览器回归通过。
