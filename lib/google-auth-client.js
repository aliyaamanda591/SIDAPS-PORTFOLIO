function correctGoogleLoginOrigin(){if(location.hostname!=='sidaps-portfolio.sidaps.workers.dev.')return false;const url=new URL(location.href);url.hostname='sidaps-portfolio.sidaps.workers.dev';location.replace(url.href);return true;}
async function prepareGoogleSignIn(){return window.SidapsFirebaseAuth?.prepare();}
async function googleSignIn(){if(correctGoogleLoginOrigin())return;return window.SidapsFirebaseAuth?.google();}
