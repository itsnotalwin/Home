import React from 'react';
const Box=({p=[0,0,0],s=[1,1,1],c='#e8e5da'})=><mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={.7}/></mesh>;
export const studioTypes=['cabinet','sink','fridge','wallcabinet','sofa','ottoman','doorway'];
export default function StudioFurniture({item}){
 const [w,h,d]=item.size,c=item.color;
 if(item.type==='sofa')return <><Box p={[0,h*.2,0]} s={[w,h*.4,d]} c={c}/><Box p={[0,h*.73,-d*.4]} s={[w,h*.54,d*.2]} c={c}/>{[-1,1].map(n=><group key={n}><Box p={[n*w*.45,h*.5,0]} s={[w*.1,h*.65,d]} c={c}/><Box p={[n*w*.21,h*.47,d*.04]} s={[w*.4,h*.16,d*.7]} c={c}/><Box p={[n*w*.21,h*.76,-d*.26]} s={[w*.4,h*.43,d*.16]} c={c}/></group>)}</>;
 if(item.type==='ottoman')return <><Box p={[0,h*.43,0]} s={[w,h*.86,d]} c={c}/><Box p={[0,h*.94,0]} s={[w,h*.12,d]} c={c}/></>;
 if(item.type==='doorway')return <><Box p={[-w*.47,h/2,0]} s={[w*.06,h,d]} c={c}/><Box p={[w*.47,h/2,0]} s={[w*.06,h,d]} c={c}/><Box p={[0,h*.985,0]} s={[w,h*.03,d]} c={c}/></>;
 if(item.type==='fridge')return <><Box p={[0,h/2,0]} s={[w,h,d]} c={c}/><Box p={[0,h*.32,d*.501]} s={[w,.012,.012]} c='#b4b8b3'/>{[.23,.72].map(y=><Box key={y} p={[-w*.35,h*y,d*.53]} s={[.025,h*.13,.04]} c='#bdc3be'/>)}<Box p={[0,h*.04,d*.506]} s={[w*.8,.04,.02]} c='#6b706a'/></>;
 const wall=item.type==='wallcabinet';
 return <><Box p={[0,h*.48,0]} s={[w,h*.96,d]} c={c}/><Box p={[0,h*.5,d*.501]} s={[.012,h*.9,.01]} c='#a3a599'/>{[-1,1].map(n=><Box key={n} p={[n*w*.07,h*.67,d*.53]} s={[.018,h*.2,.035]} c='#4a504b'/>)}
 {!wall&&<><Box p={[0,h*.975,0]} s={[w*1.02,h*.05,d*1.04]} c='#73766c'/><Box p={[0,h*.04,d*.49]} s={[w,.07,.02]} c='#777468'/></>}
 {item.type==='sink'&&<><Box p={[w*.2,h*1.004,0]} s={[w*.45,.012,d*.74]} c='#bec2bb'/><Box p={[w*.2,h*1.014,0]} s={[w*.36,.012,d*.58]} c='#596660'/><Box p={[-w*.25,h*1.004,0]} s={[w*.4,.012,d*.74]} c='#aeb6ad'/>{[0,1,2,3,4].map(n=><Box key={n} p={[-w*.4+n*w*.075,h*1.014,0]} s={[.008,.008,d*.6]} c='#7d8981'/>)}<Box p={[w*.2,h*1.12,-d*.37]} s={[.025,h*.23,.025]} c='#bcc5bd'/><Box p={[w*.2,h*1.23,-d*.25]} s={[.025,.025,d*.28]} c='#bcc5bd'/></>}
 </>;
}
