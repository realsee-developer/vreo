# CHANGELOG

#0.2.0-alpha.20
- fix: 修复 `paused` 事件抛出 `ended` 回调带来的重复抛出事件问题。

#0.2.0-alpha.19
- feat: 新增 `getCurrentTime()` 方法，支持实时获取当前播放时间点；
- feat: 新增 `ended` 标识，当检测到 video 实例 `ended` 以后会在 `paused` 事件里抛出 `true` 回调。
