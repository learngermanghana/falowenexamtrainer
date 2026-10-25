# A1 Kombiprüfung Mocks 4–8 — integration checklist

## Source mapping
- A1 Mock 4: uploaded goethe-a1-kombipruefung-test-1.pdf
- A1 Mock 5: uploaded goethe-a1-kombipruefung-test-2.pdf
- A1 Mock 6: uploaded goethe-a1-kombipruefung-test-3.pdf
- A1 Mock 7: uploaded goethe-a1-kombipruefung-test-4.pdf
- A1 Mock 8: uploaded goethe-a1-kombipruefung-test-5.pdf

Uploaded conversation ZIP: falowen_a1_mocks_4_to_8_import.zip. These PDFs/ZIP are **not** committed or hosted by this PR.

## Product behavior
- Existing A1 Mocks 1–3 stay unchanged.
- Label the new mocks **Kombiprüfung · 3 modules** and show Lesen, Schreiben, Sprechen.
- Timers: Lesen 25 min, Schreiben 15 min, Sprechen 15 min, with auto-submit on expiry.
- Do not require Hören or block a three-module result because Hören is absent.
- Persist immutable `assessmentVersion`, `sections`, `scores`, `earned`, `maximum` and `percentage` with each verified attempt.
- On future publication of Hören, only *new* attempts use four-module scoring; never recalculate older 75-point results.
- Don't expose the PDFs' bracketed answer hints, page 5 solution key of Test 5, or examiner model answers before submission.
- Use the established server attempt, verified AI Schreiben/Sprechen, resume, timer, audit and Admin Results pipelines.

## Remaining checks before visible publication
- [ ] Rights/branding review for source PDFs' Goethe-Zertifikat wording.
- [ ] Convert all five papers into structured and audited student question data; verify every reading answer key and form key.
- [ ] Connect all five question sets to the student mock route and AI speaking examiner.
- [ ] Add server-scoped answer keys, attempts, score verification and Admin/Results sync.
- [ ] Record exam version with every result; test no historical scores are modified on upgrade.
- [ ] Run E2E full three-skill tests and expired-timer, interrupted/resumed, retried submission cases.
- [ ] Verify production access and only then promote catalog cards from staged to ready.

**This PR is intentionally draft-only. It does not add live routes and must not be merged as a launch.**
