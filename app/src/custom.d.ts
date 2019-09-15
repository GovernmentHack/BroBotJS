declare module '*.png'
declare module 'd3-sankey-circular' {

  import { sankey, SankeyNode, SankeyLink, SankeyLayout, sankeyLeft } from "d3-sankey"

  function sankeyCircular<T, U, V>() : any

  export { SankeyNode, SankeyLink, SankeyLayout, sankeyLeft, sankeyCircular } 
}