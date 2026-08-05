import { App, Notice, Plugin } from "obsidian";
import { CodePreviewView } from "./codeView";
import { DEFAULT_EXTENSIONS, VIEW_TYPE } from "./constants";
import { registerHighlightLanguages } from "./language";
import { CodePreviewSettingTab } from "./settings";

interface CodePreviewSettings {
	/** 被代码预览视图接管的文件扩展名（不带前导点） */
	extensions: string[];
	/** 代码预览字体大小（px） */
	fontSize: number;
}

const DEFAULT_SETTINGS: CodePreviewSettings = {
	extensions: [...DEFAULT_EXTENSIONS],
	fontSize: 16,
};

/**
 * viewRegistry 未被官方 d.ts 暴露（运行时存在）。
 * unregisterExtensions 为部分版本提供，运行时需做能力检测。
 */
interface ExtensionRegistry {
	registerExtensions: (extensions: string[], viewType: string) => void;
	unregisterExtensions?: (extensions: string[], viewType: string) => void;
}

function getExtensionRegistry(app: App): ExtensionRegistry {
	return (app as unknown as { viewRegistry: ExtensionRegistry }).viewRegistry;
}

export default class CodePreviewPlugin extends Plugin {
	settings: CodePreviewSettings;
	/** 当前已注册到 viewRegistry 的扩展名，用于反注册与卸载清理 */
	private registeredExtensions: string[] = [];

	async onload(): Promise<void> {
		await this.loadSettings();
		registerHighlightLanguages();

		this.registerView(VIEW_TYPE, (leaf) => new CodePreviewView(leaf));
		this.applyExtensions();
		this.applyFontSize();

		this.addSettingTab(new CodePreviewSettingTab(this.app, this));
	}

	/**
	 * 把当前字体大小写到 body 的 CSS 变量上，所有已打开的代码预览视图实时生效。
	 */
	applyFontSize(): void {
		document.body.style.setProperty(
			"--code-preview-font-size",
			`${this.settings.fontSize}px`
		);
	}

	async onunload(): Promise<void> {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
		this.unregisterCurrentExtensions();
	}

	/**
	 * 将当前设置中的扩展名列表应用到 viewRegistry。
	 * 支持在运行中切换：先反注册旧列表，再注册新列表。
	 */
	applyExtensions(): void {
		const registry = getExtensionRegistry(this.app);

		if (this.registeredExtensions.length > 0) {
			if (!registry.unregisterExtensions) {
				new Notice("扩展名已保存，请重启 Obsidian 使新配置生效");
				return;
			}
			registry.unregisterExtensions(this.registeredExtensions, VIEW_TYPE);
		}

		registry.registerExtensions(this.settings.extensions, VIEW_TYPE);
		this.registeredExtensions = [...this.settings.extensions];
	}

	private unregisterCurrentExtensions(): void {
		const registry = getExtensionRegistry(this.app);
		if (this.registeredExtensions.length > 0 && registry.unregisterExtensions) {
			registry.unregisterExtensions(this.registeredExtensions, VIEW_TYPE);
		}
		this.registeredExtensions = [];
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
