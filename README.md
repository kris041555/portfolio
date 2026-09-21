# 音乐作品集网站

直接打开 `index.html` 即可查看完整页面，不需要安装依赖或执行构建。

## 更换基本信息

在 `index.html` 中搜索以下占位内容并替换：

- `RAM`：英文代号
- `朱泓羽`：中文名
- `hy.zhu04@outlook.com`：联系邮箱
- `关于` 区域的两段简介
- Instagram、YouTube、网易云音乐链接

页面标题和搜索引擎描述位于 `index.html` 的 `<head>` 区域。

## 更换 4 个视频和 6 首歌曲

所有作品数据都在 `app.js` 顶部的 `works` 数组里。

歌曲作品使用以下字段：

```js
{
  type: "song",
  title: "歌曲名称",
  subtitle: "风格 / 类型",
  year: "2026",
  cover: "assets/covers/封面.jpg",
  audioUrl: "assets/audio/歌曲.mp3",
  duration: "3:42"
}
```

视频作品使用以下字段：

```js
{
  type: "video",
  title: "视频名称",
  subtitle: "导演 / 项目类型",
  year: "2026",
  cover: "assets/covers/视频封面.jpg",
  videoUrl: "assets/videos/视频.mp4",
  description: "一句作品说明。"
}
```

当前 4 个视频和 6 首歌曲均已替换为你的素材。桌面汇聚页采用左侧视频 `2 × 2`、中间空列、右侧歌曲 `3 × 2` 的布局；移动端自动改为上下分区。所有作品卡片均不显示项目名称，名称数据仍保留在 `app.js` 中用于无障碍朗读和后续编辑。

当前对应关系：

- `F`：`assets/covers/f.jpg` + `assets/videos/f.mp4`
- `I`：`assets/covers/i.jpg` + `assets/videos/i.mp4`
- `L`：`assets/covers/l.jpg` + `assets/videos/l.mp4`
- `M`：`assets/covers/m.jpg` + `assets/videos/m.mp4`

歌曲对应关系：

- `Alarm`：`assets/covers/alarm.jpg` + `assets/audio/alarm.m4a`
- `echelon`：`assets/covers/echelon.jpg` + `assets/audio/echelon.m4a`
- `No One Helps Me Now`：`assets/covers/no-one-helps-me-now.jpg` + `assets/audio/no-one-helps-me-now.m4a`
- `alone`：`assets/covers/alone.jpg` + `assets/audio/alone.m4a`
- `beside`：`assets/covers/beside.jpg` + `assets/audio/beside.m4a`
- `go no clue`：`assets/covers/go-no-clue.jpg` + `assets/audio/go-no-clue.m4a`

歌曲由原始 WAV 转为 `192kbps` AAC/M4A，封面统一裁切为 `1200 × 1200`。4 个视频已统一转换为最高 `1280px` 宽、30fps、H.264 High Profile 和 AAC 音频，并开启 Fast Start；单文件约 `13–34MB`。页面会预缓冲约 3–5 秒，以换取更清晰的播放画质。

## 素材建议

- 封面：正方形 JPG/WebP，建议至少 `1200 × 1200`
- 音乐：MP3、M4A 或 WAV
- 视频：MP4，H.264 视频编码 + AAC 音频编码
- 封面文件可放入 `assets/covers`，音乐放入 `assets/audio`，视频可新建 `assets/videos`

## 吉他自定义鼠标

透明吉他素材位于 `assets/cursor/guitar-cursor.png`。桌面端鼠标会替换为约 `14px` 的黑色圆点，吉他会作为多层渐隐拖影跟随指针移动，并在点击时产生轻微倾斜；触屏设备会自动关闭点状鼠标和拖影。

## 本地预览

如果需要用本地服务器预览，可在 `outputs` 目录执行：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。
