# ベースイメージを指定（Node.jsの公式イメージを使用）
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係をインストール
RUN npm install

# アプリの全ファイルをコンテナにコピー
COPY . .

# アプリを起動するコマンド
CMD ["npm", "run", "dev"]