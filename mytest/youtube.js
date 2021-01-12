// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: false }))

const fs = require('fs').promises;

var Datastore = require('nedb')
  , db = new Datastore({ filename: './datafile', autoload: true });


const   keywords = ['免费机场v2ray', '老司机修车', '网络赚钱', '美容健身', '理财财经'];
//const keywords = ['网络赚钱'];

const useLanch = true
const isScrollToBottom = false


async function scrollToBottom(page) {
  if (isScrollToBottom) {
    const distance = 200; // should be less than or equal to window.innerHeight
    const delay = 100;
    let count = 0;
    while (count < 50 && await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
      await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
      await page.waitForTimeout(delay);
      count++
    }
  }
}

async function existsVid(vid) {

  var count = await new Promise((resolve, reject) => {
    db.count({vid: vid}, (err, count) => {
        if (err) reject(err);
        resolve(count);
    });
  });
  return count > 0;
}

function saveVid(vid) {
  db.insert({
    vid: vid
  }, (err, ret) => {
    let log = vid + ' has been handled succeed!'
    console.log(log)
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
async function autoComment(page, video) {
  //thumbnail = await video.$('#thumbnail')
  const yourHref = await video.$eval('#thumbnail', anchor => anchor.getAttribute('href'));
  const hrefAry = yourHref.split(new RegExp('[=&]'));
  let vid = '';
  if (hrefAry.length >= 2) {
      vid = hrefAry[1]
  } 
  //const yourHref = await page.evaluate(anchor => anchor.getAttribute('href'), thumbnail);

  if (hrefAry.length >= 3 || hrefAry.length <= 1 || await existsVid(vid)) {
    let log = vid + ' has been handled already...'
    console.log(log)

  } else {
    await video.click()
    await page.waitForSelector('.html5-video-container')
    console.log(page.url())

    const knownDialogs = `不经巨大的困难，不会有伟大的事业。——伏尔泰
  苦难磨炼一些人，也毁灭另一些人。——富勒
  改变你的想法，你就改变了自己的世界。——文森特·皮尔
  不要等待，时机永远不会恰到好处。——拿破仑·希尔
  生命如同寓言，其价值不在与长短，而在与内容。——塞涅卡
  你相信什么，你就成为什么样的人。——奥普拉·温弗瑞
  生命不可能有两次，但许多人连一次也不善于度过。——吕凯特
  人的一生是短的，但如果卑劣地过这一生，就太长了。——莎士比亚
  我的努力求学没有得到别的好处，只不过是愈来愈发觉自己的无知。——笛卡儿
  生活的道路一旦选定，就要勇敢地走到底，决不回头。——左拉
  生命是一条艰险的峡谷，只有勇敢的人才能通过。——米歇潘
  要么你主宰生活，要么你被生活主宰。——吉姆·罗恩
  不幸可能成为通向幸福的桥梁。——日本谚语
  人生就是学校。在那里，与其说好的教师是幸福，不如说好的教师是不幸。——海贝尔
  接受挑战，就可以享受胜利的喜悦。——杰纳勒尔·乔治·S·巴顿
  节制使快乐增加并使享受加强。——德谟克利特
  今天应做的事没有做，明天再早也是耽误了。——裴斯泰洛齐
  决定一个人的一生，以及整个命运的，只是一瞬之间。——歌德
  一个不注意小事情的人，永远不会成就大事业。——卡耐基
  浪费时间是一桩大罪过。——卢梭
  既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。——康德
  教育需要花费钱，而无知也是一样。——克劳斯·莫瑟爵士
  坚持意志伟大的事业需要始终不渝的精神。——伏尔泰
  你活了多少岁不算什么，重要的是你是如何度过这些岁月的。——亚伯拉罕·林肯
  内外相应，言行相称。——韩非
  你热爱生命吗？那么别浪费时间，因为时间是组成生命的材料。——富兰克林
  坚强的信心，能使平凡的人做出惊人的事业。——马尔顿
  读一切好书，就是和许多高尚的人谈话。——笛卡儿
  真正的人生，只有在经过艰难卓绝的斗争之后才能实现。——塞涅卡
  伟大的事业，需要决心，能力，组织和责任感。——易卜生
  没有人事先了解自己到底有多大的力量，直到他试过以后才知道。——歌德
  敢于浪费哪怕一个钟头时间的人，说明他还不懂得珍惜生命的全部价值。——达尔文
  感激每一个新的挑战，因为它会锻造你的意志和品格。——佚名
  共同的事业，共同的斗争，可以使人们产生忍受一切的力量。　——奥斯特洛夫斯基
  古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。——苏轼
  故立志者，为学之心也；为学者，立志之事也。——王阳明
  读一本好书，就如同和一个高尚的人在交谈。——歌德
  学习是劳动，是充满思想的劳动。——乌申斯基
  好的书籍是最贵重的珍宝。——别林斯基
  读书是易事，思索是难事，但两者缺一，便全无用处。——富兰克林
  读书是在别人思想的帮助下，建立起自己的思想。——鲁巴金
  合理安排时间，就等于节约时间。——培根
  你想成为幸福的人吗？但愿你首先学会吃得起苦。——屠格涅夫
  抛弃时间的人，时间也抛弃他。——莎士比亚
  普通人只想到如何度过时间，有才能的人设法利用时间。——叔本华
  一次失败，只是证明我们成功的决心还够坚强。——博 维
  取得成就时坚持不懈，要比遭到失败时顽强不屈更重要。——拉罗什夫科
  人的一生是短的，但如果卑劣地过这一生，就太长了。——莎士比亚
  失败是坚忍的最后考验。——俾斯麦
  不要回避苦恼和困难，挺起身来向它挑战，进而克服它。——池田大作
  那脑袋里的智慧，就像打火石里的火花一样，不去打它是不肯出来的。——莎士比亚
  最困难的事情就是认识自己。——希腊
  有勇气承担命运这才是英雄好汉。——黑塞
  最灵繁的人也看不见自己的背脊。——非洲
  阅读使人充实，会谈使人敏捷，写作使人精确。——培根
  最大的骄傲于最大的自卑都表示心灵的最软弱无力。——斯宾诺莎
  自知之明是最难得的知识。——西班牙
  勇气通往天堂，怯懦通往地狱。——塞内加
  有时候读书是一种巧妙地避开思考的方法。——赫尔普斯
  阅读一切好书如同和过去最杰出的人谈话。——笛卡儿
  越是没有本领的就越加自命不凡。——邓拓
  越是无能的人，越喜欢挑剔别人的错儿。——爱尔兰
  知人者智，自知者明。胜人者有力，自胜者强。——老子
  意志坚强的人能把世界放在手中像泥块一样任意揉捏。——歌德
  最具挑战性的挑战莫过于提升自我。——迈克尔·F·斯特利
  失败也是我需要的，它和成功对我一样有价值。——爱迪生
  一个人即使已登上顶峰，也仍要自强不息。——罗素·贝克
  最大的挑战和突破在于用人，而用人最大的突破在于信任人。——马云
  自己活着，就是为了使别人过得更美好。——雷锋
  要掌握书，莫被书掌握；要为生而读，莫为读而生。——布尔沃
  要知道对好事的称颂过于夸大，也会招来人们的反感轻蔑和嫉妒。——培根
  谁和我一样用功，谁就会和我一样成功。——莫扎特
  一切节省，归根到底都归结为时间的节省。——马克思
  意志命运往往背道而驰，决心到最后会全部推倒。——莎士比亚
  过去一切时代的精华尽在书中。——卡莱尔
  深窥自己的心，而后发觉一切的奇迹在你自己。——培根
  只有把抱怨环境的心情，化为上进的力量，才是成功的保证。——罗曼·罗兰
  知之者不如好之者，好之者不如乐之者。——孔子
  勇猛、大胆和坚定的决心能够抵得上武器的精良。——达·芬奇
  意志是一个强壮的盲人，倚靠在明眼的跛子肩上。——叔本华
  只有永远躺在泥坑里的人，才不会再掉进坑里。——黑格尔
  希望的灯一旦熄灭，生活刹那间变成了一片黑暗。——普列姆昌德
  要成功不需要什么特别的才能，只要把你能做的小事做得好就行了。——维龙
  形成天才的决定因素应该是勤奋。——郭沫若
  学到很多东西的诀窍，就是一下子不要学很多。——洛克
  自己的鞋子，自己知道紧在哪里。——西班牙
  我们唯一不会改正的缺点是软弱。——拉罗什福科
  我这个人走得很慢，但是我从不后退。——亚伯拉罕·林肯
  勿问成功的秘诀为何，且尽全力做你应该做的事吧。——美华纳
  对于不屈不挠的人来说，没有失败这回事。——俾斯麦
  学问是异常珍贵的东西，从任何源泉吸收都不可耻。——阿卜·日·法拉兹
  坚强的信念能赢得强者的心，并使他们变得更坚强。 ——白哲特
  一个人几乎可以在任何他怀有无限热忱的事情上成功。 ——查尔斯·史考伯
  卓越的人一大优点是：在不利与艰难的遭遇里百折不饶。——贝多芬
  本来无望的事，大胆尝试，往往能成功。——莎士比亚
  我们若已接受最坏的，就再没有什么损失。——卡耐基
  只有在人群中间，才能认识自己。——德国
  书籍把我们引入最美好的社会，使我们认识各个时代的伟大智者。——史美尔斯
  当一个人用工作去迎接光明，光明很快就会来照耀着他。——冯学峰
  如果你能做梦，你就能实现它。——吉格·金克拉
  `
    const str = `播主好呀，您的频道内容很棒！借贵频道分享一个免费VPN给大陆网友流畅看📺油管，谷歌商店评分4.7❤️，永久免费，不限流量。谷歌商店下载📲
  https://play.google.com/store/apps/details?id=com.stargate.vpn 
  Apkpure下载 https://apkpure.com/p/com.stargate.vpn

  `
    const dialogArray = knownDialogs.split('\n')
  
    const tmp = dialogArray[getRandomInt(0, dialogArray.length)]

    await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, 100);

    await page.waitForTimeout(1000 * getRandomInt(10, 30))

    //await page.click('ytd-subscribe-button-renderer')

    if (await page.$('#simplebox-placeholder') != null) {
      await page.type('#simplebox-placeholder', str + tmp)
      await page.waitForTimeout(1000 * getRandomInt(10, 30))
      await page.click('#submit-button')
      await page.waitForTimeout(1000 * getRandomInt(10, 30))
      saveVid(vid)
    } else {
      console.error('not found simplebox')
    }
   

    await page.goBack()
    await page.waitForTimeout(1000)
  }

}
// puppeteer.use(require('puppeteer-extra-plugin-user-data-dir')( {
//   deleteTemporary: false,
//   deleteExisting: false,
//   files: []
// }))

(async () => {
// That's it, the rest is puppeteer usage as normal 😊
  
  let browser;
  if (useLanch) {
      browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
    })
  } else {
    //const browserWSEndpoint = 'ws://127.0.0.1:9222/devtools/browser/c2d8b4f7-6bf9-47ae-8da2-a4ff6234a244';
    const browserURL = 'http://127.0.0.1:9222';
    browser = await puppeteer.connect({ browserURL });
  }
  

  
  
  const page = await browser.newPage()

  //await page.setViewport({ width: 800, height: 600 })
  
  await page.setViewport({
    width: 1000,
    height: 1500
  });


// ... puppeteer code
  const cookiesString = await fs.readFile('./cookies.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);


  for (var keyword of keywords) {
    let listUrl = 'https://www.youtube.com/results?sp=EgQIAhAB&search_query=' + encodeURI(keyword)
    await page.goto(listUrl)
    await scrollToBottom(page)
    await page.waitForSelector('ytd-thumbnail.ytd-video-renderer')
    const videos = await page.$$('ytd-thumbnail.ytd-video-renderer')
    console.log(keyword+ " list count: " + videos.length)

    for (var v of videos) {
      try {
        await autoComment(page, v)
      } catch (e) {
        console.error(e)
        await page.goBack()
      }
    }
    console.log('all videos hanlded.')

  }



})();