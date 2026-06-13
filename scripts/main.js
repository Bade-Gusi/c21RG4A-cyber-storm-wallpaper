'use strict';
// 场景主脚本 - 音乐控制

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
