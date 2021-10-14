import 'reset-css';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { createGlobalStyle } from 'styled-components';

interface GlobalStylesProps {
  theme: typeof SAMPLE_THEMES['dark'];
}
const GlobalStyle = createGlobalStyle<GlobalStylesProps>`



@font-face {
  font-family: 'Inter var';
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
  font-named-instance: 'Regular';
  src: url("/fonts/Inter-roman.var.woff2?v=3.15") format("woff2");
}
@font-face {
  font-family: 'Inter var';
  font-weight: 100 900;
  font-display: swap;
  font-style: italic;
  font-named-instance: 'Italic';
  src: url("/fonts/Inter-italic.var.woff2?v=3.15") format("woff2");
}


	
	:root { font-family: 'Inter', sans; }
  @supports (font-variation-settings: normal) {
    :root { font-family: 'Inter var', sans; }
  }



	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}

	html {
		overflow: hidden;
		height: 100vh;
		width: 100vw;
        color: ${p => p.theme.text.primary};
        background: ${p => p.theme.background.secondary};
        transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1), color 240ms cubic-bezier(0.19, 1, 0.22, 1);
		margin-left: calc(100vw - 100%);

	}
	body {
		padding: 0;
		margin: 0;
		height: 100%;
		line-height: 1.75;
		width: 100%;
		font-weight: 400;
		font-family: 'Inter var', sans-serif;

	}

	pre {

		font-family: 'Inter var', sans-serif;

	}
	*,
	*:before,
	*:after {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	code pre span  {
		-webkit-font-smoothing: subpixel-antialiased;
		-moz-osx-font-smoothing: subpixel-antialiased;
		font-family: input-mono, monospace;
	}

	p {margin-bottom: 1rem;}

	h1, h2, h3, h4, h5 {
  	margin: 3rem 0 1.38rem;
  	font-family: 'Inter var', sans-serif;
  	font-weight: 400;
  	line-height: 1.3;
	}

	h1 {
  	margin-top: 0;
  	font-size: 3.052rem;
	font-weight: 700;
}

	h2 {font-size: 2.441rem;}

	h3 {font-size: 1.953rem;}

	h4 {font-size: 1.563rem;}

	h5 {font-size: 1.25rem;}

	mall, .text_small {font-size: 0.8rem;}


	a {
		color: ${p => p.theme.text.primary};
		text-decoration: none;
		::visited {
			color: inherit;
		}
	}

*:focus:not(.focus-visible) {
  outline: none;
}

&::-webkit-scrollbar {
    width: 18px;
    background-color:  ${p => p.theme.background.secondary};
	box-shadow: inset 1px 0 0  ${p => p.theme.border.secondary};
  }
  &::-webkit-scrollbar-button {
    display: none;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${p => p.theme.border.primary};
    background-clip: content-box;
    border-radius: calc(5px * 2); 
    border: 5px solid transparent; 
    height: 72px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${p => p.theme.text.secondary};
  }
  &::-webkit-scrollbar-thumb:active {
    background-color: ${p => p.theme.text.primary};
  }
  div[role="tooltip"] {
	  z-index: 99999999999991;
  }


`;

export default GlobalStyle;
