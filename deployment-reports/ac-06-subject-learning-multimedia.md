# SHAR3 AC-06 — Subject Learning + Multi-Media Frontend

## Execution Date

2026-09-20

## Status

**READY FOR AC-07**

Frontend consumes `media[]` with independent Video / Audio / Attachments. Subject learning works with `course=null` and empty lessons. Backend/DB unchanged. Staging `lesson_media` = 0, `subject_teacher` = 0.

## Starting State

| Item | Value |
|---|---|
| Frontend SHA | `28bf030ddb7fbb04b07478fb391bbe227bfbf2a8` |
| Backend SHA | `928da9b530b0cc9d22019d6b71b5f65d5d8a3ffd` |
| DB counts | subjects 174 · courses 3 · lessons 3 · teachers 7 · subject_teacher 0 · lesson_media 0 |
| Subject-owned lessons | 0 |
| course_id nullable | NO |

## Existing Frontend Architecture

| Area | Finding |
|---|---|
| LessonViewer | Was video_url-only (`TrackedVideoPlayer` / empty placeholder) |
| Course flow | `/dashboard/courses/[id]` → `StudentCoursePage` → `LessonViewer` |
| Subject flow | `/dashboard/subjects/[slug]` → `StudentSubjectPage` → `StudentLearningPage` (required `course`) |
| API client | Bearer token in `src/lib/auth.ts` (`studentApi.subject` / `course`) |

## Media Types

Actual TypeScript contract (`src/types/lesson-media.ts`):

- `LessonMediaType`: `video` \| `audio` \| `file`
- `LessonMediaItem`: `id`, `type`, `provider`, titles, `sort_order`, `is_primary`, `url`, `mime_type`, `file_size`, `duration_seconds`, `synthetic`, `bunny`, `audio`, `download_url`, `external_url`
- Legacy retained on lesson: `video_url`, `media_type`, `bunny`, `audio`

## Media Normalization

| Rule | Behavior |
|---|---|
| `media[]` precedence | If `Array.isArray(media)` → authoritative (including empty `[]`) |
| legacy fallback | Only when `media === undefined` → synthesize from `video_url` / legacy `bunny` / `audio` |

Helper: `src/lib/lesson-media.ts`

## Lesson Viewer

Final section order:

1. Title + content
2. Video (optional)
3. Audio (optional)
4. Attachments (optional)
5. Questions / completion controls

Shared by Course and Subject flows (no Course-only media assumptions).

## Video

| Item | Behavior |
|---|---|
| Providers | bunny (embed_url when ready), legacy/url |
| Primary selection | `is_primary` then lowest `sort_order` / stable id |
| Progress | Existing watch-threshold completion; audio/files do not suppress it |
| Legacy | Synthetic `id=null` + `video_url` / `media[].url` render via existing players |
| Bunny | Uses backend `embed_url`; processing/failed show non-destructive Arabic status |

MVP UI: one effective video player (additional videos do not crash).

## Audio

| Item | Behavior |
|---|---|
| Player | HTML5 `<audio>` via authenticated blob URL |
| Authentication | Bearer via `fetchAuthenticatedBlob` (no token in query string) |
| Error behavior | Section fails independently; content/video/files/questions remain |

## Attachments

| Item | Behavior |
|---|---|
| Rendering | «المرفقات» list of all file items |
| Multiple | ordered by `sort_order` |
| Download | authenticated `download_url` when `id` is a positive number |
| External URL security | http/https only; `javascript:` / `data:` / `file:` rejected |

Never constructs `/media/null/download`.

## Subject Learning

| Item | Result |
|---|---|
| Route | `/dashboard/subjects/[slug]` |
| Direct lessons | uses Subject API `lessons` array |
| Legacy fallback | backend-provided lessons (no separate Course fetch) |
| course=null | supported (title from subject; no crash) |
| Empty state | «لم تتم إضافة دروس لهذا المقرر بعد.» |
| Progress | displays/refreshes Subject API `progress` |

## Course Learning

Regression: Course route unchanged; shares LessonViewer/media components. Public course pages still load (staging smoke 200).

## Questions

Lesson-centric via `lessonId` (`LessonQuiz` / complete / progress endpoints). No `course_id` required in quiz UI.

## Responsive / RTL

Arabic labels; aspect-video players; wrapping attachment titles; independent media error sections.

## Tests

| Area | Result |
|---|---|
| Media combinations | covered in `lesson-media.test.ts` |
| Legacy | `media` undefined + synthetic id=null |
| Bunny | ready / processing / failed |
| Audio | stream URL resolution |
| Files | multiple, safe URL, missing id |
| Subject | course=null + lessons / empty |
| Course / Questions | shared components; no regression in typecheck/build |
| Vitest | **14 passed** |

## Build

| Check | Result |
|---|---|
| Lint (AC-06 files) | pass |
| Typecheck | pass |
| Tests | 14 passed |
| Production build | pass (static export) |
| Static export | dashboard learning remains client/API-driven; subject slugs from `generateStaticParams` only for shell pages |
| Fake routes | none added |
| patch-package | retained / applied |

## Backend

| Item | Value |
|---|---|
| Changes | **0** |
| SHA | `928da9b530b0cc9d22019d6b71b5f65d5d8a3ffd` |

## Database

| Item | Value |
|---|---|
| Writes | **0** |
| Counts after | subjects 174 · courses 3 · lessons 3 · teachers 7 |
| lesson_media | **0** |
| subject_teacher | **0** |
| Subject-owned lessons | **0** |

## Git

| Item | Value |
|---|---|
| Feature | `feature/ac-06-subject-learning-multimedia` |
| Starting SHA | `28bf030ddb7fbb04b07478fb391bbe227bfbf2a8` |
| Feature SHA | `c0e210455b6253103532e45073bf9823d06c100e` |
| PR | https://github.com/Mahmoudhammad93/shar3/pull/3 |
| Staging SHA | `1677ca308879a0e473f306a36f1d8f4b91adc44c` |
| Running SHA | `1677ca308879a0e473f306a36f1d8f4b91adc44c` |
| Master | unchanged `45021fe1623a7eec7615eb78b0f366f166200fb8` |

## Deployment

| Layer | Result |
|---|---|
| Frontend | rebuilt/recreated staging frontend image |
| Backend | unchanged |
| DB | unchanged |

## Security

| Check | Result |
|---|---|
| Bunny secrets | none in source/bundle |
| Drive secrets | none |
| Auth tokens | Bearer header only for media blob/download |
| Unsafe URLs | rejected by `isSafeHttpUrl` |
| Other secrets | none found in frontend HTML/static |

## Resources

| Item | Value |
|---|---|
| RAM | 3.8 GiB · ~3.0 GiB available |
| Swap | 2.0 GiB · ~458 MiB used |
| Disk | 77G · 26% used |
| OOM | none |
| Restart loops | none |

## Deferred To AC-07

- `course_id` nullable
- XOR ownership DB CHECK
- enable Subject Lesson creation

## Deferred To AC-08

- full end-to-end regression
- release verification

## No-Change Verification

| Item | Result |
|---|---|
| Backend source | 0 |
| Backend SHA | unchanged |
| Migrations | 0 |
| Business DB | 0 |
| Bunny / Drive | 0 |
| Filament | 0 |
| Hostinger | 0 |
| Production | 0 |
| Frontend master | 0 |

## Final Status

**READY FOR AC-07**
