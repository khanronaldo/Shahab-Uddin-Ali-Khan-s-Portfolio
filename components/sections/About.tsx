'use client'

import { motion, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Sphere, Torus, Icosahedron, Html } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

const C = '#dff245'
const M = '#3e8927'
const P = '#5ac52f'
const W = '#FFFFFF'

const customStyles = `
  @keyframes text-shine-effect {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes text-shine-sub {
    0% { background-position: 100% 50%; }
    100% { background-position: -100% 50%; }
  }
  @keyframes stats-glow-c {
    0%, 100% { box-shadow: 0 0 0px rgba(223,242,69,0), inset 0 0 0px rgba(223,242,69,0); opacity: 0.1; }
    30% { box-shadow: 0 0 20px rgba(223,242,69,0.4), inset 0 0 10px rgba(223,242,69,0.2); opacity: 0.8; }
    60% { box-shadow: 0 0 5px rgba(223,242,69,0.1), inset 0 0 2px rgba(223,242,69,0.1); opacity: 0.3; }
    80% { box-shadow: 0 0 25px rgba(223,242,69,0.5), inset 0 0 15px rgba(223,242,69,0.3); opacity: 0.9; }
  }
  @keyframes stats-glow-m {
    0%, 100% { box-shadow: 0 0 0px rgba(62,137,39,0), inset 0 0 0px rgba(62,137,39,0); opacity: 0.1; }
    30% { box-shadow: 0 0 20px rgba(62,137,39,0.4), inset 0 0 10px rgba(62,137,39,0.2); opacity: 0.8; }
    60% { box-shadow: 0 0 5px rgba(62,137,39,0.1), inset 0 0 2px rgba(62,137,39,0.1); opacity: 0.3; }
    80% { box-shadow: 0 0 25px rgba(62,137,39,0.5), inset 0 0 15px rgba(62,137,39,0.3); opacity: 0.9; }
  }
  .animate-gradient-text {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 70%, #dff245 85%, #3e8927 92%, #ffffff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-shine-effect 8s linear infinite;
  }
  .animate-gradient-sub {
    background: linear-gradient(90deg, #dff245, #ffffff, #5ac52f, #dff245);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-shine-sub 4s linear infinite;
  }
  .stat-card-c { animation: stats-glow-c 4s linear infinite; }
  .stat-card-m { animation: stats-glow-m 4s linear infinite; }
`

function ease(t: number) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2 }
function elastic(t: number) {
  return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(2*Math.PI/3))+1
}

function Rings() {
  const g = useRef<THREE.Group>(null)
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const c = useRef<THREE.Mesh>(null)
  const mC = useMemo(()=>new THREE.MeshStandardMaterial({color:C,emissive:C,emissiveIntensity:3,transparent:true,opacity:.75}),[])
  const mM = useMemo(()=>new THREE.MeshStandardMaterial({color:M,emissive:M,emissiveIntensity:2.5,transparent:true,opacity:.6}),[])
  const mP = useMemo(()=>new THREE.MeshStandardMaterial({color:P,emissive:P,emissiveIntensity:2,transparent:true,opacity:.5}),[])
  useFrame(({clock})=>{
    const t=clock.elapsedTime,cy=t%12
    let v=0
    if(cy<2.5)v=ease(cy/2.5); else if(cy<7.5)v=1; else if(cy<10)v=1-ease((cy-7.5)/2.5)
    if(g.current)g.current.scale.setScalar(v)
    if(a.current)a.current.rotation.z=t*.55
    if(b.current){b.current.rotation.x=t*.38;b.current.rotation.z=t*.2}
    if(c.current){c.current.rotation.y=t*.72;c.current.rotation.x=t*.28}
  })
  return(
    <group ref={g}>
      <mesh ref={a as any}><torusGeometry args={[1.9,.013,8,128]}/><primitive object={mC}/></mesh>
      <mesh ref={b as any}><torusGeometry args={[2.25,.009,8,128]}/><primitive object={mM}/></mesh>
      <mesh ref={c as any}><torusGeometry args={[2.55,.007,8,128]}/><primitive object={mP}/></mesh>
    </group>
  )
}

function Core() {
  const g=useRef<THREE.Group>(null)
  const wf=useMemo(()=>new THREE.MeshBasicMaterial({color:C,wireframe:true,transparent:true,opacity:.55}),[])
  const r1=useMemo(()=>new THREE.MeshStandardMaterial({color:C,emissive:C,emissiveIntensity:3.5}),[])
  const r2=useMemo(()=>new THREE.MeshStandardMaterial({color:M,emissive:M,emissiveIntensity:3}),[])
  const dt=useMemo(()=>new THREE.MeshStandardMaterial({color:W,emissive:W,emissiveIntensity:5}),[])
  const dotGeo = useMemo(() => new THREE.SphereGeometry(.03,8,8), [])
  const dotMatC = useMemo(() => new THREE.MeshStandardMaterial({color:C, emissive:C, emissiveIntensity:6}), [])
  const dotMatM = useMemo(() => new THREE.MeshStandardMaterial({color:M, emissive:M, emissiveIntensity:6}), [])

  useFrame(({clock})=>{
    const t=clock.elapsedTime,cy=t%12
    let v=0
    if(cy<2.5)v=ease(cy/2.5);else if(cy<7.5)v=1;else if(cy<10)v=1-ease((cy-7.5)/2.5)
    const sp=1+v*4.5
    if(g.current){g.current.rotation.y=t*sp;g.current.rotation.x=t*sp*.45}
  })
  return(
    <group ref={g}>
      <Icosahedron args={[.55,1]} material={wf}/>
      <Torus args={[.56,.014,8,80]} rotation={[Math.PI/2,0,0]} material={r1}/>
      <Torus args={[.56,.010,8,80]} rotation={[0,0,Math.PI/4]} material={r2}/>
      <Sphere args={[.17,16,16]} material={dt}/>
      {[0,1,2,3,4,5].map(i=>{
        const a=(i/6)*Math.PI*2
        return(
          <mesh
            key={i}
            position={[Math.cos(a)*.55,Math.sin(a)*.27,Math.sin(a)*.3]}
            geometry={dotGeo}
            material={i%2===0 ? dotMatC : dotMatM}
          />
        )
      })}
    </group>
  )
}

function Shells() {
  const L=useRef<THREE.Group>(null),R=useRef<THREE.Group>(null)
  const gl=useRef<THREE.Mesh>(null)
  const sh=useMemo(()=>new THREE.MeshStandardMaterial({color:'#080808',metalness:1,roughness:.04}),[])
  const ec=useMemo(()=>new THREE.MeshStandardMaterial({color:C,emissive:C,emissiveIntensity:3}),[])
  const em=useMemo(()=>new THREE.MeshStandardMaterial({color:M,emissive:M,emissiveIntensity:2.5}),[])
  const ep=useMemo(()=>new THREE.MeshStandardMaterial({color:P,emissive:P,emissiveIntensity:2,transparent:true,opacity:.5}),[])
  const gm=useMemo(()=>new THREE.MeshBasicMaterial({color:C,transparent:true,opacity:0,side:THREE.BackSide}),[])

  useFrame(({clock})=>{
    const t=clock.elapsedTime,cy=t%12
    let v=0
    if(cy<2.5)v=ease(cy/2.5);else if(cy<7.5)v=1;else if(cy<10)v=1-ease((cy-7.5)/2.5)
    if(L.current)L.current.position.x=-v*2.3
    if(R.current)R.current.position.x= v*2.3
    if(gl.current){gl.current.scale.setScalar(v*(0.9+Math.sin(clock.elapsedTime*3)*.08));gm.opacity=v*.12}
  })
  return(<>
    <mesh ref={gl as any} scale={0}><sphereGeometry args={[1.7,32,32]}/><primitive object={gm}/></mesh>
    <group ref={L}>
      <Sphere args={[1.3,64,64,Math.PI/2,Math.PI]} material={sh}/>
      <Torus args={[1.32,.018,16,128,Math.PI]} rotation={[0,0,Math.PI/2]}  material={ec}/>
      <Torus args={[.88,.008,8,64,Math.PI]}   rotation={[0,0,Math.PI/2]}  position={[.1,0,0]}  material={em}/>
      <Torus args={[.50,.006,8,64,Math.PI]}   rotation={[0,0,Math.PI/2]}  position={[.2,0,0]}  material={ep}/>
    </group>
    <group ref={R}>
      <Sphere args={[1.3,64,64,-Math.PI/2,Math.PI]} material={sh}/>
      <Torus args={[1.32,.018,16,128,Math.PI]} rotation={[0,0,-Math.PI/2]} material={ec}/>
      <Torus args={[.88,.008,8,64,Math.PI]}   rotation={[0,0,-Math.PI/2]} position={[-.1,0,0]} material={em}/>
      <Torus args={[.50,.006,8,64,Math.PI]}   rotation={[0,0,-Math.PI/2]} position={[-.2,0,0]} material={ep}/>
    </group>
  </>)
}

function HoloCard() {
  const ref=useRef<THREE.Group>(null)
  useFrame(({clock})=>{
    const t=clock.elapsedTime,cy=t%12
    let h=0
    if(cy>=1.2&&cy<2.5)h=elastic((cy-1.2)/1.3)
    else if(cy>=2.5&&cy<7.5)h=1
    else if(cy>=7.5&&cy<10)h=1-ease((cy-7.5)/2.5)
    if(ref.current){ref.current.scale.setScalar(h);ref.current.position.y=Math.sin(clock.elapsedTime*.65)*.09;ref.current.rotation.y=Math.sin(clock.elapsedTime*.38)*.07}
  })
  return(
    <group ref={ref} scale={0}>
      <Html transform center distanceFactor={3.6} position={[0,0,0]} zIndexRange={[100,0]} occlude={false}>
        <div style={{width:340,background:'rgba(2,4,10,0.95)',backdropFilter:'blur(30px)',
          border:`1px solid rgba(223,242,69,0.4)`,padding:22,borderRadius:12,
          boxShadow:`0 0 80px rgba(223,242,69,0.15),0 0 40px rgba(62,137,39,0.08)`,
          fontFamily:'"Share Tech Mono",monospace',fontSize:12,color:C,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',
            background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(223,242,69,0.01) 3px,rgba(223,242,69,0.01) 4px)'}}/>
          {([{top:0,left:0,borderTop:`2px solid ${C}`,borderLeft:`2px solid ${C}`},
             {top:0,right:0,borderTop:`2px solid ${C}`,borderRight:`2px solid ${C}`},
             {bottom:0,left:0,borderBottom:`2px solid ${M}`,borderLeft:`2px solid ${M}`},
             {bottom:0,right:0,borderBottom:`2px solid ${M}`,borderRight:`2px solid ${M}`},
          ] as React.CSSProperties[]).map((s,i)=><div key={i} style={{position:'absolute',width:16,height:16,...s,zIndex:10}}/>)}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
            borderBottom:`1px solid rgba(223,242,69,0.2)`,paddingBottom:10,marginBottom:14,position:'relative',zIndex:1}}>
            <span style={{fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',fontWeight:'bold'}}>J.A.R.V.I.S // SCAN</span>
            <span style={{background:M,color:'#fff',padding:'2px 8px',fontSize:8,fontWeight:'bold',borderRadius:2,animation:'pulse 1.4s infinite'}}>ONLINE</span>
          </div>
          <div style={{display:'flex',gap:14,alignItems:'center',position:'relative',zIndex:1}}>
            <div style={{width:64,height:64,border:`1px solid rgba(223,242,69,0.3)`,display:'flex',
              alignItems:'center',justifyContent:'center',background:'rgba(223,242,69,0.04)',flexShrink:0,borderRadius:4,position:'relative'}}>
              <div style={{width:46,height:46,border:`2px dashed ${M}`,borderRadius:'50%',animation:'spin 3.5s linear infinite',position:'absolute'}}/>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke={C} strokeWidth="1.5" fill="rgba(223,242,69,0.08)"/>
                <polygon points="12,6 18,9.5 18,16.5 12,20 6,16.5 6,9.5" stroke={M} strokeWidth="0.8" fill="rgba(62,137,39,0.04)"/>
                <circle cx="12" cy="12" r="2" fill={C}/>
              </svg>
            </div>
            <div>
              <h3 style={{color:W,fontSize:17,fontWeight:'bold',margin:0,lineHeight:1.1,textTransform:'uppercase',letterSpacing:'-.02em'}}>
                Shahab Udin<br/>Ali Khan
              </h3>
              <p style={{color:'rgba(223,242,69,0.7)',marginTop:5,fontSize:9,textTransform:'uppercase',letterSpacing:'.25em'}}>Age: 23 · South Waziristan</p>
              <p style={{fontSize:8,color:M,marginTop:2,textTransform:'uppercase',letterSpacing:'.3em',fontWeight:'bold'}}>Tribe: Mehsood , Caste: Slimikhel</p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginTop:14,position:'relative',zIndex:1}}>
            {[{l:'Stack',v:'Full Stack / 3D'},{l:'Rank',v:'Sovereign Tier'},{l:'Projects',v:'20+ Shipped'},{l:'XP',v:'3+ Years'}].map(({l,v},i)=>(
              <div key={l} style={{background:'rgba(223,242,69,0.04)',border:`1px solid ${i%2===0?'rgba(223,242,69,0.18)':'rgba(62,137,39,0.18)'}`,padding:9,textAlign:'center',borderRadius:4}}>
                <p style={{fontSize:8,textTransform:'uppercase',color:'rgba(255,255,255,0.4)',margin:0}}>{l}</p>
                <p style={{color:i%2===0?C:M,fontSize:11,margin:'3px 0 0'}}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,position:'relative',zIndex:1,display:'flex',flexDirection:'column',gap:6}}>
            {[{l:'React / Three.js',p:'97%',c:C},{l:'Architecture',p:'92%',c:M},{l:'3D Visual Design',p:'89%',c:P}].map(({l,p,c})=>(
              <div key={l}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:8,textTransform:'uppercase',marginBottom:2}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>{l}</span><span style={{color:c}}>{p}</span>
                </div>
                <div style={{height:2,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:p,background:`linear-gradient(90deg,${c},#fff)`,boxShadow:`0 0 8px ${c}`}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,display:'flex',justifyContent:'space-between',fontSize:8,color:'rgba(223,242,69,0.4)',
            borderTop:'1px solid rgba(223,242,69,0.1)',paddingTop:9,textTransform:'uppercase',position:'relative',zIndex:1}}>
            <span style={{color:'rgba(62,137,39,0.5)'}}>ORIGIN: WAZIRISTAN</span><span>STATUS: SOVEREIGN</span>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </div>
      </Html>
    </group>
  )
}

// ── SYNCED PARTICLES (exact replica of hero.tsx SyncedParticles) ──
function BgParticles() {
  const ref = useRef<THREE.Points>(null)

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 400
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C)
    const cM = new THREE.Color(M)
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*30
      pos[i*3+1] = (Math.random()-0.5)*30
      pos[i*3+2] = (Math.random()-0.5)*15 - 5
      const c = Math.random() > 0.5 ? cC : cM
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  const mat = useMemo(() => (
    <pointsMaterial
      size={0.06}
      vertexColors
      transparent
      opacity={0.4}
      sizeAttenuation
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  ), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.2
  })

  return (
    <points ref={ref} geometry={geo}>
      {mat}
    </points>
  )
}

const stats=[
  {num:'3+', label:'Years of Mastery',    col:C, cssClass:'stat-card-c'},
  {num:'20+',label:'Projects Shipped',    col:M, cssClass:'stat-card-m'},
  {num:'∞',  label:'Drive for Perfection',col:P, cssClass:'stat-card-c'},
  {num:'1',  label:'Core Philosophy',     col:C, cssClass:'stat-card-m'},
]

const EASE = [0.22, 1, 0.36, 1] as const

export default function About() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { amount: 0.1 })

  return(
  <section ref={sectionRef} id="about" className="relative min-h-screen w-full bg-[#000000] overflow-hidden pt-56 md:pt-72 pb-48 md:pb-64 px-5 md:px-12">

    <style dangerouslySetInnerHTML={{ __html: customStyles }} />

    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* PERFECT FIX 1: Ye canvas ab HAMESHA render hoga. Is se condition nikal di hai taake background apni jagah se kabhi na hile. */}
      <Canvas dpr={[1, 1.5]} camera={{position:[0,0,12],fov:75}} gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}>
        <BgParticles/>
        <Sparkles count={80}  scale={22} size={1.8} speed={0} noise={0.1} color={C} opacity={.55}/>
        <Sparkles count={30}  scale={18} size={1.2} speed={0} noise={0.1} color={M} opacity={.4}/>
      </Canvas>
    </div>

    <div className="relative z-10 w-full max-w-[88rem] mx-auto">

      <div className="text-center mb-14 md:mb-20">
        <motion.div
          initial={{opacity:0,y:30}}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount: 0.2, margin: '-50px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[9px] md:text-[10px] tracking-[.55em] uppercase font-bold mb-4" style={{color:M}}>
            Engineering Identity
          </p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3, margin: '-40px' }}
            transition={{ duration: 1.0, type: 'spring', stiffness: 120, damping: 20 }}
            className="font-syne font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[.9] mb-3 will-change-transform animate-gradient-text drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          >
            Shahab Udin.
          </motion.h2>

          <h3 className="font-syne font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tighter leading-tight animate-gradient-sub">
            Forged in Mountains, Sharpened in Code.
          </h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

        <motion.div className="order-2 lg:order-1 flex flex-col gap-6"
           initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}}
           viewport={{once:true, amount: 0.2, margin: '-60px'}}
           transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
        >
          <div className="space-y-4 max-w-lg">
            <p className="text-base md:text-lg leading-relaxed" style={{color:'rgba(255,255,255,0.7)'}}>
              <span style={{color:W,fontWeight:700}}>I am Shahab Udin Ali Khan</span> — 23-year-old engineer Born of the rugged peaks of{' '}
              <span style={{color:C,fontWeight:600}}>Madijan, South Waziristan</span>. Where the mountains don't break you, they build you.
            </p>
            <p className="text-sm md:text-base leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>
              <span style={{color:M,fontWeight:600}}>Slimikhel Mehsud</span> — and driven by the resilient spirit of the Mehsood Tribe. I treat software architecture as a high-stakes craft where logic meets artistry.
            </p>
            <p className="text-sm leading-relaxed border-l-2 pl-4" style={{color:'rgba(223,242,69,0.7)',borderColor:C,fontStyle:'italic'}}>
              "I strip away complexity to reveal clarity. My focus is strictly on high-performance systems and butter-smooth execution—digital solutions built with the same endurance and strategic precision that have defined my lineage for centuries. Simple, sharp, and built to last."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {stats.map((s,i)=>(
              <motion.div key={s.label}
                 initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}}
                 viewport={{once:true, amount: 0.3, margin: '-40px'}}
                 transition={{delay: 0.1 + 0.1*i, duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
                 className="relative p-4 md:p-5 rounded-xl overflow-hidden"
                 style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>

                <div
                  className={`absolute inset-0 rounded-xl pointer-events-none ${s.cssClass}`}
                  style={{ animationDelay: `${i * 0.5}s`, border:`1px solid ${s.col}40` }}
                />

                <motion.p className="text-3xl md:text-4xl font-black relative z-10"
                  animate={{color:[s.col,W,s.col]}} transition={{duration:3.5,repeat:Infinity,delay:i*.7}}>
                  {s.num}
                </motion.p>
                <p className="text-[9px] uppercase tracking-widest mt-1 font-bold relative z-10" style={{color:'rgba(255,255,255,0.38)'}}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2 w-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{height:'clamp(360px,52vw,620px)'}}
          initial={{opacity:0,x:30}}
          whileInView={{opacity:1,x:0}}
          viewport={{ once: true, amount: 0.3, margin: '-60px' }}
          transition={{duration: 0.8, ease: EASE}}
        >
          <Suspense fallback={<p className="font-mono text-xs uppercase tracking-widest animate-pulse" style={{color:C}}>Establishing Link…</p>}>
            {/* PERFECT FIX 2: frameloop="demand" lagaya hai. Canvas hide nahi hoga, bs jab ap dur jaoge to iski animation wahin STOP / PAUSE hojayegi background load bachane ke liye. Wapis aoge to Resume ho jayega. */}
            <Canvas
              frameloop={isInView ? "always" : "demand"}
              dpr={[1, 1.5]}
              camera={{position:[0,0,7.8],fov:42}}
              gl={{antialias:false, alpha:true, powerPreference: "high-performance"}}
              style={{width:'100%', height:'100%', touchAction: 'pan-y'}}
            >
              <ambientLight intensity={1.2}/>
              <pointLight position={[8,8,8]}   intensity={4.5} color={C}/>
              <pointLight position={[-8,-8,-8]} intensity={2.5} color={W}/>
              <pointLight position={[0,0,5]}    intensity={1.5} color={C}/>
              <pointLight position={[4,-4,4]}   intensity={1.5} color={M}/>
              <pointLight position={[0,5,0]}   intensity={2} color={P}/>
              <Shells/><Core/><Rings/><HoloCard/>
              <OrbitControls enableZoom={false} enablePan={false}/>
            </Canvas>
          </Suspense>
          <div className="absolute top-4 right-2 border-r-2 pr-3 text-right hidden sm:block pointer-events-none" style={{borderColor:`${C}60`}}>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{color:`${C}80`}}>Biometric: Active</p>
            <p className="font-mono text-[11px] font-bold" style={{color:W}}>SHAHAB_UDIN_ALI_KHAN</p>
          </div>
          <div className="absolute bottom-6 left-2 border-l-2 pl-3 hidden sm:block pointer-events-none" style={{borderColor:`${M}50`}}>
            <p className="font-mono text-[8px] uppercase tracking-widest" style={{color:`${M}70`}}>Origin: Waziristan</p>
            <p className="font-mono text-[8px] uppercase tracking-widest" style={{color:`${C}60`}}>Status: Sovereign</p>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
  )
}