import { validateA1CanonicalSubmissionCompleteness } from "./A1CanonicalSubmissionPanel";

test('Chapter 3 requires the six grammar blanks before final submission', () => {
  const text = 'TEIL 1\n1. Es\n2. Sie\n3. Es\n4. Er\n\nTEIL 2\nMeine Familie ist klein.';
  expect(validateA1CanonicalSubmissionCompleteness({ assignmentKey: 'A1-3', text }).ok).toBe(false);
  expect(validateA1CanonicalSubmissionCompleteness({ assignmentKey: 'A1-3', text: `${text}\n\nTEIL 3\n1. gern\n2. Magst\n3. gern\n4. mögen\n5. gern\n6. mag` }).ok).toBe(true);
});
