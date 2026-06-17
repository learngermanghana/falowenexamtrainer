import {
  getClassMemberInitials,
  normalisePublicClassMember,
  shouldShowClassMembersPreview,
} from "./HomeClassPreviewCard";

test("creates compact initials for the live class preview", () => {
  expect(getClassMemberInitials("Ama Mensah")).toBe("AM");
  expect(getClassMemberInitials("Kojo")).toBe("K");
  expect(getClassMemberInitials("")).toBe("S");
});

test("keeps only public class-member fields", () => {
  const member = normalisePublicClassMember({
    id: "student-1",
    data: () => ({
      name: "Ama Mensah",
      biography: "I enjoy speaking practice.",
      email: "ama@example.com",
      balanceDue: 500,
      studentCode: "PRIVATE-123",
    }),
  });

  expect(member).toEqual({
    id: "student-1",
    name: "Ama Mensah",
    biography: "I enjoy speaking practice.",
  });
  expect(member).not.toHaveProperty("email");
  expect(member).not.toHaveProperty("balanceDue");
  expect(member).not.toHaveProperty("studentCode");
});

test("shows classmates only inside live class access for live A1 to B1 classes", () => {
  expect(
    shouldShowClassMembersPreview({
      embedded: true,
      className: "A1 Koln Klasse",
      level: "A1",
    }),
  ).toBe(true);
  expect(
    shouldShowClassMembersPreview({
      embedded: false,
      className: "A1 Koln Klasse",
      level: "A1",
    }),
  ).toBe(false);
  expect(
    shouldShowClassMembersPreview({
      embedded: true,
      className: "B2 Self-learning",
      level: "B2",
    }),
  ).toBe(false);
  expect(
    shouldShowClassMembersPreview({
      embedded: true,
      className: "C1 Self-learning",
      level: "C1",
    }),
  ).toBe(false);
});
