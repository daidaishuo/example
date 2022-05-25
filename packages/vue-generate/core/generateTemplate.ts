import {
    ElementNode,
    TemplateChildNode,
} from "@vue/compiler-core";
import { generateElement } from './generateElement'
export function generateTemplate(
    templateAst: ElementNode | TemplateChildNode,
    children = ""
): string {
    // @ts-expect-error
    if (templateAst?.children?.length) {
        // @ts-expect-error
        children = templateAst.children.reduce((result, child) => {
            return result + generateTemplate(child);
        }, "");
    }

    if (templateAst.type === 1) {
        return generateElement(templateAst, children);
    }
    
    return templateAst.loc.source;
}