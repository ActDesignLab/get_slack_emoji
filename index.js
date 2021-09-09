const axios = require('axios');
const accessToken = process.argv[2];
const fs = require('fs');
const fsExtra = require('fs-extra');
const slackUrl = 'https://slack.com/api/emoji.list';
const params = {
    token: accessToken,
    pretty: 1
};

(async () => {
    try {
        console.log('start');

        await fsExtra.remove('imgs');
        fs.mkdirSync('imgs');

        const query = Object.keys(params).map( v => { return `${v}=${params[v]}`; }).join('&');
        const result = await axios.get(`${slackUrl}?${query}`);

        const keys = Object.keys(result.data.emoji);
        for(i in keys) {
            const key = keys[i];
            const imageUrl = result.data.emoji[key];
            console.log(`${key}:${imageUrl}`);
            if (/http/.test(imageUrl)) {
                const imageResult = await axios.get(imageUrl, {responseType: 'arraybuffer'});
                fs.writeFileSync(`imgs/${key}.png`, new Buffer.from(imageResult.data), 'binary');
            }
        }

        console.log('finish');
    } catch(e) {
        console.log(e);
    }
})();
