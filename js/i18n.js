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

                // 游戏区
                'game.playOnline': '在线试玩',
                'game.fallback': '如果上方游戏无法加载，请点击',
                'game.playNow': '直接开始游戏',
                'game.controls.title': '操作说明',
                'game.controls.move': '移动',
                'game.controls.aim': '瞄准',
                'game.controls.shoot': '射击',
                'game.controls.weapons': '武器',
                'game.controls.skills': '技能',
                'game.controls.pickup': '拾取',
                'game.controls.crouch': '蹲下',
                'game.controls.jump': '跳跃',
                'game.controls.run': '奔跑',
                                'game.controls.pause': '暂停/设置',

                // 游戏介绍
                'gameIntro.title': '战地风云6：次世代战场体验',
                'gameIntro.release.title': '发售信息',
                'gameIntro.release.date': '发售日期',
                'gameIntro.release.dateDetail': '2025年10月10日全球同步发售',
                'gameIntro.release.status': '当前状态',
                'gameIntro.release.statusDetail': 'Beta测试已结束，正式版即将到来',
                'gameIntro.release.platforms': '支持平台',
                'gameIntro.release.platformsDetail': 'PC、PlayStation 5、Xbox Series X/S',
                'gameIntro.features.title': '核心特色',
                'gameIntro.features.combat.title': '动觉战斗系统',
                'gameIntro.features.combat.desc': '全新的机动性设计，支持滑铲、攀爬、悬挂射击，武器可架设在墙面或载具上以提高精准度。',
                'gameIntro.features.players.title': '128人超大战场',
                'gameIntro.features.players.desc': '支持128名玩家同时在线对战（PC及新世代主机），带来前所未有的大规模战斗体验。',
                'gameIntro.features.destruction.title': '升级破坏系统',
                'gameIntro.features.destruction.desc': '建筑可逐层摧毁，坦克穿墙、炸塌楼板实现立体突袭，每一次爆炸都改变战场格局。',
                'gameIntro.features.weather.title': '动态天气系统',
                'gameIntro.features.weather.desc': '随机天气事件包括龙卷风、沙尘暴、火箭发射等，为战斗增添更多策略性变化。',
                'gameIntro.modes.title': '游戏模式',
                'gameIntro.modes.warfare.title': '全面战争',
                'gameIntro.modes.warfare.desc': '经典64v64征服和突破模式，体验大规模团队作战的震撼。',
                'gameIntro.modes.portal.title': '战地门户2.0',
                'gameIntro.modes.portal.desc': '支持玩家自建服务器，可跨时代调用经典武器与载具，创造独特战斗体验。',
                'gameIntro.modes.battleroyale.title': '大逃杀模式',
                'gameIntro.modes.battleroyale.desc': '150人大逃杀，创新监察系统让被淘汰玩家可继续以无人机协助队友。',
                'gameIntro.modes.campaign.title': '单人战役',
                'gameIntro.modes.campaign.desc': '2027年背景设定，开放式沙盒关卡，双线叙事体验美俄特种部队的故事。',
                'gameIntro.tech.title': '技术规格',
                'gameIntro.tech.engine': '游戏引擎',
                'gameIntro.tech.engineDetail': 'Frostbite Engine (最新版本)',
                'gameIntro.tech.maxPlayers': '最大玩家数',
                'gameIntro.tech.maxPlayersDetail': '128人 (PC/新世代主机)',
                'gameIntro.tech.weapons': '武器系统',
                'gameIntro.tech.weaponsDetail': '40+主武器，包含智能步枪、磁轨狙击等',
                'gameIntro.tech.maps': '首发地图',
                'gameIntro.tech.mapsDetail': '4张大型地图：纽约、加州、极地、沙漠',

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

                // Game
                'game.playOnline': 'Play Online',
                'game.fallback': 'If the game above fails to load, click',
                'game.playNow': 'Play Now',
                'game.controls.title': 'Controls',
                'game.controls.move': 'Move',
                'game.controls.aim': 'Aim',
                'game.controls.shoot': 'Shoot',
                'game.controls.weapons': 'Weapons',
                'game.controls.skills': 'Skills',
                'game.controls.pickup': 'Pick Up',
                'game.controls.crouch': 'Crouch',
                'game.controls.jump': 'Jump',
                'game.controls.run': 'Run',
                'game.controls.pause': 'Pause/Settings',

                // Game Introduction
                'gameIntro.title': 'Battlefield 6: Next-Gen Warfare Experience',
                'gameIntro.release.title': 'Release Information',
                'gameIntro.release.date': 'Release Date',
                'gameIntro.release.dateDetail': 'Global release on October 10, 2025',
                'gameIntro.release.status': 'Current Status',
                'gameIntro.release.statusDetail': 'Beta testing completed, official version coming soon',
                'gameIntro.release.platforms': 'Supported Platforms',
                'gameIntro.release.platformsDetail': 'PC, PlayStation 5, Xbox Series X/S',
                'gameIntro.features.title': 'Core Features',
                'gameIntro.features.combat.title': 'Kinetic Combat System',
                'gameIntro.features.combat.desc': 'Enhanced mobility with sliding, climbing, hanging shooting, and weapon mounting on walls or vehicles for improved accuracy.',
                'gameIntro.features.players.title': '128-Player Massive Battles',
                'gameIntro.features.players.desc': 'Support for 128 simultaneous players (PC and next-gen consoles), delivering unprecedented large-scale combat experience.',
                'gameIntro.features.destruction.title': 'Advanced Destruction System',
                'gameIntro.features.destruction.desc': 'Buildings can be destroyed layer by layer, tanks can break through walls and collapse floors for tactical advantages.',
                'gameIntro.features.weather.title': 'Dynamic Weather System',
                'gameIntro.features.weather.desc': 'Random weather events including tornadoes, sandstorms, rocket launches adding strategic depth to combat.',
                'gameIntro.modes.title': 'Game Modes',
                'gameIntro.modes.warfare.title': 'All-Out Warfare',
                'gameIntro.modes.warfare.desc': 'Classic 64v64 Conquest and Breakthrough modes for massive team combat experience.',
                'gameIntro.modes.portal.title': 'Battlefield Portal 2.0',
                'gameIntro.modes.portal.desc': 'Player-hosted servers with cross-era weapons and vehicles from classic Battlefield games.',
                'gameIntro.modes.battleroyale.title': 'Battle Royale',
                'gameIntro.modes.battleroyale.desc': '150-player battle royale with innovative spectator system allowing eliminated players to assist teammates as drones.',
                'gameIntro.modes.campaign.title': 'Single Player Campaign',
                'gameIntro.modes.campaign.desc': 'Set in 2027 with open sandbox levels and dual narrative following US and Russian special forces.',
                'gameIntro.tech.title': 'Technical Specifications',
                'gameIntro.tech.engine': 'Game Engine',
                'gameIntro.tech.engineDetail': 'Frostbite Engine (Latest Version)',
                'gameIntro.tech.maxPlayers': 'Max Players',
                'gameIntro.tech.maxPlayersDetail': '128 players (PC/Next-gen consoles)',
                'gameIntro.tech.weapons': 'Weapon System',
                'gameIntro.tech.weaponsDetail': '40+ primary weapons including smart rifles, railgun snipers',
                'gameIntro.tech.maps': 'Launch Maps',
                'gameIntro.tech.mapsDetail': '4 large maps: New York, California, Arctic, Desert',
                
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

                // Spiel
                'game.playOnline': 'Online spielen',
                'game.fallback': 'Wenn das Spiel oben nicht lädt, klicken Sie auf',
                'game.playNow': 'Jetzt spielen',
                'game.controls.title': 'Steuerung',
                'game.controls.move': 'Bewegen',
                'game.controls.aim': 'Zielen',
                'game.controls.shoot': 'Schießen',
                'game.controls.weapons': 'Waffen',
                'game.controls.skills': 'Fähigkeiten',
                'game.controls.pickup': 'Aufheben',
                'game.controls.crouch': 'Ducken',
                'game.controls.jump': 'Springen',
                'game.controls.run': 'Laufen',
                                'game.controls.pause': 'Pause/Einstellungen',

                // Game Introduction
                'gameIntro.title': 'Battlefield 6: Next-Gen Kriegsführung',
                'gameIntro.release.title': 'Veröffentlichungsinfo',
                'gameIntro.release.date': 'Veröffentlichungsdatum',
                'gameIntro.release.dateDetail': 'Weltweite Veröffentlichung am 10. Oktober 2025',
                'gameIntro.release.status': 'Aktueller Status',
                'gameIntro.release.statusDetail': 'Beta-Test abgeschlossen, offizielle Version kommt bald',
                'gameIntro.release.platforms': 'Unterstützte Plattformen',
                'gameIntro.release.platformsDetail': 'PC, PlayStation 5, Xbox Series X/S',
                'gameIntro.features.title': 'Kernfunktionen',
                'gameIntro.features.combat.title': 'Kinetisches Kampfsystem',
                'gameIntro.features.combat.desc': 'Verbesserte Mobilität mit Rutschen, Klettern, hängendem Schießen und Waffenmontage an Wänden oder Fahrzeugen.',
                'gameIntro.features.players.title': '128-Spieler Massive Schlachten',
                'gameIntro.features.players.desc': 'Unterstützung für 128 gleichzeitige Spieler (PC und Next-Gen-Konsolen) für beispiellose Großkampferfahrung.',
                'gameIntro.features.destruction.title': 'Erweiterte Zerstörung',
                'gameIntro.features.destruction.desc': 'Gebäude können schichtweise zerstört werden, Panzer durchbrechen Wände für taktische Vorteile.',
                'gameIntro.features.weather.title': 'Dynamisches Wettersystem',
                'gameIntro.features.weather.desc': 'Zufällige Wetterereignisse wie Tornados, Sandstürme, Raketenstarts für strategische Tiefe.',
                'gameIntro.modes.title': 'Spielmodi',
                'gameIntro.modes.warfare.title': 'Totale Kriegsführung',
                'gameIntro.modes.warfare.desc': 'Klassische 64v64 Eroberungs- und Durchbruchmodi für massive Teamkämpfe.',
                'gameIntro.modes.portal.title': 'Battlefield Portal 2.0',
                'gameIntro.modes.portal.desc': 'Spieler-gehostete Server mit zeitübergreifenden Waffen und Fahrzeugen aus klassischen Battlefield-Spielen.',
                'gameIntro.modes.battleroyale.title': 'Battle Royale',
                'gameIntro.modes.battleroyale.desc': '150-Spieler Battle Royale mit innovativem Zuschauersystem für ausgeschiedene Spieler.',
                'gameIntro.modes.campaign.title': 'Einzelspieler-Kampagne',
                'gameIntro.modes.campaign.desc': 'Spielt 2027 mit offenen Sandbox-Leveln und dualer Erzählung über US- und russische Spezialeinheiten.',
                'gameIntro.tech.title': 'Technische Spezifikationen',
                'gameIntro.tech.engine': 'Game Engine',
                'gameIntro.tech.engineDetail': 'Frostbite Engine (Neueste Version)',
                'gameIntro.tech.maxPlayers': 'Max. Spieler',
                'gameIntro.tech.maxPlayersDetail': '128 Spieler (PC/Next-Gen-Konsolen)',
                'gameIntro.tech.weapons': 'Waffensystem',
                'gameIntro.tech.weaponsDetail': '40+ Primärwaffen inkl. intelligente Gewehre, Railgun-Scharfschützen',
                'gameIntro.tech.maps': 'Start-Karten',
                'gameIntro.tech.mapsDetail': '4 große Karten: New York, Kalifornien, Arktis, Wüste',

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

                // ゲーム
                'game.playOnline': 'オンラインでプレイ',
                'game.fallback': '上のゲームが読み込めない場合はクリック',
                'game.playNow': '今すぐプレイ',
                'game.controls.title': '操作方法',
                'game.controls.move': '移動',
                'game.controls.aim': '照準',
                'game.controls.shoot': '射撃',
                'game.controls.weapons': '武器',
                'game.controls.skills': 'スキル',
                'game.controls.pickup': '取得',
                'game.controls.crouch': 'しゃがむ',
                'game.controls.jump': 'ジャンプ',
                'game.controls.run': '走る',
                'game.controls.pause': '一時停止/設定',

                // ゲーム紹介
                'gameIntro.title': 'Battlefield 6: 次世代戦場体験',
                'gameIntro.release.title': '発売情報',
                'gameIntro.release.date': '発売日',
                'gameIntro.release.dateDetail': '2025年10月10日世界同時発売',
                'gameIntro.release.status': '現在の状況',
                'gameIntro.release.statusDetail': 'ベータテスト完了、正式版間もなく',
                'gameIntro.release.platforms': '対応プラットフォーム',
                'gameIntro.release.platformsDetail': 'PC、PlayStation 5、Xbox Series X/S',
                'gameIntro.features.title': 'コア機能',
                'gameIntro.features.combat.title': 'キネティック戦闘システム',
                'gameIntro.features.combat.desc': '強化された機動性：スライディング、クライミング、ハンギングショット、壁や車両への武器設置が可能。',
                'gameIntro.features.players.title': '128人大規模戦闘',
                'gameIntro.features.players.desc': '128人同時プレイ対応（PC・次世代機）、前例のない大規模戦闘体験を提供。',
                'gameIntro.features.destruction.title': '進化した破壊システム',
                'gameIntro.features.destruction.desc': '建物を層ごとに破壊、戦車が壁を貫通し床を崩落させて戦術的優位を獲得。',
                'gameIntro.features.weather.title': 'ダイナミック天候システム',
                'gameIntro.features.weather.desc': '竜巻、砂嵐、ロケット発射などのランダム天候イベントが戦略的深度を追加。',
                'gameIntro.modes.title': 'ゲームモード',
                'gameIntro.modes.warfare.title': '全面戦争',
                'gameIntro.modes.warfare.desc': 'クラシックな64v64コンクエスト・ブレークスルーモードで大規模チーム戦を体験。',
                'gameIntro.modes.portal.title': 'Battlefield ポータル 2.0',
                'gameIntro.modes.portal.desc': 'プレイヤーホスト型サーバーで、クラシックBattlefieldの武器・車両を時代横断的に使用。',
                'gameIntro.modes.battleroyale.title': 'バトルロイヤル',
                'gameIntro.modes.battleroyale.desc': '150人バトルロイヤル、革新的な観戦システムで脱落プレイヤーがドローンでチームを支援。',
                'gameIntro.modes.campaign.title': 'シングルプレイヤーキャンペーン',
                'gameIntro.modes.campaign.desc': '2027年設定、オープンサンドボックスレベル、米露特殊部隊のデュアルナラティブ。',
                'gameIntro.tech.title': '技術仕様',
                'gameIntro.tech.engine': 'ゲームエンジン',
                'gameIntro.tech.engineDetail': 'Frostbiteエンジン（最新版）',
                'gameIntro.tech.maxPlayers': '最大プレイヤー数',
                'gameIntro.tech.maxPlayersDetail': '128人（PC/次世代機）',
                'gameIntro.tech.weapons': '武器システム',
                'gameIntro.tech.weaponsDetail': '40以上の主要武器、スマートライフル、レールガンスナイパー含む',
                'gameIntro.tech.maps': 'ローンチマップ',
                'gameIntro.tech.mapsDetail': '4つの大型マップ：ニューヨーク、カリフォルニア、極地、砂漠',
                
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

                // 게임
                'game.playOnline': '온라인 플레이',
                'game.fallback': '위의 게임이 로드되지 않으면 클릭',
                'game.playNow': '지금 플레이',
                'game.controls.title': '조작법',
                'game.controls.move': '이동',
                'game.controls.aim': '조준',
                'game.controls.shoot': '사격',
                'game.controls.weapons': '무기',
                'game.controls.skills': '스킬',
                'game.controls.pickup': '줍기',
                'game.controls.crouch': '앉기',
                'game.controls.jump': '점프',
                'game.controls.run': '달리기',
                'game.controls.pause': '일시정지/설정',

                // 게임 소개
                'gameIntro.title': 'Battlefield 6: 차세대 전장 경험',
                'gameIntro.release.title': '출시 정보',
                'gameIntro.release.date': '출시일',
                'gameIntro.release.dateDetail': '2025년 10월 10일 전 세계 동시 출시',
                'gameIntro.release.status': '현재 상황',
                'gameIntro.release.statusDetail': '베타 테스트 완료, 정식 버전 곧 출시',
                'gameIntro.release.platforms': '지원 플랫폼',
                'gameIntro.release.platformsDetail': 'PC, PlayStation 5, Xbox Series X/S',
                'gameIntro.features.title': '핵심 기능',
                'gameIntro.features.combat.title': '키네틱 전투 시스템',
                'gameIntro.features.combat.desc': '향상된 기동성: 슬라이딩, 클라이밍, 매달린 채로 사격, 벽이나 차량에 무기 거치 가능.',
                'gameIntro.features.players.title': '128명 대규모 전투',
                'gameIntro.features.players.desc': '128명 동시 플레이 지원(PC 및 차세대 콘솔), 전례 없는 대규모 전투 경험 제공.',
                'gameIntro.features.destruction.title': '발전된 파괴 시스템',
                'gameIntro.features.destruction.desc': '건물을 층별로 파괴, 탱크가 벽을 뚫고 바닥을 무너뜨려 전술적 우위 확보.',
                'gameIntro.features.weather.title': '다이나믹 날씨 시스템',
                'gameIntro.features.weather.desc': '토네이도, 모래폭풍, 로켓 발사 등 무작위 날씨 이벤트로 전략적 깊이 추가.',
                'gameIntro.modes.title': '게임 모드',
                'gameIntro.modes.warfare.title': '전면전',
                'gameIntro.modes.warfare.desc': '클래식 64v64 정복 및 돌파 모드로 대규모 팀 전투 경험.',
                'gameIntro.modes.portal.title': 'Battlefield 포털 2.0',
                'gameIntro.modes.portal.desc': '플레이어 호스팅 서버로 클래식 Battlefield 무기와 차량을 시대 횡단적으로 사용.',
                'gameIntro.modes.battleroyale.title': '배틀로얄',
                'gameIntro.modes.battleroyale.desc': '150명 배틀로얄, 탈락한 플레이어가 드론으로 팀을 지원하는 혁신적 관전 시스템.',
                'gameIntro.modes.campaign.title': '싱글플레이어 캠페인',
                'gameIntro.modes.campaign.desc': '2027년 배경, 오픈 샌드박스 레벨, 미국과 러시아 특수부대의 이중 서사.',
                'gameIntro.tech.title': '기술 사양',
                'gameIntro.tech.engine': '게임 엔진',
                'gameIntro.tech.engineDetail': 'Frostbite 엔진 (최신 버전)',
                'gameIntro.tech.maxPlayers': '최대 플레이어',
                'gameIntro.tech.maxPlayersDetail': '128명 (PC/차세대 콘솔)',
                'gameIntro.tech.weapons': '무기 시스템',
                'gameIntro.tech.weaponsDetail': '40개 이상의 주무기, 스마트 라이플, 레일건 저격총 포함',
                'gameIntro.tech.maps': '출시 맵',
                'gameIntro.tech.mapsDetail': '4개 대형 맵: 뉴욕, 캘리포니아, 극지, 사막',
                
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
