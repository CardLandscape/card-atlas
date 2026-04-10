# CardAtlas 银行卡图鉴

一个基于 Vue 3 + Vite + Pinia + Element Plus + TailwindCSS 构建的银行卡产品资料库，涵盖国内主流银行的信用卡与借记卡产品信息。

## 功能特性

- 📊 **概览仪表盘**：按卡组织、银行类型的分布统计图表
- 💳 **卡产品列表**：多维度筛选（银行、卡组织、等级、类型、关键词）与排序
- 🏦 **银行列表**：按国有/股份制分类展示，点击查看旗下所有卡产品
- ⚙️ **数据管理**：完整的增删改查，支持导出/导入 JSON，支持重置默认数据
- 💾 **本地持久化**：数据自动保存到 localStorage

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.4.0 | 前端框架 |
| Vite | ^5.1.0 | 构建工具 |
| Pinia | ^2.1.7 | 状态管理 |
| Vue Router | ^4.3.0 | 路由管理 |
| Element Plus | ^2.6.0 | UI 组件库 |
| TailwindCSS | ^3.4.0 | 原子化 CSS |
| TypeScript | ^5.3.0 | 类型支持 |
| Electron | ^28.2.0 | 桌面应用（可选） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## Electron 桌面应用构建

```bash
# 启动 Electron 开发模式
npm run dev:electron

# 构建所有平台
npm run build:electron

# 构建 Windows 安装包
npm run build:electron:win

# 构建 macOS DMG
npm run build:electron:mac

# 构建 Linux AppImage
npm run build:electron:linux
```

## ECS 部署

### 方式一：手动 FTP 上传

```bash
# 执行部署脚本（构建 + 提示上传步骤）
bash scripts/deploy-ecs.sh
```

### 方式二：自动 FTP 上传（需要 lftp）

1. 复制 `.env.example` 为 `.env` 并填写 FTP 配置：

```bash
cp .env.example .env
```

编辑 `.env`：
```
FTP_HOST=your-ecs-ip
FTP_USER=your-ftp-username
FTP_PASS=your-ftp-password
FTP_REMOTE_DIR=/var/www/html
```

2. 执行自动上传脚本：

```bash
bash scripts/ftp-upload.sh
```

## 数据管理

访问 `/manage` 路由进入数据管理页面：

- **银行管理**：增删改查银行信息
- **卡组织管理**：管理 UnionPay、Visa、Mastercard 等卡组织
- **卡等级管理**：管理普卡、金卡、白金卡、钻石卡、无限卡等级
- **卡产品管理**：管理所有卡产品，包含权益、年费等详细信息
- **导出数据**：将当前数据导出为 JSON 文件备份
- **导入数据**：从 JSON 文件恢复数据
- **重置默认**：恢复出厂预设数据

## 项目结构

```
card-atlas/
├── src/
│   ├── components/        # 公共组件
│   │   ├── CardItem.vue   # 卡片展示组件
│   │   └── StatCard.vue   # 统计卡片组件
│   ├── data/              # 静态数据 JSON
│   │   ├── banks.json     # 18 家银行数据
│   │   ├── networks.json  # 6 个卡组织数据
│   │   ├── grades.json    # 5 个卡等级数据
│   │   └── cards.json     # ~30 张卡产品数据
│   ├── router/            # Vue Router 配置
│   ├── stores/            # Pinia 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── views/             # 页面组件
│   │   ├── HomeView.vue
│   │   ├── CardListView.vue
│   │   ├── CardDetailView.vue
│   │   ├── BankListView.vue
│   │   ├── BankDetailView.vue
│   │   └── ManageView.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── electron/              # Electron 主进程
│   ├── main.js
│   └── electron-builder.yml
├── scripts/               # 部署脚本
│   ├── deploy-ecs.sh
│   └── ftp-upload.sh
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 数据说明

本应用数据仅供参考，实际银行卡产品权益以各银行官方为准。当前收录：

- **18 家银行**：6 家国有银行 + 12 家股份制银行
- **6 个卡组织**：银联、Visa、万事达卡、美国运通、JCB、发现卡
- **5 个卡等级**：普卡、金卡、白金卡、钻石卡、无限卡
- **30+ 张卡产品**：每家银行 1-2 款代表产品

## License

MIT
