# Biotools - 生物序列处理工具套件

一个跨平台的生物序列处理工具套件，支持多种客户端和统一的后端API。

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
- **Web端**: React + TypeScript + Tailwind CSS
- **小程序**: Taro (基于React)
- **Raycast**: TypeScript
- **uTools**: HTML/CSS/JavaScript

## 开发状态

- ✅ Raycast 插件 - 基础功能完成
- 🔄 后端 API - 开发中
- 🔄 Web 应用 - 计划中
- 🔄 小程序 - 计划中
- 🔄 uTools 插件 - 计划中

## 快速开始

### 后端开发
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Web 应用开发
```bash
cd web-app
npm install
npm start
```

### 小程序开发
```bash
cd taro-miniprogram
npm install
npm run dev:weapp
```

## API 文档

后端启动后访问: http://localhost:8000/docs

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
