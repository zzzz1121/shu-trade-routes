# 首页启程字样 · 0.4.17

`embark-calligraphy.png` 使用内置 image_gen 生成，为透明背景的竖排“启程”书法字。圆形纸面、边框和点击区域由代码绘制，图片不包含按钮背景。HTML 按钮保留“启程”可访问名称；原生端使用同一图片。

生成提示词：

Use case: text-localization / game UI lettering asset. Create ONLY the two exact Chinese calligraphy characters “启程” arranged vertically, 启 on top and 程 below, as an elegant hand-brushed ink calligraphy game start label. Correct readable Simplified Chinese, flowing running-script with tasteful semi-cursive flourishes, varied thick and thin brush strokes, skilled traditional Chinese brushwork, restrained and beautiful, inviting adventure. Very dark warm brown ink #332f26. ONE vertical inscription centered on a portrait canvas, ample fully transparent padding around all strokes. Genuine alpha transparent background. No circle, no seal, no border, no paper, no background, no icons, no English, no extra characters, no gradients or glow. This will be placed on an independently coded round cream paper button in a quiet watercolor ancient Sichuan visual novel. Preserve exact readable character structure, not a font sample sheet.

原始生成文件：exec-205960d0-99e1-475b-a367-b083f19f26ac.png。

验证：`node tests/title-browser.cjs` 检查 375×667、375×812、390×844、430×932 下的标题、标语、圆形点击区域、进入章节、声音设置和清缓存确认。实机图：`outputs/title-0.4.17/`。
