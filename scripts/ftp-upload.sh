#!/bin/bash
# FTP 自动上传脚本（需要安装 lftp）
# 使用前请在 .env 中配置 FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR

if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo "错误：请在 .env 中配置 FTP_HOST, FTP_USER, FTP_PASS"
  exit 1
fi

REMOTE_DIR="${FTP_REMOTE_DIR:-/var/www/html}"

echo "开始构建..."
npm run build

echo "开始上传到 $FTP_HOST$REMOTE_DIR ..."
lftp -c "
  open -u $FTP_USER,$FTP_PASS $FTP_HOST
  mirror -R --delete --verbose dist/ $REMOTE_DIR/
  bye
"

echo "上传完成！"
