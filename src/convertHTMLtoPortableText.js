import {htmlToBlocks} from "@sanity/block-tools";
import jsdom from "jsdom";
import defaultSchema from "./defaultSchema.js";

const { JSDOM } = jsdom
const HTMLpattern = /<[a-z][\s\S]*>/

/**
 *  block tools needs a schema definition to now what
 * types are available
 *  */
const blockContentType = defaultSchema
  .get('blogPost')
  .fields.find(field => field.name === 'body').type

function convertHTMLtoPortableText (HTMLDoc) {
  if (!HTMLpattern.test(HTMLDoc)) {
    return []
  }
  const rules = [
    {
      // Special case for code blocks (wrapped in pre and code tag)
      deserialize (el, next, block) {
        if (el.tagName.toLowerCase() !== 'pre') {
          return undefined
        }
        const codeElement = el.children[0]
        const codeElementNodes =
        codeElement && codeElement.tagName.toLowerCase() === 'code'
            ? codeElement.childNodes
            : el.childNodes
        let code = ''
        codeElementNodes.forEach(node => {
          code += node.textContent
        })

        let language = 'text';
        if(codeElement.className){
          language = codeElement.className.split("-")[1];
        }
        return block({
          _type: 'code',
          code: code,
          language: language
        })
      }
    },
    {
      // tables
      deserialize(el, next, block) {
        if (el.tagName.toLowerCase() !== "table") {
          return undefined;
        }

        const rows = [];
        for (let i = 0; i < el.children.length; i++) {
          const tableElement = el.children[i];
          tableElement.childNodes.forEach(node => {
            if (node.hasChildNodes()) {
              let cells = [];
              node.childNodes.forEach(child => {
                if (child.textContent !== ' ') {
                  cells.push(child.textContent);
                }
              })
              rows.push({
                _type: "tableRow",
                cells
              })
            }
          })
        }

        return block({
          _type: "table",
          rows
        });
      }
    },
    {
      deserialize(el, next, block) {
        if (
          el.tagName.toLowerCase() === 'p' &&
          el.childNodes.length > 0 &&
          el.firstChild.nodeName.toLowerCase() === 'img'
        ) {
          const images = [].filter.call(el.children, function(node) {
            return node.nodeName.toLowerCase() === 'img'
          })
          const links = []
          images.forEach(image => {
            links.push(image.getAttribute('src'))
          })
          return block({
            _type: 'customAsset',
            assetType: 'images',
            assetLinks: links
          })
        }
        return undefined;
      }
    },
    {
      deserialize (el, next, block) {
        if (el.tagName.toLowerCase() !== 'img') {
          return undefined
        }
        return {
          _type: 'span',
          marks: [
            "strong"
          ],
          text: `Asset Link: ${el.getAttribute('src')}`
        }
      }
    },
    {
      deserialize(el, next, block) {
        if (
          el.tagName.toLowerCase() !== 'source'
        ) {
          return undefined;
        }
        return block({
          _type: 'customAsset',
          assetType: 'videos',
          assetLinks: [el.getAttribute('src')]
        })
      }
    },
    {
      deserialize(el, next, block) {
        if (
          el.tagName.toLowerCase() !== 'iframe'
        ) {
          return undefined;
        }
        return block({
          _type: 'youtube',
          url: el.getAttribute('src')
        })
      }
    },
  ]
  /**
   * Since we're in a node context, we need
   * to give block-tools JSDOM in order to
   * parse the HTML DOM elements
   */
  return htmlToBlocks(HTMLDoc, blockContentType, {
    rules,
    parseHtml: html => new JSDOM(html).window.document
  })
}

export default convertHTMLtoPortableText;
