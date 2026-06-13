'use strict';
// 场景主控脚本 - 负责读取属性并控制场景元素

// ---- 对象ID对照 ----
var RAIN_LAYER = 30;
var AUDIO1_LAYER = 69;
var AUDIO2_LAYER = 112;
var DATE_LAYER = 117;
var MEDIA_CONTAINER = 166;
var CLOCK_LAYER = 46;

// ---- 读取属性 ----
function getProp(name, def) {
	try {
		var v = engine.getPropertyValue(name);
		return v !== undefined ? v : def;
	} catch (e) { return def; }
}

// ---- 应用所有属性（每帧执行） ----
export function update(dt) {
	try {
		// 1. 雨量
		var rainOp = getProp('rain_opacity', 0.30);
		engine.setLayerOpacity(RAIN_LAYER, rainOp);

		// 2. 音频线可见性
		var a1vis = getProp('audio_line1_visible', true);
		var a2vis = getProp('audio_line2_visible', true);
		engine.setLayerVisibility(AUDIO1_LAYER, a1vis);
		engine.setLayerVisibility(AUDIO2_LAYER, a2vis);

		// 3. 日期可见性
		var dateVis = getProp('show_date', true);
		engine.setLayerVisibility(DATE_LAYER, dateVis);

		// 4. 音乐信息可见性
		var musicVis = getProp('show_music_info', true);
		engine.setLayerVisibility(MEDIA_CONTAINER, musicVis);

		// 5. 时钟可见性
		var clockVis = getProp('show_clock', true);
		engine.setLayerVisibility(CLOCK_LAYER, clockVis);

	} catch (e) {
		// 忽略初始化时的错误
	}
}

// ---- 点击切换播放/暂停 ----
export function cursorDown(x, y, id, layerName) {
	try {
		var state = engine.mediaInfo('playbackState');
		if (state === 'playing') {
			engine.mediaControls('pause');
		} else {
			engine.mediaControls('play');
		}
	} catch (e) {}
}
