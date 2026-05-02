# Lighthouse Audits

Run these checks against the deployed site or a production server started locally.

```bash
npm run lighthouse:mobile
npm run lighthouse:desktop
npm run lighthouse:all
npm run budgets
```

By default the audit target is `https://portfolio.saeeddev.com`. Override it when needed:

```bash
set LIGHTHOUSE_BASE_URL=http://localhost:3000
npm run lighthouse:all
```

Reports are written under `.agent/lighthouse/<timestamp>/`. The budget check reads the latest report directory unless `--dir` is passed:

```bash
npm run budgets -- --dir .agent/lighthouse/<timestamp>
```

Current score gates:

- Homepage: `95` Performance, `98` Accessibility, `100` Best Practices, `100` SEO.
- Other public routes: `90` Performance, `98` Accessibility, `100` Best Practices, `100` SEO.
