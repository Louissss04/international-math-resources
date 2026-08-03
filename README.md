# MathPath

面向中国中学生与升学规划师的中英双语数学项目数据库。

## 页面结构

- `/`：首页与近期已确认日期
- `/catalog`：全站项目检索与筛选
- `/competitions/[slug]`：竞赛专档与历年分数线
- `/modeling/[slug]`：建模专档
- `/research/[slug]`：科研规范专档
- `/summer/[slug]`：夏校与夏令营专档
- `/assessments/[slug]`：课程与考试专档
- `/archive`：分数线和奖项档案查询
- `/calendar`：考试、报名、申请与结果日期
- `/compare`：项目字段比较
- `/universities`：院校公开政策
- `/sources`：来源台账
- `/planner`：浏览器本地规划器与 CSV、ICS、JSON 导出

## 数据结构

项目、来源、日期、分数线和院校政策分别采用结构化记录。页面正文中的核心字段、日期和分数线均可关联来源，并区分当前已确认、历史记录、待公布和来源冲突四种状态。

## 本地运行

要求 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm test
```
