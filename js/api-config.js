// 混合方案API配置文件
class APIConfig {
    constructor() {
        // API配置
        this.config = {
            // Steam API配置
            steam: {
                apiKey: 'YOUR_STEAM_API_KEY', // 需要替换为真实API Key
                appId: '2807960',
                enabled: true
            },
            
            // NewsAPI配置
            newsApi: {
                apiKey: 'YOUR_NEWS_API_KEY', // 需要替换为真实API Key
                dailyLimit: 1000,
                enabled: true
            },
            
            // CORS代理配置
            corsProxy: 'https://api.allorigins.win/get?url=',
            
            // RSS源配置
            rssSources: {
                'zh-CN': [
                    'https://www.ea.com/zh-cn/games/battlefield/news.rss',
                    'https://www.gamespot.com/feeds/news/',
                    'https://www.ign.com/articles?tags=battlefield'
                ],
                'en-US': [
                    'https://www.ea.com/games/battlefield/news.rss',
                    'https://feeds.ign.com/ign/games-all',
                    'https://www.gamespot.com/feeds/news/'
                ],
                'de-DE': [
                    'https://www.ea.com/de-de/games/battlefield/news.rss',
                    'https://www.gamestar.de/rss/news.rss'
                ],
                'ja-JP': [
                    'https://www.ea.com/ja-jp/games/battlefield/news.rss',
                    'https://www.4gamer.net/games/rss/type_news.xml'
                ],
                'ko-KR': [
                    'https://www.ea.com/ko-kr/games/battlefield/news.rss',
                    'https://www.inven.co.kr/rss/news.xml'
                ]
            },
            
            // Reddit配置
            reddit: {
                subreddits: ['battlefield', 'Battlefield6', 'battlefield2042'],
                enabled: true
            },
            
            // 缓存配置
            cache: {
                serverDataTTL: 5 * 60 * 1000,    // 5分钟
                newsDataTTL: 30 * 60 * 1000,     // 30分钟
                enabled: true
            }
        };
    }

    // 获取配置
    get(key) {
        return this.config[key];
    }

    // 设置配置
    set(key, value) {
        this.config[key] = value;
    }

    // 检查API是否可用
    isEnabled(apiName) {
        return this.config[apiName]?.enabled || false;
    }

    // 获取CORS代理URL
    getCorsProxyUrl(targetUrl) {
        return this.config.corsProxy + encodeURIComponent(targetUrl);
    }
}

// 全局配置实例
window.API_CONFIG = new APIConfig();

// 导出配置类
window.APIConfig = APIConfig;