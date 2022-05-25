
import { SFCDescriptor } from "@vue/compiler-sfc";
import prettier from "prettier";
export function generateSfc(descriptor: SFCDescriptor) {
    let result = "";
    const { template, script, scriptSetup, styles, customBlocks } = descriptor;
    [template, script, scriptSetup, ...styles, ...customBlocks].forEach(
      (block) => {
        if (block?.type) {
          result += `<${block.type}${Object.entries(block.attrs).reduce(
            (attrCode, [attrName, attrValue]) => {
              if (attrValue === true) {
                attrCode += ` ${attrName}`;
              } else {
                attrCode += ` ${attrName}="${attrValue}"`;
              }
  
              return attrCode;
            },
            " "
          )}>${block.content}</${block.type}>`;
        }
      }
    );
    return prettier.format(result, {
      parser: "vue",
      semi: true,
      singleQuote: true,
    });
  }