import React from 'react';
import {RoundedBox} from '@react-three/drei';
const Box=({p=[0,0,0],s=[1,1,1],c='#e8e5da',metalness=0,roughness=.7})=><mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={roughness} metalness={metalness}/></mesh>;
const Soft=({p=[0,0,0],s,c})=><RoundedBox args={s} position={p} radius={Math.min(...s)*.17} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={c} roughness={.72}/></RoundedBox>;
export const studioTypes=['cabinet','sink','fridge','wallcabinet','sofa','ottoman','doorway'];
export default function StudioFurniture({item}){
 const [w,h,d]=item.size,c=item.color;
 if(item.type==='sofa')return <>
  <Soft p={[0,h*.2,0]} s={[w,h*.4,d]} c={c}/><Soft p={[0,h*.73,-d*.39]} s={[w,h*.53,d*.22]} c={c}/>
  {[-1,1].map(n=><group key={n}><Soft p={[n*w*.45,h*.5,0]} s={[w*.1,h*.6,d]} c={c}/><Soft p={[n*w*.21,h*.48,d*.06]} s={[w*.4,h*.15,d*.68]} c={c}/><Soft p={[n*w*.21,h*.76,-d*.25]} s={[w*.39,h*.42,d*.18]} c={c}/></group>)}
 </>;
 if(item.type==='ottoman')return <><Soft p={[0,h*.43,0]} s={[w,h*.86,d]} c={c}/><Soft p={[0,h*.9,0]} s={[w*.98,h*.17,d*.98]} c={c}/></>;
 if(item.type==='doorway')return <><Box p={[-w*.47,h/2,0]} s={[w*.06,h,d]} c={c}/><Box p={[w*.47,h/2,0]} s={[w*.06,h,d]} c={c}/><Box p={[0,h*.985,0]} s={[w,h*.03,d]} c={c}/></>;
 if(item.type==='fridge')return <>
  <Soft p={[0,h/2,0]} s={[w,h,d]} c={c}/><Box p={[0,h*.3,d*.503]} s={[w*.98,.008,.012]} c='#a9aaa4'/>
  {[.17,.69].map(y=><group key={y}><Box p={[-w*.39,h*y,d*.515]} s={[.02,h*.16,.018]} c='#c9ccc6'/><Box p={[-w*.39,h*y,d*.53]} s={[.025,h*.14,.025]} c='#9fa69e'/></group>)}
  <Box p={[0,h*.04,d*.506]} s={[w*.8,.04,.02]} c='#6b706a'/>
 </>;
 const wall=item.type==='wallcabinet';
 return <>
  <Box p={[0,h*.48,0]} s={[w,h*.96,d]} c={c}/>
  {[-1,1].map(n=><group key={n}><Box p={[n*w*.25,h*.5,d*.503]} s={[w*.49,h*.9,.01]} c={c}/><Box p={[n*w*.075,h*.58,d*.515]} s={[.016,h*.23,.015]} c='#505753'/><Box p={[n*w*.075,h*.58,d*.53]} s={[.02,h*.18,.025]} c='#9ba39a'/></group>)}
  <Box p={[0,h*.5,d*.508]} s={[.005,h*.91,.012]} c='#b4b5aa'/>
  {!wall&&<><Box p={[0,h*.975,0]} s={[w*1.02,h*.05,d*1.04]} c='#686d66'/><Box p={[0,h*.04,d*.49]} s={[w,.07,.02]} c='#777468'/></>}
  {item.type==='sink'&&<>
   <Box p={[w*.2,h*1.004,0]} s={[w*.45,.012,d*.74]} c='#b8beb8' metalness={.55} roughness={.38}/><Box p={[w*.2,h*1.014,0]} s={[w*.36,.012,d*.58]} c='#66736e' metalness={.6} roughness={.3}/>
   <Box p={[-w*.25,h*1.004,0]} s={[w*.4,.012,d*.74]} c='#aeb6ad' metalness={.45}/>{[0,1,2,3,4].map(n=><Box key={n} p={[-w*.4+n*w*.075,h*1.014,0]} s={[.008,.008,d*.6]} c='#7d8981'/>)}
   {[-1,1].map(n=><Box key={n} p={[w*.2+n*w*.08,h*1.065,-d*.36]} s={[.035,h*.1,.035]} c='#bfc7bf' metalness={.8} roughness={.25}/>)}
   <Box p={[w*.2,h*1.12,-d*.37]} s={[.025,h*.23,.025]} c='#bcc5bd' metalness={.8} roughness={.25}/><Box p={[w*.2,h*1.23,-d*.25]} s={[.025,.025,d*.28]} c='#bcc5bd' metalness={.8} roughness={.25}/>
  </>}
 </>;
}
