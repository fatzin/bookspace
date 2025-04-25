import { RefundRule } from "./RefundRuleInterface";

export class FullRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return 0;
  }
}
