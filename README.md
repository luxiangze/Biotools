# Biotools - 生物序列处理工具套件

一个跨平台的生物序列处理工具套件，支持多种客户端和统一的后端API。

**中文** | [English](README.en.md)

## 项目结构

```
biotools/
├── backend/                 # FastAPI 后端
├── web-app/                # React Web 应用
├── utools-plugin/          # uTools 插件
├── raycast_biotools/       # Raycast 插件 (已存在)
└── shared/                 # 共享类型定义和工具
```

## 功能特性

### 基础序列处理
- ✅ 序列反向互补
- ✅ 大小写转换
- ✅ DNA/RNA 转录和反转录
- ✅ 蛋白质翻译
- ✅ 序列统计和长度计算

### 高级功能 (计划中)
- 🔄 引物设计
- 🔄 gRNA 设计
- 🔄 序列比对
- 🔄 限制性内切酶分析

## 技术栈

- **后端**: FastAPI + Biopython + Docker
- **Web端**: React + TypeScript + Tailwind CSS + 国际化
- **Raycast**: TypeScript
- **uTools**: HTML/CSS/JavaScript

## 开发状态

- ✅ Raycast 插件 - 基础功能完成
- ✅ 后端 API - 核心功能完成，支持国际化
- ✅ Web 应用 - 完成，支持完整国际化
- ✅ uTools 插件 - 基础功能完成
- ❌ 小程序 - 已取消开发

## 快速开始

### 后端开发
```bash
cd backend
pixi install
pixi run python main.py
```

### Web 应用开发
```bash
cd web-app
npm install
npm start
```

### Docker 部署
```bash
docker-compose up -d
```

## API 文档

后端启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 国际化支持

项目支持中英文双语：
- **后端**: 使用 Python gettext 处理 API 响应
- **前端**: 使用 react-i18next 处理界面翻译
- **语言检测**: 自动检测并支持手动切换

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 平台支持

- **Web 应用**: 现代浏览器，响应式设计
- **Raycast 插件**: macOS 生产力工具集成
- **uTools 插件**: 跨平台快速启动器集成

## 仓库地址

GitHub: [https://github.com/luxiangze/Biotools](https://github.com/luxiangze/Biotools)

## 许可证

MIT License
