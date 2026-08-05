# OB Code Preview

一个 Obsidian 插件，用于直接查看代码文件（`.sh`、`.py`、`.yaml` 等）。代码文件在 Obsidian 中像 Markdown 一样打开，内容以代码块形式渲染并做语法高亮——**看代码文件就像看 md 文件一样**。

📦 仓库：<https://github.com/Hopetree/ob-code-preview>

## 功能特性

- 接管指定扩展名的代码文件，以代码视图渲染
- 默认支持 `.sh`、`.py`、`.yaml`、`.yml`、`.ini`、`.conf`
- 支持在插件设置中自定义接管文件扩展名与代码字体大小
- 只读查看，不支持编辑与运行

## 技术栈

- TypeScript
- Obsidian Plugin API（官方 Sample Plugin 模板，esbuild 构建）

## 文档索引

| 文档 | 说明 |
|------|------|
| [docs/design/01_PRD_产品需求规格说明书.md](docs/design/01_PRD_产品需求规格说明书.md) | 产品需求规格：功能需求、用户故事与验收标准 |

## 快速开始

### 开发构建

1. 安装依赖：`npm install`
2. 开发模式：`npm run dev`（esbuild watch，代码改动自动重建 `main.js`）
3. 生产构建：`npm run build`（`tsc` 类型检查 + esbuild 压缩）

### 安装到 Obsidian

1. 将 `main.js`、`manifest.json`、`styles.css` 复制到 vault 的 `.obsidian/plugins/ob-code-preview/` 目录
2. 在 Obsidian「设置 → 第三方插件」中启用 **Code Preview**

> 安装依赖时若遇到 obsidian 包 peer 冲突，使用 `npm install --legacy-peer-deps`。

## 安装

### 通过 GitHub Release 安装

1. 前往 [Releases](https://github.com/Hopetree/ob-code-preview/releases) 下载最新版本的 `ob-code-preview.zip`
2. 解压后，把 `ob-code-preview` 文件夹放到 vault 的 `.obsidian/plugins/` 目录
3. 在 Obsidian「设置 → 第三方插件」中启用 **Code Preview**

## 发布

推送 `v*` 格式的 tag 会触发 GitHub Actions 自动构建并发布 Release：

```bash
git tag v1.0.0
git push origin v1.0.0
```

Release 产物：
- `ob-code-preview.zip` —— 插件安装包
- `main.js` / `manifest.json` / `styles.css` —— Obsidian 社区插件安装所需文件
