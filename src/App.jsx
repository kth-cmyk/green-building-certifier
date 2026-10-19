import { useMemo, useState } from 'react'
import './App.css'

const defaults = {
  buildingName: '',
  purpose: '업무시설',
  area: 3000,
  floors: 5,
  structure: '철근콘크리트',
  insulation: '고성능 단열재',
  windows: '로이 복층유리',
  renewable: 20,
  water: '절수형 위생기구',
  materials: '환경성적표지 자재 일부 적용',
  green: '옥상녹화 및 조경 적용',
}

const steps = [
  ['01', '기본 정보', '건물의 규모와 용도'],
  ['02', '자재·설비', '환경 성능 입력'],
  ['03', '분석 결과', '예상 인증 준비도'],
]

function scoreBuilding(form) {
  const energy = Math.min(35, 16 + (form.insulation === '고성능 단열재' ? 8 : form.insulation === '일반 단열재' ? 4 : 0) + (form.windows === '로이 복층유리' ? 6 : form.windows === '삼중유리' ? 8 : 2) + Math.min(5, Number(form.renewable) / 10))
  const materials = form.materials === '환경성적표지 자재 다수 적용' ? 18 : form.materials === '환경성적표지 자재 일부 적용' ? 13 : 8
  const water = form.water === '중수도·빗물 이용 포함' ? 14 : form.water === '절수형 위생기구' ? 10 : 5
  const site = form.green === '옥상녹화 및 조경 적용' ? 11 : form.green === '자연지반·녹지 중심 계획' ? 14 : 6
  const indoor = form.windows === '삼중유리' ? 10 : form.insulation === '고성능 단열재' ? 9 : 6
  const total = Math.round(energy + materials + water + site + indoor)
  const grade = total >= 86 ? '최우수' : total >= 76 ? '우수' : total >= 66 ? '양호' : total >= 56 ? '일반' : '개선 필요'
  return { total, grade, categories: [{ name: '에너지·환경', value: Math.round(energy / 35 * 100), color: 'mint' }, { name: '자원·자재', value: Math.round(materials / 18 * 100), color: 'blue' }, { name: '물순환', value: Math.round(water / 14 * 100), color: 'violet' }, { name: '생태환경', value: Math.round(site / 14 * 100), color: 'amber' }] }
}

function Field({ label, hint, children }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

function App() {
  const [form, setForm] = useState(defaults)
  const [submitted, setSubmitted] = useState(false)
  const result = useMemo(() => scoreBuilding(form), [form])
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="그린스코프 홈"><span className="brand-mark">✦</span><span>GREENSCOPE</span></a>
      <nav><a href="#guide">평가 안내</a><a href="#form">계산 시작</a><a className="nav-pill" href="https://www.g-seed.or.kr/" target="_blank" rel="noreferrer">G-SEED 공식 사이트 ↗</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="eyebrow"><span className="dot" /> 친환경 건축 인증 준비 도구</div>
        <h1>더 나은 건물을 위한<br /><em>명확한 첫 단계.</em></h1>
        <p className="hero-copy">건물의 규모와 자재 정보를 입력하면 친환경 건축 인증 준비도를 빠르게 확인하고, 다음 개선 방향을 찾아드립니다.</p>
        <div className="hero-meta"><span>✓ 3분 간편 진단</span><span>✓ 참고용 시뮬레이션</span><span>✓ 무료로 이용</span></div>
      </section>

      <section className="workspace" id="form">
        <div className="progress-card">{steps.map(([number, title, copy], index) => <div className={`step ${index === 0 ? 'active' : ''}`} key={number}><span className="step-number">{number}</span><div><strong>{title}</strong><small>{copy}</small></div>{index < 2 && <span className="step-line" />}</div>)}</div>
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="section-heading"><div><span className="section-kicker">STEP 01 — BUILDING PROFILE</span><h2>건물 기본 정보를 알려주세요</h2></div><span className="required-note">* 필수 입력</span></div>
          <div className="fields-grid">
            <Field label="프로젝트명"><input value={form.buildingName} onChange={update('buildingName')} placeholder="예: 성수동 오피스 리모델링" /></Field>
            <Field label="건물 용도"><select value={form.purpose} onChange={update('purpose')}><option>업무시설</option><option>공동주택</option><option>교육시설</option><option>판매시설</option><option>숙박시설</option></select></Field>
            <Field label="연면적 (㎡)" hint="건축물 전체 바닥면적의 합"><input type="number" min="1" value={form.area} onChange={update('area')} /></Field>
            <Field label="지상 층수"><input type="number" min="1" value={form.floors} onChange={update('floors')} /></Field>
            <Field label="주요 구조"><select value={form.structure} onChange={update('structure')}><option>철근콘크리트</option><option>철골조</option><option>목구조</option><option>혼합 구조</option></select></Field>
          </div>

          <div className="section-heading second"><div><span className="section-kicker">STEP 02 — PERFORMANCE</span><h2>환경 성능과 자재를 선택해주세요</h2></div></div>
          <div className="fields-grid">
            <Field label="외벽·지붕 단열 성능"><select value={form.insulation} onChange={update('insulation')}><option>기본 단열재</option><option>일반 단열재</option><option>고성능 단열재</option></select></Field>
            <Field label="창호 사양"><select value={form.windows} onChange={update('windows')}><option>일반 복층유리</option><option>로이 복층유리</option><option>삼중유리</option></select></Field>
            <Field label="재생에너지 적용 비율" hint={`예상 에너지 사용량의 ${form.renewable}%`}><div className="range-wrap"><input type="range" min="0" max="80" step="5" value={form.renewable} onChange={update('renewable')} /><output>{form.renewable}%</output></div></Field>
            <Field label="물 절약·순환 설비"><select value={form.water} onChange={update('water')}><option>해당 없음</option><option>절수형 위생기구</option><option>중수도·빗물 이용 포함</option></select></Field>
            <Field label="친환경 자재 적용"><select value={form.materials} onChange={update('materials')}><option>일반 자재 중심</option><option>환경성적표지 자재 일부 적용</option><option>환경성적표지 자재 다수 적용</option></select></Field>
            <Field label="녹지·생태 계획"><select value={form.green} onChange={update('green')}><option>최소 조경 계획</option><option>옥상녹화 및 조경 적용</option><option>자연지반·녹지 중심 계획</option></select></Field>
          </div>
          <div className="form-footer"><p><span className="info-icon">i</span> 입력하신 정보는 저장되지 않으며, 결과는 사전 검토용으로만 제공됩니다.</p><button className="primary-button" type="submit">인증 준비도 확인하기 <span>→</span></button></div>
        </form>
      </section>

      {submitted && <section className="result-section" id="result">
        <div className="result-intro"><span className="section-kicker">YOUR PROJECT SNAPSHOT</span><h2>{form.buildingName || '새로운 프로젝트'}의<br /><em>친환경 가능성</em>을 확인했어요.</h2><p>현재 입력값 기준의 예상 결과입니다. 실제 인증 결과는 전문기관의 검토가 필요합니다.</p><button className="text-button" onClick={() => setSubmitted(false)}>← 입력값 수정하기</button></div>
        <div className="result-card"><div className="score-ring" style={{ '--score': `${result.total * 3.6}deg` }}><div><strong>{result.total}</strong><span>/ 100</span></div></div><div className="grade-label">예상 준비도</div><h3>{result.grade}</h3><div className="result-divider" />{result.categories.map((item) => <div className="category" key={item.name}><div><span>{item.name}</span><b>{item.value}%</b></div><div className="bar"><i className={item.color} style={{ width: `${item.value}%` }} /></div></div>)}</div>
        <div className="recommendations"><div className="recommendation-heading"><span className="sparkle">✦</span><div><span className="section-kicker">NEXT BEST ACTIONS</span><h3>점수를 높이는 방법</h3></div></div><div className="recommendation-list"><article><span>01</span><div><strong>에너지 성능을 먼저 개선하세요</strong><p>고효율 창호와 재생에너지 비율을 높이면 가장 큰 개선 효과를 기대할 수 있어요.</p></div><b>+5~10점</b></article><article><span>02</span><div><strong>환경성적표지 자재를 확대하세요</strong><p>주요 마감재부터 인증 자재로 전환하면 자원·자재 항목을 강화할 수 있습니다.</p></div><b>+3~6점</b></article><article><span>03</span><div><strong>전문기관 상담을 준비하세요</strong><p>설계도서와 에너지 시뮬레이션 자료를 준비해 공식 예비인증을 신청해보세요.</p></div><b>다음 단계</b></article></div></div>
      </section>}

      <section className="guide" id="guide"><div className="guide-copy"><span className="section-kicker">HOW IT WORKS</span><h2>인증 준비,<br /><em>복잡하지 않게.</em></h2></div><div className="guide-items"><div><span>01</span><h3>정보 입력</h3><p>건물 규모, 구조, 자재와 설비 정보를 입력합니다.</p></div><div><span>02</span><h3>빠른 분석</h3><p>주요 친환경 평가 항목을 기준으로 점수를 계산합니다.</p></div><div><span>03</span><h3>개선 방향</h3><p>부족한 항목과 우선적으로 개선할 방법을 제안합니다.</p></div></div></section>
    </main>
    <footer><span className="brand"><span className="brand-mark">✦</span> GREENSCOPE</span><span>G-SEED 공개 기준을 참고한 사전 검토 도구입니다.</span><span>© 2026 Greenscope</span></footer>
  </div>
}

export default App
