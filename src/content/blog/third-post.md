---
title: 'Astroでのウェブサイト最適化テクニック'
description: 'Astroを使ったウェブサイトのパフォーマンス最適化方法について解説します。'
pubDate: '2025-02-28'
heroImage: '/src/assets/image-template.png'
category: 'パフォーマンス'
---

# Astroでのウェブサイト最適化テクニック

Astroは最初からパフォーマンスを重視して設計されていますが、さらに最適化するためのテクニックがいくつかあります。この記事では、Astroを使ったウェブサイトのパフォーマンスを向上させるための方法を紹介します。

## 画像の最適化

Astroは画像の最適化を簡単に行うことができます。`astro:assets`を使用することで、画像の最適化が自動的に行われます。

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my-image.png';
---

<Image src={myImage} alt="説明文" />
```

これにより、以下のような最適化が行われます：

1. 適切なサイズへのリサイズ
2. 最新のフォーマット（WebP、AVIFなど）への変換
3. 遅延読み込み（Lazy Loading）の自動適用

## 部分的なハイドレーション

Astroの大きな特徴の一つは、必要な部分だけにJavaScriptを適用する「部分的なハイドレーション」です。これにより、ページ全体をハイドレーションする必要がなくなり、JavaScriptのバンドルサイズを大幅に削減できます。

```astro
---
import Counter from '../components/Counter.jsx';
---

<!-- JavaScriptなしで静的にレンダリング -->
<Counter />

<!-- クライアントでハイドレーション -->
<Counter client:load />

<!-- 表示されたときにハイドレーション -->
<Counter client:visible />
```

## コンテンツのプリロード

ユーザーが次に見る可能性が高いページをプリロードすることで、ナビゲーション体験を向上させることができます。

```astro
---
// 他のインポート
---

<head>
  <!-- 他のhead要素 -->
  <link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="prefetch" href="/blog/">
</head>
```

## CSSの最適化

Astroは自動的にCSSを最適化しますが、さらに最適化するためのテクニックがあります：

1. **コンポーネントスコープのCSS**: Astroコンポーネント内のスタイルは自動的にスコープされ、他のコンポーネントに影響を与えません。

2. **CSS変数の活用**: テーマやカラースキームには CSS 変数を使用すると、コードの重複を減らせます。

```css
:root {
  --color-primary: #4c1d95;
  --color-secondary: #8b5cf6;
}

.button {
  background-color: var(--color-primary);
  color: white;
}
```

## ビルド出力の最適化

Astroのビルド出力は既に最適化されていますが、さらに最適化するためのオプションがあります：

```js
// astro.config.mjs
export default defineConfig({
  build: {
    // アセットをインライン化するサイズの閾値
    inlineStyleThreshold: 4096,
  },
  vite: {
    build: {
      // コードの圧縮
      minify: 'terser',
      // チャンクサイズの警告閾値
      chunkSizeWarningLimit: 1000,
    }
  }
});
```

## まとめ

Astroは最初から高速なウェブサイトを構築するために設計されていますが、これらの最適化テクニックを適用することで、さらにパフォーマンスを向上させることができます。ユーザー体験を向上させるために、これらのテクニックを活用してみてください。
