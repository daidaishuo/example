import {
    ElementNode,
    AttributeNode,
    DirectiveNode,
  } from "@vue/compiler-core";
export function generateElement(node: ElementNode, children: string) {
    let attributes = "";

    if (node.props.length) {
        attributes = ` ${generateElementAttr(node.props)}`;
    }

    if (node.tag) {
        // 自关闭标签：https://html.spec.whatwg.org/multipage/syntax.html#void-elements
        const selfClosingTags = [
            "area",
            "base",
            "br",
            "col",
            "embed",
            "hr",
            "img",
            "input",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
        ];

        if (node.isSelfClosing || selfClosingTags.includes(node.tag)) {
            return `<${node.tag}${attributes} />`;
        }

        return `<${node.tag}${attributes}>${children}</${node.tag}>`;
    }

    return children;
}

export function generateElementAttr(attrs: Array<AttributeNode | DirectiveNode>) {
    return attrs
      .map((attr) => {
        return attr.loc.source;
      })
      .join(" ");
  }