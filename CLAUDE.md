# h0ke.com

Personal blog of m. hokanson ("aitch zero kay e"), served at https://h0ke.com.
Static site built with **Hexo 4** and a customized **cleanblog** theme.

## Layout

- `_config.yml` – site config. Permalinks are `posts/:title/`, `post_asset_folder: true`, `future: true`, Atom feed at `/atom.xml`.
- `source/_posts/<slug>.md` – posts. A post with images has a sibling folder `source/_posts/<slug>/`, and the post references images by bare filename (`![alt](the-array.jpg)`).
- `source/about`, `source/now`, `source/projects` – standalone pages (`index.md` each).
- `source/images/` – site-wide images, such as the index hero `hero01.jpg`.
- `source/CNAME`, `keybase.txt`, `favicon.ico` – copied as-is into `public/`.
- `scaffolds/` – templates used by `hexo new`.
- `themes/cleanblog/` – the active theme (EJS layouts in `layout/`, partials in `layout/_partial/`). Its `_config.yml` holds the menu, social links (github, mastodon, 500px, linkedin, mailto) and the GA id. The footer social links live here.
- `themes/landscape/` – the stock Hexo theme. It is unused.
- `public/` – **generated output, committed to git**. Hosting is Netlify (project `h0ke`), which also builds deploy previews for PRs.

## Post front matter

```yaml
---
title: the solar array        # lowercase titles are the house style
date: 2024-04-21
subtitle: some notes on our solar installation.
tags: blog
---
```

Footnotes use `[^1]` syntax via `hexo-footnotes`. Excerpts come from `hexo-excerpt` (depth 1).

## Workflow

- Local preview: `npx hexo server`
- Build: `npm run deploy` (runs `hexo generate && hexo deploy`). `_config.yml` has no `deploy:` section, so in practice only the generate step does anything.
- Publish: commit the regenerated `public/` along with the source changes, then `git push` to `origin` (github.com/techdubb/h0ke.com).
- Commit messages are short, lowercase and informal (e.g. "add solar array post").

## Notes

- `db.json` is Hexo's cache and is committed. Regenerating will change it, and it conflicts whenever both sides rebuild. Pull `master` before starting. To fix a conflict, take `master`'s copy and run `npx hexo generate` again.
- Regenerating can also rewrite `public/atom.xml` summaries for older posts (plugin version drift). Revert that unless the feed is meant to change.
- Local Node is v22. Hexo 4 is old, so if a build misbehaves, check for Node version issues first.
