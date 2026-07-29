/**
 * 兄弟互校协议
 *
 * 冲突处理机制。七节点双向校验，无单向否决权。
 * 网状互校：任一节点可向任一其他节点发起校验，形成全连通校验网络。
 *
 * 收敛条件：会话中所有 check 消息均有对应 response。
 * 死锁判定：pending 状态超过超时阈值且存在循环依赖。
 */

export interface MutualCheckMessage {
  /** 发送节点 */
  from: string;

  /** 接收节点 */
  to: string;

  /** 消息类型 */
  type: "check" | "response" | "converge";

  /** 校验内容 */
  payload: unknown;

  /** 时间戳 */
  timestamp: number;
}

export type CheckState = "idle" | "checking" | "converged" | "deadlocked";

/** 会话内部跟踪结构 */
interface CheckSession {
  id: string;
  state: CheckState;
  messages: MutualCheckMessage[];
  pendingChecks: Map<string, MutualCheckMessage>;
  responses: Map<string, MutualCheckMessage>;
  createdAt: number;
  timeoutMs: number;
  onConverge?: (sessionId: string) => void;
  onDeadlock?: (sessionId: string, cycle: string[]) => void;
}

/**
 * 互校协议
 *
 * 管理七节点间双向校验的全生命周期：
 * 1. 创建会话 → 2. 节点间发送 check/response → 3. 收敛或死锁终止
 */
export class MutualCheckProtocol {
  private sessions: Map<string, CheckSession> = new Map();
  private serialCounter = 0;

  /**
   * 创建新校验会话
   * @param timeoutMs 超时阈值（默认 30s）
   */
  createSession(timeoutMs = 30000): string {
    const id = `chk-${Date.now()}-${++this.serialCounter}`;
    this.sessions.set(id, {
      id,
      state: "idle",
      messages: [],
      pendingChecks: new Map(),
      responses: new Map(),
      createdAt: Date.now(),
      timeoutMs,
    });
    return id;
  }

  /** 注册收敛回调 */
  onConverge(sessionId: string, cb: (id: string) => void): void {
    this.getSession(sessionId).onConverge = cb;
  }

  /** 注册死锁回调 */
  onDeadlock(sessionId: string, cb: (id: string, cycle: string[]) => void): void {
    this.getSession(sessionId).onDeadlock = cb;
  }

  /**
   * 发起校验
   * @throws 若会话状态不允许发送校验
   */
  sendCheck(sessionId: string, from: string, to: string, payload: unknown): void {
    const session = this.getSession(sessionId);
    if (session.state !== "idle" && session.state !== "checking") {
      throw new Error(
        `Session ${sessionId} is in ${session.state} state, cannot send check`
      );
    }

    const msg: MutualCheckMessage = {
      from,
      to,
      type: "check",
      payload,
      timestamp: Date.now(),
    };

    session.state = "checking";
    session.messages.push(msg);
    session.pendingChecks.set(`${from}->${to}`, msg);
  }

  /**
   * 响应校验
   * @throws 若无对应的待处理 check
   */
  sendResponse(sessionId: string, from: string, to: string, payload: unknown): void {
    const session = this.getSession(sessionId);
    const checkKey = `${to}->${from}`;

    if (!session.pendingChecks.has(checkKey)) {
      throw new Error(
        `No pending check from ${to} to ${from} in session ${sessionId}`
      );
    }

    const msg: MutualCheckMessage = {
      from,
      to,
      type: "response",
      payload,
      timestamp: Date.now(),
    };

    session.messages.push(msg);
    session.responses.set(`${from}->${to}`, msg);
    session.pendingChecks.delete(checkKey);

    // 所有 check 均有 response → 收敛
    if (session.pendingChecks.size === 0) {
      session.state = "converged";
      session.onConverge?.(sessionId);
    }
  }

  /** 获取当前状态 */
  getState(sessionId: string): CheckState {
    return this.getSession(sessionId).state;
  }

  /** 获取所有消息 */
  getMessages(sessionId: string): readonly MutualCheckMessage[] {
    return this.getSession(sessionId).messages;
  }

  /** 获取待处理校验列表 */
  getPendingChecks(sessionId: string): MutualCheckMessage[] {
    return Array.from(this.getSession(sessionId).pendingChecks.values());
  }

  /**
   * 手动触发死锁检测
   * @returns 检测到的死锁路径（空数组表示无死锁）
   */
  detectDeadlock(sessionId: string): string[] {
    const session = this.getSession(sessionId);
    if (session.pendingChecks.size === 0) return [];

    // 仅在超时后方判定死锁
    if (Date.now() - session.createdAt < session.timeoutMs) return [];

    // 从 pending checks 构建有向图
    const graph = new Map<string, string[]>();
    for (const [key] of session.pendingChecks) {
      const [from, to] = key.split("->");
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from)!.push(to);
    }

    // DFS 检测循环
    const visited = new Set<string>();
    const path: string[] = [];
    const inStack = new Set<string>();

    for (const [node] of graph) {
      if (!visited.has(node)) {
        const cycle = this.dfsDetect(node, graph, visited, path, inStack);
        if (cycle.length > 0) {
          session.state = "deadlocked";
          session.onDeadlock?.(sessionId, cycle);
          return cycle;
        }
      }
    }
    return [];
  }

  /** 销毁会话 */
  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private getSession(sessionId: string): CheckSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    return session;
  }

  /** DFS 检测有向图中的循环 */
  private dfsDetect(
    node: string,
    graph: Map<string, string[]>,
    visited: Set<string>,
    path: string[],
    inStack: Set<string>
  ): string[] {
    visited.add(node);
    inStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const result = this.dfsDetect(neighbor, graph, visited, path, inStack);
        if (result.length > 0) return result;
      } else if (inStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        return path.slice(cycleStart).concat(neighbor);
      }
    }

    path.pop();
    inStack.delete(node);
    return [];
  }
}
