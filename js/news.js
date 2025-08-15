// 新闻聚合系统
class NewsAggregator {
    constructor() {
        this.newsData = [];
        this.currentLanguage = 'zh-CN';
        this.newsContainer = null;
        this.init();
    }

    init() {
        this.newsContainer = document.getElementById('newsGrid');
        this.loadNews();
        this.setupEventListeners();
    }

    // 混合方案：优先使用真实数据，备用模拟数据
    async loadNews() {
        try {
            // 优先级1: 从GitHub Actions生成的JSON文件加载
            const realNews = await this.loadRealNewsData();
            if (realNews && realNews.length > 0) {
                console.log('✅ 使用真实新闻数据');
                this.newsData = realNews;
                this.renderNews();
                return;
            }

            // 优先级2: 使用混合新闻聚合器
            if (window.HybridNewsAggregator) {
                const aggregator = new window.HybridNewsAggregator();
                const hybridNews = await aggregator.fetchNews(this.currentLanguage);
                if (hybridNews && hybridNews.length > 0) {
                    console.log('✅ 使用混合聚合新闻数据');
                    this.newsData = hybridNews;
                    this.renderNews();
                    return;
                }
            }

            // 备用方案: 使用模拟数据
            console.log('⚠️ 使用备用模拟数据');
            await new Promise(resolve => setTimeout(resolve, 800));
            this.newsData = this.generateMockNews();
            this.renderNews();
        } catch (error) {
            console.error('Failed to load news:', error);
            this.renderErrorState();
        }
    }

    // 加载真实新闻数据
    async loadRealNewsData() {
        try {
            const response = await fetch('./data/news.json');
            if (response.ok) {
                const data = await response.json();
                const newsForLanguage = data[this.currentLanguage] || data['en-US'] || [];
                return newsForLanguage;
            }
        } catch (error) {
            console.error('加载真实新闻数据失败:', error);
        }
        return null;
    }

    // 生成模拟新闻数据
    generateMockNews() {
        const newsTemplates = {
            'zh-CN': [
                {
                    title: 'Battlefield 6 公测第二轮即将开启',
                    excerpt: '官方宣布第二轮公测将于本周末开启，新增两张地图和多种武器配件。',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: '2025-01-15',
                    source: 'EA官方',
                    category: '游戏更新'
                },
                {
                    title: '战地6新武器系统详解',
                    excerpt: '深度解析新武器定制系统，包括配件搭配和伤害机制的重大改进。',
                    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop',
                    date: '2025-01-14',
                    source: '游戏媒体',
                    category: '攻略指南'
                },
                {
                    title: 'BF6地图设计理念揭秘',
                    excerpt: 'DICE开发团队分享了新地图的设计思路，强调环境破坏和战术多样性。',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
                    date: '2025-01-13',
                    source: '开发者访谈',
                    category: '开发日志'
                }
            ],
            'en-US': [
                {
                    title: 'Battlefield 6 Second Beta Round Coming Soon',
                    excerpt: 'Official announcement reveals the second beta test starting this weekend with two new maps and weapon attachments.',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: '2025-01-15',
                    source: 'EA Official',
                    category: 'Game Updates'
                },
                {
                    title: 'BF6 New Weapon System Breakdown',
                    excerpt: 'In-depth analysis of the new weapon customization system, including attachment combinations and damage mechanics.',
                    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop',
                    date: '2025-01-14',
                    source: 'Gaming Media',
                    category: 'Strategy Guide'
                },
                {
                    title: 'BF6 Map Design Philosophy Revealed',
                    excerpt: 'DICE development team shares insights into new map design, emphasizing environmental destruction and tactical diversity.',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
                    date: '2025-01-13',
                    source: 'Developer Interview',
                    category: 'Dev Diary'
                }
            ],
            'de-DE': [
                {
                    title: 'Battlefield 6 Zweite Beta-Runde startet bald',
                    excerpt: 'Offizielle Ankündigung der zweiten Beta-Phase am Wochenende mit zwei neuen Karten und Waffenaufsätzen.',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: '2025-01-15',
                    source: 'EA Offiziell',
                    category: 'Spiel-Updates'
                },
                {
                    title: 'BF6 Neues Waffensystem erklärt',
                    excerpt: 'Detaillierte Analyse des neuen Waffen-Anpassungssystems mit Aufsatz-Kombinationen und Schadensmechanik.',
                    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop',
                    date: '2025-01-14',
                    source: 'Gaming-Medien',
                    category: 'Strategie-Guide'
                },
                {
                    title: 'BF6 Karten-Design-Philosophie enthüllt',
                    excerpt: 'DICE-Entwicklerteam teilt Einblicke in das neue Karten-Design mit Fokus auf Umweltzerstörung.',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
                    date: '2025-01-13',
                    source: 'Entwickler-Interview',
                    category: 'Entwickler-Tagebuch'
                }
            ],
            'ja-JP': [
                {
                    title: 'Battlefield 6 第2回ベータテスト開始予定',
                    excerpt: '公式発表により、今週末に第2回ベータテストが開始され、新マップ2つと武器アタッチメントが追加されます。',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: '2025-01-15',
                    source: 'EA公式',
                    category: 'ゲーム更新'
                },
                {
                    title: 'BF6新武器システム詳細解説',
                    excerpt: '新しい武器カスタマイズシステムの詳細分析、アタッチメント組み合わせとダメージメカニクスを含む。',
                    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop',
                    date: '2025-01-14',
                    source: 'ゲームメディア',
                    category: '戦略ガイド'
                },
                {
                    title: 'BF6マップデザイン哲学が明らかに',
                    excerpt: 'DICE開発チームが新マップデザインの洞察を共有、環境破壊と戦術多様性を重視。',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
                    date: '2025-01-13',
                    source: '開発者インタビュー',
                    category: '開発日記'
                }
            ],
            'ko-KR': [
                {
                    title: 'Battlefield 6 두 번째 베타 라운드 곧 시작',
                    excerpt: '공식 발표에 따르면 이번 주말에 두 번째 베타 테스트가 시작되며 새로운 맵 2개와 무기 부착물이 추가됩니다.',
                    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                    date: '2025-01-15',
                    source: 'EA 공식',
                    category: '게임 업데이트'
                },
                {
                    title: 'BF6 새로운 무기 시스템 분석',
                    excerpt: '새로운 무기 커스터마이징 시스템의 심층 분석, 부착물 조합과 데미지 메커니즘 포함.',
                    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop',
                    date: '2025-01-14',
                    source: '게임 미디어',
                    category: '전략 가이드'
                },
                {
                    title: 'BF6 맵 디자인 철학 공개',
                    excerpt: 'DICE 개발팀이 새로운 맵 디자인에 대한 통찰을 공유, 환경 파괴와 전술 다양성을 강조.',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
                    date: '2025-01-13',
                    source: '개발자 인터뷰',
                    category: '개발 일기'
                }
            ]
        };

        return newsTemplates[this.currentLanguage] || newsTemplates['en-US'];
    }

    // 渲染新闻列表
    renderNews() {
        if (!this.newsContainer) return;

        // 添加加载动画
        this.newsContainer.innerHTML = '<div class="loading-spinner">Loading...</div>';

        setTimeout(() => {
            const newsHTML = this.newsData.map((news, index) => this.createNewsCard(news, index)).join('');
            this.newsContainer.innerHTML = newsHTML;
            
            // 添加进入动画
            this.animateNewsCards();
        }, 300);
    }

    // 创建新闻卡片HTML
    createNewsCard(news, index) {
        const formattedDate = this.formatDate(news.date);
        
        return `
            <article class="news-card" data-index="${index}">
                <div class="news-image-container">
                    <img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">
                    <div class="news-category">${news.category}</div>
                </div>
                <div class="news-content">
                    <h4 class="news-title">${news.title}</h4>
                    <p class="news-excerpt">${news.excerpt}</p>
                    <div class="news-meta">
                        <span class="news-source">${news.source}</span>
                        <span class="news-date">${formattedDate}</span>
                    </div>
                </div>
            </article>
        `;
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const dateFormats = {
            'zh-CN': {
                today: '今天',
                yesterday: '昨天',
                daysAgo: (days) => `${days}天前`
            },
            'en-US': {
                today: 'Today',
                yesterday: 'Yesterday', 
                daysAgo: (days) => `${days} days ago`
            },
            'de-DE': {
                today: 'Heute',
                yesterday: 'Gestern',
                daysAgo: (days) => `vor ${days} Tagen`
            },
            'ja-JP': {
                today: '今日',
                yesterday: '昨日',
                daysAgo: (days) => `${days}日前`
            },
            'ko-KR': {
                today: '오늘',
                yesterday: '어제',
                daysAgo: (days) => `${days}일 전`
            }
        };

        const format = dateFormats[this.currentLanguage] || dateFormats['en-US'];

        if (diffDays === 0) return format.today;
        if (diffDays === 1) return format.yesterday;
        if (diffDays < 7) return format.daysAgo(diffDays);
        
        return date.toLocaleDateString();
    }

    // 新闻卡片进入动画
    animateNewsCards() {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // 渲染错误状态
    renderErrorState() {
        if (!this.newsContainer) return;

        const errorMessages = {
            'zh-CN': '暂时无法加载新闻，请稍后再试',
            'en-US': 'Unable to load news at the moment, please try again later',
            'de-DE': 'Nachrichten können momentan nicht geladen werden, bitte versuchen Sie es später erneut',
            'ja-JP': 'ニュースを読み込めません。後でもう一度お試しください',
            'ko-KR': '뉴스를 불러올 수 없습니다. 나중에 다시 시도해주세요'
        };

        const message = errorMessages[this.currentLanguage] || errorMessages['en-US'];
        
        this.newsContainer.innerHTML = `
            <div class="news-error">
                <p>${message}</p>
                <button onclick="newsAggregator.loadNews()" class="retry-btn">重试</button>
            </div>
        `;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 语言切换时重新加载新闻
        window.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail.language;
            this.loadNews();
        });

        // 新闻卡片点击事件
        document.addEventListener('click', (event) => {
            const newsCard = event.target.closest('.news-card');
            if (newsCard) {
                const index = parseInt(newsCard.dataset.index);
                this.openNewsDetail(index);
            }
        });
    }

    // 打开新闻详情（模拟）
    openNewsDetail(index) {
        const news = this.newsData[index];
        if (!news) return;

        // 简单的模态框显示新闻详情
        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.innerHTML = `
            <div class="news-modal-content">
                <button class="news-modal-close">&times;</button>
                <img src="${news.image}" alt="${news.title}" class="news-modal-image">
                <h2 class="news-modal-title">${news.title}</h2>
                <div class="news-modal-meta">
                    <span class="news-modal-source">${news.source}</span>
                    <span class="news-modal-date">${this.formatDate(news.date)}</span>
                </div>
                <div class="news-modal-content-text">
                    <p>${news.excerpt}</p>
                    <p>这里是新闻的详细内容。在实际项目中，这里会显示完整的新闻文章内容。</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 关闭模态框事件
        modal.querySelector('.news-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // 刷新新闻
    async refreshNews() {
        await this.loadNews();
    }

    // 获取新闻统计
    getNewsStats() {
        return {
            totalNews: this.newsData.length,
            categories: [...new Set(this.newsData.map(news => news.category))],
            sources: [...new Set(this.newsData.map(news => news.source))]
        };
    }
}

// 全局实例
let newsAggregator;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    newsAggregator = new NewsAggregator();
});

// 导出给其他模块使用
window.NewsAggregator = NewsAggregator;