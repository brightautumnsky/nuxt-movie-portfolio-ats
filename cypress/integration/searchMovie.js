// E2E 테스트
describe("염화 검색 테스트", () => {
  // 검색 페이지 접근
  it("검색 페이지로 접근", () => {
    cy.visit("/");
    cy.get("header .nav-link.active").contains("Search");
  });

  // 영화 검색, frozen 예시
  it("영화 검색", () => {
    cy.get("input.form-control").type("frozen");
    cy.get("select.form-select:nth-child(2)").select("30");
    cy.get("button.btn")
      .contains("Apply")
      .click();
    cy.wait(2000);
    cy.get(".movie").should("have.length", 29);
  });

  // 아이템 선택
  it("겨울왕국2 영화 아이템 선택", () => {
    cy.get(".movie .title")
      .contains("Frozen II")
      .click();
  });

  // 상세 정보 확인
  it("겨울왕국2 영화 상세정보 확인", () => {
    cy.url().should("include", "/movie/tt4520988");
    cy.wait(1000);
    cy.get("header .nav-link.active").contains("Movie");
    cy.get(".title").contains("Frozen II");
  });
});
