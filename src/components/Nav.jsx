import { useState, useEffect } from 'react'

const sections = ['vision', 'model', 'schema', 'regulation']

export default function Nav() {
  const [active, setActive] = useState('')

  useEffect(() => {
    function onScroll() {
      let current = ''
      sections.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 200) current = id
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="nav">
      <div className="nav-brand">ZAMAI</div>
      <a href="#vision" className={active === 'vision' ? 'active' : ''}>Vision</a>
      <a href="#model" className={active === 'model' ? 'active' : ''}>Model</a>
      <a href="#schema" className={active === 'schema' ? 'active' : ''}>Schema</a>
      <a href="#regulation" className={active === 'regulation' ? 'active' : ''}>Regulation</a>
    </nav>
  )
}
