import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import ini from "highlight.js/lib/languages/ini";
import python from "highlight.js/lib/languages/python";
import yaml from "highlight.js/lib/languages/yaml";

/** 扩展名 → highlight.js 语言注册名 */
const EXT_TO_LANG: Record<string, string> = {
	sh: "bash",
	bash: "bash",
	py: "python",
	yaml: "yaml",
	yml: "yaml",
	ini: "ini",
	conf: "ini",
};

/**
 * 归一化扩展名：去首尾空白、去前导点、转小写。
 * 例如 ".Py" → "py"。
 */
export function normalizeExtension(ext: string): string {
	return ext.trim().replace(/^\.+/, "").toLowerCase();
}

/**
 * 注册插件内置支持的 highlight.js 语言。
 * 只注册目标类型所需的最小语言集，保持产物体积最小。
 */
export function registerHighlightLanguages(): void {
	hljs.registerLanguage("bash", bash);
	hljs.registerLanguage("ini", ini);
	hljs.registerLanguage("python", python);
	hljs.registerLanguage("yaml", yaml);
}

/**
 * 根据扩展名解析 highlight.js 语言名。
 * 优先查内置映射，否则回退为扩展名本身（支持用户自定义类型）；
 * 若该语言未注册则返回 null（调用方回退为纯文本显示）。
 */
export function getLanguage(ext: string): string | null {
	const normalized = normalizeExtension(ext);
	const lang = EXT_TO_LANG[normalized] ?? normalized;
	return hljs.getLanguage(lang) ? lang : null;
}

/** 对代码内容做语法高亮，返回已转义的 HTML。 */
export function highlightCode(content: string, language: string): string {
	return hljs.highlight(content, { language, ignoreIllegals: true }).value;
}
