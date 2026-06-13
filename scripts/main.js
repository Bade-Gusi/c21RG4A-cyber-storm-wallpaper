'use strict';
// 场景主控脚本 - 所有控制真实生效

// ---- 图层ID对照 ----
var LAYERS = {
	main: 17,
	rain: 30,
	clock: 46,
	audio1: 69,
	audio2: 112,
	date: 117,
	musicContainer: 166,
	songTitle: 171,
	artist: 172
};

// ---- 读取属性 ----
function getProp(name, def) {
	try {
		var v = engine.getPropertyValue(name);
		return v !== undefined && v !== null ? v : def;
	} catch (e) { return def; }
}

// ---- 每帧刷新所有控制 ----
export function update(dt) {
	try {
		// ===== 主体 =====
		var mainOp = getProp('main_opacity', 1.0);
		engine.setLayerOpacity(LAYERS.main, mainOp);

		// ===== 暴雨 =====
		var rainOp = getProp('rain_opacity', 0.30);
		engine.setLayerOpacity(LAYERS.rain, rainOp);

		// ===== 音频线 =====
		var a1op = getProp('audio1_opacity', 0.45);
		var a1vis = getProp('audio1_visible', true);
		engine.setLayerOpacity(LAYERS.audio1, a1op);
		engine.setLayerVisibility(LAYERS.audio1, a1vis);

		var a2op = getProp('audio2_opacity', 0.21);
		var a2vis = getProp('audio2_visible', true);
		engine.setLayerOpacity(LAYERS.audio2, a2op);
		engine.setLayerVisibility(LAYERS.audio2, a2vis);

		// ===== 信息显示 =====
		var showClock = getProp('show_clock', true);
		engine.setLayerVisibility(LAYERS.clock, showClock);

		var showDate = getProp('show_date', true);
		engine.setLayerVisibility(LAYERS.date, showDate);

		var showMusic = getProp('show_music', true);
		engine.setLayerVisibility(LAYERS.songTitle, showMusic);

		var showArtist = getProp('show_artist', true);
		engine.setLayerVisibility(LAYERS.artist, showArtist);

	} catch (e) {
		// 初始化时忽略错误
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
