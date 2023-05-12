import convertHTMLtoPortableText from "./convertHTMLtoPortableText.js";
import format from "date-fns/format/index.js";

function convertToSanityDocument({data = {}, contents}) {
  const { title, seo, locale } = data.frontmatter || {}
  const portableText = convertHTMLtoPortableText(contents)

  let metaDescription = null
  let metaKeywords = null
  if (seo) {
    metaDescription = seo.metaDescription
    metaKeywords = seo.keywords
  }

  const doc = {
    _type: 'page',
    _createdAt: format(new Date()),
    "__i18n_lang": locale === "en-GB" ? "en_US" : locale,
    title,
    metaDescription: metaDescription,
    metaKeywords: metaKeywords,
    body: portableText
  }
  return doc
}

export default convertToSanityDocument;