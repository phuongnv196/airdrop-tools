var searchParams = new URLSearchParams(Telegram.WebView.initParams.tgWebAppData);

const paramsObject = {};
searchParams.forEach((value, key) => {
    paramsObject[key] = value;
});

console.table(JSON.stringify({ "extInfo": paramsObject}));