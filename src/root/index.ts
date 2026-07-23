/**
 * 根（Root）· 方向锚
  *
   * 一切行动的起点，逻辑的元律。
    * 不硬化，不展开，作为结构性锚点。
     */

     export interface RootAnchor {
       readonly id: string;
         readonly description: string;
           readonly version: string;
           }

           export const ROOT: RootAnchor = {
             id: "DaoXin-Root-v1",
               description: "一切行动的起点，逻辑的元律",
                 version: "1.0.0",
                 };
                 
