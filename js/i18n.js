// 国际化语言支持系统
class I18nManager {
    constructor() {
        this.currentLang = 'zh-CN';
        this.supportedLangs = ['zh-CN', 'en-US', 'de-DE', 'ja-JP', 'ko-KR'];
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.detectLanguage();
        this.setupLanguageSwitcher();
        this.translatePage();
    }

    // 加载所有语言翻译
    async loadTranslations() {
        this.translations = {
            'zh-CN': {
                // 导航
                'nav.home': '首页',
                'nav.servers': '服务器',
                'nav.news': '资讯',
                'nav.guides': '攻略',
                
                // 倒计时
                'countdown.title': '距离正式发售还有',
                'countdown.days': '天',
                'countdown.hours': '时',
                'countdown.minutes': '分',
                'countdown.seconds': '秒',
                'countdown.release': '2025年10月10日全球同步发售',
                'countdown.released': '🎉 游戏已正式发售！🎉',
                'countdown.buy': '立即购买',
                
                // 服务器状态
                'servers.title': '服务器状态',
                'servers.asia': '亚洲服务器',
                'servers.europe': '欧洲服务器',
                'servers.america': '美洲服务器',
                'servers.online': '在线',
                'servers.ping': '延迟',
                
                // 新闻
                'news.title': '最新资讯',
                'news.viewMore': '查看更多资讯',
                
                // 页脚
                'footer.copyright': '非官方粉丝网站',
                'footer.disclaimer': '游戏版权归 EA DICE 所有',
                
                // 语言切换
                'lang.chinese': '中文',
                'lang.english': 'English',
                'lang.german': 'Deutsch',
                'lang.japanese': '日本語',
                'lang.korean': '한국어'
            },
            
            'en-US': {
                // Navigation
                'nav.home': 'Home',
                'nav.servers': 'Servers',
                'nav.news': 'News',
                'nav.guides': 'Guides',
                
                // Countdown
                'countdown.title': 'Time Until Official Release',
                'countdown.days': 'Days',
                'countdown.hours': 'Hours',
                'countdown.minutes': 'Minutes',
                'countdown.seconds': 'Seconds',
                'countdown.release': 'Global Release: October 10, 2025',
                'countdown.released': '🎉 Game Now Available! 🎉',
                'countdown.buy': 'Buy Now',
                
                // Server Status
                'servers.title': 'Server Status',
                'servers.asia': 'Asia Servers',
                'servers.europe': 'Europe Servers',
                'servers.america': 'America Servers',
                'servers.online': 'Online',
                'servers.ping': 'Ping',
                
                // News
                'news.title': 'Latest News',
                'news.viewMore': 'View More News',
                
                // Footer
                'footer.copyright': 'Unofficial Fan Website',
                'footer.disclaimer': 'Game Copyright © EA DICE',
                
                // Language
                'lang.chinese': '中文',
                'lang.english': 'English',
                'lang.german': 'Deutsch',
                'lang.japanese': '日本語',
                'lang.korean': '한국어'
            },
            
            'de-DE': {
                // Navigation
                'nav.home': 'Startseite',
                'nav.servers': 'Server',
                'nav.news': 'Nachrichten',
                'nav.guides': 'Anleitungen',
                
                // Countdown
                'countdown.title': 'Zeit bis zur offiziellen Veröffentlichung',
                'countdown.days': 'Tage',
                'countdown.hours': 'Stunden',
                'countdown.minutes': 'Minuten',
                'countdown.seconds': 'Sekunden',
                'countdown.release': 'Weltweite Veröffentlichung: 10. Oktober 2025',
                'countdown.released': '🎉 Spiel jetzt verfügbar! 🎉',
                'countdown.buy': 'Jetzt kaufen',
                
                // Server Status
                'servers.title': 'Server-Status',
                'servers.asia': 'Asien-Server',
                'servers.europe': 'Europa-Server',
                'servers.america': 'Amerika-Server',
                'servers.online': 'Online',
                'servers.ping': 'Ping',
                
                // News
                'news.title': 'Neueste Nachrichten',
                'news.viewMore': 'Mehr Nachrichten anzeigen',
                
                // Footer
                'footer.copyright': 'Inoffizielle Fan-Website',
                'footer.disclaimer': 'Spiel Copyright © EA DICE',
                
                // Language
                'lang.chinese': '中文',
                'lang.english': 'English',
                'lang.german': 'Deutsch',
                'lang.japanese': '日本語',
                'lang.korean': '한국어'
            },
            
            'ja-JP': {
                // Navigation
                'nav.home': 'ホーム',
                'nav.servers': 'サーバー',
                'nav.news': 'ニュース',
                'nav.guides': 'ガイド',
                
                // Countdown
                'countdown.title': '正式リリースまで',
                'countdown.days': '日',
                'countdown.hours': '時間',
                'countdown.minutes': '分',
                'countdown.seconds': '秒',
                'countdown.release': '2025年10月10日 世界同時発売',
                'countdown.released': '🎉 ゲーム発売開始！🎉',
                'countdown.buy': '今すぐ購入',
                
                // Server Status
                'servers.title': 'サーバー状況',
                'servers.asia': 'アジアサーバー',
                'servers.europe': 'ヨーロッパサーバー',
                'servers.america': 'アメリカサーバー',
                'servers.online': 'オンライン',
                'servers.ping': 'Ping',
                
                // News
                'news.title': '最新ニュース',
                'news.viewMore': 'もっと見る',
                
                // Footer
                'footer.copyright': '非公式ファンサイト',
                'footer.disclaimer': 'ゲーム著作権 © EA DICE',
                
                // Language
                'lang.chinese': '中文',
                'lang.english': 'English',
                'lang.german': 'Deutsch',
                'lang.japanese': '日本語',
                'lang.korean': '한국어'
            },
            
            'ko-KR': {
                // Navigation
                'nav.home': '홈',
                'nav.servers': '서버',
                'nav.news': '뉴스',
                'nav.guides': '가이드',
                
                // Countdown
                'countdown.title': '정식 출시까지',
                'countdown.days': '일',
                'countdown.hours': '시간',
                'countdown.minutes': '분',
                'countdown.seconds': '초',
                'countdown.release': '2025년 10월 10일 전 세계 동시 출시',
                'countdown.released': '🎉 게임 출시! 🎉',
                'countdown.buy': '지금 구매',
                
                // Server Status
                'servers.title': '서버 상태',
                'servers.asia': '아시아 서버',
                'servers.europe': '유럽 서버',
                'servers.america': '미주 서버',
                'servers.online': '온라인',
                'servers.ping': '핑',
                
                // News
                'news.title': '최신 뉴스',
                'news.viewMore': '더 많은 뉴스 보기',
                
                // Footer
                'footer.copyright': '비공식 팬 사이트',
                'footer.disclaimer': '게임 저작권 © EA DICE',
                
                // Language
                'lang.chinese': '中文',
                'lang.english': 'English',
                'lang.german': 'Deutsch',
                'lang.japanese': '日本語',
                'lang.korean': '한국어'
            }
        };
    }

    // 检测用户语言（IP地址 + 浏览器语言）
    async detectLanguage() {
        // 首先检查本地存储的语言设置
        const savedLang = localStorage.getItem('battlefield6-lang');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
            return;
        }

        try {
            // 尝试通过IP地址检测国家
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;
            
            // 根据国家代码设置语言
            const countryLangMap = {
                'CN': 'zh-CN',
                'TW': 'zh-CN',
                'HK': 'zh-CN',
                'US': 'en-US',
                'GB': 'en-US',
                'CA': 'en-US',
                'AU': 'en-US',
                'DE': 'de-DE',
                'AT': 'de-DE',
                'CH': 'de-DE',
                'JP': 'ja-JP',
                'KR': 'ko-KR'
            };
            
            if (countryLangMap[countryCode]) {
                this.currentLang = countryLangMap[countryCode];
                return;
            }
        } catch (error) {
            console.log('IP detection failed, using browser language');
        }

        // 如果IP检测失败，使用浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase();
        
        if (langCode.startsWith('zh')) {
            this.currentLang = 'zh-CN';
        } else if (langCode.startsWith('en')) {
            this.currentLang = 'en-US';
        } else if (langCode.startsWith('de')) {
            this.currentLang = 'de-DE';
        } else if (langCode.startsWith('ja')) {
            this.currentLang = 'ja-JP';
        } else if (langCode.startsWith('ko')) {
            this.currentLang = 'ko-KR';
        } else {
            this.currentLang = 'en-US'; // 默认英语
        }
    }

    // 设置语言切换器
    setupLanguageSwitcher() {
        const langSwitcher = document.getElementById('langSwitcher');
        if (!langSwitcher) return;

        // 更新当前语言显示
        this.updateLanguageSwitcher();

        // 绑定切换事件
        langSwitcher.addEventListener('change', (e) => {
            this.switchLanguage(e.target.value);
        });
    }

    // 更新语言切换器显示
    updateLanguageSwitcher() {
        const langSwitcher = document.getElementById('langSwitcher');
        if (langSwitcher) {
            langSwitcher.value = this.currentLang;
        }
    }

    // 切换语言
    switchLanguage(langCode) {
        if (!this.supportedLangs.includes(langCode)) return;
        
        this.currentLang = langCode;
        localStorage.setItem('battlefield6-lang', langCode);
        
        this.translatePage();
        this.updateLanguageSwitcher();
        
        // 更新HTML lang属性
        document.documentElement.lang = langCode;
        
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: langCode }
        }));
    }

    // 翻译页面
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // 更新页面标题和meta描述
        this.updatePageMeta();
    }

    // 获取翻译文本
    getTranslation(key) {
        const langData = this.translations[this.currentLang];
        return langData ? langData[key] : key;
    }

    // 更新页面元数据
    updatePageMeta() {
        const titles = {
            'zh-CN': 'Battlefield 6 - 战地风云6官方倒计时 | 发售时间、服务器状态',
            'en-US': 'Battlefield 6 - Official Countdown | Release Date & Server Status',
            'de-DE': 'Battlefield 6 - Offizieller Countdown | Veröffentlichungsdatum & Server-Status',
            'ja-JP': 'Battlefield 6 - 公式カウントダウン | 発売日・サーバー状況',
            'ko-KR': 'Battlefield 6 - 공식 카운트다운 | 출시일 및 서버 상태'
        };

        const descriptions = {
            'zh-CN': 'Battlefield 6战地风云6官方发售倒计时，实时服务器状态监控，最新游戏资讯聚合。2025年10月10日正式发售！',
            'en-US': 'Official Battlefield 6 release countdown, real-time server status monitoring, latest game news aggregation. Official release October 10, 2025!',
            'de-DE': 'Offizieller Battlefield 6 Veröffentlichungs-Countdown, Echtzeit-Server-Status-Überwachung, neueste Spiel-News-Aggregation. Offizielle Veröffentlichung 10. Oktober 2025!',
            'ja-JP': 'Battlefield 6公式発売カウントダウン、リアルタイムサーバー状況監視、最新ゲームニュース集約。2025年10月10日正式発売！',
            'ko-KR': 'Battlefield 6 공식 출시 카운트다운, 실시간 서버 상태 모니터링, 최신 게임 뉴스 집계. 2025년 10월 10일 정식 출시!'
        };

        document.title = titles[this.currentLang] || titles['en-US'];
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = descriptions[this.currentLang] || descriptions['en-US'];
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return this.supportedLangs;
    }
}

// 全局实例
let i18nManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    i18nManager = new I18nManager();
});

// 导出给其他模块使用
window.I18nManager = I18nManager;