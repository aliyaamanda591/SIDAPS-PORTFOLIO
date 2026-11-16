// Test the HTML actually assembled by application modules, never parse source as JSON.
import {portfolioHtml} from '../../../lib/portfolio-html.ts';
import {loginHtml} from '../../../lib/login-html.ts';
import {landingHtml} from '../../../lib/landing-html.ts';
export {portfolioHtml,loginHtml,landingHtml};
export function renderedTemplate(file){
 const templates={'lib/portfolio-html.ts':portfolioHtml,'lib/login-html.ts':loginHtml,'lib/landing-html.ts':landingHtml};
 if(!(file in templates))throw Error('Unknown HTML template: '+file);
 return templates[file];
}
