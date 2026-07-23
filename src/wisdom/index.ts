/**
 * 智慧（Wisdom）· 兄弟互校协议
 *
 * 冲突处理机制，七节点双向校验，无单向否决权。
 * 每个节点平等参与校验，收敛时达成共识，死锁时上报根。
 */

export interface MutualCheckMessage {
  from: string;
  to: string;
  type: "check" | "response" | "converge";
  payload: unknown;
  timestamp: number;
}

export type CheckState = "idle" | "checking" | "converged" | "deadlocked";
