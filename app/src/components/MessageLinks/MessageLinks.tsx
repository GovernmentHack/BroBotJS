import React from 'react'
import { SankeyNode, SankeyLink, SankeyLayout, sankeyCircular, sankeyLeft} from "d3-sankey-circular"
import "./MessageLinks.scss"

export interface IMessageLinksProps {
  links?: IMessageLink[]
}

export interface IMessageLink {
  key: {
    first: string;
    second: string;
  };
  nodes: {
    weight: number;
    probability: number[];
    next: string;
  }[];
  weightTotal: number;
}

interface INodeExtra {
  name: string;
}

interface ILinkExtra {
  probability: number;
}

type ICustomNode = SankeyNode<INodeExtra, ILinkExtra>
type ICustomLink = SankeyLink<INodeExtra, ILinkExtra>

interface DAG {
  nodes: ICustomNode[];
  links: ICustomLink[];
}

export const getDataFromLinks = (links: IMessageLink[]) : DAG => {
  let data : DAG = { nodes: [], links: []}

  data.nodes.push({name: links[0].key.first})
  data.links.push({
    source: links[0].key.first,
    target: links[0].key.second,
    value: 1,
    probability: 1 
  })

  links.forEach((link : IMessageLink) => {
    if (!link) return  // can't find why this may happen...
    if (!data.nodes.find(n => n.name === link.key.second)) {
      data.nodes.push({name: link.key.second})
    } 
    link.nodes.forEach((node) => {
      if (!data.nodes.find(n => n.name === node.next)) {
        data.nodes.push({name: node.next})
      }
      if(link.key.second !== node.next) {
        data.links.push({
          source: link.key.second,
          target: node.next,
          value: node.weight,
          probability: node.probability[1] - node.probability[0] 
        })
      }
    })
  })

  return data
}

const SankeyNode : React.FC<any> = ({ name, x0, x1, y0, y1, color }) => (
  <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={color}>
    <title>{name ? name : "<null>"}</title>
  </rect>
)

const SankeyLink : React.FC<any> = ({ link }) => (
  <g
    className="message-links__link"
  >
    <path
      d={link.path}
      style={{
        fill: 'none',
        strokeWidth: Math.max(1, link.width),
      }}
    />
    <text 
      x={link.target.x0 - 64}
      y={(link.target.y1 - link.target.y0) / 2 + link.target.y0}
      className="message-links__link__label"  
    >
      {`${(link.probability * 100).toFixed(2)}%`}
    </text>
  </g>
)

const NodeLabel : React.FC<any> = ({ name, x0, x1, y0, y1, color }) => (
  <text 
    x={x1 + 8}
    y={(y0 + y1) / 2}
    className="message-links__label"  
  >
    {name ? name : "<null>"}
  </text>
)

const MessageLinks : React.FC<IMessageLinksProps> = (props) => {
  if (!props.links || props.links.length < 1) {
    return (<div className="message-links-empty"></div>)
  }

  let data: DAG = getDataFromLinks(props.links)

  const height = data.links.reduce((accumulator, link) => accumulator + link.value, 16) * 16
  const width = (props.links.length + 1) * 128

  const generator : SankeyLayout<DAG , ICustomNode, ICustomLink> = sankeyCircular<DAG, ICustomNode, ICustomLink>()
    .nodeWidth(15)
    .nodePadding(10)
    .nodeId((node: ICustomNode) => node.name)
    .nodeAlign(sankeyLeft)
    .size([width, height])

  const { nodes, links } = generator(data)
  
  return (
    <div className="message-links">
      <svg height={height} width={width + 64}>
        <g style={{ mixBlendMode: 'multiply' }}>
          {nodes.map((node: ICustomNode) => (
            <SankeyNode
              {...node}
              color={"#333333"}
              key={node.name}
            />
          ))}
          {links.map((link: ICustomLink, i: number) => (
            <SankeyLink
              link={link}
              key={`${link.source}-${link.target}-${i}`}
            />
          ))}
          {nodes.map((node: ICustomNode) => (
            <NodeLabel
              {...node}
              key={`${node.name}-label`}
            />
          ))}
        </g>
      </svg>
    </div>  
  )
}

export default MessageLinks