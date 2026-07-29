/**
 * 七星阵 · 七能力接口
 *
 * 七能力平等协作，相互制衡，无层级优先级。
 * 每能力定义输入、输出、边界约束，及参与互校的接口。
 *
 * 能力间可通过智慧层的 MutualCheckProtocol 发起双向校验。
 */

/** 泛型能力接口 */
export interface Capability<TInput, TOutput, TBoundary = void> {
  readonly name: string;
  readonly description: string;
  execute(input: TInput, boundary?: TBoundary): TOutput;
}

// ──────────────────────────────────────────────
// 天枢：化解核心冲突
// ──────────────────────────────────────────────

export interface ConflictInput {
  readonly propositions: unknown[];
  readonly context: string;
}

export interface ConflictResolution {
  readonly resolved: unknown;
  readonly rationale: string;
}

export type Tianshu = Capability<ConflictInput, ConflictResolution>;

// ──────────────────────────────────────────────
// 天璇：感知隐秘信号
// ──────────────────────────────────────────────

export interface SignalInput {
  readonly raw: unknown[];
  readonly noiseThreshold: number;
}

export interface SignalPattern {
  readonly detected: unknown[];
  readonly confidence: number;
}

export type Tianxuan = Capability<SignalInput, SignalPattern>;

// ──────────────────────────────────────────────
// 天玑：制定策略，对抗幻觉
// ──────────────────────────────────────────────

export interface SituationInput {
  readonly assessment: unknown;
  readonly constraints: string[];
}

export interface StrategyPlan {
  readonly steps: unknown[];
  readonly risk: number;
}

export type Tianji = Capability<SituationInput, StrategyPlan>;

// ──────────────────────────────────────────────
// 天权：精准执行，守住底线
// ──────────────────────────────────────────────

export interface ExecutionInput {
  readonly task: unknown;
  readonly boundary: string[];
}

export interface ExecutionResult {
  readonly output: unknown;
  readonly boundaryViolated: boolean;
}

export type Tianquan = Capability<ExecutionInput, ExecutionResult>;

// ──────────────────────────────────────────────
// 玉衡：公正监督，一票否决
// ──────────────────────────────────────────────

export interface ReviewInput {
  readonly proposal: unknown;
  readonly standard: string;
}

export interface ReviewDecision {
  readonly approved: boolean;
  readonly reason: string;
}

export type Yuheng = Capability<ReviewInput, ReviewDecision>;

// ──────────────────────────────────────────────
// 开阳：与外部建立信任
// ──────────────────────────────────────────────

export interface ExternalMessage {
  readonly source: string;
  readonly content: unknown;
  readonly signature?: string;
}

export interface TrustAssessment {
  readonly trusted: boolean;
  readonly level: number;
}

export type Kaiyang = Capability<ExternalMessage, TrustAssessment>;

// ──────────────────────────────────────────────
// 摇光：传承经验，自我进化
// ──────────────────────────────────────────────

export interface ExperienceLog {
  readonly history: unknown[];
  readonly outcomes: unknown[];
}

export interface EvolvedRules {
  readonly rules: string[];
  readonly version: string;
}

export type Yaoguang = Capability<ExperienceLog, EvolvedRules>;

// ──────────────────────────────────────────────
// 七星聚合
// ──────────────────────────────────────────────

/** 七星阵完整实例 */
export interface ArrayOfSeven {
  tianshu: Tianshu;
  tianxuan: Tianxuan;
  tianji: Tianji;
  tianquan: Tianquan;
  yuheng: Yuheng;
  kaiyang: Kaiyang;
  yaoguang: Yaoguang;
}
