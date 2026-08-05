import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type CodePreviewPlugin from "./main";
import { DEFAULT_EXTENSIONS } from "./constants";
import { normalizeExtension } from "./language";

/** 扩展名设置页：textarea 每行一个扩展名，保存后立即重新注册。 */
export class CodePreviewSettingTab extends PluginSettingTab {
	plugin: CodePreviewPlugin;

	constructor(app: App, plugin: CodePreviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("字体大小")
			.setDesc("代码预览区域字体大小（像素），拖动实时生效。")
			.addSlider((slider) =>
				slider
					.setLimits(10, 28, 1)
					.setValue(this.plugin.settings.fontSize)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.fontSize = value;
						await this.plugin.saveSettings();
						this.plugin.applyFontSize();
					})
			);

		new Setting(containerEl)
			.setName("接管文件扩展名")
			.setDesc("每行一个扩展名，可带或不带前导点（如 py 或 .py）。保存后立即生效。");

		const textArea = containerEl.createEl("textarea", {
			cls: "code-preview-extensions-input",
		});
		textArea.rows = 8;
		textArea.value = this.plugin.settings.extensions.join("\n");

		new Setting(containerEl)
			.addButton((btn) =>
				btn
					.setButtonText("保存")
					.setCta()
					.onClick(() => {
						const extensions = [
							...new Set(
								textArea.value
									.split("\n")
									.map(normalizeExtension)
									.filter((ext) => ext.length > 0)
							),
						];
						this.plugin.settings.extensions = extensions;
						void this.plugin.saveSettings();
						this.plugin.applyExtensions();
						new Notice("代码预览扩展名已更新");
					})
			)
			.addButton((btn) =>
				btn
					.setButtonText("恢复默认")
					.onClick(() => {
						this.plugin.settings.extensions = [...DEFAULT_EXTENSIONS];
						void this.plugin.saveSettings();
						this.plugin.applyExtensions();
						textArea.value = this.plugin.settings.extensions.join("\n");
						new Notice("已恢复默认扩展名");
					})
			);
	}
}
