export const removeAttributes = () => {
  return {
    transformIndexHtml(html) {
      return html.replaceAll(' crossorigin', '');
    },
  };
};
