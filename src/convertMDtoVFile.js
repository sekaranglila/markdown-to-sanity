import unified from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkHtml from "remark-html";
import YAML from 'yaml'


async function convertMDtoVFile (markdownContent) {
  const VFile = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { name: 'frontmatter', yaml: YAML.parse })
    .use(remarkHtml)
    .process(markdownContent)

  // eslint-disable-next-line no-console
  console.log(String(VFile));

  return VFile
}

export default convertMDtoVFile;
