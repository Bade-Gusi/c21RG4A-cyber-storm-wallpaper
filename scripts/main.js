'use strict';
// 场景脚本 - 仅处理点击事件
// 所有属性控制已移到时钟文本脚本中

export function cursorDown(x, y, id, layerName) {
	try {
		var st = engine.mediaInfo('playbackState');
		engine.mediaControls(st === 'playing' ? 'pause' : 'play');
	} catch (e) {}
}
