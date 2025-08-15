// 混合方案新闻数据更新脚本
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class HybridNewsUpdater {
    constructor() {
        this.newsData = {
            'zh-CN': [],
            'en-US': [],
            'de-DE': [],
            'ja-JP': [],
            'ko-KR': []
        };
        
        // API配置
        this.newsApiKey = process.env.NEWS_API_KEY;
        this.dailyLimit = 100; // 为GitHub Actions保留更多配额
    }

    async updateNews() {
        console.log('🚀 开始混合方案新闻数据更新...');
        
        try {
            // 获取各语言的新闻
            await this.fetchNewsForAllLanguages();
            
            // 保存到JSON文件
            this.saveNewsData();
            
            console.log('✅ 新闻数据更新完成！');
        } catch (error) {
            console.error('❌ 更新新闻时出错:', error);
            // 不退出进程，使用备用数据
            this.createFallbackData();
            this.saveNewsData();
        }
    }

    async fetchNewsForAllLanguages() {
        const languages = [
            { code: 'zh-CN', newsApiLang: 'zh', name: '中文' },
            { code: 'en-US', newsApiLang: 'en', name: 'English' },
            { code: 'de-DE', newsApiLang: 'de', name: 'Deutsch' },
            { code: 'ja-JP', newsApiLang: 'jp', name: '日本語' },
            { code: 'ko-KR', newsApiLang: 'kr', name: '한국어' }
        ];

        for (const lang of languages) {
            console.log(`📰 获取${lang.name}新闻...`);
            
            const newsItems = [];
            
            // 方案1: NewsAPI（如果有API Key且未超限）
            if (this.newsApiKey && this.canUseNewsAPI()) {
                const apiNews = await this.fetchNewsAPI(lang.newsApiLang);
                if (apiNews.length > 0) {
                    newsItems.push(...apiNews);
                    console.log(`  ✓ NewsAPI: ${apiNews.length} 条`);
                }
            }
            
            // 方案2: RSS源（免费备用）
            const rssNews = await this.fetchRSSNews(lang.code);
            if (rssNews.length > 0) {
                newsItems.push(...rssNews);
                console.log(`  ✓ RSS: ${rssNews.length} 条`);
            }
            
            // 方案3: Reddit（免费备用）
            const redditNews = await this.fetchRedditNews();
            if (redditNews.length > 0) {
                newsItems.push(...redditNews);
                console.log(`  ✓ Reddit: ${redditNews.length} 条`);
            }
            
            // 去重和排序
            const uniqueNews = this.deduplicateNews(newsItems);
            const sortedNews = uniqueNews.slice(0, 10); // 每种语言最多10条
            
            this.newsData[lang.code] = sortedNews;
            console.log(`  📊 ${lang.name}总计: ${sortedNews.length} 条新闻`);
        }
    }

    // NewsAPI获取
    async fetchNewsAPI(language) {
        if (!this.newsApiKey) {
            console.log('  ⚠️  NewsAPI Key未配置，跳过');
            return [];
        }

        try {
            const query = 'battlefield OR "battlefield 6" OR "battlefield 2042" OR "bf6"';
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: query,
                    language: language,
                    sortBy: 'publishedAt',
                    pageSize: 5,
                    apiKey: this.newsApiKey
                },
                timeout: 10000
            });

            if (response.data.status === 'ok' && response.data.articles) {
                return response.data.articles.map(article => ({
                    title: article.title,
                    excerpt: article.description || '暂无描述',
                    image: this.getValidImageUrl(article.urlToImage),
                    date: new Date(article.publishedAt).toISOString().split('T')[0],
                    source: article.source.name,
                    category: this.categorizeNews(article.title, article.description),
                    url: article.url
                }));
            }
        } catch (error) {
            console.error(`  ❌ NewsAPI获取失败 (${language}):`, error.message);
        }
        return [];
    }

    // RSS源获取
    async fetchRSSNews(languageCode) {
        const rssSources = {
            'zh-CN': [
                'https://www.gamespot.com/feeds/news/',
                'https://feeds.ign.com/ign/games-all'
            ],
            'en-US': [
                'https://www.gamespot.com/feeds/news/',
                'https://feeds.ign.com/ign/games-all',
                'https://www.polygon.com/rss/index.xml'
            ],
            'de-DE': [
                'https://www.gamestar.de/rss/news.rss'
            ],
            'ja-JP': [
                'https://www.4gamer.net/games/rss/type_news.xml'
            ],
            'ko-KR': [
                'https://www.inven.co.kr/rss/news.xml'
            ]
        };

        const sources = rssSources[languageCode] || rssSources['en-US'];
        const newsItems = [];

        for (const feedUrl of sources.slice(0, 2)) { // 限制RSS源数量
            try {
                // 注意：在GitHub Actions中，可能需要使用不同的RSS解析方法
                console.log(`  📡 尝试RSS源: ${feedUrl}`);
                
                // 这里可以添加RSS解析逻辑
                // 由于GitHub Actions环境限制，暂时跳过RSS解析
                console.log(`  ⚠️  RSS解析在GitHub Actions中暂时跳过`);
                
            } catch (error) {
                console.error(`  ❌ RSS源获取失败: ${feedUrl}`, error.message);
            }
        }

        return newsItems;
    }

    // Reddit API获取
    async fetchRedditNews() {
        const subreddits = ['battlefield', 'Battlefield6'];
        const newsItems = [];

        for (const subreddit of subreddits) {
            try {
                const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json`, {
                    params: { limit: 3 },
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Battlefield6.xyz/1.0'
                    }
                });

                if (response.data.data && response.data.data.children) {
                    response.data.data.children.forEach(post => {
                        const postData = post.data;
                        if (this.isRelevantNews(postData.title)) {
                            newsItems.push({
                                title: postData.title,
                                excerpt: postData.selftext ? 
                                        postData.selftext.substring(0, 150) + '...' : 
                                        '来自Reddit社区的热门讨论',
                                image: this.getValidImageUrl(postData.thumbnail),
                                date: new Date(postData.created_utc * 1000).toISOString().split('T')[0],
                                source: `r/${subreddit}`,
                                category: '社区讨论',
                                url: `https://reddit.com${postData.permalink}`
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`  ❌ Reddit ${subreddit} 获取失败:`, error.message);
            }
        }

        return newsItems;
    }

    // 检查新闻相关性
    isRelevantNews(title) {
        const keywords = ['battlefield', 'bf6', 'dice', 'ea', '战地', '战地风云'];
        const titleLower = title.toLowerCase();
        return keywords.some(keyword => titleLower.includes(keyword));
    }

    // 获取有效图片URL
    getValidImageUrl(url) {
        if (url && url.startsWith('http') && !url.includes('default') && !url.includes('self')) {
            return url;
        }
        return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop';
    }

    // 新闻去重
    deduplicateNews(newsArray) {
        const seen = new Set();
        return newsArray.filter(news => {
            const key = news.title.substring(0, 50);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    // 新闻分类
    categorizeNews(title, description) {
        const text = (title + ' ' + (description || '')).toLowerCase();
        
        if (text.includes('update') || text.includes('patch') || text.includes('更新')) {
            return '游戏更新';
        } else if (text.includes('guide') || text.includes('tips') || text.includes('攻略')) {
            return '攻略指南';
        } else if (text.includes('official') || text.includes('ea') || text.includes('dice') || text.includes('官方')) {
            return '官方公告';
        } else if (text.includes('community') || text.includes('reddit') || text.includes('社区')) {
            return '社区讨论';
        } else {
            return '游戏资讯';
        }
    }

    // 检查是否可以使用NewsAPI
    canUseNewsAPI() {
        // 在GitHub Actions中，我们可以更自由地使用API
        return true;
    }

    // 创建备用数据
    createFallbackData() {
        console.log('📋 创建备用新闻数据...');
        
        const fallbackNews = {
            'zh-CN': [
                {
                    title: 'Battlefield 6 最新开发进展',
                    excerpt: 'EA DICE团队持续优化游戏体验，根据玩家反馈调整武器平衡和地图设计。',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: new Date().toISOString().split('T')[0],
                    source: '官方资讯',
                    category: '游戏更新',
                    url: '#'
                }
            ],
            'en-US': [
                {
                    title: 'Battlefield 6 Latest Development Updates',
                    excerpt: 'EA DICE team continues to optimize gameplay experience based on player feedback and community input.',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: new Date().toISOString().split('T')[0],
                    source: 'Official News',
                    category: 'Game Updates',
                    url: '#'
                }
            ]
        };

        // 为其他语言复制英文内容
        ['de-DE', 'ja-JP', 'ko-KR'].forEach(lang => {
            this.newsData[lang] = fallbackNews['en-US'];
        });

        Object.assign(this.newsData, fallbackNews);
    }

    // 保存数据
    saveNewsData() {
        const dataDir = path.join(__dirname, '..', 'data');
        
        // 确保data目录存在
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // 保存新闻数据
        const newsFile = path.join(dataDir, 'news.json');
        fs.writeFileSync(newsFile, JSON.stringify(this.newsData, null, 2));
        
        console.log(`💾 新闻数据已保存到: ${newsFile}`);
        
        // 更新元数据
        const metaFile = path.join(dataDir, 'meta.json');
        const totalNews = Object.values(this.newsData).reduce((sum, arr) => sum + arr.length, 0);
        const meta = {
            lastUpdated: new Date().toISOString(),
            newsCount: totalNews,
            updateMethod: 'hybrid',
            sources: ['NewsAPI', 'Reddit', 'RSS'],
            languages: Object.keys(this.newsData)
        };
        fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
        
        console.log(`📊 总计更新 ${totalNews} 条新闻`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const updater = new HybridNewsUpdater();
    updater.updateNews();
}

module.exports = HybridNewsUpdater;