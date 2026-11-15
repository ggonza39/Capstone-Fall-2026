function Content({ id, fromParagraphs, fallbackContent }) {
  // This component was generated using ChatGPT
  if (fromParagraphs == null) {
    return fallbackContent;
  }

  const paragraph = fromParagraphs.find(
    (paragraph) => paragraph.id === id
  );

  return paragraph ? paragraph.content : fallbackContent;
}

export default Content;