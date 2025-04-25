import { DateRange } from "./DateRange";

describe("DateRange Value Object", () => {
  it("deve criar um intervalo de datas com sucesso e verificar o retorno dessas datas", () => {
    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it("deve lançar um erro se a data de término for anterior à data de início", () => {
    expect(() => {
      new DateRange(new Date("2024-12-25"), new Date("2024-12-20"));
    }).toThrow("A data de término não pode ser anterior à data de início.");
  });

  it("Deve calcular o total de noites entre as datas", () => {
    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    expect(dateRange.getTotalNights()).toEqual(5);

    const startDate2 = new Date("2024-12-20");
    const endDate2 = new Date("2024-12-21");
    const dateRange2 = new DateRange(startDate2, endDate2);
    expect(dateRange2.getTotalNights()).toEqual(1);
  });

  it("Deve verificar se dois intervalos de datas se sobrepõem", () => {
    const dateRange1 = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );
    const dateRange2 = new DateRange(
      new Date("2024-12-23"),
      new Date("2024-12-30")
    );

    const overlaps = dateRange1.overlaps(dateRange2);
    expect(overlaps).toBe(true);

    const dateRange3 = new DateRange(
      new Date("2024-12-26"),
      new Date("2024-12-30")
    );

    const overlaps2 = dateRange1.overlaps(dateRange3);
    expect(overlaps2).toBe(false);
  });

  it("Deve lançar erro se a data de inicio e termino forem iguais", () => {
    const date = new Date("2024-12-20");
    expect(() => {
      new DateRange(date, date);
    }).toThrow("A data de término não pode ser igual à data de início.");
  });
});
