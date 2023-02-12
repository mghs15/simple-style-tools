# simple-style-tools
[simple-style](https://github.com/mghs15/simple-style)をいじるためNodeスクリプト

以下のレポジトリをベースに作成

* https://github.com/mghs15/style-color-change-on-web
* https://github.com/gsi-cyberjapan/gsimaps-vector-experiment

## 使い方
1. `makeTemplate.js`でもとになる`basic.json`からひな型となる`template.json`を作成する。
  * 地図デザインで使われている色を、カテゴリごとに分類する。。
  * 分類した色を文字列として`template.json`に埋め込む（`template.json`そのものをMapbox GL JSで利用できない。）。
2. `convert.js`で`template.json`の文字列を使いたい配色セットで置き換える。
  * 配色セットは、今のところ、convert.jsにハードコードされている。


