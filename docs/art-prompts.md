# Imagegen 提示词记录

## town-extended（上下场景延展）

内置 imagegen 编辑现有 town-atlas.png，非透明背景；结果保存在 miniapp/assets/approved/town-extended.png。运行时作为独立外围地形底层，原中央图集仍保留，沿上下边缘融合。

Use case: precise-object-edit / vertical outpainting. Input is the EDIT TARGET, an existing game town illustration. Extend the canvas vertically ABOVE and BELOW this exact image; do not zoom or crop the existing composition. Target portrait canvas approximately 1536 x 2304, aspect ratio 2:3. The ORIGINAL whole image must stay horizontally full-width, centered vertically, with its existing aspect ratio and its buildings, bridge, river, paths, rocks and trees at exactly the same scale and relative positions. The original scene should occupy the central approximately 55% of the final canvas height, with new terrain occupying about 22.5% above and 22.5% below. Preserve the central illustration with maximum fidelity. Outpaint the upper and lower missing landscape naturally: continue the existing river's upper-left course and banks into the top area, continue the trees and small grey rock clusters along both sides, extend warm pale ground with subtle grassy patches and small scattered shrubs through the center. Lower extension: continue foreground low plants, trees near the edges, and pale softly faceted ground with small patches of greenery; do not create broad empty uniform beige bands. The new areas should have gentle natural landscape detail distributed across their width, with enough open ground to remain calm, not dense forest. Same elevated isometric camera, same modern faceted digital game illustration, same light, matching original colors so seamless joining is possible (the app will apply its own desaturation). NO additional buildings, new bridges, mountains, fog, sky, borders, frames, vignettes, UI, text, icons or route markers. Absolutely preserve all six existing gameplay landmarks in their original central arrangement. This is a seamless terrain extension, not a redesigned or enlarged town.

## town-atlas（最新参考图场景版）

内置 imagegen，编辑输入 docs/references/approved-game-ui.png，transparent_background=false。结果复制至 miniapp/assets/approved/town-atlas.png。场景分区渲染，全部 UI 与逻辑路线由代码覆盖。下方较早生成记录保留供溯源；旧建筑不再用于主地图。

Precise image edit of the provided approved game scene. Preserve the ENTIRE existing illustration exactly: same landscape canvas ratio approximately 634:522, identical framing, fixed positions and sizes of warehouse at left, arched stone bridge upper center, cloth shop upper right, two small alley houses lower middle, merchant hall lower right, river, trees, rock formations, fences, crates, cloth, cobblestone paving, same soft faceted modern digital illustration and colors. Do NOT redesign or reinterpret. Remove ALL UI overlays: every Chinese text label, every white label plate and speech bubble, all red/blue circular location markers, and the white dashed route line. Seamlessly reconstruct the underlying ground or building only where those overlays covered it. Keep the actual sandy paths, bridge, buildings and scenery. No new text, UI, pins, lines, borders, watermarks. Return the clean, richly illustrated scene as a production game scene reference; keep all original detail and composition, do not simplify into icons or change perspective.


## terrain（固定屏改版新增）

内置 image_gen，transparent_background=false，无参考输入。仅地表图，不含路网和建筑，页面以低透明度叠加。

Create a square raster TERRAIN UNDERLAY for a polished Chinese miniature-town mobile strategy game. This is ground scenery only, not a map screenshot. Modern clean digital illustration with restrained soft 2.5D isometric stone paving and low plants, desaturated sage green and warm cream sandstone. The middle 75% should be spacious, gently varied pale cream sandy ground, with only a few very subtle isometric rectangular paving slabs and small patches of short grass. Along the outer corners only, tiny clusters of grey rounded rocks and low sage shrubs. Keep all decorative elements small and sparse so separate game building sprites and roads can be layered above. Flat level ground viewed from high above; no tall objects, no buildings, no trees, no river, no roads or paths, no sky, no cliffs, no floating island, no borders, no text, no UI, no parchment texture, no watercolor, no ink painting, no fog, no gradients. The outermost 8% edges must blend smoothly into a uniform solid warm off-white #f5f1e6. Refined and quiet, not a repeating texture and not photorealistic.
方式：内置 image_gen；全部 transparent_background=true。货仓首张生成；桥、商行、布铺、街巷、后巷、铁钱、交子使用货仓作为风格参考。布料与树木在首批网络失败后以文字提示单独重试成功，无参考图输入。没有使用CLI/API密钥。

## warehouse

Use case: stylized-concept. Asset type: isolated transparent PNG game building sprite for Shu Trade Routes, a Northern Song Sichuan trading puzzle. Generate ONE warehouse building, not a whole map or UI. Modern polished digital illustration with clean faceted shapes, subtle 2.5D depth, orthographic isometric three-quarter view from above (about 35 degrees elevation), front facade and right side visible. Traditional Chinese dark desaturated blue-grey tiled curved roof, warm brown timber framing, pale cream plaster, small stacked crates at the entrance. Match a refined mobile miniature-town game: muted sage greens, slate blue roofs, warm tan wood, soft compact ground shadow, controlled detail readable when scaled to 100px. One cohesive building fills 85% of square canvas, complete silhouette and roof visible, bottom ground-contact point around 88% height. Transparent background with genuine alpha, tiny neutral ground footprint only, no landscape, no water, no large trees, no lettering, no signs with text, no numbers, no UI, no borders, no ink painting or parchment texture, no photorealism. This is a finished raster illustration, not a flat vector icon or SVG placeholder.

## shop

Use case: stylized-concept. Generate one independent game sprite with TRUE transparent alpha background. The input warehouse image is STYLE REFERENCE ONLY, not an object to retain: closely match its polished digital game illustration, orthographic isometric three-quarter elevated camera, desaturated slate blue tiled roofs, cream plaster, warm timber, soft lighting and clean silhouette. Keep detail controlled for 100px mobile display. Entire subject centered with 8% transparent margin, bottom contact about 88% canvas height. No text, labels, numbers, UI, roads extending outward, trees, landscape, watermark, or border. Not SVG or vector placeholder. Subject: a compact Northern Song Sichuan cloth shop. Distinct single-storey timber shop with dark blue-grey curved tiled roof, open frontage, muted coral and blue cloth hanging from a bamboo rail, three rolled fabrics on a low wooden counter, tiny side awning. Small square stone footprint, attractive but restrained. One shop only.

## bridge

Use case: stylized-concept. Generate one independent game sprite with TRUE transparent alpha background. The input warehouse image is STYLE REFERENCE ONLY, not an object to retain: closely match its polished digital game illustration, orthographic isometric three-quarter elevated camera, desaturated slate blue tiled roofs, cream plaster, warm timber, soft lighting and clean silhouette. Keep detail controlled for 100px mobile display. Entire subject centered with 8% transparent margin, bottom contact about 88% canvas height. No text, labels, numbers, UI, roads extending outward, trees, landscape, watermark, or border. Not SVG or vector placeholder. Subject: one short pale grey stone arched pedestrian toll bridge, NO building or roof. Isometric bridge deck running from lower left to upper right, low stone balustrades, a graceful open arch clearly visible beneath, two small timber toll posts on the ends. No water or ground outside the bridge, transparent through the arch, no platform spanning the arch opening.

## delivery

Use case: stylized-concept. Generate one independent game sprite with TRUE transparent alpha background. The input warehouse image is STYLE REFERENCE ONLY, not an object to retain: closely match its polished digital game illustration, orthographic isometric three-quarter elevated camera, desaturated slate blue tiled roofs, cream plaster, warm timber, soft lighting and clean silhouette. Keep detail controlled for 100px mobile display. Entire subject centered with 8% transparent margin, bottom contact about 88% canvas height. No text, labels, numbers, UI, roads extending outward, trees, landscape, watermark, or border. Not SVG or vector placeholder. Subject: one modest Northern Song Sichuan merchant delivery hall. A dignified two-storey wooden trading house with slate blue curved tiled roof, cream plaster, warm timber posts, a broad entrance and three stone steps, two neatly packed goods crates near the entrance and a plain muted burgundy hanging cloth with NO writing. One hall only, compact ground footprint.

## street

Use case: stylized-concept. Create ONE independent transparent PNG sprite for the same polished Chinese miniature-town mobile game. Input warehouse is style reference only, do not reproduce warehouse. Match its orthographic isometric three-quarter elevated view, desaturated slate-blue, warm tan wood, pale cream and sage palette, soft daylight, controlled game illustration details. TRUE alpha transparency, no background scene, no text/letters/numbers, no UI, no borders, no watermark. Full uncropped subject, compact shadow, generous 8% transparent margin. Not a flat vector icon. A tiny street-side open timber stall beneath a small blue-grey tiled awning, beside one short cream plaster wall, two baskets and a low bench; a compact street-corner trading vignette, not a full house, minimal square stone ground footprint.

## alley

Use case: stylized-concept. Create ONE independent transparent PNG sprite for the same polished Chinese miniature-town mobile game. Input warehouse is style reference only, do not reproduce warehouse. Match its orthographic isometric three-quarter elevated view, desaturated slate-blue, warm tan wood, pale cream and sage palette, soft daylight, controlled game illustration details. TRUE alpha transparency, no background scene, no text/letters/numbers, no UI, no borders, no watermark. Full uncropped subject, compact shadow, generous 8% transparent margin. Not a flat vector icon. A quiet back-alley entrance: one small wooden gateway with blue-grey curved tiled roof and two short cream plaster wall wings, closed wooden door, one small ceramic storage jar. One compact gateway only, no road painted into sprite.

## iron

Use case: stylized-concept. Create ONE independent transparent PNG sprite for the same polished Chinese miniature-town mobile game. Input warehouse is style reference only, do not reproduce warehouse. Match its orthographic isometric three-quarter elevated view, desaturated slate-blue, warm tan wood, pale cream and sage palette, soft daylight, controlled game illustration details. TRUE alpha transparency, no background scene, no text/letters/numbers, no UI, no borders, no watermark. Full uncropped subject, compact shadow, generous 8% transparent margin. Not a flat vector icon. A game inventory object: three bronze-brown iron cash coins in a small overlapping stack, each coin with a clearly visible square central hole. Chunky simple readable silhouette, subtle metal edge relief, no engravings or text, NOT shiny gold, centered occupying 75% canvas.

## note

Use case: stylized-concept. Create ONE independent transparent PNG sprite for the same polished Chinese miniature-town mobile game. Input warehouse is style reference only, do not reproduce warehouse. Match its orthographic isometric three-quarter elevated view, desaturated slate-blue, warm tan wood, pale cream and sage palette, soft daylight, controlled game illustration details. TRUE alpha transparency, no background scene, no text/letters/numbers, no UI, no borders, no watermark. Full uncropped subject, compact shadow, generous 8% transparent margin. Not a flat vector icon. A game inventory object: one small folded cream-colored jiaozi paper banknote, slightly angled, restrained brown geometric border and a small muted red square seal; NO calligraphy and absolutely NO readable words or numerals. Clean paper without aging texture. Centered occupying 75% canvas.

## cloth

Create a polished isometric game inventory illustration: two neatly folded lengths of cloth, muted indigo blue over warm cream, small soft folds and a curled end. Clean readable shape for a miniature Chinese trading game, soft daylight, restrained detail, no other objects, no text. A single centered object on genuinely transparent background, 10% clear margin. Square PNG.

## tree

Single small tree sprite for a polished isometric miniature-town game. Full tree with compact sculpted foliage masses in desaturated sage and olive green, short warm brown trunk, soft daylight, clean digital illustration with gentle 2.5D depth and controlled detail. Centered complete silhouette, 12% transparent margin, genuine alpha transparent background. No scenery, rocks, text, border or UI. Square PNG.


## V2 模块素材

使用 imagegen 技能和内置 imagegen，未使用外部下载、CLI API 或矢量占位。

- 建筑：以 town-atlas.png 为风格参考，生成3列2行透明精灵图集；统一斜俯视，灰瓦木构，六建筑完整置于各单元，不含文字与路径。
- 地形：以 town-atlas.png 为参考，生成无建筑、无道路的竖屏地表，边缘树木岩石，上方小段河流，中央可布置建筑。运行时统一降饱和。
- 货物：四图标2×2透明精灵图集：粮食、药包、茶包、纸墨，低饱和材质，独立单元。九图标请求因网络错误失败，未接入其结果；纸币使用已生成的 note.png 加代码印记。
