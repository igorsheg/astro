import 'reset-css';
import { createGlobalStyle } from 'styled-components';
import { SAMPLE_THEMES } from 'server/config/seed-data';

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
  src: url("fonts/Inter-roman.var.woff2?v=3.15") format("woff2");
}
@font-face {
  font-family: 'Inter var';
  font-weight: 100 900;
  font-display: swap;
  font-style: italic;
  font-named-instance: 'Italic';
  src: url("fonts/Inter-italic.var.woff2?v=3.15") format("woff2");
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
		overflow-x: hidden;
		height: 100%;
		width: 100%;
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

	}

	pre {
		font-family: input-mono, monospace;
	}
	*,
	*:before,
	*:after {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	code pre span {
		-webkit-font-smoothing: subpixel-antialiased;
		-moz-osx-font-smoothing: subpixel-antialiased;
		font-family: input-mono, monospace;
	}

	p {margin-bottom: 1rem;}

	h1, h2, h3, h4, h5 {
  	margin: 3rem 0 1.38rem;
  	font-family: 'Poppins', sans-serif;
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

`;

export default GlobalStyle;
