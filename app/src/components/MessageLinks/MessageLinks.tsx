import React, { Children } from 'react'
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import "./MessageLinks.scss"
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'

interface IMessageLinksProps {
  links?: IMessageLink[]
}

interface IMessageLink {
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

const MessageLinks : React.FC<IMessageLinksProps> = (props) => {
  if (!props.links) {
    return (<div className="message-links"></div>)
  }

  const links = props.links.map((link) => {
    const nodes = link.nodes.map((node) => {
      const probability = 
        Math.floor((node.probability[1] - node.probability[0]) * 100)
      
      return (
        <Chip 
          key={node.next}
          label={!!node.next ? node.next : "<null>"}
          avatar={<Avatar>{`${probability}%`}</Avatar>}
          className="message-links__link-node"
        />
      )
    }
    )
    
    return (
      <Card 
        key={`${link.key.first}${link.key.second}`}
        className="message-links__link"
      >
        <div className="message-links__link-header">
          <Typography>{link.key.first}</Typography>
          <Typography color="textSecondary">{!!link.key.second ? link.key.second : "<null>"}</Typography>
        </div>
        <div className="message-links__link-body" >
          {nodes}
        </div>
      </Card>
      )
    }
  )
  
  return (
    <div className="message-links">
      {links}
    </div>  
  )
}

export default MessageLinks