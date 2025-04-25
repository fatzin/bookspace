import { NoRefund } from "./ NoRefund";
import { FullRefund } from "./FullRefund";
import { PartialRefund } from "./PartialRefund";
import { RefundRule } from "./RefundRuleInterface";

export class RefundRuleFactory {
  static getRefundRule(daysUntilCheckin: number): RefundRule {
    if (daysUntilCheckin > 7) {
      return new FullRefund();
    } else if (daysUntilCheckin >= 1) {
      return new PartialRefund();
    }
    return new NoRefund();
  }
}
