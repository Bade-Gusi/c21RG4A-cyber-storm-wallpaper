'use strict';
// 场景主控 - 所有滑条真实控制对应效果

// 图层ID
var ID = {
	base: 17,
	ca: 300,
	ripple: 305,
	rain: 30,
	clock: 46,
	audio1: 69,
	audio2: 112,
	date: 117,
	musicParent: 166,
	songTitle: 171,
	artist: 172
};

function getP(name, def) {
	try { var v = engine.getPropertyValue(name); return v !== undefined && v !== null ? v : def; }
	catch (e) { return def; }
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

export function update(dt) {
	try {
		// === 色差 (0~100 → 0~1) ===
		var ca = clamp(getP('ca_strength', 33), 0, 100) / 100;
		engine.setLayerOpacity(ID.ca, ca);

		// === 水波 (0~100 → 0~1) ===
		var rp = clamp(getP('ripple_strength', 24), 0, 100) / 100;
		engine.setLayerOpacity(ID.ripple, rp);

		// === 暴雨 (0~100 → 0~1) ===
		var rain = clamp(getP('rain_opacity', 30), 0, 100) / 100;
		engine.setLayerOpacity(ID.rain, rain);

		// === 音频线1 ===
		var a1op = clamp(getP('audio1_opacity', 100), 0, 100) / 100;
		var a1vis = getP('audio1_visible', true);
		engine.setLayerOpacity(ID.audio1, a1op);
		engine.setLayerVisibility(ID.audio1, a1vis);

		// === 音频线2 ===
		var a2op = clamp(getP('audio2_opacity', 100), 0, 100) / 100;
		var a2vis = getP('audio2_visible', true);
		engine.setLayerOpacity(ID.audio2, a2op);
		engine.setLayerVisibility(ID.audio2, a2vis);

		// === 信息显示开关 ===
		engine.setLayerVisibility(ID.clock, getP('show_clock', true));
		engine.setLayerVisibility(ID.date, getP('show_date', true));
		engine.setLayerVisibility(ID.songTitle, getP('show_music', true));
		engine.setLayerVisibility(ID.artist, getP('show_artist', true));

	} catch (e) {}
}

export function cursorDown(x, y, id, layerName) {
	try {
		var st = engine.mediaInfo('playbackState');
		engine.mediaControls(st === 'playing' ? 'pause' : 'play');
	} catch (e) {}
}
