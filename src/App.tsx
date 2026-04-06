import { useState, useCallback } from "react"

export default function App() {
  const [display, setDisplay] = useState("0")
  const [expressao, setExpressao] = useState("")
  const [memoria, setMemoria] = useState(0)
  const [historico, setHistorico] = useState<{expr: string; res: string}[]>([])
  const [mostrarHist, setMostrarHist] = useState(false)

  const limpar = () => { setDisplay("0"); setExpressao("") }

  const apagar = () => {
    if (display.length <= 1 || display === "Erro") setDisplay("0")
    else setDisplay(display.slice(0, -1))
  }

  const digito = (d: string) => {
    if (display === "0" && d !== ".") setDisplay(d)
    else if (display === "Erro") setDisplay(d)
    else setDisplay(display + d)
  }

  const operador = (op: string) => {
    if (display === "Erro") return
    setExpressao(display + " " + op + " ")
    setDisplay("0")
  }

  const fn = useCallback((nome: string) => {
    const v = parseFloat(display)
    if (isNaN(v) && !["pi","e"].includes(nome)) { setDisplay("Erro"); return }
    let r: number
    switch (nome) {
      case "sin": r = Math.sin(v * Math.PI / 180); break
      case "cos": r = Math.cos(v * Math.PI / 180); break
      case "tan": r = Math.tan(v * Math.PI / 180); break
      case "sqrt": r = Math.sqrt(v); break
      case "log": r = Math.log10(v); break
      case "ln": r = Math.log(v); break
      case "pow2": r = v * v; break
      case "pow3": r = v * v * v; break
      case "inv": r = 1 / v; break
      case "abs": r = Math.abs(v); break
      case "pi": r = Math.PI; break
      case "e": r = Math.E; break
      case "pct": r = v / 100; break
      case "fact": r = v < 0 || v > 170 ? NaN : Array.from({length: v}, (_, i) => i + 1).reduce((a, b) => a * b, 1); break
      default: r = v
    }
    if (!isFinite(r) || isNaN(r)) { setDisplay("Erro"); return }
    setDisplay(String(parseFloat(r.toPrecision(12))))
  }, [display])

  const calcular = () => {
    const expr = expressao ? expressao + display : display
    try {
      const js = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**")
      if (!/^[\d\s+\-*/().%e**]+$/.test(js)) { setDisplay("Erro"); return }
      const r = Function(`"use strict"; return (${js})`)()
      if (!isFinite(r)) { setDisplay("Erro"); setExpressao(""); return }
      const s = String(parseFloat(Number(r).toPrecision(12)))
      setHistorico(h => [{expr, res: s}, ...h].slice(0, 30))
      setDisplay(s); setExpressao("")
    } catch { setDisplay("Erro"); setExpressao("") }
  }

  type Btn = { l: string; a: () => void; c?: string; s?: number }
  const btns: Btn[] = [
    {l:"sin",a:()=>fn("sin"),c:"f"},{l:"cos",a:()=>fn("cos"),c:"f"},{l:"tan",a:()=>fn("tan"),c:"f"},{l:"n!",a:()=>fn("fact"),c:"f"},
    {l:"ln",a:()=>fn("ln"),c:"f"},{l:"log",a:()=>fn("log"),c:"f"},{l:"x²",a:()=>fn("pow2"),c:"f"},{l:"√",a:()=>fn("sqrt"),c:"f"},
    {l:"π",a:()=>fn("pi"),c:"f"},{l:"e",a:()=>fn("e"),c:"f"},{l:"C",a:limpar,c:"cl"},{l:"⌫",a:apagar,c:"cl"},
    {l:"MC",a:()=>setMemoria(0),c:"m"},{l:"MR",a:()=>setDisplay(String(memoria)),c:"m"},{l:"M+",a:()=>setMemoria(m=>m+parseFloat(display||"0")),c:"m"},{l:"M-",a:()=>setMemoria(m=>m-parseFloat(display||"0")),c:"m"},
    {l:"7",a:()=>digito("7")},{l:"8",a:()=>digito("8")},{l:"9",a:()=>digito("9")},{l:"÷",a:()=>operador("÷"),c:"op"},
    {l:"4",a:()=>digito("4")},{l:"5",a:()=>digito("5")},{l:"6",a:()=>digito("6")},{l:"×",a:()=>operador("×"),c:"op"},
    {l:"1",a:()=>digito("1")},{l:"2",a:()=>digito("2")},{l:"3",a:()=>digito("3")},{l:"−",a:()=>operador("-"),c:"op"},
    {l:"0",a:()=>digito("0"),s:2},{l:".",a:()=>digito(".")},{l:"+",a:()=>operador("+"),c:"op"},
    {l:"=",a:calcular,c:"eq",s:4},
  ]
  const cor = (c?: string) => {
    switch(c) {
      case "f": return "bg-slate-700 hover:bg-slate-600 text-cyan-400"
      case "op": return "bg-amber-700/30 hover:bg-amber-700/50 text-amber-400"
      case "cl": return "bg-red-500/20 hover:bg-red-500/30 text-red-400"
      case "eq": return "bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
      case "m": return "bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs"
      default: return "bg-slate-800 hover:bg-slate-700 text-slate-100"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-slate-200">Calculadora Avancada</h1>
          <p className="text-[11px] text-slate-500">Synerium Factory</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 mb-3 border border-slate-800">
          {expressao && <div className="text-right text-xs text-slate-500 mb-1 h-4">{expressao}</div>}
          <div className="text-right text-3xl font-light text-slate-100 tracking-wide overflow-x-auto whitespace-nowrap">{display}</div>
          {memoria !== 0 && <div className="text-right text-[10px] text-purple-400 mt-1">M: {memoria}</div>}
        </div>
        <button onClick={() => setMostrarHist(!mostrarHist)} className="w-full text-[11px] text-slate-500 hover:text-slate-300 mb-3">
          {mostrarHist ? "Esconder" : `Historico (${historico.length})`}
        </button>
        {mostrarHist && historico.length > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-3 mb-3 max-h-32 overflow-y-auto border border-slate-800/50">
            {historico.map((h, i) => (
              <div key={i} className="flex justify-between py-0.5 border-b border-slate-800/30 last:border-0">
                <span className="text-[11px] text-slate-500 truncate mr-2">{h.expr}</span>
                <button onClick={() => setDisplay(h.res)} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">= {h.res}</button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-4 gap-1.5">
          {btns.map((b, i) => (
            <button key={i} onClick={b.a} className={`${b.s === 2 ? "col-span-2" : b.s === 4 ? "col-span-4" : ""} ${cor(b.c)} rounded-xl py-2.5 text-sm font-medium transition-all active:scale-95`}>
              {b.l}
            </button>
          ))}
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-4">React + TypeScript + Tailwind CSS</p>
      </div>
    </div>
  )
}
