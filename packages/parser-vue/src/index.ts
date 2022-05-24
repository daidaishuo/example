import glob from 'glob'
import fs from 'fs'
import path from 'path'
import { createDefaultCompiler } from '@vue/component-compiler';
import { parse, compileTemplate, SFCDescriptor, SFCTemplateBlock } from '@vue/compiler-sfc';
import babelGenerator from '@babel/generator';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
// https://zhuanlan.zhihu.com/p/114239056
import * as parser from '@babel/parser';
import traverse from '@babel/traverse'; //https://segmentfault.com/a/1190000022345699
import * as t from '@babel/types';
const filename = 'vue3parse.vue'

const vue3Str = fs.readFileSync(path.resolve(__dirname, '../example/vue3.vue'), 'utf8');
// 解析vue3sfc 文件
let parseValue: any = parse(
    vue3Str
    ,
    {
        filename: filename
    }
)
// 编译模版内容
const compileTemplateRes = compileTemplate({
    id: '11',
    filename,
    source: parseValue.descriptor.template?.content || '',
});

const { code } = compileTemplateRes

const ast = parser.parse(code, { sourceType: 'module', plugins: ['typescript'] });
// 看着这个写
// https://evilrecluse.top/Babel-traverse-api-doc/#/?id=index  
const traverseAst = (ast: any) => {
    const res: any = [];
    traverse(ast, {
        CallExpression(path) {
            const { callee }: any = path.node;
            const nodeArguments: any = path.node.arguments;
            // 是否是标识符
            if (t.isStringLiteral(nodeArguments[0]) && callee?.name === '_createTextVNode') {
                res.push(nodeArguments[0].value)
                path.remove()
            }
        },
    });
    return res
}

// console.log(ast)

function generateSfc(descriptor: SFCDescriptor) {
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

    return result
}

// 测试获取vue3中 <testWarp>包裹的中文文案
const textWarpNodeList = traverseAst(ast)



const dfs = (root: any) => {
    if (!root) return
    if (root.type === 1 && root.tag === 'testWarp') {
        console.log(111, root)
        const content = root?.children[0].content
        console.log(content)
        root.tag = 'i18n'
        root.loc = {
            source: `<i18n>${content}</i18n>`
        }
        console.log(222, root)
    }
    if (root.children?.length) {
        root.children.forEach((item: any) => {
            dfs(item)
        })
    }
    
    return root
}

dfs(parseValue?.descriptor?.template?.ast)

// console.log(JSON.stringify(dfs(parseValue?.descriptor?.template?.ast)))
// console.log(generateSfc(parseValue.descriptor))
parseValue.descriptor.template.ast = dfs(parseValue?.descriptor?.template?.ast) as any
console.log(JSON.stringify(parseValue.descriptor.template.ast))
console.log(generateSfc(parseValue.descriptor))
