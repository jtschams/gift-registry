import React from 'react';
import ThemeSample from '../components/ThemeSample';
import themes from '../utils/themes.js';

export default function ThemeChange() {

  return (<>
    <h1>Select a Theme</h1>
    <section>
      {Object.keys(themes).map((theme) => (<ThemeSample key={theme} theme={theme} styleInfo={themes[theme]}/>))}
    </section>
  </>)
}