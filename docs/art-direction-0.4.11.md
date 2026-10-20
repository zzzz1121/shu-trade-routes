# 0.4.11 · 参考图美术校正

本轮按用户确认，先落实首页、第一关开场与正式对白的构图和美术，再将同一套素材、纸面及字体处理延伸到布铺、手记和结算。保留原剧本、规则、地图道路、动画、声音与存档。

## 可查看结果

- [三页实际运行总览](../outputs/v34/three-pages.png) · [三页原尺寸相册](../outputs/v34/three-pages.html)
- [八页当前实机总览](../outputs/v34/eight-pages.png) · [八页原尺寸相册](../outputs/v34/index.html)
- 预览：`http://127.0.0.1:4173/?v=0.4.11`

三种手机尺寸均有实际点击流程截图：375×812、390×844、430×932。截图由 `tests/v34-browser.cjs` 生成，没有将参考整图当作游戏界面。

## 视觉改动

1. 首页使用独立生成的远山／商镇／河桥／前景行商构图，撤掉放大的微缩地图。标题、slogan、启程及声音／清缓存仍为独立组件。
2. 开场改用人眼高度的商行室内，罗掌柜更接近参考中的圆脸、发髻、短须、棕衣形象；人物位于上半屏，原文委托、任务摘要及开始按钮位于下半屏。
3. 正式对白有自己的街景／商行／布铺背景层，角色不再悬在带节点文字的地图前。底层地图隐藏且不可误触，六种表情、回看、自动与略过已读继续沿用。
4. 三位首关角色的表情图集统一为细铅笔线、克制水彩／水粉与纸张笔触。阿禾和沈娘子参照原脸、服饰和道具重绘，罗掌柜按用户参考重新塑形；每位角色各六格固定形象，没有逐句随机生成脸。
5. 新纸面用生成的空白面板九切片实现，文字与点击区域仍是代码。纸纹、细线与轻微磨边用于对白、委托、手记等；主按钮保留细内线，没有给所有按钮套厚木牌。
6. 布铺有独立布料陈列背景，后仓近景保持原四个物件的坐标并统一笔触，点击功能不变。结算使用同城夕景与行商背影，移除中央大掌柜，账目可单独展开。
7. 角色显示采用图集实际单格比例，避免拉宽。还按 alpha 边界测量头部顶点，为表情格配置垂直补偿；阿禾第二行约 50px 的原图锚点差已在显示层修正。

本轮没有重画关卡地图，章节缩略图仍用原六格资源，许掌柜仍用原立绘。它们可以从八页总览中直接辨认；不宣称这几项已经与新参考逐像素一致。

## 新生成素材（10 项）

统一使用内置 `image_gen`，没有调用 CLI、外部 API 或第三方素材下载。原素材保留；新增资源使用独立目录。

| 文件 | 用途 |
| --- | --- |
| `miniapp/assets/art-v34/home-town.png` | 首页商镇与前景行商 |
| `miniapp/assets/art-v34/merchant-room.png` | 开场及商行对白室内 |
| `miniapp/assets/art-v34/market-lane.png` | 门廊街景与阿禾对白 |
| `miniapp/assets/art-v34/cloth-shop.png` | 布铺及店内对白 |
| `miniapp/assets/art-v34/warehouse-counter.png` | 可点击后仓近景 |
| `miniapp/assets/art-v34/ending-town.png` | 同城夕景结算 |
| `miniapp/assets/art-v34/paper-frame.png` | 可九切片的空白纸面 |
| `miniapp/assets/characters/v34/ahe-expressions.png` | 阿禾六表情，1024×1536，单格比例 4:9 |
| `miniapp/assets/characters/v34/luo-expressions.png` | 罗掌柜六表情，1536×1024，单格方形 |
| `miniapp/assets/characters/v34/shen-expressions.png` | 沈娘子六表情，1536×1024，单格方形 |

全部生成提示词与源图编号：[prompts.json](../miniapp/assets/art-v34/prompts.json)。生成图与原始参考仅用于美术，不承载价格、余额、通关或分支选择。

## 验证

- `npm test`：109 项通过，包括新图集尺寸／真实单格比例／RGBA、固定角色资源、原有剧情分支和六关规则。
- `npm run test:art`：三种手机尺寸完整首关，八页截图；全对白按钮边界、回看／自动、付款上限与草稿、购布撤销、店内地图往返、存档恢复及重玩检查通过；零脚本或资源错误。
- `node tests/v4-layout.cjs`：另含 375×667 小屏，人物边界、声音面板、回看、继续和清缓存隔离检查通过。
- `node tests/warehouse-browser.cjs`：三尺寸四热点最小触区及不重叠，拾钱、旧匣、可选探索、刷新恢复通过。
- `node tests/campaign-browser.cjs`：后五关 × 两策略 × 三手机尺寸，30 条共享组件流程通过。
- `npm run test:experience`：静态构建、六章、人物和 24 个音频文件加载通过，零脚本／HTTP 错误。
- `node tests/v4-audio-browser.cjs`：音乐解码、换曲、音量／静音、声部限制、后台暂停通过。
- 原生适配器测试及模板标签检查通过；没有运行官方小程序开发工具，设备端最终美术表现未验收。纸面 CSS 保留米色底和细边框作为不支持九切片时的显示回退。

构建继续显式复制全部新资源。复现：`npm run test:art`，再执行 `node scripts/generate-ui-review.cjs v34` 和 `node scripts/generate-art-review.cjs`。声音仍是现有原创程序合成原型，本轮没有更换曲目。
