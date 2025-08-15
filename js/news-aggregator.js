// 混合方案新闻聚合器
class HybridNewsAggregator {
    constructor() {
        this.newsData = [];
        this.currentLanguage = 'zh-CN';
        this.apiCallCount = 0;
        this.dailyLimit = 1000;
    }

    // 混合方案获取新闻
    async fetchNews(language = 'zh-CN') {
        this.currentLanguage = language;
        const allNews = [];

        try {
            // 优先级1: 本地缓存数据
            const cachedNews = this.getCachedNews();
            if (cachedNews && cachedNews.length > 0) {
                console.log('使用缓存新闻数据');
                return cachedNews;
            }

            // 优先级2: GitHub Actions更新的JSON文件
            const githubNews = await this.fetchGithubNews();
            if (githubNews && githubNews.length > 0) {
                allNews.push(...githubNews);
            }

            // 优先级3: RSS源聚合（免费）
            const rssNews = await this.fetchRSSNews();
            if (rssNews && rssNews.length > 0) {
                allNews.push(...rssNews);
            }

            // 优先级4: Reddit API（免费）
            const redditNews = await this.fetchRedditNews();
            if (redditNews && redditNews.length > 0) {
                allNews.push(...redditNews);
            }

            // 优先级5: NewsAPI（有限制）
            if (this.canUseNewsAPI()) {
                const apiNews = await this.fetchNewsAPI();
                if (apiNews && apiNews.length > 0) {
                    allNews.push(...apiNews);
                }
            }

            // 去重和排序
            const uniqueNews = this.deduplicateNews(allNews);
            const sortedNews = this.sortNewsByDate(uniqueNews);
            
            // 缓存结果
            this.cacheNews(sortedNews);
            
            return sortedNews.slice(0, 10); // 返回最新10条

        } catch (error) {
            console.error('获取新闻失败:', error);
            return this.getDefaultNews();
        }
    }

    // 从GitHub Actions更新的数据获取
    async fetchGithubNews() {
        try {
            const response = await fetch('./data/news.json');
            if (response.ok) {
                const data = await response.json();
                const news = data[this.currentLanguage] || data['en-US'] || [];
                console.log(`从GitHub获取到 ${news.length} 条新闻`);
                return news.map(item => ({
                    ...item,
                    source: item.source + ' (GitHub)',
                    priority: 1
                }));
            }
        } catch (error) {
            console.error('GitHub新闻获取失败:', error);
        }
        return [];
    }

    // RSS源聚合
    async fetchRSSNews() {
        const rssSources = window.API_CONFIG.get('rssSources')[this.currentLanguage] || 
                          window.API_CONFIG.get('rssSources')['en-US'];
        const newsItems = [];

        for (const feedUrl of rssSources.slice(0, 2)) { // 限制RSS源数量
            try {
                const proxyUrl = window.API_CONFIG.getCorsProxyUrl(feedUrl);
                const response = await fetch(proxyUrl);
                const data = await response.json();
                
                if (data.contents) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                    const items = xmlDoc.querySelectorAll('item');
                    
                    items.forEach((item, index) => {
                        if (index < 3) { // 每个源最多3条
                            const newsItem = this.parseRSSItem(item);
                            if (newsItem && this.isRelevantNews(newsItem.title)) {
                                newsItems.push({
                                    ...newsItem,
                                    priority: 2
                                });
                            }
                        }
                    });
                }
            } catch (error) {
                console.error(`RSS源获取失败: ${feedUrl}`, error);
            }
        }

        console.log(`从RSS获取到 ${newsItems.length} 条新闻`);
        return newsItems;
    }

    // Reddit API获取
    async fetchRedditNews() {
        const subreddits = window.API_CONFIG.get('reddit').subreddits;
        const newsItems = [];
        
        for (const subreddit of subreddits.slice(0, 2)) { // 限制subreddit数量
            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=3`);
                const data = await response.json();
                
                if (data.data && data.data.children) {
                    data.data.children.forEach(post => {
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
                                url: `https://reddit.com${postData.permalink}`,
                                priority: 3
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`Reddit ${subreddit} 获取失败:`, error);
            }
        }

        console.log(`从Reddit获取到 ${newsItems.length} 条新闻`);
        return newsItems;
    }

    // NewsAPI获取（有限制）
    async fetchNewsAPI() {
        if (!this.canUseNewsAPI()) {
            console.log('NewsAPI调用次数已达限制');
            return [];
        }

        try {
            const apiKey = window.API_CONFIG.get('newsApi').apiKey;
            const language = this.getNewsAPILanguage();
            const query = 'battlefield OR "battlefield 6" OR "battlefield 2042"';
            
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'ok' && data.articles) {
                this.apiCallCount++;
                this.updateAPICallCount();
                
                const articles = data.articles.map(article => ({
                    title: article.title,
                    excerpt: article.description || '',
                    image: this.getValidImageUrl(article.urlToImage),
                    date: new Date(article.publishedAt).toISOString().split('T')[0],
                    source: article.source.name + ' (NewsAPI)',
                    category: this.categorizeNews(article.title, article.description),
                    url: article.url,
                    priority: 4
                }));

                console.log(`从NewsAPI获取到 ${articles.length} 条新闻`);
                return articles;
            }
        } catch (error) {
            console.error('NewsAPI获取失败:', error);
        }
        return [];
    }

    // 解析RSS项目
    parseRSSItem(item) {
        try {
            const title = item.querySelector('title')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            
            return {
                title: this.cleanText(title),
                excerpt: this.cleanText(description).substring(0, 150) + '...',
                image: this.extractImageFromDescription(description) || 
                       'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                date: new Date(pubDate).toISOString().split('T')[0],
                source: this.extractSourceFromLink(link),
                category: this.categorizeNews(title, description),
                url: link
            };
        } catch (error) {
            console.error('解析RSS项目失败:', error);
            return null;
        }
    }

    // 检查新闻相关性
    isRelevantNews(title) {
        const keywords = ['battlefield', 'bf6', 'dice', 'ea games', '战地', '战地风云'];
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
            const key = news.title.substring(0, 50); // 使用标题前50字符作为去重键
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    // 按日期和优先级排序
    sortNewsByDate(newsArray) {
        return newsArray.sort((a, b) => {
            // 首先按优先级排序
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // 然后按日期排序
            return new Date(b.date) - new Date(a.date);
        });
    }

    // 检查是否可以使用NewsAPI
    canUseNewsAPI() {
        const today = new Date().toDateString();
        const storedData = localStorage.getItem('newsapi_usage');
        
        if (storedData) {
            const usage = JSON.parse(storedData);
            if (usage.date === today) {
                return usage.count < this.dailyLimit;
            }
        }
        
        return true;
    }

    // 更新API调用计数
    updateAPICallCount() {
        const today = new Date().toDateString();
        const usage = {
            date: today,
            count: this.apiCallCount
        };
        localStorage.setItem('newsapi_usage', JSON.stringify(usage));
    }

    // 缓存管理
    getCachedNews() {
        try {
            const cacheKey = `bf6_news_${this.currentLanguage}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                const ttl = window.API_CONFIG.get('cache').newsDataTTL;
                if (Date.now() - data.timestamp < ttl) {
                    return data.news;
                }
            }
        } catch (error) {
            console.error('缓存读取失败:', error);
        }
        return null;
    }

    cacheNews(news) {
        try {
            const cacheKey = `bf6_news_${this.currentLanguage}`;
            const data = {
                news: news,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
            console.error('缓存保存失败:', error);
        }
    }

    // 辅助方法
    cleanText(text) {
        return text.replace(/<[^>]*>/g, '').trim();
    }

    extractImageFromDescription(description) {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        return imgMatch ? imgMatch[1] : null;
    }

    extractSourceFromLink(link) {
        try {
            const url = new URL(link);
            return url.hostname.replace('www.', '');
        } catch {
            return '未知来源';
        }
    }

    categorizeNews(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        
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

    getNewsAPILanguage() {
        const langMap = {
            'zh-CN': 'zh',
            'en-US': 'en',
            'de-DE': 'de',
            'ja-JP': 'jp',
            'ko-KR': 'kr'
        };
        return langMap[this.currentLanguage] || 'en';
    }

    // 默认新闻数据
    getDefaultNews() {
        return [
            {
                title: 'Battlefield 6 最新消息汇总',
                excerpt: '收集整理最新的游戏开发进展和社区反馈信息。',
                image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                date: new Date().toISOString().split('T')[0],
                source: '官方资讯',
                category: '游戏资讯',
                url: '#',
                priority: 5
            }
        ];
    }
}

// 导出类
window.HybridNewsAggregator = HybridNewsAggregator;