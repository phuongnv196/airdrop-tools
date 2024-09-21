
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import { MongoClient } from 'mongodb';


const dbUrl = 'mongodb+srv://siunvp:siungoc96@siu.vmhcq.mongodb.net/?retryWrites=true&w=majority&appName=siu';

const client = new MongoClient(dbUrl);

let extInfos = [];

const loginData = {};

var intervals = {};


const login = async (extInfo) => {
    const user = JSON.parse(extInfo.extInfo.user);
    const rawResponse = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/login?lang=en_US', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(extInfo)
    });
    const content = await rawResponse.json();
    if (/x_g_t_k=(.+?);/.test(rawResponse.headers.get('set-cookie'))) {
        if (!loginData[user.id]) {
            loginData[user.id] = {};
        }
        loginData[user.id].cookies = /x_g_t_k=(.+?);/.exec(rawResponse.headers.get('set-cookie'))[0];
    }
    return content;
}

const getSummary = async (user) => {
    const res = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/summary?lang=en_US', {
        headers: {
            'Accept': 'application/json',
            'Cookie': loginData[user.id].cookies
        }
    });

    return await res.json();
}

const appRun = () => {
    extInfos.forEach(item => {
        (async () => {
            const user = JSON.parse(item.extInfo.user);

            const loginResult = await login(item);
            if (loginResult.success) {
                console.log("Đăng nhập thành công!");
                const summary = await getSummary(user);
                loginData[user.id].tapRemain = summary.data.feedPreview.molecule;
                loginData[user.id].availableAmount = summary.data.availableAmount;

                setInterval(() => {
                    loginData[user.id].tapRemain += 2;
                }, 1000);

                setInterval(async () => {
                    let randomTaps = Math.floor(Math.random() * (16 - 10)) + 10;
                    randomTaps = loginData[user.id].tapRemain > randomTaps ? randomTaps : loginData[user.id].tapRemain;

                    const formdata = new FormData();
                    formdata.append("increment", randomTaps);
                    formdata.append("molecule", loginData[user.id].tapRemain - randomTaps);

                    const res = await fetch('https://www.kucoin.com/_api/xkucoin/platform-telebot/game/gold/increase?lang=en_US', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Cookie': loginData[user.id].cookies
                        },
                        body: formdata
                    });

                    const result = await res.json();
                    if (result?.success) {
                        loginData[user.id].tapRemain -= randomTaps;
                        loginData[user.id].availableAmount += randomTaps;
                        console.log(`User Id: ${user.id} - ${user.first_name} ${user.last_name}: Đã tap ${randomTaps} còn lại ${loginData[user.id].tapRemain} Số coins: ${loginData[user.id].availableAmount}`);
                    } else {
                        await login(item);
                    }
                }, 5000);
            }
            else {
                console.log('Đăng nhập thất bại!');
            }
        })();
    });
}


(async () => {

    try {
        await client.connect();
        const database = client.db('Airdrop');
        const collection = database.collection('XFrogExtInfos_2');

        const documents = await collection.find({}).toArray();
        extInfos = documents.map(item => { return {
            extInfo: item.extInfo
        }});
        appRun();
    } catch (e){
        console.error(e);
    } finally {
        client.close();
    }
})();
