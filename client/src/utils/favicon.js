export const styles = {
  light:      `--left-ribbon: #99999980; --right-ribbon: #999999;`,
  dark:       `--left-ribbon: #99999980; --right-ribbon: #999999;`,
  lavender:   `--left-ribbon: #C0C0F280; --right-ribbon: #C3C3ED;`,
  sky:        `--left-ribbon: #C0D9F280; --right-ribbon: #C4D9EE;`,
  mint:       `--left-ribbon: #C0F2C080; --right-ribbon: #C4EEC4;`,
  pink:       `--left-ribbon: #F2C0CC80; --right-ribbon: #EEC4CE;`,
};
export default function(theme) {
  
  const favicon = document.createElement('div');
  favicon.innerHTML = `<svg viewBox="1 1 6.66 7" style="${styles[theme]}" xmlns="http://www.w3.org/2000/svg">
    <polygon fill="var(--left-ribbon)" points="
    1.5,7        1.5,4
    5.83,1.5     7.16,2.268
    2.83,4.768   2.83,7.768
    "/>
    <polygon fill="var(--right-ribbon)" points="
    7.16,7       7.16,4
    2.83,1.5     1.5,2.268
    5.83,4.768   5.83,7.768
    "/>
  </svg>`
  
  const faviconXML = new XMLSerializer().serializeToString(favicon.children[0]);
  const dataURL = 'data:image/svg+xml;base64,' + btoa(faviconXML);
  document.querySelector('link#favicon').setAttribute('href', dataURL)
}