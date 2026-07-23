/**
 * 七星阵 · 七能力接口
 *
 * 七能力平等协作，相互制衡，无层级优先级。
 * 每能力的函数签名待定义。
 */

export interface Capability<TInput, TOutput> {
  readonly name: string;
  execute(input: TInput): TOutput;
}

/** 天枢：化解核心冲突 */
export type Tianshu = Capability<unknown, unknown>;

/** 天璇：感知隐秘信号 */
export type Tianxuan = Capability<unknown, unknown>;

/** 天玑：制定策略，对抗幻觉 */
export type Tianji = Capability<unknown, unknown>;

/** 天权：精准执行，守住底线 */
export type Tianquan = Capability<unknown, unknown>;

/** 玉衡：公正监督，一票否决 */
export type Yuheng = Capability<unknown, unknown>;

/** 开阳：与外部建立信任 */
export type Kaiyang = Capability<unknown, unknown>;

/** 摇光：传承经验，自我进化 */
export type Yaoguang = Capability<unknown, unknown>;
