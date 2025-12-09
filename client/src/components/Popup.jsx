import React from 'react';

import { usePopupContext } from '../App';

export default function Popup() {

  const { popupState } = usePopupContext();

  function generateOption(option, key, count) {
    if (option.href) return (<a key={key} className={"button button-" + count} href={option.href}>{option.text}</a>)
    else if (option.onClick) return (<button key={key} className={"button-" + count} onClick={option.onClick}>{option.text}</button>);
  }

  return (<>
  <div id="popup-background">
    <div id="popup-foreground">
      <h2>{popupState?.title}</h2>
      <p>{popupState?.message}</p>
      <section>{popupState?.options.map((option, index, {length}) => generateOption(option, index, length))}</section>
    </div>
  </div>
  </>)
}