#!/bin/bash
# 构建静态文件
npm run build
# 提示用户通过 FTP 上传 dist/ 目录
echo "构建完成！请将 dist/ 目录中的所有文件通过 FTP 上传到 ECS 服务器的 Web 根目录"
echo "例如：使用 FileZilla 连接 ECS，将 dist/* 上传到 /var/www/html/"
