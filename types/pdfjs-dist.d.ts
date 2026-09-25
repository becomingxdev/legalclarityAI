// Ambient module declaration so TypeScript doesn't complain about the missing
// @types package for the pdfjs-dist build entry point.
declare module "pdfjs-dist/build/pdf.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export = content;
}
