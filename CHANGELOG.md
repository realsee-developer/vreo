# CHANGELOG
#1.0.0-alpha.21
- fix: 多段BgMusic播放问题

#1.0.0-alpha.19
- fix: 多段BgMusic可以重复播放

#1.0.0-alpha.18
- fix: 修复无音频版本中途播放会从头开始的问题

#1.0.0-alpha.1
- feat: css样式适配: 手机横竖屏, pad, pc
- feat: 新增两种波浪风格: 'wave' | 'solid'
- feat: 标签调用dna插件
- fix: 图片/视频 弹窗UI问题

#0.2.0-alpha.25
- feat: rotate 不指定顺时针或者逆时针，则按照锐角交互。

#0.2.0-alpha.24
- fix: 修复 CSS3DRender 与插件库样式冲突问题。
- fix: 修复示例 wrapper 定位问题。

#0.2.0-alpha.23
- fix: 修复21版本针对非旋转运镜使用了旋转速度问题修复的代码丢失问题。

#0.2.0-alpha.22
- fix: 修复运镜顺时针逆时针反向问题。

#0.2.0-alpha.21
- fix: 修复非旋转运镜使用了旋转速度问题。

#0.2.0-alpha.20
- fix: 修复 `paused` 事件抛出 `ended` 回调带来的重复抛出事件问题。

#0.2.0-alpha.19
- feat: 新增 `getCurrentTime()` 方法，支持实时获取当前播放时间点；
- feat: 新增 `ended` 标识，当检测到 video 实例 `ended` 以后会在 `paused` 事件里抛出 `true` 回调。
