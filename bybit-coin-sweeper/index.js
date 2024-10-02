import CryptoJS from 'crypto-js';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const X_FIELDS_COUNT = 6
  , Y_FIELDS_COUNT = 9
  , BOMBS_COUNT = 9;

const value = e => {
    return e['split']("")['reduce']( (a, o) => a + o['charCodeAt'](0), 0) / 1e5
}

const calc = (e, s, a, o, g, rt) => {
    const ht = (10 * e + Math.max(0, 1200 - 10 * s) + 2e3) * (1 + o / a) / 10;
    return Math.floor(ht) + value(rt)
}

const getWinPostData = (gameData) => {
    const gameTime = gameData.gameTime;
    const fieldsOpened = 45;
    const Er = `${gameData.id}-${new Date(gameData.createdAt).getTime()}`
          , Sr = "66f18bbce5c5186a620ce72ev$2f1-" + Er
          , Ar = `${gameTime}-${gameData.id}`
          , Br = CryptoJS.HmacSHA256(Ar, Sr).toString(CryptoJS.enc.Hex)
          , score = calc(fieldsOpened, gameTime, X_FIELDS_COUNT * Y_FIELDS_COUNT, BOMBS_COUNT, !0, gameData.id);
    return {
        gameId: gameData.id,
        bits: gameData.rewards.bits,
        bagCoins: gameData.rewards.bagCoins,
        gifts: gameData.rewards.gifts,
        score: score,
        gameTime: gameTime,
        h: Br
    }
}

const startGame = async (user) => {
    const res = await fetch('https://api.bybitcoinsweeper.com/api/games/start', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${user.accessToken}`,
            'Tl-Init-Data': user.initData
        },
    });
    return await res.json();
}

const refreshToken = async (user) => {
    const data = {"refreshToken": user.refreshToken };

    const res = await fetch('https://api.bybitcoinsweeper.com/api/auth/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${user.accessToken}`,
            'Tl-Init-Data': user.initData
        },
        body: JSON.stringify(data)
    });
    return await res.json()
}

const win = async (user, gameData) => {
    const winPostData = getWinPostData(gameData);
    const res = await fetch('https://api.bybitcoinsweeper.com/api/games/win', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${user.accessToken}`,
            'Tl-Init-Data': user.initData
        },
        body: JSON.stringify(winPostData)
    });
}

const login = async (queryData) => {
    const res = await fetch('https://api.bybitcoinsweeper.com/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Tl-Init-Data': queryData
        },
        body: JSON.stringify({"initData": queryData })
    });
    return await res.json();
};

const users = [{
    initData: 'query_id=AAEHXP0_AAAAAAdc_T8bBZ7H&user=%7B%22id%22%3A1073568775%2C%22first_name%22%3A%22Phuong%22%2C%22last_name%22%3A%22Nguyen%20%F0%9F%90%88%E2%80%8D%E2%AC%9B%22%2C%22username%22%3A%22phuongnv96%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727796607&hash=d33e1caa1923a9e110324ba371f912bbe077f68d12b03af18f4056a3380fb383'
}];

(async () => {
    try {
        users.forEach(async user => {
            try {
                const loginResult = await login(user.initData);
                if (!loginResult.error) { 
                    console.error(`Login successfully! ${loginResult.userName} - ${loginResult.firstName} - ${loginResult.lastName}`);
                    Object.assign(user, loginResult);
                    //Refresh token
                    setInterval(async () => {
                        const refreshTokenResult = await refreshToken(user);
                        console.log('Refresh token');
                        Object.assign(user, refreshTokenResult);
                    }, 60 * 15 * 1000);

                    let interval = null;
                    const gameInterval = async () => {
                        const gameData = await startGame(user);
                        console.log(`Start game token: ${JSON.stringify(gameData)}`);
                        if (gameData.rewards.bagCoins + gameData.rewards.bits + gameData.rewards.gifts > 0) {
                            const gameTime = parseInt(60 + Math.random() * 30);
                            setTimeout(async () => {
                                try {
                                    gameData.gameTime = gameTime;
                                    await win(user, gameData);
                                    console.log(`Win game: ${JSON.stringify(gameData)}`);
                                } catch(error) {
                                    console.error(error);
                                }
                            }, gameTime * 1000);
                            clearInterval(interval);
                            interval = setInterval(gameInterval, gameTime * 1000 + 60000);
                        } else {
                            clearInterval(interval);
                            interval = setInterval(gameInterval, 10000);
                        }
                    }
                    interval = setInterval(gameInterval, 10000);
                } else {
                    console.error('Login error! ', loginResult.message);
                }
            } catch (error) {
                console.error('Login error!');
            }
        });
    } catch (e){

    } finally {
        
    }
})();
