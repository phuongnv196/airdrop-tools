
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));;

var extInfoData = {"extInfo":{}};

const initData = {
    tapRemain: 3000,
    availableAmount: 0,
    cookies: ''
};

const login = async () => {
    const rawResponse = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/login?lang=en_US', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(extInfoData)
    });
    const content = await rawResponse.json();
    if (/x_g_t_k=(.+?);/.test(rawResponse.headers.get('set-cookie'))) {
        initData.cookies = /x_g_t_k=(.+?);/.exec(rawResponse.headers.get('set-cookie'))[0];
    }
    return content;
}

const getSummary = async () => {
    const res = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/summary?lang=en_US', {
        headers: {
            'Accept': 'application/json',
            'Cookie': initData.cookies
        }
    });

    return await res.json();
}

(async () => {
    var loginResult = await login();

    if (loginResult.success) {
        console.log("Đăng nhập thành công!");
        const summary = await getSummary();
        initData.tapRemain = summary.data.feedPreview.molecule;
        initData.availableAmount = summary.data.availableAmount;

        setInterval(() => {
            initData.tapRemain += 2;
        }, 1000);

        setInterval(async () => {
            let randomTaps = Math.floor(Math.random() * (16 - 10)) + 10;
            randomTaps = initData.tapRemain > randomTaps ? randomTaps : initData.tapRemain;
            
            const formdata = new FormData();
            formdata.append("increment", randomTaps);
            formdata.append("molecule", initData.tapRemain - randomTaps);
            
            const res = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/gold/increase?lang=en_US', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Cookie': initData.cookies
                },
                body: formdata
            });

            const result = await res.json();
            if (result && result.success) {
                initData.tapRemain -= randomTaps;
                initData.availableAmount += randomTaps;
                console.log(`Đã tap ${randomTaps} còn lại ${initData.tapRemain} Số coins: ${initData.availableAmount}`);
            } else {
                await login();
            }
        }, 3000);
    }
    else {
        console.log('Đăng nhập thất bại!');
    }
})();