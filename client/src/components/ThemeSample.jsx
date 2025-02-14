import React from "react";

export default function ThemeSample({ theme, styleInfo }) {

  const handleChangeTheme = (event) => {
    event.preventDefault();
    localStorage.setItem('color-theme', theme.toLowerCase())
    window.location.reload();
  }

  return (
    <article style={styleInfo} className="theme-sample">
      <button className="theme-name" onClick={handleChangeTheme}>{theme} Theme</button>
      <p>Click the button to select this theme!</p>
    </article>
  )
}