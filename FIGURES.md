# 图片与编号维护

网页图片按出现顺序编号，与论文原始编号分别维护。图片使用语义文件名，不将序号写入文件名，后续重排无需再改名。

| 网页编号 | 文件 | 内容 | 论文原始编号 |
|---|---|---|---|
| Figure 1 | `assets/figures/benchmark-overview.jpg` | VideoGlitchBench overview | Figure 1 |
| Figure 2 | `assets/figures/glide-framework.jpg` | GliDe framework | Figure 3 |
| Figure 3 | `assets/figures/case-human-fall-flat.jpg` | Human: Fall Flat case | Figure 4 |
| Figure 4 | `assets/figures/case-ark-survival-evolved.jpg` | ARK: Survival Evolved case | Figure 5 |

所有保留图片只进行了文件重命名，没有重新压缩、裁剪或修改像素内容。替换图片时覆盖同名文件即可。

每张图的正文引用、`data-figure`、按钮 `aria-label` 和图注均在 `index.html`。放大弹窗自动读取 `data-figure`。

网页 Table 1 对应论文 Table 3，完整数值在 `data/results.json`，图注与正文在 `index.html`。

统计区圆环、词云为代码绘制，不依赖已删除的 Figure 7/8 位图。分类数据位于 `benchmark-viz.js`。词云词汇及参考视觉层级位于 `data/wordcloud-layout.json`；其坐标与尺寸仅为论文原图的参考排版数据，不是语料词频。排版使用本地 d3-cloud。

## Conference poster

`assets/figures/poster.png` 展示在 Results 与 Citation 之间的 Poster 板块，保留原图并支持点击放大。海报不占用论文图片编号。展示信息由作者提供：November 12, 2026 · Main Conference · 10:30–12:30 · Rio de Janeiro, Brazil。
