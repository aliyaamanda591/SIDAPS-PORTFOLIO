// Isolated regression suite; no live registration, email, or portfolio writes.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const tests=[
  "test-audit-regressions.mjs",
  "test-brand-display.mjs",
  "test-brand-seo.mjs",
  "test-canonical-login.mjs",
  "test-demo-mode.mjs",
  "test-demo-market-prices.mjs",
  "test-landing-intro.mjs",
  "test-fast-login.mjs",
  "test-google-account-link.mjs",
  "test-google-domain.mjs",
  "test-google-tokens.mjs",
  "test-landing-cinema.mjs",
  "test-landing.mjs",
  "test-login-experience.mjs",
  "test-login-market.mjs",
  "test-login-performance.mjs",
  "test-market-board.mjs",
  "test-mobile-login.mjs",
  "test-password-reset.mjs",
  "test-platform-picker.mjs",
  "test-portfolio-summary.mjs",
  "test-profile-photos.mjs",
  "test-recovery-otp-ui.mjs",
  "test-retail-gold.mjs",
  "test-starter-portfolio.mjs",
  "test-themes.mjs",
  "test-usage-demo.mjs",
  "test-usage-tour.mjs"
];
let failed=0;
for(const test of tests){
 const result=spawnSync(process.execPath,['--import','./scripts/tests/helpers/register.mjs','scripts/tests/'+test],{cwd:root,encoding:'utf8',timeout:120000});
 if(result.status!==0){failed++;console.error('FAIL '+test+'\n'+(result.stderr||result.stdout||result.error));}
 else console.log('PASS '+test);
}
console.log((tests.length-failed)+'/'+tests.length+' offline tests passed');
process.exitCode=failed?1:0;
