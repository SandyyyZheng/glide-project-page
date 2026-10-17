# GliDe · VideoGlitchBench project page

在线网页：https://SandyyyZheng.github.io/glide-project-page/

GitHub 仓库：https://github.com/SandyyyZheng/glide-project-page

独立静态项目页，适用于 GitHub Pages。无需构建或安装 npm 依赖。页面文字、数据与图片在本地维护，原始素材文件夹 `../glide_project_page` 未修改。

## 本地预览

```sh
cd /Users/muyangzheng/Documents/Cursor/glide-project-page
npm run dev
```

打开 http://localhost:4173 。也可运行 `python3 preview.py`。修改文件后预览自动刷新；视频支持分段请求和时间跳转。端口冲突时用 `PORT=4174 npm run dev`。Ctrl+C 停止。

## 项目结构

- `index.html`：页面正文、标题、链接、图片及引用。
- `styles.css`：视觉样式、动效、响应式布局。
- `app.js`：视频切换、时间轴、标注展示、结果表、图片放大、导航和页面交互。
- `benchmark-viz.js`：分类圆环与词云布局、词语悬停动画。
- `preview.py`：本地预览、自动刷新、视频 Range 请求。
- `data/examples.json`：三个案例的原始标注。
- `data/results.json`：网页 Table 1（论文 Table 3）数据；每行为模型、设置、P、R、F1、mIoU、F1×IoU。
- `data/wordcloud-layout.json`：从论文词云整理的词汇和参考尺寸；尺寸代表原图视觉层级，不代表精确词频。
- `assets/figures/`：当前页面使用的四张论文图片，使用语义名称。
- `assets/videos/`：三个视频及封面；视频文件名与原始标注保持一致。
- `assets/vendor/`：固定版本 d3-cloud 1.2.7 及许可证，离线本地加载。
- `FIGURES.md`：网页图片、表格与论文原始编号的对照及替换说明。
- `citation.bib`：当前 arXiv article 引用；修改时与页面 BibTeX 同步。

## 部署到 GitHub Pages

将本目录内容作为独立仓库的根目录推送。Settings → Pages → Deploy from a branch → main / (root)。保留 `.nojekyll`。所有站内资源均用相对路径，支持 GitHub Pages 仓库子路径。无需构建，也无需上传原始素材目录。

## 来源与维护

- 论文：https://arxiv.org/abs/2604.07818
- 代码：https://github.com/SandyyyZheng/GliDe
- 数据集：https://huggingface.co/datasets/SandyZheng33/VideoGlitchBench
- 原始案例：用户提供的 `glide_project_page/example.json` 及三个视频。
- 会议标识采用作者提供的 ACM Multimedia 2026 信息；引用暂用作者指定的 arXiv 条目。

网页中的图片编号为 Figure 1–4，表格为 Table 1；它们与论文编号的对照见 FIGURES.md。图表结果按论文原值显示。字体来自 Google Fonts，离线时自动使用系统字体，其余资源均为本地文件。
