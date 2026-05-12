# Hillside Auto Website B — 作業ルール

## デプロイフロー（重要）

このフォルダ（`hillside-auto-website-b`）は **本番公開中** のサイトです。
ユーザーから修正依頼があったら、毎回以下を**自動で**実行してください：

1. このフォルダ内のファイルを編集
2. `git add -A`
3. `git commit -m "<変更内容>"`
4. `git push`
5. ユーザーに「1〜2分後に https://hillside-auto.vercel.app に反映されます」と伝える

ユーザーが個別にcommit/pushを依頼する必要はありません。**自動で実行**してください。

## 公開URL

- 本番: https://hillside-auto.vercel.app
- GitHub: https://github.com/Tatsunosuke127/hillside-auto-website-b
- リモート: origin/main

## Git config

- user.email: Tatsunosuke127@users.noreply.github.com
- user.name: Tatsunosuke127

## 関連フォルダ

- `C:\Users\hillsideauto\Desktop\hillside-auto-website-c\` — 進化版の実験用（**触らない**）
- `C:\Users\hillsideauto\Desktop\hillside-auto-website\` — A版オリジナル（**触らない**）

## デザイン方針

NOT A HOTEL ARCHITECTS（https://architects.notahotel.com/）にインスパイアされた、
ミニマル・モノクロ・タイポグラフィ重視のデザイン。

- 配色: 純粋な白黒のみ
- フォント: Cormorant Garamond（英セリフ） / Noto Serif JP（和明朝） / Inter（サンセリフ）
- 画像: グレースケール、ホバーでカラーに
- 角丸・影なし
- 余白を大きく取る
