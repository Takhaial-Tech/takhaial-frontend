// Resolve the declarative pairs in React's streamed HTML without executing its scripts.
export function resolveStreams($){
  let moved=0;
  for(let pass=0;pass<12;pass++){
    let changed=0;
    for(const source of $('[id^="S:"]').toArray()){
      const suffix=$(source).attr('id').slice(2);
      const target=$('[id="B:'+suffix+'"], [id="P:'+suffix+'"]').first();
      if(!target.length)continue;
      const placeholder=target.get(0);
      if(placeholder.attribs.id.startsWith('B:')){
        let node=placeholder.next,depth=0;
        while(node){
          const next=node.next;
          if(node.type==='comment'){
            if(node.data==='/$'){if(depth===0)break;depth--;}
            else if(/^\$(?:\?|!)?$/.test(node.data))depth++;
          }
          $(node).remove();node=next;
        }
      }
      target.replaceWith($(source).contents());$(source).remove();changed++;moved++;
    }
    if(!changed)break;
  }
  return moved;
}
