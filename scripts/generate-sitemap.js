// 生成sitemap.xml脚本
const fs = require('fs');
const path = require('path');

class SitemapGenerator {
    constructor() {
        this.baseUrl = 'https://battlefield6.xyz';
        this.pages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/servers.html', priority: '0.9', changefreq: 'hourly' },
            { url: '/news.html', priority: '0.8', changefreq: 'daily' },
            { url: '/guides.html', priority: '0.7', changefreq: 'weekly' }
        ];
    }

    generateSitemap() {
        console.log('生成sitemap.xml...');
        
        const currentDate = new Date().toISOString().split('T')[0];
        
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

        // 为每个页面生成多语言版本
        const languages = ['zh-CN', 'en-US', 'de-DE', 'ja-JP', 'ko-KR'];
        
        this.pages.forEach(page => {
            languages.forEach(lang => {
                const url = page.url === '/' ? '/' : page.url;
                const fullUrl = `${this.baseUrl}${url}`;
                
                sitemap += `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;

                // 添加多语言链接
                languages.forEach(altLang => {
                    const hreflang = altLang.toLowerCase();
                    sitemap += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${fullUrl}?lang=${altLang}" />
`;
                });

                sitemap += `  </url>
`;
            });
        });

        sitemap += `</urlset>`;

        // 保存sitemap文件
        const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap);
        
        console.log(`Sitemap已生成: ${sitemapPath}`);
        
        // 生成robots.txt
        this.generateRobots();
    }

    generateRobots() {
        const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# 优化爬虫行为
Crawl-delay: 1

# 禁止访问的目录
Disallow: /scripts/
Disallow: /.github/
Disallow: /data/
`;

        const robotsPath = path.join(__dirname, '..', 'robots.txt');
        fs.writeFileSync(robotsPath, robots);
        
        console.log(`Robots.txt已生成: ${robotsPath}`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const generator = new SitemapGenerator();
    generator.generateSitemap();
}

module.exports = SitemapGenerator;