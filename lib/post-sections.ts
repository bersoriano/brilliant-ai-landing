import type { PhrasingContent, Root } from "mdast";

export type PostSection = { id: string; depth: number };

function headingText(nodes: PhrasingContent[]): string {
  return nodes.map((node) => {
    if ("value" in node) return node.value;
    if ("alt" in node) return node.alt ?? "";
    return "children" in node ? headingText(node.children) : "";
  }).join("");
}

export function remarkPostSections(sections: PostSection[]) {
  return (tree: Root) => {
    const used = new Set<string>();
    for (const heading of tree.children) {
      if (heading.type !== "heading" || heading.depth < 2) continue;
      const slug = headingText(heading.children).normalize("NFKD").toLowerCase()
        .replace(/\p{Mark}/gu, "").replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const base = slug ? `section-${slug}` : "section-heading";
      let id = base;
      for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
      used.add(id);
      heading.data = { ...heading.data, hProperties: { ...heading.data?.hProperties, id } };
      sections.push({ id, depth: heading.depth });
    }
  };
}

export function alternateSections(sections: PostSection[], translated: PostSection[]) {
  // Only pair translations that have the same heading structure.
  if (sections.length !== translated.length || sections.some((section, i) => section.depth !== translated[i].depth)) {
    return {};
  }
  return Object.fromEntries(sections.map((section, i) => [section.id, translated[i].id]));
}
