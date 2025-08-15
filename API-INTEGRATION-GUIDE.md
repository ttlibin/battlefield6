# 🔄 真实API集成指南

本指南详细说明如何将网站中的模拟数据替换为真实API数据源。

## 📊 服务器状态数据替换

### 1. Steam API集成

**获取Steam API Key：**
1. 访问 https://steamcommunity.com/dev/apikey
2. 注册Steam开发者账号
3. 获取API密钥

**替换代码位置：** `js/servers.js` 中的 `fetchServerData()` 方法

```javascript
// 替换现有的模拟数据方法
async fetchServerData(serverKey) {
    try {
        // Steam API调用
        const steamApiKey = 'YOUR_STEAM_API_KEY';
        const appId = '2807960'; // Battlefield 6的Steam App ID
        
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}&key=${steamApiKey}`);
        const data = await response.json();
        
        if (data.response && data.response.player_count) {
            const totalPlayers = data.response.player_count;
            
            // 根据地区分配玩家数量
            const regionDistribution = {
                asia: 0.35,    // 35%
                europe: 0.30,  // 30%
                america: 0.35  // 35%
            };
            
            const players = Math.floor(totalPlayers * regionDistribution[serverKey]);
            
            return {
                players: players,
                ping: await this.measurePing(serverKey),
                status: players > 100 ? 'online' : 'maintenance'
            };
        }
    } catch (error) {
        console.error('Steam API调用失败:', error);
        return this.getDefaultServerData(serverKey);
    }
}

// 添加延迟测量方法
async measurePing(serverKey) {
    const pingEndpoints = {
        asia: 'https://asia-ping.battlefield6.xyz/ping',
        europe: 'https://europe-ping.battlefield6.xyz/ping',
        america: 'https://america-ping.battlefield6.xyz/ping'
    };
    
    try {
        const startTime = Date.now();
        await fetch(pingEndpoints[serverKey], { method: 'HEAD', mode: 'no-cors' });
        const endTime = Date.now();
        return endTime - startTime;
    } catch (error) {
        // 返回估算延迟
        const estimatedPing = { asia: 25, europe: 45, america: 35 };
        return estimatedPing[serverKey] || 50;
    }
}
```

### 2. 第三方游戏服务器API

**推荐服务：**
- **GameTracker API** - https://www.gametracker.com/
- **Battlemetrics API** - https://www.battlemetrics.com/
- **GameDig** - https://github.com/gamedig/node-gamedig

**示例集成：**
```javascript
async fetchThirdPartyData(serverKey) {
    try {
        const response = await fetch(`https://api.battlemetrics.com/servers?filter[game]=battlefield6&filter[region]=${serverKey}`, {
            headers: {
                'Authorization': 'Bearer YOUR_BATTLEMETRICS_TOKEN'
            }
        });
        
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const server = data.data[0];
            return {
                players: server.attributes.players,
                ping: server.attributes.ping,
                status: server.attributes.status
            };
        }
    } catch (error) {
        console.error('第三方API调用失败:', error);
    }
    return null;
}
```

## 📰 新闻数据API替换

### 1. RSS源聚合

**替换代码位置：** `js/news.js` 中的 `generateMockNews()` 方法

```javascript
// 替换现有的模拟新闻生成方法
async generateMockNews() {
    try {
        // 方案1: RSS源聚合
        const rssNews = await this.fetchRSSNews();
        if (rssNews && rssNews.length > 0) return rssNews;
        
        // 方案2: 新闻API
        const apiNews = await this.fetchNewsAPI();
        if (apiNews && apiNews.length > 0) return apiNews;
        
        // 方案3: Reddit API
        const redditNews = await this.fetchRedditNews();
        if (redditNews && redditNews.length > 0) return redditNews;
        
        // 备用方案
        return this.getDefaultNews();
    } catch (error) {
        console.error('获取新闻失败:', error);
        return this.getDefaultNews();
    }
}

// RSS源聚合方法
async fetchRSSNews() {
    const rssFeeds = {
        'zh-CN': [
            'https://www.ea.com/zh-cn/games/battlefield/rss',
            'https://www.gamespot.com/feeds/news/'
        ],
        'en-US': [
            'https://www.ea.com/games/battlefield/rss',
            'https://feeds.ign.com/ign/games-all'
        ]
        // 添加更多语言的RSS源...
    };

    const feeds = rssFeeds[this.currentLanguage] || rssFeeds['en-US'];
    const newsItems = [];

    for (const feedUrl of feeds) {
        try {
            // 使用CORS代理
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                items.forEach((item, index) => {
                    if (index < 5) {
                        const newsItem = this.parseRSSItem(item);
                        if (newsItem) newsItems.push(newsItem);
                    }
                });
            }
        } catch (error) {
            console.error(`RSS源获取失败: ${feedUrl}`, error);
        }
    }

    return newsItems.slice(0, 10);
}
```

### 2. NewsAPI.org集成

**获取API Key：**
1. 访问 https://newsapi.org/
2. 注册免费账号
3. 获取API密钥

```javascript
async fetchNewsAPI() {
    try {
        const apiKey = 'YOUR_NEWS_API_KEY';
        const language = this.getNewsAPILanguage();
        const query = 'battlefield OR "battlefield 6"';
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
            return data.articles.map(article => ({
                title: article.title,
                excerpt: article.description || '',
                image: article.urlToImage || 'default-image.jpg',
                date: new Date(article.publishedAt).toISOString().split('T')[0],
                source: article.source.name,
                category: this.categorizeNews(article.title, article.description),
                url: article.url
            }));
        }
    } catch (error) {
        console.error('NewsAPI获取失败:', error);
    }
    return null;
}
```

### 3. Reddit API集成

```javascript
async fetchRedditNews() {
    try {
        const subreddits = ['battlefield', 'Battlefield6', 'battlefield2042'];
        const newsItems = [];
        
        for (const subreddit of subreddits) {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`);
            const data = await response.json();
            
            if (data.data && data.data.children) {
                data.data.children.forEach(post => {
                    const postData = post.data;
                    newsItems.push({
                        title: postData.title,
                        excerpt: postData.selftext ? postData.selftext.substring(0, 150) + '...' : '来自Reddit社区的讨论',
                        image: postData.thumbnail && postData.thumbnail.startsWith('http') ? 
                               postData.thumbnail : 'default-image.jpg',
                        date: new Date(postData.created_utc * 1000).toISOString().split('T')[0],
                        source: `r/${subreddit}`,
                        category: '社区讨论',
                        url: `https://reddit.com${postData.permalink}`
                    });
                });
            }
        }
        
        return newsItems.slice(0, 8);
    } catch (error) {
        console.error('Reddit新闻获取失败:', error);
    }
    return null;
}
```

## 🔧 环境变量配置

### 1. 创建环境配置文件

创建 `js/config.js` 文件：

```javascript
// API配置文件
const API_CONFIG = {
    // Steam API
    STEAM_API_KEY: process.env.STEAM_API_KEY || 'your-steam-api-key',
    STEAM_APP_ID: '2807960',
    
    // News API
    NEWS_API_KEY: process.env.NEWS_API_KEY || 'your-news-api-key',
    
    // Battlemetrics API
    BATTLEMETRICS_TOKEN: process.env.BATTLEMETRICS_TOKEN || 'your-battlemetrics-token',
    
    // CORS代理
    CORS_PROXY: 'https://api.allorigins.win/get?url=',
    
    // 服务器端点
    SERVER_ENDPOINTS: {
        asia: 'asia.battlefield6.xyz',
        europe: 'europe.battlefield6.xyz',
        america: 'america.battlefield6.xyz'
    }
};

// 导出配置
window.API_CONFIG = API_CONFIG;
```

### 2. GitHub Actions环境变量

在GitHub仓库设置中添加以下Secrets：

```yaml
# .github/workflows/deploy.yml 中使用
env:
  STEAM_API_KEY: ${{ secrets.STEAM_API_KEY }}
  NEWS_API_KEY: ${{ secrets.NEWS_API_KEY }}
  BATTLEMETRICS_TOKEN: ${{ secrets.BATTLEMETRICS_TOKEN }}
```

## 🚀 自动化数据更新

### 1. 更新GitHub Actions脚本

修改 `scripts/update-news.js`：

```javascript
const axios = require('axios');
const fs = require('fs');

class NewsUpdater {
    constructor() {
        this.apiKey = process.env.NEWS_API_KEY;
    }

    async updateNews() {
        console.log('开始更新新闻数据...');
        
        const languages = ['zh', 'en', 'de', 'ja', 'kr'];
        const newsData = {};
        
        for (const lang of languages) {
            try {
                const response = await axios.get(`https://newsapi.org/v2/everything`, {
                    params: {
                        q: 'battlefield OR "battlefield 6"',
                        language: lang,
                        sortBy: 'publishedAt',
                        pageSize: 10,
                        apiKey: this.apiKey
                    }
                });
                
                if (response.data.status === 'ok') {
                    newsData[this.mapLanguageCode(lang)] = response.data.articles.map(article => ({
                        title: article.title,
                        excerpt: article.description || '',
                        image: article.urlToImage || '',
                        date: new Date(article.publishedAt).toISOString().split('T')[0],
                        source: article.source.name,
                        category: this.categorizeNews(article.title),
                        url: article.url
                    }));
                }
            } catch (error) {
                console.error(`获取${lang}新闻失败:`, error.message);
            }
        }
        
        // 保存到data目录
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data');
        }
        
        fs.writeFileSync('./data/news.json', JSON.stringify(newsData, null, 2));
        console.log('新闻数据更新完成！');
    }
    
    mapLanguageCode(code) {
        const mapping = {
            'zh': 'zh-CN',
            'en': 'en-US',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'kr': 'ko-KR'
        };
        return mapping[code] || 'en-US';
    }
    
    categorizeNews(title) {
        const text = title.toLowerCase();
        if (text.includes('update') || text.includes('patch')) return '游戏更新';
        if (text.includes('guide') || text.includes('tips')) return '攻略指南';
        if (text.includes('official') || text.includes('ea')) return '官方公告';
        return '游戏资讯';
    }
}

if (require.main === module) {
    const updater = new NewsUpdater();
    updater.updateNews();
}
```

### 2. 服务器数据更新脚本

创建 `scripts/update-servers.js`：

```javascript
const axios = require('axios');
const fs = require('fs');

class ServerUpdater {
    constructor() {
        this.steamApiKey = process.env.STEAM_API_KEY;
        this.appId = '2807960';
    }

    async updateServerData() {
        console.log('开始更新服务器数据...');
        
        try {
            const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/`, {
                params: {
                    appid: this.appId,
                    key: this.steamApiKey
                }
            });
            
            if (response.data.response) {
                const totalPlayers = response.data.response.player_count;
                
                const serverData = {
                    timestamp: new Date().toISOString(),
                    totalPlayers: totalPlayers,
                    regions: {
                        asia: Math.floor(totalPlayers * 0.35),
                        europe: Math.floor(totalPlayers * 0.30),
                        america: Math.floor(totalPlayers * 0.35)
                    }
                };
                
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                
                fs.writeFileSync('./data/servers.json', JSON.stringify(serverData, null, 2));
                console.log('服务器数据更新完成！');
            }
        } catch (error) {
            console.error('更新服务器数据失败:', error.message);
        }
    }
}

if (require.main === module) {
    const updater = new ServerUpdater();
    updater.updateServerData();
}
```

## 📱 CORS问题解决方案

### 1. 使用CORS代理服务

**免费CORS代理：**
- https://api.allorigins.win/
- https://cors-anywhere.herokuapp.com/
- https://api.codetabs.com/v1/proxy/

**使用示例：**
```javascript
const proxyUrl = 'https://api.allorigins.win/get?url=';
const targetUrl = 'https://api.example.com/data';
const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
```

### 2. 服务器端代理

如果需要更稳定的解决方案，可以创建自己的代理服务：

```javascript
// Cloudflare Workers代理示例
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get('url')
    
    if (!targetUrl) {
        return new Response('Missing url parameter', { status: 400 })
    }
    
    const response = await fetch(targetUrl, {
        headers: {
            'User-Agent': 'Battlefield6.xyz/1.0'
        }
    })
    
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    
    return newResponse
}
```

## 🔍 测试和调试

### 1. API测试脚本

创建 `test-apis.html` 用于测试API连接：

```html
<!DOCTYPE html>
<html>
<head>
    <title>API测试</title>
</head>
<body>
    <h1>API连接测试</h1>
    <div id="results"></div>
    
    <script>
        async function testAPIs() {
            const results = document.getElementById('results');
            
            // 测试Steam API
            try {
                const steamResponse = await fetch('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=2807960&key=YOUR_KEY');
                const steamData = await steamResponse.json();
                results.innerHTML += `<p>Steam API: ✅ ${steamData.response.player_count} 玩家在线</p>`;
            } catch (error) {
                results.innerHTML += `<p>Steam API: ❌ ${error.message}</p>`;
            }
            
            // 测试NewsAPI
            try {
                const newsResponse = await fetch('https://newsapi.org/v2/everything?q=battlefield&apiKey=YOUR_KEY');
                const newsData = await newsResponse.json();
                results.innerHTML += `<p>News API: ✅ 找到 ${newsData.articles.length} 条新闻</p>`;
            } catch (error) {
                results.innerHTML += `<p>News API: ❌ ${error.message}</p>`;
            }
        }
        
        testAPIs();
    </script>
</body>
</html>
```

### 2. 错误处理和日志

```javascript
// 添加详细的错误处理和日志
class APILogger {
    static log(message, data = null) {
        console.log(`[${new Date().toISOString()}] ${message}`, data);
    }
    
    static error(message, error = null) {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
        
        // 可选：发送错误到监控服务
        if (window.gtag) {
            gtag('event', 'api_error', {
                'error_message': message,
                'error_details': error?.message || 'Unknown error'
            });
        }
    }
}

// 在API调用中使用
try {
    APILogger.log('开始获取服务器数据');
    const data = await fetchServerData();
    APILogger.log('服务器数据获取成功', data);
} catch (error) {
    APILogger.error('服务器数据获取失败', error);
}
```

## 📋 实施检查清单

### ✅ 准备工作
- [ ] 获取Steam API Key
- [ ] 获取NewsAPI Key  
- [ ] 选择CORS代理服务
- [ ] 设置GitHub Secrets

### ✅ 代码修改
- [ ] 替换服务器数据获取方法
- [ ] 替换新闻数据获取方法
- [ ] 添加错误处理机制
- [ ] 创建配置文件

### ✅ 测试验证
- [ ] 测试API连接
- [ ] 验证数据格式
- [ ] 检查错误处理
- [ ] 测试自动更新

### ✅ 部署配置
- [ ] 更新GitHub Actions
- [ ] 配置环境变量
- [ ] 测试自动部署
- [ ] 监控API使用量

## 💡 最佳实践建议

1. **API限制管理**：注意各API的调用限制，合理设置更新频率
2. **缓存策略**：实施适当的缓存机制，减少API调用次数
3. **备用方案**：始终准备备用数据源，确保网站稳定运行
4. **监控告警**：设置API调用失败的监控和告警机制
5. **数据验证**：对API返回的数据进行验证和清理
6. **用户体验**：在数据加载时显示适当的加载状态

通过以上步骤，你就可以将网站从模拟数据完全转换为真实API数据驱动的动态网站了！