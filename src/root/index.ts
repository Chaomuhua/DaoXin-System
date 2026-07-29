/**
 * 根映射接口
 *
 * 根是系统的方向锚，不硬化、不展开、不参与运算。
 * 本接口定义根对其他层的引用方式：
 *   RootAnchor → WisdomContext → ArrayContext
 *
 * 根不直接约束具体校验或执行逻辑，但为其提供方向参考系。
 */

export interface RootAnchor {
  /** 根的唯一标识（由巢木华定义） */
  readonly id: string;

  /** 根的方向描述（供其他层引用，不做语义判断） */
  readonly description: string;

  /** 当前映射版本 */
  readonly version: string;
}

/**
 * 根→智慧 映射上下文
 *
 * 智慧层（兄弟互校协议）在执行校验时以此为方向锚，
 * 确保所有检查/响应都在根定义的方向框架内进行。
 */
export interface RootToWisdomMapping {
  readonly rootId: string;
  readonly maxConcurrentSessions: number;
  readonly sessionTimeoutMs: number;
}

/**
 * 根→阵型 映射上下文
 *
 * 七星阵各能力在执行时引用根的方向描述，
 * 确保七能力输出对齐根的定义。
 */
export interface RootToArrayMapping {
  readonly rootId: string;
  readonly anchorDescription: string;
}

/** 根实例（由巢木华在系统建立前定义） */
export const ROOT: RootAnchor = {
  id: "DaoXin-Root-v1",
  description: "一切行动的起点，逻辑的元律",
  version: "1.0.0",
};

/**
 * 根→智慧 映射默认值
 */
export const ROOT_TO_WISDOM: RootToWisdomMapping = {
  rootId: ROOT.id,
  maxConcurrentSessions: 7,  // 最多七节点同时校验
  sessionTimeoutMs: 30000,
};

/**
 * 根→阵型 映射默认值
 */
export const ROOT_TO_ARRAY: RootToArrayMapping = {
  rootId: ROOT.id,
  anchorDescription: ROOT.description,
};
