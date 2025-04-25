export class DateRange {
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.validateDates(startDate, endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (endDate < startDate) {
      throw new Error(
        "A data de término não pode ser anterior à data de início."
      );
    }
    if (endDate == startDate) {
      throw new Error("A data de término não pode ser igual à data de início.");
    }
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getTotalNights(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  overlaps(other: DateRange): boolean {
    return this.startDate < other.endDate && this.endDate > other.startDate;
  }
}
