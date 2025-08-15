# Battlefield 6 官方倒计时网站

🎮 **Battlefield6.xyz** - 战地风云6官方发售倒计时，实时服务器状态监控，最新游戏资讯聚合。

## 🌟 功能特性

### 🕒 实时倒计时
- 精确到秒的发售倒计时
- 多时区支持
- 动态视觉效果

### 🌍 多语言支持
- **中文** (简体中文)
- **English** (英语)
- **Deutsch** (德语)
- **日本語** (日语)
- **한국어** (韩语)

### 📊 服务器监控
- 实时服务器状态
- 在线玩家数量
- 延迟监控
- 历史数据图表

### 📰 新闻聚合
- 多语言新闻内容
- 自动更新
- 分类筛选
- 响应式设计

### 🎯 攻略指南
- 武器配装推荐
- 地图战术指南
- 兵种玩法技巧
- 载具操作指南

## 🚀 技术栈

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript (ES6+)** - 交互功能
- **响应式设计** - 移动端适配

### 自动化部署
- **GitHub Actions** - CI/CD流程
- **Cloudflare Pages** - 静态网站托管
- **自动化脚本** - 内容更新

### 设计风格
- **军事科技风** - 深绿配色方案
- **发光效果** - 橙色高亮元素
- **等宽字体** - 数字显示
- **流畅动画** - 用户体验优化

## 📁 项目结构

```
battlefield6.xyz/
├── index.html              # 主页
├── servers.html            # 服务器状态页
├── news.html              # 新闻资讯页
├── guides.html            # 攻略指南页
├── css/
│   └── style.css          # 主样式文件
├── js/
│   ├── i18n.js           # 国际化系统
│   ├── countdown.js      # 倒计时功能
│   ├── servers.js        # 服务器监控
│   ├── news.js           # 新闻聚合
│   ├── server-details.js # 服务器详情
│   └── guides.js         # 攻略功能
├── scripts/
│   ├── update-news.js    # 新闻更新脚本
│   └── generate-sitemap.js # 站点地图生成
├── .github/
│   └── workflows/
│       └── deploy.yml    # 自动部署配置
├── sitemap.xml           # 搜索引擎站点地图
├── robots.txt            # 爬虫规则
└── README.md             # 项目文档
```

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- 现代浏览器

### 快速开始
```bash
# 克隆项目
git clone https://github.com/yourusername/battlefield6.xyz.git

# 进入项目目录
cd battlefield6.xyz

# 安装依赖
npm install

# 启动本地服务器
npx http-server . -p 8080

# 访问网站
open http://localhost:8080
```

### 开发脚本
```bash
# 更新新闻数据
node scripts/update-news.js

# 生成站点地图
node scripts/generate-sitemap.js
```

## 🚀 部署配置

### Cloudflare Pages 设置
1. 连接GitHub仓库
2. 设置构建命令：`npm run build`
3. 设置输出目录：`./`
4. 配置环境变量

### 环境变量
```bash
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ZONE_ID=your_zone_id
NEWS_API_KEY=your_news_api_key
```

### 自动化部署
- **推送触发**：每次推送到main分支自动部署
- **定时更新**：每小时自动更新内容
- **缓存清理**：部署后自动清理CDN缓存

## 🌐 SEO优化

### 搜索引擎优化
- 语义化HTML结构
- 多语言meta标签
- 结构化数据标记
- 自动生成sitemap.xml
- 优化的robots.txt

### 性能优化
- 图片懒加载
- CSS/JS压缩
- CDN加速
- 缓存策略

## 📱 响应式设计

### 支持设备
- 🖥️ 桌面端 (1200px+)
- 💻 笔记本 (768px-1199px)
- 📱 平板 (480px-767px)
- 📱 手机 (320px-479px)

### 移动端优化
- 触摸友好的交互
- 优化的字体大小
- 简化的导航菜单
- 快速加载优化

## 🔧 自定义配置

### 语言配置
在 `js/i18n.js` 中添加新语言：
```javascript
'new-lang': {
    'nav.home': 'Home',
    // 添加更多翻译...
}
```

### 服务器配置
在 `js/servers.js` 中修改服务器设置：
```javascript
this.servers = {
    newRegion: {
        name: 'New Region',
        endpoint: 'new.battlefield6.xyz',
        // 配置参数...
    }
};
```

## 📊 数据来源

### 服务器数据
- 模拟实时数据（可替换为真实API）
- 自动更新机制
- 历史数据记录

### 新闻数据
- 多语言内容支持
- RSS源聚合
- 自动分类标记

## 🤝 贡献指南

### 如何贡献
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用ES6+语法
- 遵循响应式设计原则
- 添加适当的注释
- 保持代码整洁

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本网站为非官方粉丝项目，与EA DICE无关。Battlefield和相关商标归EA所有。

## 📞 联系方式

- 网站：https://battlefield6.xyz
- 邮箱：contact@battlefield6.xyz
- GitHub：https://github.com/yourusername/battlefield6.xyz

---

⭐ 如果这个项目对你有帮助，请给它一个星标！