import { RefundRule } from "./RefundRuleInterface";

export class PartialRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    const REFUND_PERCENTAGE = 0.5;
    return totalPrice * REFUND_PERCENTAGE;
  }
}
