import { RefundRule } from "./RefundRuleInterface";

export class NoRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice;
  }
}
