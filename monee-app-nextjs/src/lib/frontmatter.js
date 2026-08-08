import yaml from 'js-yaml';

export function parseFrontmatter(markdown) {
  const source = markdown.replace(/^\uFEFF/, '');
  const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);

  if (!match) {
    return { data: {}, content: markdown };
  }

  const parsedData = yaml.load(match[1]) || {};
  const data = parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)
    ? parsedData
    : {};

  return {
    data,
    content: source.slice(match[0].length),
  };
}
