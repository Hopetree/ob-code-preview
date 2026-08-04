import { FileView, TFile, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE } from "./constants";
import { getLanguage, highlightCode } from "./language";

/** 只读代码预览视图：接管指定扩展名文件，渲染为语法高亮的代码块。 */
export class CodePreviewView extends FileView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.file?.basename ?? "Code Preview";
	}

	getIcon(): string {
		return "file-code";
	}

	async onLoadFile(file: TFile): Promise<void> {
		const content = await this.app.vault.read(file);
		this.render(content, file.extension);
	}

	async onUnloadFile(_file: TFile): Promise<void> {
		this.contentEl.empty();
	}

	private render(content: string, ext: string): void {
		this.contentEl.empty();
		this.contentEl.classList.add("code-preview-view");

		const codeEl = this.contentEl.createEl("pre").createEl("code");
		const lang = getLanguage(ext);
		if (lang) {
			codeEl.className = `language-${lang}`;
			codeEl.innerHTML = highlightCode(content, lang);
		} else {
			codeEl.className = "language-plaintext";
			codeEl.textContent = content;
		}
	}

	// 只读视图，不参与内容保存/序列化
	getViewData(): string {
		return "";
	}

	setViewData(_data: string, _clear: boolean): void {
		// no-op
	}
}
