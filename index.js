const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const accessToken = process.argv[2];
const fs = require('fs');
const fsExtra = require('fs-extra');
const slackUrl = 'https://slack.com/api/emoji.list';
const params = { pretty: 1 };

(async () => {
  try {
    console.log('start');

    await fsExtra.remove('imgs');
    fs.mkdirSync('imgs');

    const query = (new URLSearchParams(params)).toString();
    const result = await fetch(`${slackUrl}?${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const obj = await result.json();
    if (!obj.emoji) throw 'request key emoji is not exist.';
    const emoji = obj.emoji;

    const keys = Object.keys(emoji);
    for (const key of keys) {
      const imageUrl = emoji[key];
      console.log(`${key}:${imageUrl}`);
      if (/http/.test(imageUrl)) {
        const imageResult = await fetch(imageUrl, { method: 'GET' });
        const arrayBuffer = await imageResult.arrayBuffer();
        fs.writeFileSync(`imgs/${key}.png`, new Buffer.from(arrayBuffer), 'binary');
      }
    }
    console.log('finish');
  } catch (e) {
    console.log(e);
  }
})();
