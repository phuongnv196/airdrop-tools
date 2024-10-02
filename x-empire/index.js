
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import { MongoClient } from 'mongodb';

const dbUrl = 'mongodb+srv://siunvp:siungoc96@siu.vmhcq.mongodb.net/?retryWrites=true&w=majority&appName=siu';

const client = new MongoClient(dbUrl);

var compress = (() => {
    const _hash = function(e) {
        const t = function(g) {
            var w = n(i(r(o(g), 8 * g.length)));
            return w.toLowerCase()
        };
        function n(g) {
            for (var w, p = "0123456789ABCDEF", b = "", v = 0; v < g.length; v++)
                w = g.charCodeAt(v),
                b += p.charAt(w >>> 4 & 15) + p.charAt(15 & w);
            return b
        }
        function o(g) {
            for (var w = Array(g.length >> 2), p = 0; p < w.length; p++)
                w[p] = 0;
            for (p = 0; p < 8 * g.length; p += 8)
                w[p >> 5] |= (255 & g.charCodeAt(p / 8)) << p % 32;
            return w
        }
        function i(g) {
            for (var w = "", p = 0; p < 32 * g.length; p += 8)
                w += String.fromCharCode(g[p >> 5] >>> p % 32 & 255);
            return w
        }
        function r(g, w) {
            g[w >> 5] |= 128 << w % 32,
            g[14 + (w + 64 >>> 9 << 4)] = w;
            for (var p = 1732584193, b = -271733879, v = -1732584194, m = 271733878, y = 0; y < g.length; y += 16) {
                var S = p
                  , _ = b
                  , x = v
                  , I = m;
                b = u(b = u(b = u(b = u(b = c(b = c(b = c(b = c(b = l(b = l(b = l(b = l(b = s(b = s(b = s(b = s(b, v = s(v, m = s(m, p = s(p, b, v, m, g[y + 0], 7, -680876936), b, v, g[y + 1], 12, -389564586), p, b, g[y + 2], 17, 606105819), m, p, g[y + 3], 22, -1044525330), v = s(v, m = s(m, p = s(p, b, v, m, g[y + 4], 7, -176418897), b, v, g[y + 5], 12, 1200080426), p, b, g[y + 6], 17, -1473231341), m, p, g[y + 7], 22, -45705983), v = s(v, m = s(m, p = s(p, b, v, m, g[y + 8], 7, 1770035416), b, v, g[y + 9], 12, -1958414417), p, b, g[y + 10], 17, -42063), m, p, g[y + 11], 22, -1990404162), v = s(v, m = s(m, p = s(p, b, v, m, g[y + 12], 7, 1804603682), b, v, g[y + 13], 12, -40341101), p, b, g[y + 14], 17, -1502002290), m, p, g[y + 15], 22, 1236535329), v = l(v, m = l(m, p = l(p, b, v, m, g[y + 1], 5, -165796510), b, v, g[y + 6], 9, -1069501632), p, b, g[y + 11], 14, 643717713), m, p, g[y + 0], 20, -373897302), v = l(v, m = l(m, p = l(p, b, v, m, g[y + 5], 5, -701558691), b, v, g[y + 10], 9, 38016083), p, b, g[y + 15], 14, -660478335), m, p, g[y + 4], 20, -405537848), v = l(v, m = l(m, p = l(p, b, v, m, g[y + 9], 5, 568446438), b, v, g[y + 14], 9, -1019803690), p, b, g[y + 3], 14, -187363961), m, p, g[y + 8], 20, 1163531501), v = l(v, m = l(m, p = l(p, b, v, m, g[y + 13], 5, -1444681467), b, v, g[y + 2], 9, -51403784), p, b, g[y + 7], 14, 1735328473), m, p, g[y + 12], 20, -1926607734), v = c(v, m = c(m, p = c(p, b, v, m, g[y + 5], 4, -378558), b, v, g[y + 8], 11, -2022574463), p, b, g[y + 11], 16, 1839030562), m, p, g[y + 14], 23, -35309556), v = c(v, m = c(m, p = c(p, b, v, m, g[y + 1], 4, -1530992060), b, v, g[y + 4], 11, 1272893353), p, b, g[y + 7], 16, -155497632), m, p, g[y + 10], 23, -1094730640), v = c(v, m = c(m, p = c(p, b, v, m, g[y + 13], 4, 681279174), b, v, g[y + 0], 11, -358537222), p, b, g[y + 3], 16, -722521979), m, p, g[y + 6], 23, 76029189), v = c(v, m = c(m, p = c(p, b, v, m, g[y + 9], 4, -640364487), b, v, g[y + 12], 11, -421815835), p, b, g[y + 15], 16, 530742520), m, p, g[y + 2], 23, -995338651), v = u(v, m = u(m, p = u(p, b, v, m, g[y + 0], 6, -198630844), b, v, g[y + 7], 10, 1126891415), p, b, g[y + 14], 15, -1416354905), m, p, g[y + 5], 21, -57434055), v = u(v, m = u(m, p = u(p, b, v, m, g[y + 12], 6, 1700485571), b, v, g[y + 3], 10, -1894986606), p, b, g[y + 10], 15, -1051523), m, p, g[y + 1], 21, -2054922799), v = u(v, m = u(m, p = u(p, b, v, m, g[y + 8], 6, 1873313359), b, v, g[y + 15], 10, -30611744), p, b, g[y + 6], 15, -1560198380), m, p, g[y + 13], 21, 1309151649), v = u(v, m = u(m, p = u(p, b, v, m, g[y + 4], 6, -145523070), b, v, g[y + 11], 10, -1120210379), p, b, g[y + 2], 15, 718787259), m, p, g[y + 9], 21, -343485551),
                p = f(p, S),
                b = f(b, _),
                v = f(v, x),
                m = f(m, I)
            }
            return Array(p, b, v, m)
        }
        function a(g, w, p, b, v, m) {
            return f(h(f(f(w, g), f(b, m)), v), p)
        }
        function s(g, w, p, b, v, m, y) {
            return a(w & p | ~w & b, g, w, v, m, y)
        }
        function l(g, w, p, b, v, m, y) {
            return a(w & b | p & ~b, g, w, v, m, y)
        }
        function c(g, w, p, b, v, m, y) {
            return a(w ^ p ^ b, g, w, v, m, y)
        }
        function u(g, w, p, b, v, m, y) {
            return a(p ^ (w | ~b), g, w, v, m, y)
        }
        function f(g, w) {
            var p = (65535 & g) + (65535 & w);
            return (g >> 16) + (w >> 16) + (p >> 16) << 16 | 65535 & p
        }
        function h(g, w) {
            return g << w | g >>> 32 - w
        }
        return t(e)
    }
    return {
        getApiKey: (time, data) => {
            return _hash(encodeURIComponent(`${time}_${JSON.stringify(data)}`));
        }
    }
})();

const tap = async (data) => {
    const time = parseInt(new Date().getTime() / 1000);
    const res = await fetch('https://api.xempire.io/hero/action/tap', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': '30df0fea3ea4c8b14b732851f48b8d7f2044278ae16d375daf6b7c59e242575f',
            'Api-Time': time,
            'Api-Hash': compress.getApiKey(time, data),
            'Is-Beta-Server': null
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

const appRun = async () => {
    let data = { time: 1};
    setInterval(async () => {
        const result = await tap({"data":{"data":{"task":{"amount": 100000,"currentEnergy": 37000}},"seconds": 6}});
        if (data.time == 1 || data.time % 20 == 0) {
            if (result.success) {
                console.log(`tapped_today: ${result.data.tapped_today}: Money: ${result.data.hero.money}`);
                data.time = 1;
            } else {
                console.log(`${JSON.stringify(result)}`);
                data.time++;
            }
        }
    }, 6000);
}

(async () => {

    try {
        await client.connect();
        const database = client.db('Airdrop');
        const collection = database.collection('XFrogExtInfos_2');

        const documents = await collection.find({}).toArray();
     
        await appRun();
    } catch (e){
        console.error(e);
    } finally {
        client.close();
    }
})();
