# 临时音效

本目录全部 WAV 由 scripts/generate-sounds.js 确定性生成，原创程序合成，无第三方采样。用于验证安静的纸张/钱币/脚步反馈，非正式录音素材。单声道、22050Hz、16-bit PCM；环境为 8 秒淡入淡出循环。统一映射见 ui/sound-catalog.js，替换文件无需改事件调用。

0.4.13：点击改用 `ui-click-paper.wav`，55ms 无固定音高的带限轻触声，6ms 起音与平方衰减；总线增益 0.18、160ms 冷却。以 `node scripts/generate-sounds.js ui-click-paper` 单独重建，不改其他音效。
